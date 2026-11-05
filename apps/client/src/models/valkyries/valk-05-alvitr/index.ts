import { ClothDamageTier } from '@valkyrie/shared-domain';
import {
  Valkyrie3DModelInstance,
  ValkyrieModelInitConfig,
  UnitCombatVisualState
} from '../valkyrie-3d-types.js';
import { createAlvitrMaterials, updateAlvitrClothTier } from './alvitr-materials.js';
import { buildAlvitrGeometry } from './alvitr-geometry.js';
import { createAlvitrAnimations } from './alvitr-animations.js';

/**
 * Factory function to create the bespoke 3D humanoid model for Alvitr (VALK-05).
 * Tạo mô hình 3D hình người riêng biệt cho Alvitr (Pháp Sư Thiên Lôi / Backline Sorceress):
 * - Chiều cao 1.70m, cúp ngực F (0.36m), mái tóc tím thẫm dài gợn sóng lãng mạn.
 * - Quả cầu lôi điện tử Gimbal Gyroscope 3 vòng xoay độc lập lơ lửng trước tay.
 * - 3 cấp độ rách đầm dạ hội lụa 18+ (Pristine -> Xẻ Tà Hông & Rách Ngực -> Climax Lôi Quang Trút Xuống).
 * - Cử động mượt mà 60 FPS, 100% 3D Procedural Mesh, không dùng sprite ảnh 2D.
 */
export function createAlvitr3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createAlvitrMaterials(config.isEnemy);
  const geometryHierarchy = buildAlvitrGeometry(materials);
  const animationController = createAlvitrAnimations(geometryHierarchy, materials);

  // Apply initial cloth damage tier
  updateAlvitrClothTier(materials, config.tier);
  geometryHierarchy.updateClothDamageTier(config.tier);

  const modelInstance: Valkyrie3DModelInstance = {
    rootGroup: geometryHierarchy.rootGroup,

    update: (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
      animationController.update(delta, elapsedTime, state);
    },

    setClothTier: (tier: ClothDamageTier): void => {
      updateAlvitrClothTier(materials, tier);
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

export * from './alvitr-materials.js';
export * from './alvitr-geometry.js';
export * from './alvitr-animations.js';
export * from './alvitr-face-texture.js';
