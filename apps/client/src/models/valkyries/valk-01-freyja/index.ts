import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { createFreyjaMaterials, applyFreyjaClothTier } from './freyja-materials.js';
import { buildFreyjaGeometry } from './freyja-geometry.js';
import { FreyjaAnimationController } from './freyja-animations.js';
import { FreyjaVfxController } from './freyja-vfx.js';

/**
 * Factory that instantiates a fully interactive, articulated 3D humanoid anime model of Freyja.
 * Hàm khởi tạo thực thể mô hình 3D hình người cử động hoàn chỉnh của Freyja (VALK-01).
 *
 * @param config - Initial model configuration.
 * @returns Fully reactive Valkyrie3DModelInstance with update loops and animation triggers.
 */
export function createFreyja3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createFreyjaMaterials(config.isEnemy);
  const hierarchy = buildFreyjaGeometry(materials);
  const animController = new FreyjaAnimationController(hierarchy);
  const vfxController = new FreyjaVfxController(hierarchy);

  let currentTier: ClothDamageTier = config.tier;
  // Initialize with the provided cloth damage tier and visual hierarchy
  applyFreyjaClothTier(materials, config.tier, hierarchy);

  return {
    rootGroup: hierarchy.rootGroup,

    update: (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
      if (state.tier !== currentTier) {
        currentTier = state.tier;
        applyFreyjaClothTier(materials, currentTier, hierarchy);
      }
      animController.update(delta, elapsedTime, state);
      vfxController.update(delta, elapsedTime, state, currentTier);
    },

    setClothTier: (tier: ClothDamageTier): void => {
      currentTier = tier;
      applyFreyjaClothTier(materials, tier, hierarchy);
    },

    triggerAttack: (): void => {
      animController.triggerAttack();
      vfxController.triggerAttackVfx();
    },

    triggerUltimate: (): void => {
      animController.triggerUltimate();
      vfxController.triggerUltimateVfx();
    },

    triggerHit: (): void => {
      animController.triggerHit();
      vfxController.triggerHitVfx();
    },

    dispose: (): void => {
      vfxController.dispose();
      hierarchy.dispose();
      materials.dispose();
    }
  };
}
