import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createKaraFaceTexture } from './kara-face-texture.js';

export interface KaraMaterials {
  readonly hair: THREE.MeshStandardMaterial;
  readonly skin: THREE.MeshStandardMaterial;
  readonly militaryCoat: THREE.MeshStandardMaterial;
  readonly whiteShirt: THREE.MeshStandardMaterial;
  readonly pleatedSkirt: THREE.MeshStandardMaterial;
  readonly redTie: THREE.MeshStandardMaterial;
  readonly stockings: THREE.MeshStandardMaterial;
  readonly bootsArmor: THREE.MeshStandardMaterial;
  readonly goldTrim: THREE.MeshStandardMaterial;
  readonly cannonChassis: THREE.MeshStandardMaterial;
  readonly cannonBarrel: THREE.MeshStandardMaterial;
  readonly nuclearCoreGlow: THREE.MeshStandardMaterial;
  readonly laceUnderwear: THREE.MeshStandardMaterial;
  readonly face: THREE.MeshBasicMaterial;
  readonly dispose: () => void;
}

/**
 * Initializes physical PBR materials for Kara (VALK-04).
 * Khởi tạo vật liệu PBR cho Kara: Quân phục Cyberpunk cao cấp, tóc vàng twin-tails,
 * nòng trọng pháo hạt nhân titan bóng mạ và lõi năng lượng photon phát quang.
 */
export function createKaraMaterials(isEnemy: boolean = false): KaraMaterials {
  const glowColor = isEnemy ? 0xFF2244 : 0xF97316;
  const glowEmissive = isEnemy ? 0xDC2626 : 0xEA580C;
  const faceTexture = createKaraFaceTexture();

  const materials: KaraMaterials = {
    // 1. Radiant Golden Blonde Anime Hair
    hair: new THREE.MeshStandardMaterial({
      color: 0xFBBF24,
      roughness: 0.38,
      metalness: 0.12
    }),

    // 2. Translucent Anime Skin (Subsurface peach-cream tone)
    skin: new THREE.MeshStandardMaterial({
      color: 0xFFE4D6,
      roughness: 0.70,
      metalness: 0.02
    }),

    // 3. Cyber Military Coat (Navy Blue Obsidian)
    militaryCoat: new THREE.MeshStandardMaterial({
      color: 0x0F172A,
      roughness: 0.28,
      metalness: 0.35
    }),

    // 4. Crisp White Uniform Shirt
    whiteShirt: new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.55,
      metalness: 0.05
    }),

    // 5. Tech Pleated Skirt
    pleatedSkirt: new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.45,
      metalness: 0.15
    }),

    // 6. Crimson Officer Tie
    redTie: new THREE.MeshStandardMaterial({
      color: 0xDC2626,
      roughness: 0.35,
      metalness: 0.20
    }),

    // 7. Zettai Ryouiki Thigh-High Stockings (Sheer Matte Black 40-Denier)
    stockings: new THREE.MeshStandardMaterial({
      color: 0x18181B,
      roughness: 0.65,
      metalness: 0.08
    }),

    // 8. Heavy Armored Combat Boots
    bootsArmor: new THREE.MeshStandardMaterial({
      color: 0x090D16,
      roughness: 0.22,
      metalness: 0.85
    }),

    // 9. Officer Gold Trim & Epaulets
    goldTrim: new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.20,
      metalness: 0.92
    }),

    // 10. Heavy Plasma Railgun Cannon Chassis (Dark Gunmetal Titanium)
    cannonChassis: new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.24,
      metalness: 0.88
    }),

    // 11. Cannon Hexagonal Barrel & Magnetic Rails
    cannonBarrel: new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.18,
      metalness: 0.94
    }),

    // 12. Nuclear Core Plasma Glow
    nuclearCoreGlow: new THREE.MeshStandardMaterial({
      color: glowColor,
      emissive: glowEmissive,
      emissiveIntensity: 2.4,
      roughness: 0.10,
      metalness: 0.10
    }),

    // 13. Sensual White Lace Underwear (Tier 2/3 Cloth Damage)
    laceUnderwear: new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.85,
      metalness: 0.0,
      transparent: true,
      opacity: 0.92
    }),

    // 14. High-Res Face Decal Layer
    face: new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      depthWrite: false
    }),

    dispose: (): void => {
      faceTexture.dispose();
      materials.hair.dispose();
      materials.skin.dispose();
      materials.militaryCoat.dispose();
      materials.whiteShirt.dispose();
      materials.pleatedSkirt.dispose();
      materials.redTie.dispose();
      materials.stockings.dispose();
      materials.bootsArmor.dispose();
      materials.goldTrim.dispose();
      materials.cannonChassis.dispose();
      materials.cannonBarrel.dispose();
      materials.nuclearCoreGlow.dispose();
      materials.laceUnderwear.dispose();
      materials.face.dispose();
    }
  };

  return materials;
}

/**
 * Updates dynamic material properties of Kara according to the active cloth damage tier.
 */
export function updateKaraClothTier(materials: KaraMaterials, tier: ClothDamageTier): void {
  if (tier === 1) {
    materials.whiteShirt.color.setHex(0xF8FAFC);
    materials.nuclearCoreGlow.emissiveIntensity = 2.4;
  } else if (tier === 2) {
    materials.whiteShirt.color.setHex(0xF1F5F9);
    materials.nuclearCoreGlow.emissiveIntensity = 3.2;
  } else {
    // Tier 3: Core superheated
    materials.nuclearCoreGlow.emissiveIntensity = 4.5;
  }
}
