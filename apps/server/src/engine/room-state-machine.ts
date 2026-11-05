import {
  BO3_TARGET_WINS,
  BO5_TARGET_WINS,
  DRAFT_TIMEOUT_SECONDS,
  GamePhase,
  MatchFormat,
  PREPARATION_TIMEOUT_SECONDS,
  SeriesScore,
  UnitPlacement,
  validateFormation
} from '@valkyrie/shared-domain';
import { VectorBuffSelectionService } from '../services/vector-buff-selection.service.js';
import { CombatEngine } from './combat-engine.js';
import { PlayerSession } from './room-types.js';
import {
  broadcastCombatSnapshot,
  broadcastCombatStart,
  broadcastDraftStart,
  broadcastMatchInit,
  broadcastMatchResult,
  broadcastPreparationStart,
  broadcastRoundResult,
  sendReconnectSync
} from './room-broadcaster.js';

export type { PlayerSession } from './room-types.js';

/**
 * Server-authoritative Room State Machine for 1v1 BO3/BO5 matches.
 * Máy trạng thái phòng đấu phía Server cho các trận đối kháng 1v1 BO3/BO5.
 */
export class MatchRoom {
  public readonly matchId: string;
  public readonly format: MatchFormat;
  public readonly targetWins: number;
  private currentPhase: GamePhase = 'MATCHMAKING';
  private roundNumber = 1;
  private playerWins = 0;
  private opponentWins = 0;
  private p1: PlayerSession;
  private p2: PlayerSession;
  private combatEngine?: CombatEngine | undefined;
  private combatTimer: NodeJS.Timeout | null = null;
  private phaseTimer: NodeJS.Timeout | null = null;

  public constructor(
    matchId: string,
    format: MatchFormat,
    p1: PlayerSession,
    p2: PlayerSession,
    private readonly vectorBuffService: VectorBuffSelectionService
  ) {
    this.matchId = matchId;
    this.format = format;
    this.targetWins = format === 'BO5' ? BO5_TARGET_WINS : BO3_TARGET_WINS;
    this.p1 = p1;
    this.p2 = p2;
  }

  public getPhase(): GamePhase {
    return this.currentPhase;
  }

  public getSeriesScore(): SeriesScore {
    return { playerWins: this.playerWins, opponentWins: this.opponentWins };
  }

  public startMatch(): void {
    broadcastMatchInit(this.p1, this.p2, this.matchId, this.format, this.targetWins);
    this.startBuffDrafting();
  }

  public startBuffDrafting(): void {
    this.currentPhase = 'BUFF_DRAFTING';
    this.p1.isLockedIn = false;
    this.p2.isLockedIn = false;
    delete this.p1.chosenBuffId;
    delete this.p2.chosenBuffId;

    const p1Buffs = this.vectorBuffService.selectDraftBuffs(
      this.p1.accumulatedBuffIds,
      this.p2.accumulatedBuffIds,
      this.roundNumber
    );
    const p2Buffs = this.vectorBuffService.selectDraftBuffs(
      this.p2.accumulatedBuffIds,
      this.p1.accumulatedBuffIds,
      this.roundNumber
    );

    broadcastDraftStart(
      this.p1,
      this.p2,
      this.matchId,
      this.roundNumber,
      this.getSeriesScore(),
      p1Buffs,
      p2Buffs
    );

    if (this.p2.playerId.startsWith('ai_')) {
      const bestBotBuff = p2Buffs[Math.floor(Math.random() * Math.min(3, p2Buffs.length))]?.id ?? 'BUFF-002';
      this.p2.chosenBuffId = bestBotBuff;
      this.p2.accumulatedBuffIds.push(bestBotBuff);
    }

    this.clearTimers();
    this.phaseTimer = setTimeout(() => {
      this.resolveBuffSelection();
    }, DRAFT_TIMEOUT_SECONDS * 1000);
  }

  public onSelectBuff(playerId: string, buffId: string): void {
    if (this.currentPhase !== 'BUFF_DRAFTING') return;

    const player = playerId === this.p1.playerId ? this.p1 : this.p2;
    player.chosenBuffId = buffId;
    player.accumulatedBuffIds.push(buffId);

    if (this.p1.chosenBuffId && this.p2.chosenBuffId) {
      this.resolveBuffSelection();
    }
  }

  private resolveBuffSelection(): void {
    this.clearTimers();

    if (!this.p1.chosenBuffId) {
      const p1Buffs = this.vectorBuffService.selectDraftBuffs(this.p1.accumulatedBuffIds, this.p2.accumulatedBuffIds, this.roundNumber);
      const fallback = p1Buffs[0]?.id ?? 'BUFF-001';
      this.p1.chosenBuffId = fallback;
      this.p1.accumulatedBuffIds.push(fallback);
    }
    if (!this.p2.chosenBuffId) {
      const p2Buffs = this.vectorBuffService.selectDraftBuffs(this.p2.accumulatedBuffIds, this.p1.accumulatedBuffIds, this.roundNumber);
      const fallback = p2Buffs[0]?.id ?? 'BUFF-002';
      this.p2.chosenBuffId = fallback;
      this.p2.accumulatedBuffIds.push(fallback);
    }

    this.startFormationPlacement();
  }

  public startFormationPlacement(): void {
    this.currentPhase = 'FORMATION_PLACEMENT';
    this.p1.isLockedIn = false;
    this.p2.isLockedIn = false;

    if (this.p2.playerId.startsWith('ai_')) {
      this.p2.isLockedIn = true;
      if (this.roundNumber === 2) {
        this.p2.formation = [
          { valkyrieId: 'VALK-10', slotIndex: 1 },
          { valkyrieId: 'VALK-11', slotIndex: 0 },
          { valkyrieId: 'VALK-12', slotIndex: 3 }
        ];
      } else if (this.roundNumber >= 3) {
        this.p2.formation = [
          { valkyrieId: 'VALK-04', slotIndex: 6 },
          { valkyrieId: 'VALK-01', slotIndex: 1 },
          { valkyrieId: 'VALK-21', slotIndex: 2 }
        ];
      }
    }

    broadcastPreparationStart(this.p1, this.p2, this.matchId, this.roundNumber);

    this.clearTimers();
    this.phaseTimer = setTimeout(() => {
      this.startCombatSimulation();
    }, PREPARATION_TIMEOUT_SECONDS * 1000);
  }

  public onUpdateFormation(playerId: string, formation: readonly UnitPlacement[]): void {
    if (this.currentPhase !== 'FORMATION_PLACEMENT') return;
    const validation = validateFormation(formation);
    if (!validation.isValid) return;

    const player = playerId === this.p1.playerId ? this.p1 : this.p2;
    player.formation = [...formation];
  }

  public onLockFormation(playerId: string): void {
    if (this.currentPhase !== 'FORMATION_PLACEMENT') return;
    const player = playerId === this.p1.playerId ? this.p1 : this.p2;
    player.isLockedIn = true;

    if (this.p1.isLockedIn && this.p2.isLockedIn) {
      this.startCombatSimulation();
    }
  }

  public startCombatSimulation(): void {
    this.clearTimers();
    this.currentPhase = 'BATTLE_SIMULATION';

    const seed = Math.floor(Math.random() * 1000000);
    broadcastCombatStart(this.p1, this.p2, this.matchId, this.roundNumber, seed);

    this.combatEngine = new CombatEngine(
      this.p1.playerId,
      this.p1.formation,
      this.p2.playerId,
      this.p2.formation,
      (tick, entities, events) => {
        broadcastCombatSnapshot(this.p1, this.p2, this.matchId, this.roundNumber, tick, entities, events);
      }
    );

    this.combatTimer = setInterval(() => {
      if (!this.combatEngine) return;
      const step = this.combatEngine.stepTick();
      if (step.isFinished) {
        this.finishRound(step.winnerId);
      }
    }, 50);
  }

  private finishRound(winnerPlayerId: string | null): void {
    this.clearTimers();
    this.currentPhase = 'ROUND_EVALUATION';

    if (winnerPlayerId === this.p1.playerId) {
      this.playerWins += 1;
    } else if (winnerPlayerId === this.p2.playerId) {
      this.opponentWins += 1;
    }

    const currentScore = this.getSeriesScore();
    const summary = this.combatEngine ? this.combatEngine.getSummary(winnerPlayerId) : {
      totalDamageDealt: 0,
      totalClothTearTriggers: 0,
      totalUltimateCasts: 0
    };

    const isP1Champion = this.playerWins >= this.targetWins;
    const isP2Champion = this.opponentWins >= this.targetWins;
    const isMatchOver = isP1Champion || isP2Champion;

    broadcastRoundResult(
      this.p1,
      this.p2,
      this.matchId,
      this.roundNumber,
      winnerPlayerId,
      currentScore,
      isMatchOver,
      summary
    );

    if (isMatchOver) {
      this.currentPhase = 'MATCH_OVER';
      const championId = isP1Champion ? this.p1.playerId : this.p2.playerId;
      broadcastMatchResult(this.p1, this.p2, this.matchId, championId, currentScore, isP1Champion, isP2Champion);
    } else {
      this.clearTimers();
      this.phaseTimer = setTimeout(() => {
        this.roundNumber += 1;
        this.startBuffDrafting();
      }, 3500);
    }
  }

  public handleReconnect(playerId: string): void {
    const isP1 = playerId === this.p1.playerId;
    const player = isP1 ? this.p1 : this.p2;
    const opponent = isP1 ? this.p2 : this.p1;
    const score = isP1 ? this.getSeriesScore() : { playerWins: this.opponentWins, opponentWins: this.playerWins };

    sendReconnectSync(player, opponent, this.matchId, this.currentPhase, this.roundNumber, score);
  }

  public clearTimers(): void {
    if (this.combatTimer) {
      clearInterval(this.combatTimer);
      this.combatTimer = null;
    }
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
  }

  public dispose(): void {
    this.clearTimers();
  }
}
