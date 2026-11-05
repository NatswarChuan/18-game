import * as THREE from 'three';
import { createMistFaceTexture } from './mist-face-texture';

export interface MistMaterialBundle {
  skinMat: THREE.MeshStandardMaterial;
  faceMat: THREE.MeshStandardMaterial;
  hairMat: THREE.MeshStandardMaterial;
  habitWhiteMat: THREE.MeshStandardMaterial;
  goldTrimMat: THREE.MeshStandardMaterial;
  cyanGemMat: THREE.MeshStandardMaterial;
  wingMat: THREE.MeshStandardMaterial;
  veilMat: THREE.MeshStandardMaterial;
  stockingsMat: THREE.MeshStandardMaterial;
  scepterShaftMat: THREE.MeshStandardMaterial;
  scepterCoreMat: THREE.MeshStandardMaterial;
  lingerieMat: THREE.MeshStandardMaterial;
  updateClothTier: (tier: 1 | 2 | 3) => void;
  dispose: () => void;
}

/**
 * Creates the complete PBR material set for VALK-06: Mist (Holy Saint / Support).
 * Khởi tạo bộ vật liệu PBR cho Mist:
 * - Vải áo nữ tu công nghệ trắng tinh khiết viền vàng kim.
 * - Đôi cánh ánh sáng thiên thần phát quang thánh khiết.
 * - Mái tóc xanh ngọc bích dịu dàng.
 * - Vớ lụa trắng đùi bán trong suốt.
 * - Hệ thống chuyển đổi rách giáp 3 cấp độ (Tier 1-3).
 */
export function createMistMaterials(): MistMaterialBundle {
  const faceTexture = createMistFaceTexture();

  // 1. Làn da trắng hồng thánh nữ
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffede8,
    roughness: 0.55,
    metalness: 0.04
  });

  // 2. Khuôn mặt Anime
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.55,
    metalness: 0.04
  });

  // 3. Mái tóc xanh ngọc bích dịu dàng (Aquamarine / Mint Green)
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x36cfb5,
    roughness: 0.38,
    metalness: 0.12,
    emissive: 0x0a4036,
    emissiveIntensity: 0.22
  });

  // 4. Vải áo tu sĩ trắng tinh khiết (Pure Holy White Habit)
  const habitWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xfcfdff,
    roughness: 0.42,
    metalness: 0.08
  });

  // 5. Kim loại vàng hoàng kim thánh quang (Holy Gold)
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffd24d,
    roughness: 0.22,
    metalness: 0.92,
    emissive: 0x554000,
    emissiveIntensity: 0.25
  });

  // 6. Ngọc thánh quang xanh lam ngọc (Cyan Holy Gemstones)
  const cyanGemMat = new THREE.MeshStandardMaterial({
    color: 0x38e8ff,
    roughness: 0.12,
    metalness: 0.85,
    emissive: 0x00c4e6,
    emissiveIntensity: 0.85
  });

  // 7. Đôi cánh ánh sáng thiên thần (Angelic Light Wings)
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0xf0ffff,
    roughness: 0.15,
    metalness: 0.2,
    emissive: 0x88f5e6,
    emissiveIntensity: 0.95,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  });

  // 8. Khăn trùm đầu tu sĩ bán trong suốt (Semi-sheer Nun Veil)
  const veilMat = new THREE.MeshStandardMaterial({
    color: 0xfafbff,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.84,
    side: THREE.DoubleSide
  });

  // 9. Vớ lụa trắng đùi bán trong suốt (White Silk Thigh-highs)
  const stockingsMat = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    roughness: 0.45,
    metalness: 0.08,
    transparent: true,
    opacity: 0.72
  });

  // 10. Thân quyền trượng Nano (Holy Scepter Shaft)
  const scepterShaftMat = new THREE.MeshStandardMaterial({
    color: 0xf0f4f8,
    roughness: 0.25,
    metalness: 0.88
  });

  // 11. Lõi ngọc sao phát sáng quyền trượng (Pulsating Holy Star Core)
  const scepterCoreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.3,
    emissive: 0xffdf60,
    emissiveIntensity: 1.45
  });

  // 12. Dải ruy băng thánh mỏng manh che ngực Tier 3 Climax
  const lingerieMat = new THREE.MeshStandardMaterial({
    color: 0xfff0f5,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.68,
    emissive: 0xffccd6,
    emissiveIntensity: 0.25
  });

  // Cập nhật rách giáp theo 3 cấp độ (Tier 1 -> Tier 2 -> Tier 3)
  const updateClothTier = (tier: 1 | 2 | 3): void => {
    if (tier === 1) {
      // Tier 1: Nguyên bản trang nghiêm
      habitWhiteMat.color.setHex(0xfcfdff);
      habitWhiteMat.opacity = 1.0;
      habitWhiteMat.transparent = false;
      veilMat.opacity = 0.84;
      stockingsMat.opacity = 0.72;
      wingMat.emissiveIntensity = 0.95;
      wingMat.opacity = 0.88;
      skinMat.emissive.setHex(0x000000);
      skinMat.emissiveIntensity = 0;
    } else if (tier === 2) {
      // Tier 2: Rách áo tu sĩ, xẻ ngực Cup H, lộ đùi
      habitWhiteMat.color.setHex(0xf4f0f8);
      habitWhiteMat.opacity = 0.88;
      habitWhiteMat.transparent = true;
      veilMat.opacity = 0.55;
      stockingsMat.opacity = 0.52;
      wingMat.emissiveIntensity = 1.25;
      wingMat.opacity = 0.82;
      // Làn da hơi ửng hồng vì tim đập nhanh
      skinMat.emissive.setHex(0xff7799);
      skinMat.emissiveIntensity = 0.12;
    } else {
      // Tier 3: Climax Extreme 18+ - Cánh gãy cụp rực sáng, áo nát chỉ còn ruy băng mỏng
      habitWhiteMat.color.setHex(0xffeef4);
      habitWhiteMat.opacity = 0.28;
      habitWhiteMat.transparent = true;
      veilMat.opacity = 0.25;
      stockingsMat.opacity = 0.32;
      wingMat.emissiveIntensity = 1.75;
      wingMat.opacity = 0.75;
      // Da ửng hồng đỏ vì xấu hổ và sung sướng
      skinMat.emissive.setHex(0xff3366);
      skinMat.emissiveIntensity = 0.28;
    }
  };

  const dispose = (): void => {
    faceTexture.dispose();
    skinMat.dispose();
    faceMat.dispose();
    hairMat.dispose();
    habitWhiteMat.dispose();
    goldTrimMat.dispose();
    cyanGemMat.dispose();
    wingMat.dispose();
    veilMat.dispose();
    stockingsMat.dispose();
    scepterShaftMat.dispose();
    scepterCoreMat.dispose();
    lingerieMat.dispose();
  };

  return {
    skinMat,
    faceMat,
    hairMat,
    habitWhiteMat,
    goldTrimMat,
    cyanGemMat,
    wingMat,
    veilMat,
    stockingsMat,
    scepterShaftMat,
    scepterCoreMat,
    lingerieMat,
    updateClothTier,
    dispose
  };
}
