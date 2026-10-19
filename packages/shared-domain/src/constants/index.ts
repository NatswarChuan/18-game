/**
 * Global game constants for Valkyrie Protocol: Zero (16+ Tactical Edition).
 * Các hằng số toàn cục cho trò chơi Valkyrie Protocol: Zero.
 */

export const TICK_RATE_HZ = 20 as const;
export const TICK_INTERVAL_MS = 50 as const; // 1000ms / 20 = 50ms
export const EPSILON = 1e-9 as const;

export const GRID_ROWS = 3 as const;
export const GRID_COLS = 3 as const;
export const TOTAL_SLOTS = 9 as const;
export const MAX_UNITS_PER_TEAM = 6 as const;
export const MIN_EMPTY_SLOTS = 3 as const;

export const DRAFT_TIMEOUT_SECONDS = 20 as const;
export const PREPARATION_TIMEOUT_SECONDS = 20 as const;
export const COMBAT_MAX_SECONDS = 60 as const;
export const COMBAT_MAX_TICKS = 1200 as const; // 60s * 20 ticks

export const BO3_TARGET_WINS = 2 as const;
export const BO5_TARGET_WINS = 3 as const;

export const BASE_HP = 1000 as const;
export const BASE_ATK = 50 as const;
export const MAX_MANA = 100 as const;

// Hyperbolic armor parameter
export const ARMOR_CONSTANT_K = 100 as const;
export const MIN_DEFENSE_CLAMP = -80 as const;

// Cloth / Battle Damage Tiers
export const CLOTH_DAMAGE_TIER_1_THRESHOLD = 0.7 as const; // HP >= 70%: Pristine
export const CLOTH_DAMAGE_TIER_2_THRESHOLD = 0.3 as const; // 30% <= HP < 70%: Battle-Torn
// HP < 30%: Tier 3 Critical Burst

// 12-Dimensional Vector Dimensions
export const VECTOR_DIMENSIONS = 12 as const;

export const VECTOR_DIMENSION_NAMES = [
  'PHYSICAL_DAMAGE', // 0
  'ENERGY_DAMAGE',   // 1
  'TRUE_DAMAGE',     // 2
  'PHYSICAL_ARMOR',  // 3
  'ENERGY_SHIELD',   // 4
  'HEALTH_REGEN',    // 5
  'ATTACK_SPEED',    // 6
  'CRITICAL_STRIKE', // 7
  'MANA_ACCELERATION', // 8
  'CROWD_CONTROL',   // 9
  'MOBILITY_DODGE',  // 10
  'COUNTER_REFLECT'  // 11
] as const;

export type VectorDimensionType = (typeof VECTOR_DIMENSION_NAMES)[number];
