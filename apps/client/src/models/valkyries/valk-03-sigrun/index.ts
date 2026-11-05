import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { createSigrunMaterials, updateSigrunClothTier } from './sigrun-materials.js';
import { buildSigrunGeometry } from './sigrun-geometry.js';
import { createSigrunAnimations } from './sigrun-animations.js';

/**
 * Factory that instantiates a fully interactive, articulated 3D humanoid anime model of Sigrun (VALK-03).
 * Hàm khởi tạo mô hình 3D hình người cử động hoàn chỉnh của Sigrun - Sát Thủ Bóng Đêm (Neo-Valhalla).
 *
 * @param config - Initial model configuration.
 * @returns Fully reactive Valkyrie3DModelInstance with update loops and animation triggers.
 */
export function createSigrun3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createSigrunMaterials(config.isEnemy);
  const bundle = buildSigrunGeometry(materials);
  const animController = createSigrunAnimations(bundle.bones);

  // Initialize with the provided cloth damage tier
  updateSigrunClothTier(materials, config.tier);
  bundle.updateTier(config.tier);

  return {
    rootGroup: bundle.bones.rootGroup,

    update: (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
      animController.update(delta, elapsedTime, state);
    },

    setClothTier: (tier: ClothDamageTier): void => {
      updateSigrunClothTier(materials, tier);
      bundle.updateTier(tier);
    },

    triggerAttack: (): void => {
      animController.triggerAttack();
    },

    triggerUltimate: (): void => {
      animController.triggerUltimate();
    },

    triggerHit: (): void => {
      animController.triggerHit();
    },

    dispose: (): void => {
      bundle.meshes.dispose();
      materials.dispose();
    }
  };
}
