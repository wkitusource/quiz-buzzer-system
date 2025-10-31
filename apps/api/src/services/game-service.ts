import type { Room, BuzzerEvent } from '../types/game.types.js';
import { BuzzerLockedError, UnauthorizedError } from '../utils/error-handler.js';
import { playerService } from './player-service.js';

class GameService {
  /**
   * Handles a player buzzing in
   * Returns the buzzer event if successful
   */
  buzz(room: Room, playerId: string): BuzzerEvent {
    // Check if buzzer is already locked
    if (room.buzzerState.isLocked) {
      throw new BuzzerLockedError();
    }

    // Get the player
    const player = playerService.getPlayerOrThrow(room, playerId);

    // Lock the buzzer
    const timestamp = new Date();
    room.buzzerState.isLocked = true;
    room.buzzerState.lockedBy = playerId;
    room.buzzerState.lockedAt = timestamp;

    // Return the buzzer event
    return {
      playerId: player.id,
      username: player.username,
      timestamp,
    };
  }

  /**
   * Resets the buzzer state
   * Only the host can reset the buzzer
   */
  resetBuzzer(room: Room, requestingPlayerId: string): void {
    // Only the host can reset the buzzer
    if (requestingPlayerId !== room.hostId) {
      throw new UnauthorizedError('Only the host can reset the buzzer');
    }

    room.buzzerState.isLocked = false;
    room.buzzerState.lockedBy = null;
    room.buzzerState.lockedAt = null;
  }

  /**
   * Updates a player's score
   * Only the host can update scores
   */
  updateScore(room: Room, requestingPlayerId: string, targetPlayerId: string, points: number): void {
    // Only the host can update scores
    if (requestingPlayerId !== room.hostId) {
      throw new UnauthorizedError('Only the host can update scores');
    }

    playerService.updateScore(room, targetPlayerId, points);
  }

  /**
   * Checks if the buzzer is locked
   */
  isBuzzerLocked(room: Room): boolean {
    return room.buzzerState.isLocked;
  }

  /**
   * Gets the player who locked the buzzer
   */
  getBuzzerLockedBy(room: Room): string | null {
    return room.buzzerState.lockedBy;
  }

  /**
   * Checks if a player is the host
   */
  isHost(room: Room, playerId: string): boolean {
    return room.hostId === playerId;
  }
}

// Export singleton instance
export const gameService = new GameService();
