import type { Room, RoomSummary } from '../types/game.types.js';
import { generateRoomCode, generateRoomId } from '../utils/id-generator.js';
import { RoomNotFoundError, RoomFullError } from '../utils/error-handler.js';

class RoomService {
  private rooms: Map<string, Room> = new Map();
  private roomCodeToId: Map<string, string> = new Map();

  /**
   * Creates a new room
   */
  createRoom(hostId: string, maxPlayers?: number): Room {
    const roomId = generateRoomId();
    const roomCode = this.generateUniqueRoomCode();

    const room: Room = {
      id: roomId,
      code: roomCode,
      hostId,
      players: new Map(),
      buzzerState: {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
      },
      createdAt: new Date(),
      maxPlayers,
    };

    this.rooms.set(roomId, room);
    this.roomCodeToId.set(roomCode, roomId);

    return room;
  }

  /**
   * Gets a room by ID
   */
  getRoomById(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Gets a room by code
   */
  getRoomByCode(roomCode: string): Room | undefined {
    const roomId = this.roomCodeToId.get(roomCode.toUpperCase());
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  /**
   * Validates if a player can join a room
   */
  canJoinRoom(room: Room): boolean {
    if (room.maxPlayers && room.players.size >= room.maxPlayers) {
      return false;
    }
    return true;
  }

  /**
   * Validates room exists and can be joined
   */
  validateRoomForJoin(roomCode: string): Room {
    const room = this.getRoomByCode(roomCode);

    if (!room) {
      throw new RoomNotFoundError(roomCode);
    }

    if (!this.canJoinRoom(room)) {
      throw new RoomFullError();
    }

    return room;
  }

  /**
   * Deletes a room
   */
  deleteRoom(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (room) {
      this.roomCodeToId.delete(room.code);
      return this.rooms.delete(roomId);
    }
    return false;
  }

  /**
   * Gets all rooms
   */
  getAllRooms(): RoomSummary[] {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      code: room.code,
      playerCount: room.players.size,
      maxPlayers: room.maxPlayers,
      createdAt: room.createdAt,
    }));
  }

  /**
   * Cleans up empty rooms
   */
  cleanupEmptyRooms(): number {
    let deletedCount = 0;
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.players.size === 0) {
        this.deleteRoom(roomId);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  /**
   * Generates a unique room code that doesn't already exist
   */
  private generateUniqueRoomCode(): string {
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateRoomCode();
      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique room code');
      }
    } while (this.roomCodeToId.has(code));

    return code;
  }
}

// Export singleton instance
export const roomService = new RoomService();
