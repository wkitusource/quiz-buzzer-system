export interface Player {
  id: string
  username: string
  score: number
  connected: boolean
}

export interface PlayerPublic {
  id: string
  username: string
  score: number
  connected: boolean
}

export interface BuzzerState {
  isLocked: boolean
  lockedBy: string | null
  lockedAt: Date | null
}

export interface Room {
  id: string
  code: string
  hostId: string
  players: Player[]
  buzzerState: BuzzerState
  createdAt: Date
  maxPlayers?: number
}

export interface BuzzerEvent {
  playerId: string
  username: string
  timestamp: Date
}

export interface RoomSummary {
  id: string
  code: string
  playerCount: number
  maxPlayers?: number
  createdAt: Date
}
