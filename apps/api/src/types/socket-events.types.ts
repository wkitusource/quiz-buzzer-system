import { z } from 'zod';
import type { PlayerPublic, BuzzerEvent } from './game.types.js';

// Client to Server Events (with Zod validation)
export const CreateRoomSchema = z.object({
  username: z.string().min(1).max(50),
  maxPlayers: z.number().int().min(2).max(20).optional(),
});

export const JoinRoomSchema = z.object({
  roomCode: z.string().min(1),
  username: z.string().min(1).max(50),
});

export const UpdateScoreSchema = z.object({
  playerId: z.string(),
  points: z.number().int(),
});

export type CreateRoomPayload = z.infer<typeof CreateRoomSchema>;
export type JoinRoomPayload = z.infer<typeof JoinRoomSchema>;
export type UpdateScorePayload = z.infer<typeof UpdateScoreSchema>;

// Server to Client Events
export interface ServerToClientEvents {
  'room-created': (data: { roomId: string; roomCode: string; playerId: string }) => void;
  'room-joined': (data: { roomId: string; roomCode: string; playerId: string; players: PlayerPublic[] }) => void;
  'player-joined': (data: { player: PlayerPublic }) => void;
  'player-left': (data: { playerId: string }) => void;
  'player-buzzed': (data: BuzzerEvent) => void;
  'buzzer-reset': () => void;
  'score-updated': (data: { playerId: string; newScore: number }) => void;
  'player-list-updated': (data: { players: PlayerPublic[] }) => void;
  'error': (data: { message: string }) => void;
}

// Client to Server Events
export interface ClientToServerEvents {
  'create-room': (data: CreateRoomPayload, callback: (response: { success: boolean; roomId?: string; roomCode?: string; playerId?: string; error?: string }) => void) => void;
  'join-room': (data: JoinRoomPayload, callback: (response: { success: boolean; roomId?: string; playerId?: string; error?: string }) => void) => void;
  'buzz': (callback: (response: { success: boolean; error?: string }) => void) => void;
  'reset-buzzer': () => void;
  'update-score': (data: UpdateScorePayload) => void;
  'leave-room': () => void;
}

// Socket Data (stored on socket instance)
export interface SocketData {
  playerId?: string;
  roomId?: string;
}
