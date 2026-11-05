import { ClothDamageTier } from '@valkyrie/shared-domain';
import {
  Valkyrie3DModelInstance,
  ValkyrieModelInitConfig,
  UnitCombatVisualState
} from '../valkyrie-3d-types.js';
import { createHerjaMaterials } from './herja-materials.js';
import { buildHerjaGeometry } from './herja-geometry.js';
import { createHerjaAnimations } from './herja-animations.js';

/**
 * Factory creating VALK-07: Herja (Frontline Berserker) 3D Model Instance.
 * Khởi tạo mô hình 3D hoàn chỉnh cho Herja:
 * - 100% Procedural Mesh Three.js, không dùng sprite ảnh 2D.
 * - Chiều cao 1.74m, Cúp ngực E (0.34m) săn chắc nở nang, cơ bụng số 11 sắc nét.
 * - Ngọn Thương Sấm Sét Gungnir Replica dài 2.10m bùng cháy tia sét Plasma.
 * - Rách giáp 3 cấp độ (Tier 1-3).
 */
export function createHerjaModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createHerjaMaterials();
  const meshParts = buildHerjaGeometry(materials);
  const anims = createHerjaAnimations(meshParts, materials);

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
