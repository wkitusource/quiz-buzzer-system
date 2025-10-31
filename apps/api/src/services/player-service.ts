import type { Player, PlayerPublic, Room } from '../types/game.types.js';
import { generatePlayerId } from '../utils/id-generator.js';
import { PlayerNotFoundError } from '../utils/error-handler.js';

class PlayerService {
  /**
   * Creates a new player and adds them to a room
   */
  createPlayer(username: string, room: Room): Player {
    const playerId = generatePlayerId();

    const player: Player = {
      id: playerId,
      username,
      roomId: room.id,
      score: 0,
      connected: true,
      joinedAt: new Date(),
    };

    room.players.set(playerId, player);

    return player;
  }

  /**
   * Gets a player from a room
   */
  getPlayer(room: Room, playerId: string): Player | undefined {
    return room.players.get(playerId);
  }

  /**
   * Gets a player from a room or throws an error
   */
  getPlayerOrThrow(room: Room, playerId: string): Player {
    const player = this.getPlayer(room, playerId);
    if (!player) {
      throw new PlayerNotFoundError(playerId);
    }
    return player;
  }

  /**
   * Removes a player from a room
   */
  removePlayer(room: Room, playerId: string): boolean {
    return room.players.delete(playerId);
  }

  /**
   * Updates a player's connection status
   */
  setPlayerConnectionStatus(room: Room, playerId: string, connected: boolean): void {
    const player = this.getPlayer(room, playerId);
    if (player) {
      player.connected = connected;
    }
  }

  /**
   * Updates a player's score
   */
  updateScore(room: Room, playerId: string, points: number): Player {
    const player = this.getPlayerOrThrow(room, playerId);
    player.score += points;
    return player;
  }

  /**
   * Gets all players in a room as public data
   */
  getPublicPlayers(room: Room): PlayerPublic[] {
    return Array.from(room.players.values()).map(player => ({
      id: player.id,
      username: player.username,
      score: player.score,
      connected: player.connected,
    }));
  }

  /**
   * Converts a player to public data
   */
  toPublic(player: Player): PlayerPublic {
    return {
      id: player.id,
      username: player.username,
      score: player.score,
      connected: player.connected,
    };
  }

  /**
   * Gets the count of connected players in a room
   */
  getConnectedPlayerCount(room: Room): number {
    let count = 0;
    for (const player of room.players.values()) {
      if (player.connected) {
        count++;
      }
    }
    return count;
  }
}

// Export singleton instance
export const playerService = new PlayerService();
