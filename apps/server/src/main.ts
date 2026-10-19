import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { ClientMessage, ServerMessage } from '@valkyrie/shared-domain';
import fastify from 'fastify';
import { MatchRoom, PlayerSession } from './engine/room-state-machine.js';
import { VectorBuffSelectionService } from './services/vector-buff-selection.service.js';

const PORT = 4000;
const HOST = '0.0.0.0';

const app = fastify({ logger: true });

// Vector Buff Service with in-memory catalog
const vectorBuffService = new VectorBuffSelectionService();

// In-Memory store for active rooms
const activeRooms = new Map<string, MatchRoom>();

await app.register(cors, { origin: true });
await app.register(websocket);

// Health check endpoint
app.get('/health', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    activeRoomsCount: activeRooms.size,
    mode: 'IN_MEMORY_ZERO_DEPENDENCY'
  };
});

// WebSocket game gateway
app.register(async (fastifyInstance) => {
  fastifyInstance.get('/ws', { websocket: true }, (socket, req) => {
    const query = req.query as { playerId?: string; name?: string; format?: 'BO3' | 'BO5' };
    const playerId = query.playerId ?? `player_${Math.random().toString(36).substring(2, 9)}`;
    const displayName = query.name ?? 'Commander';
    const matchFormat = query.format ?? 'BO3';

    app.log.info({ playerId, displayName }, 'Client connected to WebSocket Gateway');

    // Create player session
    const playerSession: PlayerSession = {
      playerId,
      displayName,
      avatarValkyrieId: 'VALK-01',
      send: (msg: ServerMessage) => {
        try {
          socket.send(JSON.stringify(msg));
        } catch (err) {
          app.log.error({ err }, 'Failed to send message over socket');
        }
      },
      accumulatedBuffIds: [],
      formation: [
        { valkyrieId: 'VALK-01', slotIndex: 1 },
        { valkyrieId: 'VALK-02', slotIndex: 0 },
        { valkyrieId: 'VALK-03', slotIndex: 3 }
      ],
      isLockedIn: false
    };

    // Create an intelligent AI Bot opponent for immediate playtesting
    const botSession: PlayerSession = {
      playerId: `ai_valkyrie_${Math.random().toString(36).substring(2, 6)}`,
      displayName: 'Valkyrie AI Protocol',
      avatarValkyrieId: 'VALK-20',
      send: () => {
        // AI Session consumer
      },
      accumulatedBuffIds: [],
      formation: [
        { valkyrieId: 'VALK-20', slotIndex: 1 },
        { valkyrieId: 'VALK-19', slotIndex: 0 },
        { valkyrieId: 'VALK-23', slotIndex: 4 }
      ],
      isLockedIn: true
    };

    const matchId = `match_${Date.now()}`;
    const room = new MatchRoom(matchId, matchFormat, playerSession, botSession, vectorBuffService);
    activeRooms.set(matchId, room);

    // Start match immediately
    room.startMatch();

    // Listen to messages from Client
    socket.on('message', (rawMessage: Buffer) => {
      try {
        const parsed = JSON.parse(rawMessage.toString()) as ClientMessage;

        switch (parsed.type) {
          case 'C2S_SELECT_BUFF': {
            room.onSelectBuff(parsed.payload.playerId, parsed.payload.buffId);
            break;
          }
          case 'C2S_UPDATE_FORMATION': {
            room.onUpdateFormation(parsed.payload.playerId, parsed.payload.formation);
            break;
          }
          case 'C2S_LOCK_FORMATION': {
            room.onLockFormation(parsed.payload.playerId);
            break;
          }
          case 'C2S_RECONNECT': {
            room.handleReconnect(parsed.payload.playerId);
            break;
          }
        }
      } catch (err) {
        app.log.error({ err }, 'Failed to parse incoming WebSocket message');
      }
    });

    socket.on('close', () => {
      app.log.info({ playerId }, 'Client disconnected');
      room.dispose();
      activeRooms.delete(matchId);
    });
  });
});

try {
  await app.listen({ port: PORT, host: HOST });
  app.log.info(`Valkyrie Protocol: Zero Server running at http://${HOST}:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
