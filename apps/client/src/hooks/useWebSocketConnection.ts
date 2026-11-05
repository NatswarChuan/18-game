import { useEffect, useRef } from 'react';
import { ServerMessage } from '@valkyrie/shared-domain';
import { handleServerMessage } from './websocket-message-handler.js';
import { GameState } from './useGameWebSocket.js';

/**
 * Manages WebSocket connection lifecycle, auto-reconnection, and packet dispatching.
 * Quản lý vòng đời kết nối WebSocket, tự động kết nối lại và điều phối gói tin.
 */
export function useWebSocketConnection(
  playerId: string,
  displayName: string,
  setState: React.Dispatch<React.SetStateAction<GameState>>
): React.RefObject<WebSocket | null> {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = (): void => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:4000/ws?playerId=${playerId}&name=${encodeURIComponent(displayName)}`;
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = (): void => setState((prev) => ({ ...prev, connected: true }));
      ws.onmessage = (event: MessageEvent): void => {
        try {
          const msg = JSON.parse(event.data) as ServerMessage;
          handleServerMessage(msg, setState);
        } catch {
          // Ignore malformed packet
        }
      };
      ws.onclose = (): void => {
        setState((prev) => ({ ...prev, connected: false }));
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [displayName, playerId, setState]);

  return socketRef;
}
