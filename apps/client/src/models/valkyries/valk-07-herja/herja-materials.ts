import * as THREE from 'three';
import { createHerjaFaceTexture } from './herja-face-texture';

export interface HerjaMaterialBundle {
  skinMat: THREE.MeshStandardMaterial;
  faceMat: THREE.MeshStandardMaterial;
  hairMat: THREE.MeshStandardMaterial;
  leatherMat: THREE.MeshStandardMaterial;
  titanMetalMat: THREE.MeshStandardMaterial;
  goldTrimMat: THREE.MeshStandardMaterial;
  thunderPlasmaMat: THREE.MeshStandardMaterial;
  spearShaftMat: THREE.MeshStandardMaterial;
  bloodCutMat: THREE.MeshStandardMaterial;
  tornStrapMat: THREE.MeshStandardMaterial;
  updateClothTier: (tier: 1 | 2 | 3) => void;
  dispose: () => void;
}

/**
 * Creates the complete PBR material set for VALK-07: Herja (Frontline Berserker).
 * Khởi tạo bộ vật liệu PBR cho Herja:
 * - Da bánh mật khỏe khoắn bóng mồ hôi chiến trận.
 * - Da thuộc chiến binh phương Bắc dạn dày sương gió.
 * - Kim loại Titan gai góc, ngọn thương sấm sét Gungnir phát quang plasma.
 * - Vết cào rớm máu đầy khiêu khích và hệ thống rách giáp 3 cấp độ (Tier 1-3).
 */
export function createHerjaMaterials(): HerjaMaterialBundle {
  const faceTexture = createHerjaFaceTexture();

  // 1. Da bánh mật khỏe khoắn bóng mồ hôi chiến binh
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfcdbc8,
    roughness: 0.42, // Hơi bóng nhẹ thể hiện mồ hôi chiến trận
    metalness: 0.05
  });

  // 2. Khuôn mặt Anime
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.45,
    metalness: 0.05
  });

  // 3. Mái tóc vàng ánh kim hoang dã (Wild Golden Blonde)
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0xffcd38,
    roughness: 0.35,
    metalness: 0.15,
    emissive: 0x553800,
    emissiveIntensity: 0.2
  });

  // 4. Da thuộc chiến binh dạn dày (Weathered Brown Leather)
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x3d261a,
    roughness: 0.65,
    metalness: 0.12
  });

  // 5. Kim loại Titan gai góc (Rugged Titan Armor)
  const titanMetalMat = new THREE.MeshStandardMaterial({
    color: 0x3a3f47,
    roughness: 0.28,
    metalness: 0.88
  });

  // 6. Hoa văn phù điêu vàng Bắc Âu (Norse Gold Accents)
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf5a623,
    roughness: 0.22,
    metalness: 0.92,
    emissive: 0x4a2c00,
    emissiveIntensity: 0.2
  });

  // 7. Lưỡi thương sấm sét Plasma (Thunder Plasma Energy)
  const thunderPlasmaMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    roughness: 0.15,
    metalness: 0.3,
    emissive: 0xff9900,
    emissiveIntensity: 1.45
  });

  // 8. Cán thương kim loại gia cường (Reinforced Spear Shaft)
  const spearShaftMat = new THREE.MeshStandardMaterial({
    color: 0x22262c,
    roughness: 0.32,
    metalness: 0.82
  });

  // 9. Vết cào rớm máu đầy khiêu khích trên ngực (Blood Scratches - Tier 2 & 3)
  const bloodCutMat = new THREE.MeshStandardMaterial({
    color: 0xc62828,
    roughness: 0.25,
    metalness: 0.2,
    emissive: 0xb71c1c,
    emissiveIntensity: 0.65
  });

  // 10. Dây đai da rách tả tơi che hờ hững (Tier 3 Climax Extreme)
  const tornStrapMat = new THREE.MeshStandardMaterial({
    color: 0x2b1b12,
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  // Cập nhật trạng thái rách giáp 3 cấp độ
  const updateClothTier = (tier: 1 | 2 | 3): void => {
    if (tier === 1) {
      leatherMat.color.setHex(0x3d261a);
      leatherMat.opacity = 1.0;
      leatherMat.transparent = false;
      titanMetalMat.color.setHex(0x3a3f47);
      thunderPlasmaMat.emissiveIntensity = 1.45;
      skinMat.roughness = 0.42;
      skinMat.emissive.setHex(0x000000);
      skinMat.emissiveIntensity = 0;
    } else if (tier === 2) {
      // Tier 2: Nứt vỡ giáp vai, vỡ một bên áo ngực da, rớm máu khiêu khích
      leatherMat.color.setHex(0x341f14);
      leatherMat.opacity = 0.85;
      leatherMat.transparent = true;
      titanMetalMat.color.setHex(0x553530); // Kim loại trầy xước đỏ lửa
      thunderPlasmaMat.emissiveIntensity = 1.85;
      // Mồ hôi bóng nhẫy, da ửng hồng say máu
      skinMat.roughness = 0.32;
      skinMat.emissive.setHex(0xaa2233);
      skinMat.emissiveIntensity = 0.14;
    } else {
      // Tier 3: Climax Extreme 18+ - Áo rách vụn hoàn toàn, da bóng nhẫy mồ hôi và vệt dầu, ngọn thương cuồng nộ
      leatherMat.opacity = 0.3;
      leatherMat.transparent = true;
      thunderPlasmaMat.emissiveIntensity = 2.4;
      skinMat.roughness = 0.22; // Bóng nhẫy mồ hôi tột đỉnh
      skinMat.emissive.setHex(0xff2244);
      skinMat.emissiveIntensity = 0.28;
    }
  };

  const dispose = (): void => {
    faceTexture.dispose();
    skinMat.dispose();
    faceMat.dispose();
    hairMat.dispose();
    leatherMat.dispose();
    titanMetalMat.dispose();
    goldTrimMat.dispose();
    thunderPlasmaMat.dispose();
    spearShaftMat.dispose();
    bloodCutMat.dispose();
    tornStrapMat.dispose();
  };

  return {
    skinMat,
    faceMat,
    hairMat,
    leatherMat,
    titanMetalMat,
    goldTrimMat,
    thunderPlasmaMat,
    spearShaftMat,
    bloodCutMat,
    tornStrapMat,
    updateClothTier,
    dispose
  };
}
