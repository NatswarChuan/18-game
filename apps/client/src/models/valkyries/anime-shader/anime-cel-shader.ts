import * as THREE from 'three';

/**
 * Procedurally generates a stepped 3-tone or 4-tone Cel/Toon gradient ramp texture.
 * Tạo gradient map dạng bậc thang (Cel/Toon Ramp) cho phong cách Anime Cel-Shading chuẩn game 3D Nhật Bản.
 * 
 * @param steps - Number of discrete shading bands (typically 3 or 4).
 * @returns THREE.CanvasTexture configured for discrete toon stepping.
 */
export function createToonGradientMap(steps: 2 | 3 | 4 = 3): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (steps === 2) {
      // 2-tone: Highlight & Shadow
      ctx.fillStyle = '#404040';
      ctx.fillRect(0, 0, 128, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(128, 0, 128, 1);
    } else if (steps === 3) {
      // 3-tone: Dark Crevice, Mid-tone Shadow, Highlight
      ctx.fillStyle = '#444455';
      ctx.fillRect(0, 0, 85, 1);
      ctx.fillStyle = '#9999aa';
      ctx.fillRect(85, 0, 85, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(170, 0, 86, 1);
    } else {
      // 4-tone: Extra smooth anime depth
      ctx.fillStyle = '#303040';
      ctx.fillRect(0, 0, 64, 1);
      ctx.fillStyle = '#777788';
      ctx.fillRect(64, 0, 64, 1);
      ctx.fillStyle = '#bbbbcc';
      ctx.fillRect(128, 0, 64, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(192, 0, 64, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

// Global cached toon ramp textures
let sharedToonRamp: THREE.CanvasTexture | null = null;
let sharedSkinToonRamp: THREE.CanvasTexture | null = null;
let sharedHairToonRamp: THREE.CanvasTexture | null = null;

export function getSharedToonRamp(): THREE.CanvasTexture {
  if (!sharedToonRamp) {
    sharedToonRamp = createToonGradientMap(3);
  }
  return sharedToonRamp;
}

/**
 * Creates warm, radiant porcelain skin cel-shading ramp.
 * Gradient map chuyên biệt cho làn da Anime sứ phát sáng (bóng màu hồng đào ấm áp, không bị xám xịt).
 */
export function getSharedSkinToonRamp(): THREE.CanvasTexture {
  if (!sharedSkinToonRamp) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Warm porcelain anime skin: Rosy shadow -> Soft peach midtone -> Radiant highlight
      ctx.fillStyle = '#f0b5a4';
      ctx.fillRect(0, 0, 96, 1);
      ctx.fillStyle = '#fce5dc';
      ctx.fillRect(96, 0, 72, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(168, 0, 88, 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sharedSkinToonRamp = texture;
  }
  return sharedSkinToonRamp;
}

/**
 * Creates rich, saturated crimson/wine cel-shading ramp for anime hair.
 * Gradient map chuyên biệt cho mái tóc Anime rực rỡ và bóng mượt.
 */
export function getSharedHairToonRamp(): THREE.CanvasTexture {
  if (!sharedHairToonRamp) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#7a0c20';
      ctx.fillRect(0, 0, 90, 1);
      ctx.fillStyle = '#c41838';
      ctx.fillRect(90, 0, 80, 1);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(170, 0, 86, 1);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sharedHairToonRamp = texture;
  }
  return sharedHairToonRamp;
}

export interface AnimeCelMaterialOptions {
  readonly color: THREE.ColorRepresentation;
  readonly roughness?: number;
  readonly metalness?: number;
  readonly emissive?: THREE.ColorRepresentation;
  readonly emissiveIntensity?: number;
  readonly transparent?: boolean;
  readonly opacity?: number;
  readonly side?: THREE.Side;
  readonly map?: THREE.Texture | null;
  readonly isSkin?: boolean;
  readonly isHair?: boolean;
  readonly rimColor?: THREE.ColorRepresentation;
  readonly rimIntensity?: number;
  readonly rimPower?: number;
}

/**
 * Injects a GPU-accelerated Anime Fresnel Rim Light shader chunk into standard Three.js materials.
 * Bơm shader chunk tạo viền sáng hào quang Anime (Fresnel Rim Lighting) trực tiếp trên GPU:
 * - Viền sáng chạy dọc theo silhouette của cơ thể, bầu ngực, mái tóc và giáp
 * - Bắt sáng rực rỡ với Unreal Bloom Pass, tách rời nhân vật khỏi hậu cảnh tối.
 */
export function injectAnimeRimLight(
  mat: THREE.Material,
  rimColor: THREE.ColorRepresentation = 0xffb0c8,
  rimIntensity = 0.85,
  rimPower = 2.6
): void {
  const colorObj = new THREE.Color(rimColor);
  mat.onBeforeCompile = (shader): void => {
    shader.uniforms.uAnimeRimColor = { value: colorObj };
    shader.uniforms.uAnimeRimIntensity = { value: rimIntensity };
    shader.uniforms.uAnimeRimPower = { value: rimPower };

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      uniform vec3 uAnimeRimColor;
      uniform float uAnimeRimIntensity;
      uniform float uAnimeRimPower;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
      vec3 nNorm = normalize(vNormal);
      vec3 nView = normalize(vViewPosition);
      float rimDot = 1.0 - clamp(dot(nNorm, nView), 0.0, 1.0);
      float animeRim = pow(rimDot, uAnimeRimPower);
      gl_FragColor.rgb += uAnimeRimColor * (animeRim * uAnimeRimIntensity);
      `
    );
  };

  mat.customProgramCacheKey = (): string => {
    return `AnimeRim_${colorObj.getHexString()}_${rimIntensity.toFixed(2)}_${rimPower.toFixed(2)}`;
  };
}

/**
 * Creates an Anime Cel-Shading Material with custom stepped light terminator and optional Fresnel Rim Light.
 * Tạo vật liệu Cel-Shading Anime chuyên biệt cho Valkyrie 3D.
 */
export function createAnimeCelMaterial(options: AnimeCelMaterialOptions): THREE.MeshToonMaterial {
  let gradientMap = getSharedToonRamp();
  if (options.isSkin) {
    gradientMap = getSharedSkinToonRamp();
  } else if (options.isHair) {
    gradientMap = getSharedHairToonRamp();
  }

  const mat = new THREE.MeshToonMaterial({
    color: options.color,
    gradientMap,
    map: options.map ?? null,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    side: options.side ?? THREE.FrontSide
  });

  if (options.rimColor !== undefined || options.rimIntensity !== undefined) {
    injectAnimeRimLight(mat, options.rimColor ?? 0xffadc2, options.rimIntensity ?? 0.85, options.rimPower ?? 2.6);
  }

  return mat;
}

export interface AnimePhysicalMaterialOptions {
  readonly color: THREE.ColorRepresentation;
  readonly map?: THREE.Texture | null;
  readonly roughness?: number;
  readonly metalness?: number;
  readonly clearcoat?: number;
  readonly clearcoatRoughness?: number;
  readonly sheen?: number;
  readonly sheenColor?: THREE.ColorRepresentation;
  readonly sheenRoughness?: number;
  readonly emissive?: THREE.ColorRepresentation;
  readonly emissiveIntensity?: number;
  readonly transparent?: boolean;
  readonly opacity?: number;
  readonly side?: THREE.Side;
  readonly rimColor?: THREE.ColorRepresentation;
  readonly rimIntensity?: number;
  readonly rimPower?: number;
}

/**
 * Creates an Anime PBR Physical Material with high-end specular sheen, clearcoat glaze, and subsurface warmth.
 * Tạo vật liệu PBR Physical cho Anime 18+ (làn da sứ ngậm nước, độ bóng mồ hôi/dầu gợi cảm, vải latex siêu bóng).
 */
export function createAnimePhysicalMaterial(options: AnimePhysicalMaterialOptions): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: options.color,
    map: options.map ?? null,
    roughness: options.roughness ?? 0.28,
    metalness: options.metalness ?? 0.04,
    clearcoat: options.clearcoat ?? 0.82,
    clearcoatRoughness: options.clearcoatRoughness ?? 0.16,
    sheen: options.sheen ?? 0.75,
    sheenColor: options.sheenColor ?? 0xffd2dc,
    sheenRoughness: options.sheenRoughness ?? 0.35,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    side: options.side ?? THREE.FrontSide
  });

  if (options.rimColor !== undefined || options.rimIntensity !== undefined) {
    injectAnimeRimLight(mat, options.rimColor ?? 0xffadc2, options.rimIntensity ?? 0.85, options.rimPower ?? 2.6);
  }

  return mat;
}

export interface InvertedHullOutlineOptions {
  readonly thickness?: number; // In world units, e.g. 0.004 - 0.008
  readonly color?: THREE.ColorRepresentation;
  readonly opacity?: number;
}

/**
 * Creates an Inverted Hull Outline mesh for an existing BufferGeometry.
 * Tạo lớp viền đen mực Anime (Inverted Hull Outline) chuẩn game anime 3D:
 * - Đảo ngược mặt đa giác (BackSide culling)
 * - Đẩy đỉnh vertex nở ra dọc theo pháp tuyến (Normal extrusion)
 * - Tô màu mực đen/tím đậm không bị ảnh hưởng bởi ánh sáng môi trường.
 */
export function createInvertedHullOutlineMesh(
  geometry: THREE.BufferGeometry,
  options: InvertedHullOutlineOptions = {}
): THREE.Mesh {
  const thickness = options.thickness ?? 0.005;
  const outlineColor = options.color ?? 0x140e1a; // Warm deep ink anime line
  const opacity = options.opacity ?? 0.95;

  // Clone geometry and displace vertices along normals
  const outlineGeo = geometry.clone();
  const posAttr = outlineGeo.attributes.position;
  const normAttr = outlineGeo.attributes.normal;

  if (posAttr && normAttr) {
    const posArray = posAttr.array as Float32Array;
    const normArray = normAttr.array as Float32Array;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const nx = normArray[idx] ?? 0;
      const ny = normArray[idx + 1] ?? 0;
      const nz = normArray[idx + 2] ?? 0;

      // Displace position slightly outward
      posArray[idx] = (posArray[idx] ?? 0) + nx * thickness;
      posArray[idx + 1] = (posArray[idx + 1] ?? 0) + ny * thickness;
      posArray[idx + 2] = (posArray[idx + 2] ?? 0) + nz * thickness;
    }
    posAttr.needsUpdate = true;
  }

  const outlineMat = new THREE.MeshBasicMaterial({
    color: outlineColor,
    side: THREE.BackSide,
    transparent: opacity < 1.0,
    opacity,
    depthWrite: false
  });

  const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
  outlineMesh.name = 'Anime_InvertedHull_Outline';
  return outlineMesh;
}

/**
 * Creates a mesh pair: the base anime cel-shaded mesh + attached inverted hull outline mesh.
 * Tạo khối mesh Anime hoàn chỉnh gồm thân mesh chính + viền đen Inverted Hull bao bọc.
 */
export function createAnimeMeshWithOutline(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  outlineOptions: InvertedHullOutlineOptions = {}
): THREE.Group {
  const group = new THREE.Group();
  const mainMesh = new THREE.Mesh(geometry, material);
  group.add(mainMesh);

  const outlineMesh = createInvertedHullOutlineMesh(geometry, outlineOptions);
  group.add(outlineMesh);

  return group;
}
