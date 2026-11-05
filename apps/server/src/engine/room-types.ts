import { ServerMessage, UnitPlacement } from '@valkyrie/shared-domain';

export interface PlayerSession {
  readonly playerId: string;
  readonly displayName: string;
  readonly avatarValkyrieId: string;
  send: (msg: ServerMessage) => void;
  accumulatedBuffIds: string[];
  chosenBuffId?: string | undefined;
  formation: UnitPlacement[];
  isLockedIn: boolean;
}
