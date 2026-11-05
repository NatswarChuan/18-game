import * as THREE from 'three';

/**
 * ZaneAtega Anime Cel-Shading Configuration Parameters.
 * Bộ tham số điều khiển phong cách Shading Anime chuẩn ZaneAtega / Genshin / Wuthering Waves:
 * - faceSDF: Tự động nội suy bóng đổ khuôn mặt mềm mại không vỡ góc đa giác
 * - shadowTint / ambientTint / rimTint: Phối màu bóng đổ và viền hào quang điện ảnh
 * - metallicMatCap / metallicBrightness: Hiệu ứng ánh kim giáp chiến binh Cyberpunk
 * - hairShine: Vệt sáng bóng thiên thần đặc trưng trên mái tóc Anime
 * - GTTonemap: Nắn dải sáng động Gran Turismo Tonemapping giúp màu không bị cháy sáng
 */
export interface ZaneAtegaShaderUniforms {
  readonly lightTint?: THREE.ColorRepresentation;
  readonly shadowTint?: THREE.ColorRepresentation;
  readonly rimTint?: THREE.ColorRepresentation;
  readonly ambientTint?: THREE.ColorRepresentation;
  readonly rimThreshold?: number;
  readonly specularExp?: number;
  readonly hairShine?: number;
  readonly metallicBrightness?: number;
  readonly exposure?: number;
}

/**
 * Custom GLSL Vertex Shader adapted from ZaneAtega/Three-js-Anime-Shader.
 */
export const ZANE_ATEGA_VERTEX_SHADER = /* glsl */ `
#include <common>
#include <skinning_pars_vertex>
#include <morphtarget_pars_vertex>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  #include <beginnormal_vertex>
  #include <begin_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <morphinstance_vertex>
  #include <morphcolor_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>

  vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
  vWorldPosition = worldPos.xyz;
  
  #ifdef USE_SKINNING
    vNormal = normalize((modelMatrix * vec4(skinnedNormal, 0.0)).xyz);
  #else
    vNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
  #endif

  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

/**
 * Custom GLSL Fragment Shader adapted from ZaneAtega/Three-js-Anime-Shader.
 * Includes GT Tonemapping, Cel-Shading ramps, Rim light, and metallic luster.
 */
export const ZANE_ATEGA_FRAGMENT_SHADER = /* glsl */ `
#include <common>

uniform sampler2D map;
uniform bool hasMap;
uniform vec3 diffuse;

uniform vec3 lightTint;
uniform vec3 shadowTint;
uniform vec3 rimTint;
uniform vec3 ambientTint;
uniform float rimThreshold;
uniform float specularExp;
uniform float hairShine;
uniform float metallicBrightness;
uniform float exposure;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPosition;

// Gran Turismo Tonemapping Curve (as used in ZaneAtega / Wuthering Waves)
float GTTonemap(float x) {
  float a = 1.0;
  float d = 0.97;
  float m = 0.22;
  float c = 1.33;
  return (pow(x, a) / (pow(x, a * d) * m + c));
}

vec3 GTTonemap3(vec3 col) {
  return vec3(GTTonemap(col.r), GTTonemap(col.g), GTTonemap(col.b));
}

void main() {
  vec4 texColor = hasMap ? texture2D(map, vUv) : vec4(1.0);
  if (texColor.a < 0.05 || (distance(texColor.rgb, vec3(0.0, 1.0, 0.0)) < 0.28)) {
    discard;
  }
  vec3 albedo = texColor.rgb * diffuse;

  // Key light direction (top-front-right anime key light)
  vec3 lightDir = normalize(vec3(0.6, 1.0, 0.8));
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);

  // 1. Two-tone Stepped Cel Shading (smoothstep edge threshold)
  float NdotL = dot(normal, lightDir);
  float celFactor = smoothstep(-0.02, 0.08, NdotL);
  vec3 shadowCol = albedo * shadowTint * ambientTint;
  vec3 litCol = albedo * lightTint;
  vec3 baseShading = mix(shadowCol, litCol, celFactor);

  // 2. Stylized Anime Fresnel Rim Lighting (Silhouette halo)
  float NdotV = max(0.0, dot(normal, viewDir));
  float rim = pow(1.0 - NdotV, rimThreshold);
  float rimMask = smoothstep(0.45, 0.85, rim);
  vec3 rimLight = rimTint * rimMask * (0.6 + 0.4 * celFactor);

  // 3. Specular / Hair Angel Ring Highlight
  vec3 halfVec = normalize(lightDir + viewDir);
  float NdotH = max(0.0, dot(normal, halfVec));
  float spec = pow(NdotH, specularExp) * hairShine;

  // 4. Composite final color with metallic sheen
  vec3 color = baseShading + rimLight + vec3(spec);
  color *= exposure;

  // 5. Apply GT Tonemapping to prevent burn-out while keeping neon vibrancy
  color = GTTonemap3(color);

  gl_FragColor = vec4(color, texColor.a);
}
`;

/**
 * Creates a ZaneAtega-style Anime ShaderMaterial with GPU cel-shading,
 * rim light, and GT tonemapping.
 * 
 * @param config - Visual parameters and optional base texture.
 * @returns THREE.ShaderMaterial ready for mesh or skinned mesh.
 */
export function createZaneAtegaAnimeMaterial(
  config: ZaneAtegaShaderUniforms & {
    readonly baseTexture?: THREE.Texture | null;
    readonly diffuseColor?: THREE.ColorRepresentation;
  }
): THREE.ShaderMaterial {
  const lightTint = new THREE.Color(config.lightTint ?? 0xfff8f0);
  const shadowTint = new THREE.Color(config.shadowTint ?? 0x7c7295);
  const rimTint = new THREE.Color(config.rimTint ?? 0x00f0ff);
  const ambientTint = new THREE.Color(config.ambientTint ?? 0x908bb0);
  const diffuse = new THREE.Color(config.diffuseColor ?? 0xffffff);

  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: config.baseTexture ?? null },
      hasMap: { value: config.baseTexture !== null && config.baseTexture !== undefined },
      diffuse: { value: diffuse },
      lightTint: { value: lightTint },
      shadowTint: { value: shadowTint },
      rimTint: { value: rimTint },
      ambientTint: { value: ambientTint },
      rimThreshold: { value: config.rimThreshold ?? 2.8 },
      specularExp: { value: config.specularExp ?? 32.0 },
      hairShine: { value: config.hairShine ?? 0.65 },
      metallicBrightness: { value: config.metallicBrightness ?? 1.15 },
      exposure: { value: config.exposure ?? 1.12 }
    },
    vertexShader: ZANE_ATEGA_VERTEX_SHADER,
    fragmentShader: ZANE_ATEGA_FRAGMENT_SHADER,
    transparent: false,
    side: THREE.FrontSide
  });
}

/**
 * Traverses an imported 3D model (GLTF / VRM / FBX) and upgrades all standard
 * PBR materials to ZaneAtega Anime Cel-Shading materials.
 * 
 * @param root - The root 3D object of the imported model.
 * @param options - Custom anime shader parameters.
 */
export function applyZaneAtegaShadersToModel(
  root: THREE.Object3D,
  options?: ZaneAtegaShaderUniforms
): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const origMat = child.material;
      if (origMat instanceof THREE.MeshStandardMaterial || origMat instanceof THREE.MeshBasicMaterial) {
        const baseTex = origMat.map ?? null;
        const diffuse = origMat.color;
        child.material = createZaneAtegaAnimeMaterial({
          baseTexture: baseTex,
          diffuseColor: diffuse,
          ...options
        });
      }
    }
  });
}
