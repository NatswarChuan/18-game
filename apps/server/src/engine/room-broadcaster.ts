import {
  BuffDefinition,
  CombatEntitySnapshot,
  CombatEventItem,
  DRAFT_TIMEOUT_SECONDS,
  GamePhase,
  MatchFormat,
  PREPARATION_TIMEOUT_SECONDS,
  SeriesScore
} from '@valkyrie/shared-domain';
import { PlayerSession } from './room-types.js';

export interface RoundSummaryData {
  readonly totalDamageDealt: number;
  readonly totalClothTearTriggers: number;
  readonly totalUltimateCasts: number;
}

export function broadcastMatchInit(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  format: MatchFormat,
  targetWins: number
): void {
  p1.send({
    type: 'S2C_MATCH_INIT',
    payload: {
      matchId,
      format,
      targetWins,
      opponentProfile: {
        id: p2.playerId,
        displayName: p2.displayName,
        rankRating: 1500,
        avatarValkyrieId: p2.avatarValkyrieId
      }
    }
  });

  p2.send({
    type: 'S2C_MATCH_INIT',
    payload: {
      matchId,
      format,
      targetWins,
      opponentProfile: {
        id: p1.playerId,
        displayName: p1.displayName,
        rankRating: 1500,
        avatarValkyrieId: p1.avatarValkyrieId
      }
    }
  });
}

export function broadcastDraftStart(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  roundNumber: number,
  score: SeriesScore,
  p1Buffs: readonly BuffDefinition[],
  p2Buffs: readonly BuffDefinition[]
): void {
  p1.send({
    type: 'S2C_ROUND_DRAFT_START',
    payload: {
      matchId,
      roundNumber,
      seriesScore: score,
      draftTimeoutSeconds: DRAFT_TIMEOUT_SECONDS,
      personalizedBuffs: p1Buffs,
      historyAccumulationDepth: p1.accumulatedBuffIds.length
    }
  });

  p2.send({
    type: 'S2C_ROUND_DRAFT_START',
    payload: {
      matchId,
      roundNumber,
      seriesScore: { playerWins: score.opponentWins, opponentWins: score.playerWins },
      draftTimeoutSeconds: DRAFT_TIMEOUT_SECONDS,
      personalizedBuffs: p2Buffs,
      historyAccumulationDepth: p2.accumulatedBuffIds.length
    }
  });
}

export function broadcastPreparationStart(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  roundNumber: number
): void {
  p1.send({
    type: 'S2C_PREPARATION_START',
    payload: {
      matchId,
      roundNumber,
      timeoutSeconds: PREPARATION_TIMEOUT_SECONDS,
      playerChosenBuffId: p1.chosenBuffId ?? ''
    }
  });

  p2.send({
    type: 'S2C_PREPARATION_START',
    payload: {
      matchId,
      roundNumber,
      timeoutSeconds: PREPARATION_TIMEOUT_SECONDS,
      playerChosenBuffId: p2.chosenBuffId ?? ''
    }
  });
}

export function broadcastCombatStart(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  roundNumber: number,
  randomSeed: number
): void {
  p1.send({
    type: 'S2C_COMBAT_START',
    payload: {
      matchId,
      roundNumber,
      randomSeed,
      playerFormation: p1.formation,
      opponentFormation: p2.formation,
      activeBuffs: {
        playerBuffIds: p1.accumulatedBuffIds,
        opponentBuffIds: p2.accumulatedBuffIds
      }
    }
  });

  p2.send({
    type: 'S2C_COMBAT_START',
    payload: {
      matchId,
      roundNumber,
      randomSeed,
      playerFormation: p2.formation,
      opponentFormation: p1.formation,
      activeBuffs: {
        playerBuffIds: p2.accumulatedBuffIds,
        opponentBuffIds: p1.accumulatedBuffIds
      }
    }
  });
}

export function broadcastCombatSnapshot(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  roundNumber: number,
  tick: number,
  entities: readonly CombatEntitySnapshot[],
  events: readonly CombatEventItem[]
): void {
  const payload = {
    matchId,
    roundNumber,
    tick,
    timestamp: Date.now(),
    entities,
    events
  };

  p1.send({ type: 'S2C_COMBAT_SNAPSHOT', payload });
  p2.send({ type: 'S2C_COMBAT_SNAPSHOT', payload });
}

export function broadcastRoundResult(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  roundNumber: number,
  winnerPlayerId: string | null,
  currentScore: SeriesScore,
  isMatchOver: boolean,
  summary: RoundSummaryData
): void {
  const roundSummary = {
    totalDamageDealt: summary.totalDamageDealt,
    totalClothTearTriggers: summary.totalClothTearTriggers,
    ultimateCount: summary.totalUltimateCasts
  };

  p1.send({
    type: 'S2C_ROUND_RESULT',
    payload: {
      matchId,
      roundNumber,
      winnerPlayerId,
      updatedSeriesScore: currentScore,
      nextState: isMatchOver ? 'MATCH_OVER' : 'BUFF_DRAFTING',
      roundSummary
    }
  });

  p2.send({
    type: 'S2C_ROUND_RESULT',
    payload: {
      matchId,
      roundNumber,
      winnerPlayerId,
      updatedSeriesScore: { playerWins: currentScore.opponentWins, opponentWins: currentScore.playerWins },
      nextState: isMatchOver ? 'MATCH_OVER' : 'BUFF_DRAFTING',
      roundSummary
    }
  });
}

export function broadcastMatchResult(
  p1: PlayerSession,
  p2: PlayerSession,
  matchId: string,
  championId: string,
  currentScore: SeriesScore,
  isP1Champion: boolean,
  isP2Champion: boolean
): void {
  p1.send({
    type: 'S2C_MATCH_RESULT',
    payload: {
      matchId,
      championPlayerId: championId,
      finalScores: currentScore,
      mvpValkyrieId: p1.formation[0]?.valkyrieId ?? 'VALK-01',
      mmrDelta: isP1Champion ? 25 : -25
    }
  });

  p2.send({
    type: 'S2C_MATCH_RESULT',
    payload: {
      matchId,
      championPlayerId: championId,
      finalScores: { playerWins: currentScore.opponentWins, opponentWins: currentScore.playerWins },
      mvpValkyrieId: p2.formation[0]?.valkyrieId ?? 'VALK-02',
      mmrDelta: isP2Champion ? 25 : -25
    }
  });
}

export function sendReconnectSync(
  player: PlayerSession,
  opponent: PlayerSession,
  matchId: string,
  currentPhase: GamePhase,
  roundNumber: number,
  score: SeriesScore
): void {
  player.send({
    type: 'S2C_SYNC_STATE',
    payload: {
      matchId,
      currentPhase,
      remainingSecondsInPhase: 10,
      roundNumber,
      seriesScore: score,
      myAccumulatedBuffs: player.accumulatedBuffIds,
      opponentAccumulatedBuffs: opponent.accumulatedBuffIds,
      currentFormation: player.formation
    }
  });
}
