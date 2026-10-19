import {
  MAX_UNITS_PER_TEAM,
  MIN_EMPTY_SLOTS,
  TOTAL_SLOTS
} from '../constants/index.js';

export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type BoardRow = 'FRONTLINE' | 'MIDLINE' | 'BACKLINE';
export type BoardColumn = 'LEFT' | 'CENTER' | 'RIGHT';

export interface SlotBehavior {
  readonly slotIndex: SlotIndex;
  readonly row: number; // 0, 1, 2
  readonly col: number; // 0, 1, 2
  readonly rowType: BoardRow;
  readonly colType: BoardColumn;
  readonly manaGainOnDamageBonus: number; // e.g. 0.15 for Frontline
  readonly attackSpeedBonus: number;      // e.g. 0.10 for Midline
  readonly rangeBonus: number;            // e.g. +1 for Backline
  readonly targetPriorityWeight: number;  // Higher means targeted first
}

/**
 * Immutable lookup table for 3x3 grid slots.
 * Bảng tra cứu bất biến cho 9 ô cờ của bàn cờ 3x3.
 */
export const GRID_SLOT_BEHAVIORS: Readonly<Record<SlotIndex, SlotBehavior>> = {
  0: {
    slotIndex: 0,
    row: 0,
    col: 0,
    rowType: 'FRONTLINE',
    colType: 'LEFT',
    manaGainOnDamageBonus: 0.15,
    attackSpeedBonus: 0.0,
    rangeBonus: 0,
    targetPriorityWeight: 1.0
  },
  1: {
    slotIndex: 1,
    row: 0,
    col: 1,
    rowType: 'FRONTLINE',
    colType: 'CENTER',
    manaGainOnDamageBonus: 0.15,
    attackSpeedBonus: 0.0,
    rangeBonus: 0,
    targetPriorityWeight: 1.2 // Center frontline gets focused slightly more
  },
  2: {
    slotIndex: 2,
    row: 0,
    col: 2,
    rowType: 'FRONTLINE',
    colType: 'RIGHT',
    manaGainOnDamageBonus: 0.15,
    attackSpeedBonus: 0.0,
    rangeBonus: 0,
    targetPriorityWeight: 1.0
  },
  3: {
    slotIndex: 3,
    row: 1,
    col: 0,
    rowType: 'MIDLINE',
    colType: 'LEFT',
    manaGainOnDamageBonus: 0.05,
    attackSpeedBonus: 0.10,
    rangeBonus: 0,
    targetPriorityWeight: 0.7
  },
  4: {
    slotIndex: 4,
    row: 1,
    col: 1,
    rowType: 'MIDLINE',
    colType: 'CENTER',
    manaGainOnDamageBonus: 0.05,
    attackSpeedBonus: 0.10,
    rangeBonus: 0,
    targetPriorityWeight: 0.8
  },
  5: {
    slotIndex: 5,
    row: 1,
    col: 2,
    rowType: 'MIDLINE',
    colType: 'RIGHT',
    manaGainOnDamageBonus: 0.05,
    attackSpeedBonus: 0.10,
    rangeBonus: 0,
    targetPriorityWeight: 0.7
  },
  6: {
    slotIndex: 6,
    row: 2,
    col: 0,
    rowType: 'BACKLINE',
    colType: 'LEFT',
    manaGainOnDamageBonus: 0.0,
    attackSpeedBonus: 0.0,
    rangeBonus: 1,
    targetPriorityWeight: 0.4
  },
  7: {
    slotIndex: 7,
    row: 2,
    col: 1,
    rowType: 'BACKLINE',
    colType: 'CENTER',
    manaGainOnDamageBonus: 0.0,
    attackSpeedBonus: 0.0,
    rangeBonus: 1,
    targetPriorityWeight: 0.5
  },
  8: {
    slotIndex: 8,
    row: 2,
    col: 2,
    rowType: 'BACKLINE',
    colType: 'RIGHT',
    manaGainOnDamageBonus: 0.0,
    attackSpeedBonus: 0.0,
    rangeBonus: 1,
    targetPriorityWeight: 0.4
  }
};

export interface UnitPlacement {
  readonly valkyrieId: string;
  readonly slotIndex: SlotIndex;
}

export interface FormationValidationResult {
  readonly isValid: boolean;
  readonly errorMessage?: string;
}

/**
 * Validates player formation according to 3x3 tactical rules:
 * - Total units <= 6 (always leaves >= 3 empty slots).
 * - No duplicate slots.
 * - Slot indices bounded in 0..8.
 *
 * Xác thực đội hình 3x3 theo luật bàn cờ:
 * - Tối đa 6 quân (luôn chừa >= 3 ô trống).
 * - Không trùng ô cờ.
 * - Tọa độ ô trong khoảng 0..8.
 *
 * @param formation - List of unit placements / Danh sách bố trí quân
 * @returns Validation result / Kết quả xác thực
 */
export function validateFormation(formation: readonly UnitPlacement[]): FormationValidationResult {
  if (formation.length > MAX_UNITS_PER_TEAM) {
    return {
      isValid: false,
      errorMessage: `Đội hình vượt quá số lượng tối đa (${formation.length}/${MAX_UNITS_PER_TEAM}). Cần chừa tối thiểu ${MIN_EMPTY_SLOTS} ô trống.`
    };
  }

  const usedSlots = new Set<number>();
  for (const placement of formation) {
    if (placement.slotIndex < 0 || placement.slotIndex >= TOTAL_SLOTS) {
      return {
        isValid: false,
        errorMessage: `Tọa độ ô cờ ${placement.slotIndex} không hợp lệ (hợp lệ: 0..8).`
      };
    }

    if (usedSlots.has(placement.slotIndex)) {
      return {
        isValid: false,
        errorMessage: `Ô cờ ${placement.slotIndex} bị đặt trùng lặp quân.`
      };
    }
    usedSlots.add(placement.slotIndex);
  }

  return { isValid: true };
}
