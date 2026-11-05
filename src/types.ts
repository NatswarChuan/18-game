/**
 * Types and interfaces for Valkyrie Protocol: Zero (XR Blocks Edition).
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

export type ClothDamageTier = 1 | 2 | 3;
export type ClothDamageStatus = 'PRISTINE' | 'TORN' | 'CLIMAX';

export type SlotIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface UnitPlacement {
  readonly valkyrieId: string;
  readonly slotIndex: SlotIndex;
}

export type GamePhase =
  | 'MATCHMAKING'
  | 'DRAFT_BUFFS'
  | 'FORMATION_PLACEMENT'
  | 'COMBAT_SIMULATION'
  | 'ROUND_RESULT'
  | 'MATCH_RESULT'
  | 'VALKYRIE_STUDIO';

export type MatchFormat = 'BO3' | 'BO5';

export interface BuffDefinition {
  readonly id: string;
  readonly name: string;
  readonly depth: number;
  readonly category: string;
  readonly weights: readonly number[];
  readonly description: string;
  readonly statBoost?: {
    readonly attackPercent?: number;
    readonly hpPercent?: number;
    readonly armorFlat?: number;
    readonly energyRegen?: number;
    readonly critChance?: number;
  };
}

export interface CombatUnitState {
  readonly id: string;
  readonly ownerId: 'player' | 'opponent';
  readonly valkyrie: ValkyrieDefinition;
  readonly slotIndex: SlotIndex;
  hp: number;
  mana: number;
  clothDamageTier: ClothDamageTier;
  attackCooldownTicks: number;
  isAlive: boolean;
  isCastingUltimate: boolean;
  targetUnitId: string | null;
  // Animation offsets
  lungeOffset: number;
  hitReaction: number;
}

export interface CombatEventItem {
  readonly eventType: 'ATTACK' | 'DAMAGE' | 'ULTIMATE' | 'CLOTH_TORN' | 'DEATH';
  readonly sourceEntityId?: string;
  readonly targetEntityId?: string;
  readonly value?: number;
  readonly clothTier?: ClothDamageTier;
  readonly description?: string;
}

export interface UltimateCutInData {
  readonly valkyrie: ValkyrieDefinition;
  readonly voiceLine: string;
  readonly tier: ClothDamageTier;
  readonly timestamp: number;
}
