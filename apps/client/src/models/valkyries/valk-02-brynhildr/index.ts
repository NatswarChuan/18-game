import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { createBrynhildrMaterials, updateBrynhildrClothTier } from './brynhildr-materials.js';
import { buildBrynhildrGeometry } from './brynhildr-geometry.js';
import { createBrynhildrAnimations } from './brynhildr-animations.js';

/**
 * Factory that instantiates a fully interactive, articulated 3D humanoid anime model of Brynhildr (VALK-02).
 * Hàm khởi tạo mô hình 3D hình người cử động hoàn chỉnh của Brynhildr - Khiên Băng Tuyệt Đối (Neo-Valhalla).
 *
 * @param config - Initial model configuration.
 * @returns Fully reactive Valkyrie3DModelInstance with update loops and animation triggers.
 */
export function createBrynhildr3DModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createBrynhildrMaterials(config.isEnemy);
  const bundle = buildBrynhildrGeometry(materials);
  const animController = createBrynhildrAnimations(bundle.bones);

  // Initialize with the provided cloth damage tier
  updateBrynhildrClothTier(materials, config.tier);
  bundle.updateTier(config.tier);

  return {
    rootGroup: bundle.bones.rootGroup,

    update: (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
      animController.update(delta, elapsedTime, state);
    },

    setClothTier: (tier: ClothDamageTier): void => {
      updateBrynhildrClothTier(materials, tier);
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
