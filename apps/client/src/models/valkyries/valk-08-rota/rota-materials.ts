import * as THREE from 'three';
import { createRotaFaceTexture } from './rota-face-texture';

export interface RotaMaterialBundle {
  skinMat: THREE.MeshStandardMaterial;
  faceMat: THREE.MeshStandardMaterial;
  hairMat: THREE.MeshStandardMaterial;
  leotardBlueMat: THREE.MeshStandardMaterial;
  leotardWhiteMat: THREE.MeshStandardMaterial;
  goldTrimMat: THREE.MeshStandardMaterial;
  bladePlasmaMat: THREE.MeshStandardMaterial;
  bladeSteelMat: THREE.MeshStandardMaterial;
  thighRibbonMat: THREE.MeshStandardMaterial;
  lingerieStrapMat: THREE.MeshStandardMaterial;
  updateClothTier: (tier: 1 | 2 | 3) => void;
  dispose: () => void;
}

/**
 * Creates the complete PBR material set for VALK-08: Rota (Midline Skirmisher / Blade Dancer).
 * Khởi tạo bộ vật liệu PBR cho Rota:
 * - Vải Leotard bó sát gợi cảm màu xanh lam đậm phối trắng bạc bóng bẩy.
 * - Mái tóc xanh cobalt buộc đuôi ngựa cao.
 * - Lưỡi kiếm bay Plasma xanh sapphire phát quang trường lực từ tính.
 * - Ruy-băng quấn đùi bán trong suốt và hệ thống rách giáp 3 cấp độ (Tier 1-3).
 */
export function createRotaMaterials(): RotaMaterialBundle {
  const faceTexture = createRotaFaceTexture();

  // 1. Da trắng hồng mịn màng của vũ công
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfdebe4,
    roughness: 0.48,
    metalness: 0.04
  });

  // 2. Khuôn mặt Anime
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture,
    roughness: 0.48,
    metalness: 0.04
  });

  // 3. Mái tóc xanh cobalt rực rỡ (Cobalt Blue Hair)
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x1a5acc,
    roughness: 0.32,
    metalness: 0.18,
    emissive: 0x081e4d,
    emissiveIntensity: 0.25
  });

  // 4. Vải leotard xanh lam thẫm bó sát (Midnight Blue Leotard)
  const leotardBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0f2452,
    roughness: 0.38,
    metalness: 0.14
  });

  // 5. Vải satin trắng phối hai bên hông và ngực (White Satin Accents)
  const leotardWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf4f7fd,
    roughness: 0.32,
    metalness: 0.1
  });

  // 6. Kim loại vàng hoàng kim viền trang phục (Gold Dancer Trims)
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffcc11,
    roughness: 0.22,
    metalness: 0.92,
    emissive: 0x4d3800,
    emissiveIntensity: 0.22
  });

  // 7. Lưỡi kiếm Plasma xanh sapphire (Sapphire Plasma Edge)
  const bladePlasmaMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.15,
    metalness: 0.2,
    emissive: 0x0077ff,
    emissiveIntensity: 1.45
  });

  // 8. Thép gương phản chiếu thân kiếm (Mirror Steel Blade Body)
  const bladeSteelMat = new THREE.MeshStandardMaterial({
    color: 0xd8e4f0,
    roughness: 0.12,
    metalness: 0.95
  });

  // 9. Dải ruy băng quấn đùi vũ công (Thigh Ribbon)
  const thighRibbonMat = new THREE.MeshStandardMaterial({
    color: 0x0f2866,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.82
  });

  // 10. Dây đan mỏng manh che hờ hững Tier 3 Climax Extreme
  const lingerieStrapMat = new THREE.MeshStandardMaterial({
    color: 0x091738,
    roughness: 0.5,
    metalness: 0.1,
    transparent: true,
    opacity: 0.75
  });

  // Cập nhật trạng thái rách giáp 3 cấp độ
  const updateClothTier = (tier: 1 | 2 | 3): void => {
    if (tier === 1) {
      leotardBlueMat.color.setHex(0x0f2452);
      leotardBlueMat.opacity = 1.0;
      leotardBlueMat.transparent = false;
      leotardWhiteMat.opacity = 1.0;
      leotardWhiteMat.transparent = false;
      bladePlasmaMat.emissiveIntensity = 1.45;
      skinMat.emissive.setHex(0x000000);
      skinMat.emissiveIntensity = 0;
    } else if (tier === 2) {
      // Tier 2: Leotard rách toạc hai bên hông lộ xương chậu, xẻ ngực cúp D
      leotardBlueMat.color.setHex(0x132a61);
      leotardBlueMat.opacity = 0.85;
      leotardBlueMat.transparent = true;
      leotardWhiteMat.opacity = 0.8;
      leotardWhiteMat.transparent = true;
      bladePlasmaMat.emissiveIntensity = 1.85;
      // Da ửng hồng vì cơ thể nóng lên sau bài kiếm vũ
      skinMat.emissive.setHex(0xcc3366);
      skinMat.emissiveIntensity = 0.12;
    } else {
      // Tier 3: Climax Extreme 18+ - Leotard rách vụn chỉ còn vài sợi dây đan chéo manh manh
      leotardBlueMat.opacity = 0.25;
      leotardBlueMat.transparent = true;
      leotardWhiteMat.opacity = 0.2;
      leotardWhiteMat.transparent = true;
      bladePlasmaMat.emissiveIntensity = 2.4;
      // Da đỏ hồng hưng phấn, cơ thể run rẩy
      skinMat.emissive.setHex(0xff2255);
      skinMat.emissiveIntensity = 0.26;
    }
  };

  const dispose = (): void => {
    faceTexture.dispose();
    skinMat.dispose();
    faceMat.dispose();
    hairMat.dispose();
    leotardBlueMat.dispose();
    leotardWhiteMat.dispose();
    goldTrimMat.dispose();
    bladePlasmaMat.dispose();
    bladeSteelMat.dispose();
    thighRibbonMat.dispose();
    lingerieStrapMat.dispose();
  };

  return {
    skinMat,
    faceMat,
    hairMat,
    leotardBlueMat,
    leotardWhiteMat,
    goldTrimMat,
    bladePlasmaMat,
    bladeSteelMat,
    thighRibbonMat,
    lingerieStrapMat,
    updateClothTier,
    dispose
  };
}
