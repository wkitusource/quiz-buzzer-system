export interface Player {
  id: string;
  username: string;
  roomId: string;
  score: number;
  connected: boolean;
  joinedAt: Date;
}

export interface BuzzerState {
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: Date | null;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: Map<string, Player>;
  buzzerState: BuzzerState;
  createdAt: Date;
  maxPlayers?: number;
}

export interface RoomSummary {
  id: string;
  code: string;
  playerCount: number;
  maxPlayers?: number;
  createdAt: Date;
}

export interface PlayerPublic {
  id: string;
  username: string;
  score: number;
  connected: boolean;
}

export interface BuzzerEvent {
  playerId: string;
  username: string;
  timestamp: Date;
}
