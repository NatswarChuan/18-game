import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '@valkyrie/shared-domain';

const textureCache = new Map<string, THREE.Texture>();
const textureLoader = new THREE.TextureLoader();

/**
 * Returns the primary neon hex color for a faction.
 * Lấy mã màu hex Neon đặc trưng của từng Tộc/Hệ.
 *
 * @param faction - The faction identifier (NEO_VALHALLA, ABYSSAL_EDEN, SOL_DYNASTY).
 * @returns Numeric hex color for Three.js materials.
 */
export function getFactionHexColor(faction: FactionId): number {
  if (faction === 'NEO_VALHALLA') return 0x00f0ff;
  if (faction === 'ABYSSAL_EDEN') return 0xff2a85;
  return 0xffd700;
}

/**
 * Loads and caches avatar textures to minimize GPU allocations.
 * Tải và lưu bộ đệm texture chân dung để tối ưu bộ nhớ GPU.
 *
 * @param valkyrieId - Valkyrie identifier string.
 * @returns Cached or newly initialized THREE.Texture.
 */
export function loadCachedAvatarTexture(valkyrieId: string): THREE.Texture {
  const cached = textureCache.get(valkyrieId);
  if (cached) return cached;

  const texture = textureLoader.load(`/avatars/${valkyrieId}.jpg`);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  textureCache.set(valkyrieId, texture);
  return texture;
}

/**
 * Builds the 3D holographic pedestal disc and rotating rune ring.
 * Dựng bệ đỡ Hologram 3D phát sáng và vòng ma pháp trận công nghệ xoay tròn.
 *
 * @param colorHex - Neon hex color of the pedestal.
 * @returns THREE.Group containing pedestal geometry.
 */
export function createHologramPedestal(colorHex: number): THREE.Group {
  const pedestalGroup = new THREE.Group();
  pedestalGroup.position.set(0, -0.65, 0);

  const ringGeo = new THREE.TorusGeometry(0.68, 0.02, 8, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: colorHex });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  pedestalGroup.add(ringMesh);

  const discGeo = new THREE.CircleGeometry(0.65, 24);
  const discMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.rotation.x = -Math.PI / 2;
  pedestalGroup.add(discMesh);

  const beamGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.2, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.set(0, 0.1, 0);
  pedestalGroup.add(beamMesh);

  return pedestalGroup;
}

/**
 * Builds multi-layer 2.5D parallax character planes.
 * Tạo cụm mặt phẳng 2.5D đa tầng tạo hiệu ứng thị sai chiều sâu (Parallax Depth).
 *
 * @param texture - Character avatar texture.
 * @param colorHex - Faction neon hex color.
 * @param tier - Current cloth damage tier.
 * @returns THREE.Group containing 2.5D layered character meshes.
 */
export function createParallaxCharacterRig(
  texture: THREE.Texture,
  colorHex: number,
  tier: ClothDamageTier
): THREE.Group {
  const rigGroup = new THREE.Group();

  // 1. Back Layer: Aura & Wing Glow (Z = -0.06)
  const auraGeo = new THREE.PlaneGeometry(1.25, 1.25);
  const auraMat = new THREE.MeshBasicMaterial({
    color: tier === 3 ? 0xff2a85 : colorHex,
    transparent: true,
    opacity: tier === 3 ? 0.45 : 0.25,
    blending: THREE.AdditiveBlending
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  auraMesh.position.set(0, 0.05, -0.06);
  rigGroup.add(auraMesh);

  // 2. Core Layer: Valkyrie Character Figure (Z = 0)
  const charGeo = new THREE.PlaneGeometry(1.05, 1.05);
  const charMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  const charMesh = new THREE.Mesh(charGeo, charMat);
  charMesh.position.set(0, 0.05, 0);
  rigGroup.add(charMesh);

  // 3. Front Layer: Tech Border Frame (Z = +0.06)
  const frameGeo = new THREE.RingGeometry(0.5, 0.54, 24);
  const frameMat = new THREE.MeshBasicMaterial({
    color: tier === 2 ? 0xffd700 : tier === 3 ? 0xff3344 : colorHex,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  frameMesh.position.set(0, 0.05, 0.06);
  rigGroup.add(frameMesh);

  return rigGroup;
}

/**
 * Creates dynamic directional, ambient, and underglow lights for the 2.5D scene.
 * Thiết lập hệ thống chiếu sáng động (môi trường, hướng sáng, và đèn hắt chân bệ).
 *
 * @param colorHex - Faction underglow color.
 * @returns Lighting setup bundle.
 */
export function createValkyrieLighting(colorHex: number): {
  readonly ambient: THREE.AmbientLight;
  readonly directional: THREE.DirectionalLight;
  readonly underglow: THREE.PointLight;
} {
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  const directional = new THREE.DirectionalLight(0xffffff, 1.5);
  directional.position.set(1.5, 2.5, 2.0);

  const underglow = new THREE.PointLight(colorHex, 2.5, 4.0);
  underglow.position.set(0, -0.5, 0.4);

  return { ambient, directional, underglow };
}

/**
 * Safely disposes all geometries, materials, and renderer contexts (Coverity SAST Clean).
 * Giải phóng an toàn toàn bộ tài nguyên WebGL tránh rò rỉ bộ nhớ GPU.
 *
 * @param scene - THREE.Scene to dispose.
 * @param renderer - THREE.WebGLRenderer to destroy.
 */
export function disposeThreeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });

  renderer.dispose();
  renderer.forceContextLoss();
}
