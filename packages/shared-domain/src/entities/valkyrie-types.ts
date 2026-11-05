/**
 * Valkyrie type definitions for Valkyrie Protocol: Zero (16+ Tactical Edition).
 * Định nghĩa kiểu dữ liệu cho thực thể Valkyrie.
 */

export type FactionId = 'NEO_VALHALLA' | 'ABYSSAL_EDEN' | 'SOL_DYNASTY';

export type TacticalRole =
  | 'FRONTLINE_BREAKER'
  | 'FRONTLINE_VANGUARD'
  | 'FRONTLINE_BERSERKER'
  | 'MIDLINE_INFILTRATOR'
  | 'MIDLINE_TACTICIAN'
  | 'MIDLINE_SKIRMISHER'
  | 'BACKLINE_ARTILLERY'
  | 'BACKLINE_SORCERESS'
  | 'BACKLINE_ENCHANTER';

export interface ValkyrieStats {
  readonly maxHp: number;
  readonly attack: number;
  readonly armor: number;
  readonly attackSpeed: number; // Attacks per second
  readonly attackRange: number; // 1 = Melee, 2 = Mid, 3 = Long
  readonly maxEnergy: number;   // 80 - 110
}

export interface ValkyrieUltimate {
  readonly name: string;
  readonly description: string;
  readonly energyCost: number;
  readonly cooldownTicks: number;
}

export interface ValkyrieBattleDamageMeta {
  readonly tier1Description: string; // Pristine
  readonly tier2Description: string; // Battle-Torn
  readonly tier3Description: string; // Critical Burst / Overdrive
  readonly battleVoiceLine: string;
}

export interface ValkyrieDefinition {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly faction: FactionId;
  readonly role: TacticalRole;
  readonly optimalSlot: number; // 0..8
  readonly stats: ValkyrieStats;
  readonly ultimate: ValkyrieUltimate;
  readonly battleDamage: ValkyrieBattleDamageMeta;
}
