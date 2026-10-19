import { SlotIndex, UnitPlacement } from '../board/grid.js';
import { BuffDefinition } from '../entities/buff.js';
import { ClothDamageTier } from '../math/combat-math.js';

export type MatchFormat = 'BO3' | 'BO5';

export type GamePhase =
  | 'MATCHMAKING'
  | 'BUFF_DRAFTING'
  | 'FORMATION_PLACEMENT'
  | 'BATTLE_SIMULATION'
  | 'ROUND_EVALUATION'
  | 'MATCH_OVER';

// ==========================================
// C2S (Client to Server) Payload Definitions
// ==========================================

export interface C2SSelectBuffPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly buffId: string;
}

export interface C2SUpdateFormationPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly formation: readonly UnitPlacement[];
}

export interface C2SLockFormationPayload {
  readonly matchId: string;
  readonly playerId: string;
}

export interface C2SReconnectPayload {
  readonly matchId: string;
  readonly playerId: string;
  readonly sessionToken: string;
}

export type ClientMessageType =
  | 'C2S_SELECT_BUFF'
  | 'C2S_UPDATE_FORMATION'
  | 'C2S_LOCK_FORMATION'
  | 'C2S_RECONNECT';

export type ClientMessage =
  | { readonly type: 'C2S_SELECT_BUFF'; readonly payload: C2SSelectBuffPayload }
  | { readonly type: 'C2S_UPDATE_FORMATION'; readonly payload: C2SUpdateFormationPayload }
  | { readonly type: 'C2S_LOCK_FORMATION'; readonly payload: C2SLockFormationPayload }
  | { readonly type: 'C2S_RECONNECT'; readonly payload: C2SReconnectPayload };

// ==========================================
// S2C (Server to Client) Payload Definitions
// ==========================================

export interface OpponentProfile {
  readonly id: string;
  readonly displayName: string;
  readonly rankRating: number;
  readonly avatarValkyrieId: string;
}

export interface S2CMatchInitPayload {
  readonly matchId: string;
  readonly format: MatchFormat;
  readonly targetWins: number;
  readonly opponentProfile: OpponentProfile;
}

export interface SeriesScore {
  readonly playerWins: number;
  readonly opponentWins: number;
}

export interface S2CRoundDraftStartPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly seriesScore: SeriesScore;
  readonly draftTimeoutSeconds: number;
  readonly personalizedBuffs: readonly BuffDefinition[]; // 9 Buffs
  readonly historyAccumulationDepth: number;
}

export interface S2CPreparationStartPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly timeoutSeconds: number;
  readonly playerChosenBuffId: string;
}

export interface S2CCombatStartPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly randomSeed: number;
  readonly playerFormation: readonly UnitPlacement[];
  readonly opponentFormation: readonly UnitPlacement[];
  readonly activeBuffs: {
    readonly playerBuffIds: readonly string[];
    readonly opponentBuffIds: readonly string[];
  };
}

export interface CombatEntitySnapshot {
  readonly id: string;
  readonly ownerId: string;
  readonly valkyrieId: string;
  readonly currentHp: number;
  readonly maxHp: number;
  readonly currentMana: number;
  readonly maxMana: number;
  readonly clothDamageTier: ClothDamageTier;
  readonly slotIndex: SlotIndex;
  readonly isAlive: boolean;
  readonly isCastingUltimate: boolean;
}

export interface CombatEventItem {
  readonly tick: number;
  readonly eventType: 'ATTACK' | 'DAMAGE' | 'HEAL' | 'ARMOR_BREAK' | 'CLOTH_TIER_CHANGED' | 'ULTIMATE_CAST' | 'UNIT_DEFEATED';
  readonly sourceEntityId?: string;
  readonly targetEntityId?: string;
  readonly value?: number;
  readonly tier?: ClothDamageTier;
  readonly message?: string;
}

export interface S2CCombatSnapshotPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly tick: number;
  readonly timestamp: number;
  readonly entities: readonly CombatEntitySnapshot[];
  readonly events: readonly CombatEventItem[];
}

export interface S2CRoundResultPayload {
  readonly matchId: string;
  readonly roundNumber: number;
  readonly winnerPlayerId: string | null;
  readonly updatedSeriesScore: SeriesScore;
  readonly nextState: 'BUFF_DRAFTING' | 'MATCH_OVER';
  readonly roundSummary: {
    readonly totalDamageDealt: number;
    readonly totalClothTearTriggers: number;
    readonly ultimateCount: number;
  };
}

export interface S2CMatchResultPayload {
  readonly matchId: string;
  readonly championPlayerId: string;
  readonly finalScores: SeriesScore;
  readonly mvpValkyrieId: string;
  readonly mmrDelta: number;
}

export interface S2CSyncStatePayload {
  readonly matchId: string;
  readonly currentPhase: GamePhase;
  readonly remainingSecondsInPhase: number;
  readonly roundNumber: number;
  readonly seriesScore: SeriesScore;
  readonly myAccumulatedBuffs: readonly string[];
  readonly opponentAccumulatedBuffs: readonly string[];
  readonly currentDraftPool?: readonly BuffDefinition[];
  readonly currentFormation?: readonly UnitPlacement[];
}

export interface S2CErrorPayload {
  readonly code: string;
  readonly message: string;
}

export type ServerMessageType =
  | 'S2C_MATCH_INIT'
  | 'S2C_ROUND_DRAFT_START'
  | 'S2C_PREPARATION_START'
  | 'S2C_COMBAT_START'
  | 'S2C_COMBAT_SNAPSHOT'
  | 'S2C_ROUND_RESULT'
  | 'S2C_MATCH_RESULT'
  | 'S2C_SYNC_STATE'
  | 'S2C_ERROR';

export type ServerMessage =
  | { readonly type: 'S2C_MATCH_INIT'; readonly payload: S2CMatchInitPayload }
  | { readonly type: 'S2C_ROUND_DRAFT_START'; readonly payload: S2CRoundDraftStartPayload }
  | { readonly type: 'S2C_PREPARATION_START'; readonly payload: S2CPreparationStartPayload }
  | { readonly type: 'S2C_COMBAT_START'; readonly payload: S2CCombatStartPayload }
  | { readonly type: 'S2C_COMBAT_SNAPSHOT'; readonly payload: S2CCombatSnapshotPayload }
  | { readonly type: 'S2C_ROUND_RESULT'; readonly payload: S2CRoundResultPayload }
  | { readonly type: 'S2C_MATCH_RESULT'; readonly payload: S2CMatchResultPayload }
  | { readonly type: 'S2C_SYNC_STATE'; readonly payload: S2CSyncStatePayload }
  | { readonly type: 'S2C_ERROR'; readonly payload: S2CErrorPayload };
