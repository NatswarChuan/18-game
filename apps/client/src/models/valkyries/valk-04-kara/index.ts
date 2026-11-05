import { ClothDamageTier } from '@valkyrie/shared-domain';
import {
  Valkyrie3DModelInstance,
  ValkyrieModelInitConfig,
  UnitCombatVisualState
} from '../valkyrie-3d-types.js';
import { createKaraMaterials, updateKaraClothTier } from './kara-materials.js';
import { buildKaraGeometry } from './kara-geometry.js';
import { createKaraAnimations } from './kara-animations.js';

/**
 * Factory function to create the bespoke 3D humanoid model for Kara (VALK-04).
 * Tạo mô hình 3D hình người riêng biệt cho Kara (Pháo Thủ Hạng Nặng / Backline Artillery):
 * - Chiều cao 1.62m, cúp ngực D (0.31m), tóc vàng twin-tails óng ả bồng bềnh.
 * - Khẩu trọng pháo hạt nhân Heavy Railgun dài 1.85m vác vai với lõi plasma phát sáng.
 * - 3 cấp độ rách quân phục 18+ (Pristine -> Rách Váy & Bung Áo -> Climax Nội Y Ren Mỏng).
 * - Cử động mượt mà 60 FPS, 100% 3D Procedural Mesh, không dùng sprite ảnh 2D.
 */
export function createKara3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createKaraMaterials(config.isEnemy);
  const geometryHierarchy = buildKaraGeometry(materials);
  const animationController = createKaraAnimations(geometryHierarchy, materials);

  // Apply initial cloth damage tier
  updateKaraClothTier(materials, config.tier);
  geometryHierarchy.updateClothDamageTier(config.tier);

  const modelInstance: Valkyrie3DModelInstance = {
    rootGroup: geometryHierarchy.rootGroup,

    update: (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
      animationController.update(delta, elapsedTime, state);
    },

    setClothTier: (tier: ClothDamageTier): void => {
      updateKaraClothTier(materials, tier);
      geometryHierarchy.updateClothDamageTier(tier);
    },

    triggerAttack: (): void => {
      animationController.triggerAttack();
    },

    triggerUltimate: (): void => {
      animationController.triggerUltimate();
    },

    triggerHit: (): void => {
      animationController.triggerHit();
    },

    dispose: (): void => {
      animationController.dispose();
      geometryHierarchy.dispose();
      materials.dispose();
    }
  };

  return modelInstance;
}

export * from './kara-materials.js';
export * from './kara-geometry.js';
export * from './kara-animations.js';
export * from './kara-face-texture.js';
