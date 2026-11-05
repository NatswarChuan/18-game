import { CombatEventItem, ServerMessage } from '@valkyrie/shared-domain';
import { GameState } from './useGameWebSocket.js';
import { soundManager } from '../utils/sound.js';

type StateSetter = React.Dispatch<React.SetStateAction<GameState>>;
type ExtractMsg<T extends ServerMessage['type']> = Extract<ServerMessage, { readonly type: T }>;

function playCombatAudio(events: readonly CombatEventItem[]): void {
  for (const ev of events) {
    if (ev.eventType === 'ATTACK') {
      soundManager.playAttackHit();
    } else if (ev.eventType === 'CLOTH_TIER_CHANGED') {
      soundManager.playArmorBreak();
    } else if (ev.eventType === 'ULTIMATE_CAST') {
      soundManager.playUltimateBurst();
    }
  }
}

function onMatchInit(msg: ExtractMsg<'S2C_MATCH_INIT'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    matchId: msg.payload.matchId,
    format: msg.payload.format,
    targetWins: msg.payload.targetWins,
    opponent: msg.payload.opponentProfile
  }));
}

function onRoundDraftStart(msg: ExtractMsg<'S2C_ROUND_DRAFT_START'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    phase: 'BUFF_DRAFTING',
    roundNumber: msg.payload.roundNumber,
    seriesScore: msg.payload.seriesScore,
    draftBuffs: msg.payload.personalizedBuffs,
    draftTimeoutSeconds: msg.payload.draftTimeoutSeconds,
    chosenBuffId: null,
    isLockedIn: false
  }));
}

function onPreparationStart(msg: ExtractMsg<'S2C_PREPARATION_START'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    phase: 'FORMATION_PLACEMENT',
    roundNumber: msg.payload.roundNumber,
    chosenBuffId: msg.payload.playerChosenBuffId,
    isLockedIn: false
  }));
}

function onCombatStart(msg: ExtractMsg<'S2C_COMBAT_START'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    phase: 'BATTLE_SIMULATION',
    playerFormation: msg.payload.playerFormation,
    opponentFormation: msg.payload.opponentFormation,
    combatEvents: []
  }));
}

function onCombatSnapshot(msg: ExtractMsg<'S2C_COMBAT_SNAPSHOT'>, setState: StateSetter): void {
  playCombatAudio(msg.payload.events);
  setState((prev) => ({
    ...prev,
    combatEntities: msg.payload.entities,
    combatEvents: [...prev.combatEvents, ...msg.payload.events].slice(-25)
  }));
}

function onRoundResult(msg: ExtractMsg<'S2C_ROUND_RESULT'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    phase: 'ROUND_EVALUATION',
    seriesScore: msg.payload.updatedSeriesScore
  }));
}

function onMatchResult(msg: ExtractMsg<'S2C_MATCH_RESULT'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    phase: 'MATCH_OVER',
    matchWinnerId: msg.payload.championPlayerId,
    seriesScore: msg.payload.finalScores
  }));
}

function onSyncState(msg: ExtractMsg<'S2C_SYNC_STATE'>, setState: StateSetter): void {
  setState((prev) => ({
    ...prev,
    matchId: msg.payload.matchId,
    phase: msg.payload.currentPhase,
    roundNumber: msg.payload.roundNumber,
    seriesScore: msg.payload.seriesScore,
    playerFormation: msg.payload.currentFormation ?? prev.playerFormation
  }));
}

type MessageDispatcher = (msg: ServerMessage, setState: StateSetter) => void;

const DISPATCH_TABLE: Readonly<Partial<Record<ServerMessage['type'], MessageDispatcher>>> = {
  S2C_MATCH_INIT: (msg, setState) => onMatchInit(msg as ExtractMsg<'S2C_MATCH_INIT'>, setState),
  S2C_ROUND_DRAFT_START: (msg, setState) => onRoundDraftStart(msg as ExtractMsg<'S2C_ROUND_DRAFT_START'>, setState),
  S2C_PREPARATION_START: (msg, setState) => onPreparationStart(msg as ExtractMsg<'S2C_PREPARATION_START'>, setState),
  S2C_COMBAT_START: (msg, setState) => onCombatStart(msg as ExtractMsg<'S2C_COMBAT_START'>, setState),
  S2C_COMBAT_SNAPSHOT: (msg, setState) => onCombatSnapshot(msg as ExtractMsg<'S2C_COMBAT_SNAPSHOT'>, setState),
  S2C_ROUND_RESULT: (msg, setState) => onRoundResult(msg as ExtractMsg<'S2C_ROUND_RESULT'>, setState),
  S2C_MATCH_RESULT: (msg, setState) => onMatchResult(msg as ExtractMsg<'S2C_MATCH_RESULT'>, setState),
  S2C_SYNC_STATE: (msg, setState) => onSyncState(msg as ExtractMsg<'S2C_SYNC_STATE'>, setState),
  S2C_ERROR: () => { /* Logged by network layer */ }
};

/**
 * Dispatches incoming ServerMessage events via table lookup.
 * Điều phối các sự kiện từ ServerMessage qua bảng tra cứu.
 */
export function handleServerMessage(msg: ServerMessage, setState: StateSetter): void {
  const handler = DISPATCH_TABLE[msg.type];
  if (handler) {
    handler(msg, setState);
  }
}
