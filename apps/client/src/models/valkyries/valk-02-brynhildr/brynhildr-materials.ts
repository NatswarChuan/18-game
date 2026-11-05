import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createBrynhildrFaceTexture } from './brynhildr-face-texture.js';

/**
 * Container of all PBR & Cel-shaded materials for Brynhildr (VALK-02).
 * Tập hợp toàn bộ vật liệu PBR và đổ bóng phong cách anime cho Brynhildr.
 */
export interface BrynhildrMaterials {
  readonly skin: THREE.MeshStandardMaterial;
  readonly face: THREE.MeshBasicMaterial;
  readonly hair: THREE.MeshStandardMaterial;
  readonly armorPlatinum: THREE.MeshStandardMaterial;
  readonly armorIceBlue: THREE.MeshStandardMaterial;
  readonly armorGold: THREE.MeshStandardMaterial;
  readonly bodysuitDark: THREE.MeshStandardMaterial;
  readonly shieldCrystal: THREE.MeshStandardMaterial;
  readonly shieldFrostGlow: THREE.MeshBasicMaterial;
  readonly swordBlade: THREE.MeshStandardMaterial;
  readonly swordPlasmaGlow: THREE.MeshBasicMaterial;
  readonly dispose: () => void;
}

/**
 * Creates and tunes all PBR shaders and materials for Brynhildr's 3D humanoid model.
 * Khởi tạo và tinh chỉnh vật liệu PBR cho mô hình 3D của Brynhildr.
 *
 * @param isEnemy - True if this unit is an opponent entity.
 * @returns BrynhildrMaterials bundle with safe dispose lifecycle.
 */
export function createBrynhildrMaterials(isEnemy: boolean): BrynhildrMaterials {
  const primaryGlow = isEnemy ? 0xff2244 : 0x00f0ff;

  const skin = new THREE.MeshStandardMaterial({
    color: 0xffdfd2,
    roughness: 0.52,
    metalness: 0.05
  });

  const faceTexture = createBrynhildrFaceTexture();
  const face = new THREE.MeshBasicMaterial({
    map: faceTexture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  const hair = new THREE.MeshStandardMaterial({
    color: 0xd8f0ff,
    roughness: 0.42,
    metalness: 0.15
  });

  const armorPlatinum = new THREE.MeshStandardMaterial({
    color: 0xe8ecf2,
    metalness: 0.92,
    roughness: 0.18
  });

  const armorIceBlue = new THREE.MeshStandardMaterial({
    color: 0x00bfff,
    metalness: 0.85,
    roughness: 0.22
  });

  const armorGold = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.88,
    roughness: 0.25
  });

  const bodysuitDark = new THREE.MeshStandardMaterial({
    color: 0x0c1224,
    metalness: 0.2,
    roughness: 0.65
  });

  const shieldCrystal = new THREE.MeshStandardMaterial({
    color: primaryGlow,
    roughness: 0.12,
    metalness: 0.15,
    transparent: true,
    opacity: 0.82
  });

  const shieldFrostGlow = new THREE.MeshBasicMaterial({
    color: primaryGlow,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });

  const swordBlade = new THREE.MeshStandardMaterial({
    color: 0xd0e8ff,
    metalness: 0.9,
    roughness: 0.15
  });

  const swordPlasmaGlow = new THREE.MeshBasicMaterial({
    color: primaryGlow,
    transparent: true,
    opacity: 0.85
  });

  const dispose = (): void => {
    faceTexture.dispose();
    skin.dispose();
    face.dispose();
    hair.dispose();
    armorPlatinum.dispose();
    armorIceBlue.dispose();
    armorGold.dispose();
    bodysuitDark.dispose();
    shieldCrystal.dispose();
    shieldFrostGlow.dispose();
    swordBlade.dispose();
    swordPlasmaGlow.dispose();
  };

  return {
    skin,
    face,
    hair,
    armorPlatinum,
    armorIceBlue,
    armorGold,
    bodysuitDark,
    shieldCrystal,
    shieldFrostGlow,
    swordBlade,
    swordPlasmaGlow,
    dispose
  };
}

/**
 * Applies Cloth Damage Tier transformations to Brynhildr's materials.
 * Cập nhật biến đổi độ rách giáp 18+ cho Brynhildr theo từng cấp độ sát thương.
 *
 * @param materials - BrynhildrMaterials instance.
 * @param tier - Current cloth damage tier (1, 2, or 3).
 */
export function updateBrynhildrClothTier(materials: BrynhildrMaterials, tier: ClothDamageTier): void {
  if (tier === 1) {
    materials.armorPlatinum.opacity = 1.0;
    materials.armorPlatinum.transparent = false;
    materials.armorPlatinum.roughness = 0.18;
    materials.shieldCrystal.opacity = 0.82;
  } else if (tier === 2) {
    materials.armorPlatinum.roughness = 0.35;
    materials.shieldCrystal.opacity = 0.65;
  } else {
    // Tier 3: Climax Extreme
    materials.armorPlatinum.opacity = 0.25;
    materials.armorPlatinum.transparent = true;
    materials.shieldCrystal.opacity = 0.95;
    materials.shieldFrostGlow.opacity = 1.0;
  }
}
