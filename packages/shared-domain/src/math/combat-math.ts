import {
  ARMOR_CONSTANT_K,
  CLOTH_DAMAGE_TIER_1_THRESHOLD,
  CLOTH_DAMAGE_TIER_2_THRESHOLD,
  MIN_DEFENSE_CLAMP
} from '../constants/index.js';

export type ClothDamageTier = 1 | 2 | 3;

/**
 * Calculates final damage multiplier from physical/energy defense using hyperbolic formula.
 * Tính toán hệ số nhân sát thương từ chỉ số giáp/kháng dựa trên công thức Hyperbolic.
 *
 * Formula: multiplier = K / (K + max(MIN_CLAMP, defense))
 *
 * @param defenseValue - Armor or resistance value / Chỉ số giáp hoặc kháng
 * @returns Damage multiplier (greater than 0) / Hệ số nhân sát thương
 */
export function calculateDamageMultiplier(defenseValue: number): number {
  const safeDefense = Math.max(MIN_DEFENSE_CLAMP, defenseValue);
  return ARMOR_CONSTANT_K / (ARMOR_CONSTANT_K + safeDefense);
}

/**
 * Computes net combat damage applying attack power, multipliers and defense.
 * Tính toán lượng sát thương thực tế sau khi áp dụng giáp và hệ số bạo kích.
 *
 * @param rawAttack - Base attack power / Sát thương gốc
 * @param defense - Target defense value / Giáp của mục tiêu
 * @param isCritical - Whether attack is critical / Đòn đánh có bạo kích hay không
 * @param critMultiplier - Critical damage multiplier (e.g., 1.5) / Hệ số bạo kích
 * @returns Net integer damage dealt / Sát thương thực tế (số nguyên)
 */
export function calculateNetDamage(
  rawAttack: number,
  defense: number,
  isCritical: boolean = false,
  critMultiplier: number = 1.5
): number {
  const armorMult = calculateDamageMultiplier(defense);
  const critMult = isCritical ? Math.max(1.0, critMultiplier) : 1.0;
  const net = rawAttack * armorMult * critMult;
  return Math.max(1, Math.round(net));
}

/**
 * Evaluates the Cloth / Battle Damage Tier according to remaining health ratio.
 * Xác định Cấp độ Tổn hại Giáp phục (Cloth Damage Tier) theo tỷ lệ phần trăm máu còn lại.
 *
 * - Tier 1: Pristine (HP >= 70%)
 * - Tier 2: Battle-Torn (30% <= HP < 70%)
 * - Tier 3: Critical Burst (HP < 30%)
 *
 * @param currentHp - Current unit HP / Máu hiện tại
 * @param maxHp - Maximum unit HP / Máu tối đa
 * @returns Cloth damage tier (1, 2, or 3) / Cấp độ rách giáp (1, 2, hoặc 3)
 */
export function getClothDamageTier(currentHp: number, maxHp: number): ClothDamageTier {
  if (maxHp <= 0) {
    return 3;
  }
  const ratio = currentHp / maxHp;

  if (ratio >= CLOTH_DAMAGE_TIER_1_THRESHOLD) {
    return 1;
  }
  if (ratio >= CLOTH_DAMAGE_TIER_2_THRESHOLD) {
    return 2;
  }
  return 3;
}
