import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createSigrunFaceTexture } from './sigrun-face-texture.js';

/**
 * Container of all PBR & Cel-shaded materials for Sigrun (VALK-03).
 * Tập hợp toàn bộ vật liệu PBR và đổ bóng phong cách anime sát thủ bóng đêm cho Sigrun.
 */
export interface SigrunMaterials {
  readonly skin: THREE.MeshStandardMaterial;
  readonly face: THREE.MeshBasicMaterial;
  readonly hair: THREE.MeshStandardMaterial;
  readonly bodysuitNano: THREE.MeshStandardMaterial;
  readonly armorCarbon: THREE.MeshStandardMaterial;
  readonly armorViolet: THREE.MeshStandardMaterial;
  readonly armorGold: THREE.MeshStandardMaterial;
  readonly daggersBlade: THREE.MeshStandardMaterial;
  readonly daggersPlasmaGlow: THREE.MeshBasicMaterial;
  readonly dispose: () => void;
}

/**
 * Creates and tunes all PBR shaders and materials for Sigrun's 3D humanoid model.
 * Khởi tạo và tinh chỉnh vật liệu PBR cho mô hình 3D của Sigrun.
 *
 * @param isEnemy - True if this unit is an opponent entity.
 * @returns SigrunMaterials bundle with safe dispose lifecycle.
 */
export function createSigrunMaterials(isEnemy: boolean): SigrunMaterials {
  const primaryGlow = isEnemy ? 0xff2244 : 0xc084fc;
  const bladeGlow = isEnemy ? 0xff1133 : 0x9333ea;

  const skin = new THREE.MeshStandardMaterial({
    color: 0xffdfd2,
    roughness: 0.52,
    metalness: 0.05
  });

  const faceTexture = createSigrunFaceTexture();
  const face = new THREE.MeshBasicMaterial({
    map: faceTexture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const hair = new THREE.MeshStandardMaterial({
    color: 0x221630,
    roughness: 0.38,
    metalness: 0.18
  });

  const bodysuitNano = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    metalness: 0.3,
    roughness: 0.5
  });

  const armorCarbon = new THREE.MeshStandardMaterial({
    color: 0x1c1f26,
    metalness: 0.85,
    roughness: 0.28
  });

  const armorViolet = new THREE.MeshStandardMaterial({
    color: bladeGlow,
    metalness: 0.88,
    roughness: 0.2
  });

  const armorGold = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.25
  });

  const daggersBlade = new THREE.MeshStandardMaterial({
    color: 0x1a0f26,
    metalness: 0.92,
    roughness: 0.12
  });

  const daggersPlasmaGlow = new THREE.MeshBasicMaterial({
    color: primaryGlow,
    transparent: true,
    opacity: 0.88
  });

  const dispose = (): void => {
    faceTexture.dispose();
    skin.dispose();
    face.dispose();
    hair.dispose();
    bodysuitNano.dispose();
    armorCarbon.dispose();
    armorViolet.dispose();
    armorGold.dispose();
    daggersBlade.dispose();
    daggersPlasmaGlow.dispose();
  };

  return {
    skin,
    face,
    hair,
    bodysuitNano,
    armorCarbon,
    armorViolet,
    armorGold,
    daggersBlade,
    daggersPlasmaGlow,
    dispose
  };
}

/**
 * Applies Cloth Damage Tier transformations to Sigrun's materials.
 * Cập nhật biến đổi độ rách giáp 18+ cho Sigrun theo từng cấp độ sát thương.
 *
 * @param materials - SigrunMaterials instance.
 * @param tier - Current cloth damage tier (1, 2, or 3).
 */
export function updateSigrunClothTier(materials: SigrunMaterials, tier: ClothDamageTier): void {
  if (tier === 1) {
    materials.bodysuitNano.opacity = 1.0;
    materials.bodysuitNano.transparent = false;
    materials.daggersPlasmaGlow.opacity = 0.85;
  } else if (tier === 2) {
    materials.bodysuitNano.roughness = 0.65;
    materials.daggersPlasmaGlow.opacity = 0.95;
  } else {
    // Tier 3: Climax Extreme
    materials.bodysuitNano.opacity = 0.22;
    materials.bodysuitNano.transparent = true;
    materials.daggersPlasmaGlow.opacity = 1.0;
  }
}
