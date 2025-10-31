import type { BuzzerEvent, PlayerPublic } from './game.types'

// Client to Server Events Payloads
export interface CreateRoomPayload {
  username: string
  maxPlayers?: number
}

export interface JoinRoomPayload {
  roomCode: string
  username: string
}

export interface UpdateScorePayload {
  playerId: string
  points: number
}

// Server to Client Events
export interface ServerToClientEvents {
  'room-created': (data: {
    roomId: string
    roomCode: string
    playerId: string
  }) => void
  'room-joined': (data: {
    roomId: string
    roomCode: string
    playerId: string
    players: PlayerPublic[]
  }) => void
  'player-joined': (data: { player: PlayerPublic }) => void
  'player-left': (data: { playerId: string }) => void
  'player-buzzed': (data: BuzzerEvent) => void
  'buzzer-reset': () => void
  'score-updated': (data: { playerId: string; newScore: number }) => void
  'player-list-updated': (data: { players: PlayerPublic[] }) => void
  error: (data: { message: string }) => void
}

// Client to Server Events
export interface ClientToServerEvents {
  'create-room': (
    data: CreateRoomPayload,
    callback: (response: {
      success: boolean
      roomId?: string
      roomCode?: string
      playerId?: string
      error?: string
    }) => void
  ) => void
  'join-room': (
    data: JoinRoomPayload,
    callback: (response: {
      success: boolean
      roomId?: string
      playerId?: string
      error?: string
    }) => void
  ) => void
  buzz: (
    callback: (response: { success: boolean; error?: string }) => void
  ) => void
  'reset-buzzer': () => void
  'update-score': (data: UpdateScorePayload) => void
  'leave-room': () => void
}

// Socket Data (stored on socket instance)
export interface SocketData {
  playerId?: string
  roomId?: string
}
