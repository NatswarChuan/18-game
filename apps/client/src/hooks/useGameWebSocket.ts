import {
  BuffDefinition,
  ClientMessage,
  CombatEntitySnapshot,
  CombatEventItem,
  GamePhase,
  MatchFormat,
  OpponentProfile,
  SeriesScore,
  ServerMessage,
  UnitPlacement
} from '@valkyrie/shared-domain';
import { useCallback, useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/sound.js';

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

export function useGameWebSocket(playerId: string, displayName: string) {
  const [state, setState] = useState<GameState>({
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
  });

  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((msg: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const selectBuff = useCallback((buffId: string) => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, chosenBuffId: buffId }));
    if (state.matchId) {
      sendMessage({
        type: 'C2S_SELECT_BUFF',
        payload: { matchId: state.matchId, playerId, buffId }
      });
    }
  }, [playerId, sendMessage, state.matchId]);

  const updateFormation = useCallback((formation: readonly UnitPlacement[]) => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, playerFormation: formation }));
    if (state.matchId) {
      sendMessage({
        type: 'C2S_UPDATE_FORMATION',
        payload: { matchId: state.matchId, playerId, formation }
      });
    }
  }, [playerId, sendMessage, state.matchId]);

  const lockFormation = useCallback(() => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, isLockedIn: true }));
    if (state.matchId) {
      sendMessage({
        type: 'C2S_LOCK_FORMATION',
        payload: { matchId: state.matchId, playerId }
      });
    }
  }, [playerId, sendMessage, state.matchId]);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:4000/ws?playerId=${playerId}&name=${encodeURIComponent(displayName)}`;

      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setState((prev) => ({ ...prev, connected: true }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as ServerMessage;

          switch (msg.type) {
            case 'S2C_MATCH_INIT': {
              setState((prev) => ({
                ...prev,
                matchId: msg.payload.matchId,
                format: msg.payload.format,
                targetWins: msg.payload.targetWins,
                opponent: msg.payload.opponentProfile
              }));
              break;
            }
            case 'S2C_ROUND_DRAFT_START': {
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
              break;
            }
            case 'S2C_PREPARATION_START': {
              setState((prev) => ({
                ...prev,
                phase: 'FORMATION_PLACEMENT',
                roundNumber: msg.payload.roundNumber,
                chosenBuffId: msg.payload.playerChosenBuffId,
                isLockedIn: false
              }));
              break;
            }
            case 'S2C_COMBAT_START': {
              setState((prev) => ({
                ...prev,
                phase: 'BATTLE_SIMULATION',
                playerFormation: msg.payload.playerFormation,
                opponentFormation: msg.payload.opponentFormation,
                combatEvents: []
              }));
              break;
            }
            case 'S2C_COMBAT_SNAPSHOT': {
              // Trigger audio effects based on events
              msg.payload.events.forEach((ev) => {
                if (ev.eventType === 'ATTACK') soundManager.playAttackHit();
                if (ev.eventType === 'CLOTH_TIER_CHANGED') soundManager.playArmorBreak();
                if (ev.eventType === 'ULTIMATE_CAST') soundManager.playUltimateBurst();
              });

              setState((prev) => ({
                ...prev,
                combatEntities: msg.payload.entities,
                combatEvents: [...prev.combatEvents, ...msg.payload.events].slice(-25)
              }));
              break;
            }
            case 'S2C_ROUND_RESULT': {
              setState((prev) => ({
                ...prev,
                phase: 'ROUND_EVALUATION',
                seriesScore: msg.payload.updatedSeriesScore
              }));
              break;
            }
            case 'S2C_MATCH_RESULT': {
              setState((prev) => ({
                ...prev,
                phase: 'MATCH_OVER',
                matchWinnerId: msg.payload.championPlayerId,
                seriesScore: msg.payload.finalScores
              }));
              break;
            }
          }
        } catch {
          // ignore malformed message
        }
      };

      ws.onclose = () => {
        setState((prev) => ({ ...prev, connected: false }));
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [displayName, playerId]);

  return {
    state,
    selectBuff,
    updateFormation,
    lockFormation
  };
}
