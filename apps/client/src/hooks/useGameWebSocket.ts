import {
  BuffDefinition,
  ClientMessage,
  CombatEntitySnapshot,
  CombatEventItem,
  GamePhase,
  MatchFormat,
  OpponentProfile,
  SeriesScore,
  UnitPlacement
} from '@valkyrie/shared-domain';
import { useCallback, useState } from 'react';
import { soundManager } from '../utils/sound.js';
import { useWebSocketConnection } from './useWebSocketConnection.js';

export interface GameState {
  readonly connected: boolean;
  readonly matchId: string | null;
  readonly format: MatchFormat;
  readonly targetWins: number;
  readonly opponent: OpponentProfile | null;
  readonly phase: GamePhase;
  readonly roundNumber: number;
  readonly seriesScore: SeriesScore;
  readonly draftBuffs: readonly BuffDefinition[];
  readonly draftTimeoutSeconds: number;
  readonly chosenBuffId: string | null;
  readonly playerFormation: readonly UnitPlacement[];
  readonly opponentFormation: readonly UnitPlacement[];
  readonly combatEntities: readonly CombatEntitySnapshot[];
  readonly combatEvents: readonly CombatEventItem[];
  readonly isLockedIn: boolean;
  readonly matchWinnerId: string | null;
}

const INITIAL_GAME_STATE: GameState = {
  connected: false,
  matchId: null,
  format: 'BO3',
  targetWins: 2,
  opponent: null,
  phase: 'MATCHMAKING',
  roundNumber: 1,
  seriesScore: { playerWins: 0, opponentWins: 0 },
  draftBuffs: [],
  draftTimeoutSeconds: 20,
  chosenBuffId: null,
  playerFormation: [
    { valkyrieId: 'VALK-01', slotIndex: 1 },
    { valkyrieId: 'VALK-02', slotIndex: 0 },
    { valkyrieId: 'VALK-03', slotIndex: 3 }
  ],
  opponentFormation: [],
  combatEntities: [],
  combatEvents: [],
  isLockedIn: false,
  matchWinnerId: null
};

export interface GameWebSocketControls {
  readonly state: GameState;
  readonly selectBuff: (buffId: string) => void;
  readonly updateFormation: (formation: readonly UnitPlacement[]) => void;
  readonly lockFormation: () => void;
}

/**
 * Main game hook coordinating state, actions, and network communication.
 * Hook chính điều phối trạng thái, thao tác của người chơi và mạng WebSocket.
 */
export function useGameWebSocket(playerId: string, displayName: string): GameWebSocketControls {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);
  const socketRef = useWebSocketConnection(playerId, displayName, setState);

  const sendMessage = useCallback((msg: ClientMessage): void => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, [socketRef]);

  const selectBuff = useCallback((buffId: string): void => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, chosenBuffId: buffId }));
    if (state.matchId) {
      sendMessage({ type: 'C2S_SELECT_BUFF', payload: { matchId: state.matchId, playerId, buffId } });
    }
  }, [playerId, sendMessage, state.matchId]);

  const updateFormation = useCallback((formation: readonly UnitPlacement[]): void => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, playerFormation: formation }));
    if (state.matchId) {
      sendMessage({ type: 'C2S_UPDATE_FORMATION', payload: { matchId: state.matchId, playerId, formation } });
    }
  }, [playerId, sendMessage, state.matchId]);

  const lockFormation = useCallback((): void => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, isLockedIn: true }));
    if (state.matchId) {
      sendMessage({ type: 'C2S_LOCK_FORMATION', payload: { matchId: state.matchId, playerId } });
    }
  }, [playerId, sendMessage, state.matchId]);

  return { state, selectBuff, updateFormation, lockFormation };
}
