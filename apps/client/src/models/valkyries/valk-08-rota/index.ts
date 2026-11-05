import { ClothDamageTier } from '@valkyrie/shared-domain';
import {
  Valkyrie3DModelInstance,
  ValkyrieModelInitConfig,
  UnitCombatVisualState
} from '../valkyrie-3d-types.js';
import { createRotaMaterials } from './rota-materials.js';
import { buildRotaGeometry } from './rota-geometry.js';
import { createRotaAnimations } from './rota-animations.js';

/**
 * Factory creating VALK-08: Rota (Midline Skirmisher / Blade Dancer) 3D Model Instance.
 * Khởi tạo mô hình 3D hoàn chỉnh cho Rota:
 * - 100% Procedural Mesh Three.js, không dùng sprite ảnh 2D.
 * - Chiều cao 1.70m, Cúp ngực D (0.32m), bộ đồ Leotard khoét hông cao quyến rũ.
 * - 4 Lưỡi Kiếm Bay Lơ Lửng xoay đồng tâm quanh cơ thể.
 * - Rách giáp 3 cấp độ (Tier 1-3).
 */
export function createRotaModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createRotaMaterials();
  const meshParts = buildRotaGeometry(materials);
  const anims = createRotaAnimations(meshParts, materials);

  // Áp dụng cờ xoay nếu là kẻ địch
  if (config.isEnemy) {
    meshParts.rootGroup.rotation.y = Math.PI;
  }

  // Áp dụng cấp độ rách giáp ban đầu
  const setClothTier = (tier: ClothDamageTier): void => {
    materials.updateClothTier(tier);
    meshParts.tier1Group.visible = tier === 1;
    meshParts.tier2Group.visible = tier === 2;
    meshParts.tier3Group.visible = tier === 3;
  };
  setClothTier(config.tier ?? 1);

  const update = (delta: number, elapsedTime: number, _state: UnitCombatVisualState): void => {
    anims.update(delta, elapsedTime);
  };

  const dispose = (): void => {
    materials.dispose();
  };

  return {
    rootGroup: meshParts.rootGroup,
    update,
    setClothTier,
    triggerAttack: () => anims.triggerAttack(),
    triggerUltimate: () => anims.triggerUltimate(),
    triggerHit: () => anims.triggerHit(),
    dispose
  };
}
