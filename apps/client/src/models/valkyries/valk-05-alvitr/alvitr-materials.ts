import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createAlvitrFaceTexture } from './alvitr-face-texture.js';

export interface AlvitrMaterials {
  readonly hair: THREE.MeshStandardMaterial;
  readonly skin: THREE.MeshStandardMaterial;
  readonly violetSilk: THREE.MeshStandardMaterial;
  readonly goldJewelry: THREE.MeshStandardMaterial;
  readonly cyberGem: THREE.MeshStandardMaterial;
  readonly orbCore: THREE.MeshStandardMaterial;
  readonly orbGimbalRings: THREE.MeshStandardMaterial;
  readonly sheerStockings: THREE.MeshStandardMaterial;
  readonly laceTorn: THREE.MeshStandardMaterial;
  readonly face: THREE.MeshBasicMaterial;
  readonly dispose: () => void;
}

/**
 * Initializes physical PBR materials for Alvitr (VALK-05).
 * Khởi tạo vật liệu PBR cho Alvitr: Đầm dạ hội lụa tím thẫm kiêu sa,
 * trang sức vàng hoàng kim đính ngọc Cyber, quả cầu lôi điện tử phóng tia plasma tím.
 */
export function createAlvitrMaterials(isEnemy: boolean = false): AlvitrMaterials {
  const orbColor = isEnemy ? 0xFF0055 : 0xC084FC;
  const orbEmissive = isEnemy ? 0xDC2626 : 0x9333EA;
  const faceTexture = createAlvitrFaceTexture();

  const materials: AlvitrMaterials = {
    // 1. Deep Wavy Amethyst Anime Hair
    hair: new THREE.MeshStandardMaterial({
      color: 0x581C87,
      roughness: 0.32,
      metalness: 0.15
    }),

    // 2. Translucent Anime Skin (Subsurface peach-cream tone)
    skin: new THREE.MeshStandardMaterial({
      color: 0xFFE0D0,
      roughness: 0.70,
      metalness: 0.02
    }),

    // 3. Royal Violet High-Slit Silk Gown
    violetSilk: new THREE.MeshStandardMaterial({
      color: 0x3B0764,
      roughness: 0.22,
      metalness: 0.38
    }),

    // 4. Cyber Gold Filigree, Tiara & Ornaments
    goldJewelry: new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.16,
      metalness: 0.95
    }),

    // 5. Glowing Cyan Cyber Gems
    cyberGem: new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      emissive: 0x0891B2,
      emissiveIntensity: 2.2,
      roughness: 0.10,
      metalness: 0.90
    }),

    // 6. Floating Electro-Orb Plasma Core
    orbCore: new THREE.MeshStandardMaterial({
      color: orbColor,
      emissive: orbEmissive,
      emissiveIntensity: 3.2,
      roughness: 0.08,
      metalness: 0.10
    }),

    // 7. Electro-Orb Concentric Gimbal Gyroscope Rings
    orbGimbalRings: new THREE.MeshStandardMaterial({
      color: 0xD97706,
      roughness: 0.18,
      metalness: 0.92
    }),

    // 8. Sheer Thigh Stockings (Midnight Indigo)
    sheerStockings: new THREE.MeshStandardMaterial({
      color: 0x1E1B4B,
      roughness: 0.60,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82
    }),

    // 9. Sensual Torn Lace Ribbons (Tier 2/3 Cloth Damage)
    laceTorn: new THREE.MeshStandardMaterial({
      color: 0xE879F9,
      roughness: 0.80,
      metalness: 0.0,
      transparent: true,
      opacity: 0.88
    }),

    // 10. High-Res Face Decal Layer
    face: new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      depthWrite: false
    }),

    dispose: (): void => {
      faceTexture.dispose();
      materials.hair.dispose();
      materials.skin.dispose();
      materials.violetSilk.dispose();
      materials.goldJewelry.dispose();
      materials.cyberGem.dispose();
      materials.orbCore.dispose();
      materials.orbGimbalRings.dispose();
      materials.sheerStockings.dispose();
      materials.laceTorn.dispose();
      materials.face.dispose();
    }
  };

  return materials;
}

/**
 * Updates dynamic material properties of Alvitr according to the active cloth damage tier.
 */
export function updateAlvitrClothTier(materials: AlvitrMaterials, tier: ClothDamageTier): void {
  if (tier === 1) {
    materials.violetSilk.opacity = 1.0;
    materials.orbCore.emissiveIntensity = 3.2;
  } else if (tier === 2) {
    // Wet silk effect (darker, more specular gloss)
    materials.violetSilk.roughness = 0.14;
    materials.orbCore.emissiveIntensity = 4.2;
  } else {
    // Tier 3 Climax: Supercharged electric surge
    materials.orbCore.emissiveIntensity = 6.0;
  }
}
