import { ClothDamageTier } from '@valkyrie/shared-domain';
import {
  Valkyrie3DModelInstance,
  ValkyrieModelInitConfig,
  UnitCombatVisualState
} from '../valkyrie-3d-types.js';
import { createMistMaterials } from './mist-materials.js';
import { buildMistGeometry } from './mist-geometry.js';
import { createMistAnimations } from './mist-animations.js';

/**
 * Factory creating VALK-06: Mist (Holy Saint / Support) 3D Model Instance.
 * Khởi tạo mô hình 3D hoàn chỉnh cho Mist:
 * - 100% Procedural Mesh Three.js, không dùng sprite 2D.
 * - Tỷ lệ Cup H (0.42m) thánh thiện gợi cảm.
 * - Đôi cánh thiên sứ ánh sáng & Quyền trượng Nano Thánh Quang.
 * - Rách giáp 3 cấp độ (Tier 1-3).
 */
export function createMistModel(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const materials = createMistMaterials();
  const meshParts = buildMistGeometry(materials);
  const anims = createMistAnimations(meshParts, materials);

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
