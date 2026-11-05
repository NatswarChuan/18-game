import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { createGondulMaterials } from './gondul-materials.js';
import { buildGondulGeometry } from './gondul-geometry.js';
import { createGondulAnimations } from './gondul-animations.js';

/**
 * Factory for VALK-09 Gondul (Neo-Valhalla Backline Enchanter / Shield Matrix Researcher).
 * Tạo thể hiện model 3D hoàn chỉnh cho VALK-09 Gondul:
 * - Procedural Humanoid Mesh (1.68m, Cúp F 0.36m, Áo blouse trắng & Bodysuit công nghệ cao)
 * - Meganekko Glasses (Kính cận 3D gọng vàng kim trên khuôn mặt)
 * - Hologram Pad Máy Tính & 2 Drone Hộ Vệ Ma Trận Khiên
 * - Hệ thống rách giáp 3 Tier 18+ & Tuyệt kỹ Overclock Forcefield
 */
export function createGondulModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createGondulMaterials(config.tier ?? 1);
  const meshHierarchy = buildGondulGeometry(materials);
  const animations = createGondulAnimations(meshHierarchy);

  let currentTier: ClothDamageTier = config.tier ?? 1;
  meshHierarchy.setClothTierGeometry(currentTier);

  const setClothTier = (tier: ClothDamageTier): void => {
    currentTier = tier;
    materials.updateClothTier(tier);
    meshHierarchy.setClothTierGeometry(tier);
  };

  const update = (delta: number, elapsedTime: number, state: UnitCombatVisualState): void => {
    animations.update(delta, elapsedTime, state);
  };

  const dispose = (): void => {
    materials.dispose();
  };

  return {
    rootGroup: meshHierarchy.rootGroup,
    update,
    setClothTier,
    triggerAttack: () => animations.triggerAttack(),
    triggerUltimate: () => animations.triggerUltimate(),
    triggerHit: () => animations.triggerHit(),
    dispose
  };
}
