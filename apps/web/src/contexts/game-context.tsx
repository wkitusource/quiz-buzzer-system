'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useSocket } from '@/hooks/use-socket'
import { useSounds } from '@/hooks/use-sounds'
import type { BuzzerEvent, PlayerPublic } from '@/types/game.types'
import type {
  CreateRoomPayload,
  JoinRoomPayload,
  UpdateScorePayload,
} from '@/types/socket-events.types'

interface GameState {
  // Room info
  roomId: string | null
  roomCode: string | null
  hostId: string | null

  // Player info
  playerId: string | null
  players: PlayerPublic[]

  // Buzzer state
  buzzerLocked: boolean
  buzzerLockedBy: string | null
  lastBuzzer: BuzzerEvent | null

  // Connection state
  connected: boolean
  error: string | null
}

interface GameActions {
  createRoom: (
    payload: CreateRoomPayload
  ) => Promise<{ success: boolean; roomCode?: string; error?: string }>
  joinRoom: (
    payload: JoinRoomPayload
  ) => Promise<{ success: boolean; error?: string }>
  buzz: () => Promise<{ success: boolean; error?: string }>
  resetBuzzer: () => void
  updateScore: (payload: UpdateScorePayload) => void
  leaveRoom: () => void
  clearError: () => void
}

type GameContextType = GameState & GameActions

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { socket, connected } = useSocket()
  const { playSound } = useSounds()

  // Game state
  const [roomId, setRoomId] = useState<string | null>(null)
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [hostId, setHostId] = useState<string | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [players, setPlayers] = useState<PlayerPublic[]>([])
  const [buzzerLocked, setBuzzerLocked] = useState(false)
  const [buzzerLockedBy, setBuzzerLockedBy] = useState<string | null>(null)
  const [lastBuzzer, setLastBuzzer] = useState<BuzzerEvent | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Actions
  const createRoom = useCallback(
    async (
      payload: CreateRoomPayload
    ): Promise<{ success: boolean; roomCode?: string; error?: string }> => {
      return new Promise((resolve) => {
        socket.emit('create-room', payload, (response) => {
          if (
            response.success &&
            response.roomId &&
            response.roomCode &&
            response.playerId
          ) {
            setRoomId(response.roomId)
            setRoomCode(response.roomCode)
            setPlayerId(response.playerId)
            // The creator is always the host
            setHostId(response.playerId)
            setError(null)
          } else if (response.error) {
            setError(response.error)
          }
          resolve({
            success: response.success,
            roomCode: response.roomCode,
            error: response.error,
          })
        })
      })
    },
    [socket]
  )

  const joinRoom = useCallback(
    async (
      payload: JoinRoomPayload
    ): Promise<{ success: boolean; error?: string }> => {
      return new Promise((resolve) => {
        socket.emit('join-room', payload, (response) => {
          if (response.success && response.roomId && response.playerId) {
            setRoomId(response.roomId)
            setRoomCode(payload.roomCode.toUpperCase())
            setPlayerId(response.playerId)
            setError(null)
          } else if (response.error) {
            setError(response.error)
          }
          resolve(response)
        })
      })
    },
    [socket]
  )

  const buzz = useCallback(async (): Promise<{
    success: boolean
    error?: string
  }> => {
    return new Promise((resolve) => {
      socket.emit('buzz', (response) => {
        if (!response.success && response.error) {
          setError(response.error)
        }
        resolve(response)
      })
    })
  }, [socket])

  const resetBuzzer = useCallback(() => {
    socket.emit('reset-buzzer')
  }, [socket])

  const updateScore = useCallback(
    (payload: UpdateScorePayload) => {
      socket.emit('update-score', payload)
    },
    [socket]
  )

  const leaveRoom = useCallback(() => {
    socket.emit('leave-room')
    // Clear local state
    setRoomId(null)
    setRoomCode(null)
    setHostId(null)
    setPlayerId(null)
    setPlayers([])
    setBuzzerLocked(false)
    setBuzzerLockedBy(null)
    setLastBuzzer(null)
    setError(null)
  }, [socket])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    // Player list updated
    socket.on('player-list-updated', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers)

      // Update hostId if we have players
      if (updatedPlayers.length > 0 && roomId) {
        // The host is typically the first player, but we'll need to get this from room data
        // For now, we'll track it when we create/join
      }
    })

    // Player joined
    socket.on('player-joined', ({ player }) => {
      console.log('Player joined:', player.username)
      playSound('join')
    })

    // Player left
    socket.on('player-left', ({ playerId: leftPlayerId }) => {
      console.log('Player left:', leftPlayerId)
      playSound('leave')
    })

    // Player buzzed
    socket.on('player-buzzed', (buzzerEvent) => {
      setBuzzerLocked(true)
      setBuzzerLockedBy(buzzerEvent.playerId)
      setLastBuzzer(buzzerEvent)
      playSound('buzz')
    })

    // Buzzer reset
    socket.on('buzzer-reset', () => {
      setBuzzerLocked(false)
      setBuzzerLockedBy(null)
    })

    // Score updated
    socket.on('score-updated', ({ playerId: updatedPlayerId, newScore }) => {
      setPlayers((prev) => {
        const updated = prev.map((p) => {
          if (p.id === updatedPlayerId) {
            // Play sound based on score change
            const scoreDiff = newScore - p.score
            if (scoreDiff > 0) {
              playSound('correct')
            } else if (scoreDiff < 0) {
              playSound('incorrect')
            }
            return { ...p, score: newScore }
          }
          return p
        })
        return updated
      })
    })

    // Error
    socket.on('error', ({ message }) => {
      setError(message)
    })

    // Cleanup
    return () => {
      socket.off('player-list-updated')
      socket.off('player-joined')
      socket.off('player-left')
      socket.off('player-buzzed')
      socket.off('buzzer-reset')
      socket.off('score-updated')
      socket.off('error')
    }
  }, [socket, roomId, playSound])

  const value: GameContextType = {
    // State
    roomId,
    roomCode,
    hostId,
    playerId,
    players,
    buzzerLocked,
    buzzerLockedBy,
    lastBuzzer,
    connected,
    error,

    // Actions
    createRoom,
    joinRoom,
    buzz,
    resetBuzzer,
    updateScore,
    leaveRoom,
    clearError,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
