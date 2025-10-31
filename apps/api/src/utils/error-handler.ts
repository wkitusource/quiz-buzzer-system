import { ZodError } from 'zod'

export class GameError extends Error {
  constructor(
    message: string,
    public code: string = 'GAME_ERROR'
  ) {
    super(message)
    this.name = 'GameError'
  }
}

export class RoomNotFoundError extends GameError {
  constructor(roomCode: string) {
    super(`Room with code ${roomCode} not found`, 'ROOM_NOT_FOUND')
    this.name = 'RoomNotFoundError'
  }
}

export class RoomFullError extends GameError {
  constructor() {
    super('Room is full', 'ROOM_FULL')
    this.name = 'RoomFullError'
  }
}

export class PlayerNotFoundError extends GameError {
  constructor(playerId: string) {
    super(`Player ${playerId} not found`, 'PLAYER_NOT_FOUND')
    this.name = 'PlayerNotFoundError'
  }
}

export class BuzzerLockedError extends GameError {
  constructor() {
    super('Buzzer is already locked', 'BUZZER_LOCKED')
    this.name = 'BuzzerLockedError'
  }
}

export class UnauthorizedError extends GameError {
  constructor(message: string = 'Unauthorized action') {
    super(message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

/**
 * Handles errors and returns a user-friendly message
 */
export function handleError(error: unknown): string {
  if (error instanceof GameError) {
    return error.message
  }

  if (error instanceof ZodError) {
    const firstError = error.errors[0]
    return `Validation error: ${firstError.path.join('.')} - ${firstError.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred'
}
