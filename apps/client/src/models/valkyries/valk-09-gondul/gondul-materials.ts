import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createGondulFaceTexture } from './gondul-face-texture.js';

export interface GondulMaterialsBundle {
  readonly skinMat: THREE.MeshStandardMaterial;
  readonly faceMat: THREE.MeshStandardMaterial;
  readonly hairMat: THREE.MeshStandardMaterial;
  readonly labCoatMat: THREE.MeshStandardMaterial;
  readonly bodysuitMat: THREE.MeshStandardMaterial;
  readonly trimMat: THREE.MeshStandardMaterial;
  readonly glassesMat: THREE.MeshStandardMaterial;
  readonly droneShellMat: THREE.MeshStandardMaterial;
  readonly droneCoreMat: THREE.MeshBasicMaterial;
  readonly hologramMat: THREE.MeshBasicMaterial;
  readonly forcefieldMat: THREE.MeshBasicMaterial;
  readonly updateClothTier: (tier: ClothDamageTier) => void;
  readonly dispose: () => void;
}

/**
 * Creates and manages PBR materials for VALK-09 Gondul.
 * Bộ chất liệu PBR cho VALK-09 Gondul (Nhà Nghiên Cứu Ma Trận Khiên Neo-Valhalla):
 * Áo khoác blouse trắng phòng thí nghiệm, bodysuit công nghệ cao khoét ngực sâu,
 * da ngọc đào bóng bẩy, máy tính hologram và cặp drone hộ vệ.
 */
export function createGondulMaterials(initialTier: ClothDamageTier = 1): GondulMaterialsBundle {
  let faceTexture = createGondulFaceTexture(initialTier);

  // 1. Pale Rosy Peach Anime Skin (Da ngọc đào)
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffeae4,
    roughness: initialTier === 3 ? 0.22 : 0.45,
    metalness: 0.04
  });

  // 2. Anime Face with Megane Glasses & Ruby Eyes
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.38,
    metalness: 0.02
  });

  // 3. Soft Pastel Pink Anime Hair (Mái tóc hồng nhạt mềm mại)
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0xffadc6,
    roughness: 0.55,
    metalness: 0.08,
    side: THREE.DoubleSide
  });

  // 4. White High-Tech Lab Coat (Áo blouse phòng thí nghiệm)
  const labCoatMat = new THREE.MeshStandardMaterial({
    color: 0xf5f8fc,
    roughness: 0.48,
    metalness: 0.12,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: initialTier === 3 ? 0.35 : initialTier === 2 ? 0.8 : 1.0
  });

  // 5. Deep Indigo High-Tech Bodysuit (Bodysuit công nghệ cao xẻ ngực sâu)
  const bodysuitMat = new THREE.MeshStandardMaterial({
    color: 0x161a2e,
    roughness: 0.32,
    metalness: 0.35
  });

  // 6. Gold & Magenta Trims (Viền vàng kim & hồng neon)
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.85,
    roughness: 0.22,
    emissive: 0x553300,
    emissiveIntensity: 0.25
  });

  // 7. Glasses Gold Frame (Gọng kính cận vàng kim)
  const glassesMat = new THREE.MeshStandardMaterial({
    color: 0xffe066,
    metalness: 0.9,
    roughness: 0.18
  });

  // 8. Drone Ceramic Shell (Vỏ Drone trắng sứ)
  const droneShellMat = new THREE.MeshStandardMaterial({
    color: 0xedf2f7,
    roughness: 0.25,
    metalness: 0.4
  });

  // 9. Drone Plasma Core (Lõi năng lượng drone phát quang)
  const droneCoreMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.9
  });

  // 10. Holographic Tablet Display (Màn hình máy tính ba chiều)
  const hologramMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  // 11. Hexagonal Forcefield Shield (Màng khiên ma trận lục giác)
  const forcefieldMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });

  const updateClothTier = (tier: ClothDamageTier): void => {
    faceTexture.dispose();
    faceTexture = createGondulFaceTexture(tier);
    faceMat.map = faceTexture;
    faceMat.needsUpdate = true;

    if (tier === 1) {
      labCoatMat.opacity = 1.0;
      labCoatMat.color.setHex(0xf5f8fc);
      skinMat.roughness = 0.45;
      bodysuitMat.color.setHex(0x161a2e);
    } else if (tier === 2) {
      labCoatMat.opacity = 0.78;
      labCoatMat.color.setHex(0xe8edf5);
      skinMat.roughness = 0.32; // Slight sweat sheen
      bodysuitMat.color.setHex(0x1a152e); // Scuffed
    } else {
      // Tier 3: Climax Extreme - Wet skin gloss, torn blouse remnants, blush flush
      labCoatMat.opacity = 0.28;
      labCoatMat.color.setHex(0xdfd8e5);
      skinMat.roughness = 0.18; // Maximum sensual glistening sweat
      skinMat.color.setHex(0xffdedb); // Flushed rosy skin
      bodysuitMat.color.setHex(0x111322);
    }
  };

  const dispose = (): void => {
    faceTexture.dispose();
    skinMat.dispose();
    faceMat.dispose();
    hairMat.dispose();
    labCoatMat.dispose();
    bodysuitMat.dispose();
    trimMat.dispose();
    glassesMat.dispose();
    droneShellMat.dispose();
    droneCoreMat.dispose();
    hologramMat.dispose();
    forcefieldMat.dispose();
  };

  return {
    skinMat,
    faceMat,
    hairMat,
    labCoatMat,
    bodysuitMat,
    trimMat,
    glassesMat,
    droneShellMat,
    droneCoreMat,
    hologramMat,
    forcefieldMat,
    updateClothTier,
    dispose
  };
}
