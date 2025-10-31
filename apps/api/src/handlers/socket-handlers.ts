import type { Server, Socket } from 'socket.io'

import { gameService } from '../services/game-service.js'
import { playerService } from '../services/player-service.js'
import { roomService } from '../services/room-service.js'
import {
  CreateRoomSchema,
  JoinRoomSchema,
  UpdateScoreSchema,
  type ClientToServerEvents,
  type CreateRoomPayload,
  type JoinRoomPayload,
  type ServerToClientEvents,
  type SocketData,
  type UpdateScorePayload,
} from '../types/socket-events.types.js'
import { handleError } from '../utils/error-handler.js'

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>
type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>

export function setupSocketHandlers(io: TypedServer) {
  io.on('connection', (socket: TypedSocket) => {
    console.log(`Client connected: ${socket.id}`)

    // Handle room creation
    socket.on('create-room', (data: CreateRoomPayload, callback) => {
      try {
        // Validate input
        const validated = CreateRoomSchema.parse(data)

        // Create room
        const room = roomService.createRoom(socket.id, validated.maxPlayers)

        // Create host player
        const player = playerService.createPlayer(validated.username, room)

        // Store player and room info in socket data
        socket.data.playerId = player.id
        socket.data.roomId = room.id

        // Set host as the player who created the room
        room.hostId = player.id

        // Join socket to room
        socket.join(room.id)

        console.log(`Room created: ${room.code} by player ${player.username}`)

        callback({
          success: true,
          roomId: room.id,
          roomCode: room.code,
          playerId: player.id,
        })

        // Emit to room
        io.to(room.id).emit('player-list-updated', {
          players: playerService.getPublicPlayers(room),
        })
      } catch (error) {
        console.error('Error creating room:', error)
        callback({
          success: false,
          error: handleError(error),
        })
      }
    })

    // Handle joining a room
    socket.on('join-room', (data: JoinRoomPayload, callback) => {
      try {
        // Validate input
        const validated = JoinRoomSchema.parse(data)

        // Get and validate room
        const room = roomService.validateRoomForJoin(validated.roomCode)

        // Create player
        const player = playerService.createPlayer(validated.username, room)

        // Store player and room info in socket data
        socket.data.playerId = player.id
        socket.data.roomId = room.id

        // Join socket to room
        socket.join(room.id)

        console.log(`Player ${player.username} joined room ${room.code}`)

        callback({
          success: true,
          roomId: room.id,
          playerId: player.id,
        })

        // Notify room about new player
        socket.to(room.id).emit('player-joined', {
          player: playerService.toPublic(player),
        })

        // Send updated player list to all in room
        io.to(room.id).emit('player-list-updated', {
          players: playerService.getPublicPlayers(room),
        })
      } catch (error) {
        console.error('Error joining room:', error)
        callback({
          success: false,
          error: handleError(error),
        })
      }
    })

    // Handle buzzer press
    socket.on('buzz', (callback) => {
      try {
        const { playerId, roomId } = socket.data

        if (!playerId || !roomId) {
          throw new Error('Not in a room')
        }

        const room = roomService.getRoomById(roomId)
        if (!room) {
          throw new Error('Room not found')
        }

        // Process buzz
        const buzzerEvent = gameService.buzz(room, playerId)

        console.log(
          `Player ${buzzerEvent.username} buzzed in room ${room.code}`
        )

        callback({ success: true })

        // Notify all players in the room
        io.to(room.id).emit('player-buzzed', buzzerEvent)
      } catch (error) {
        console.error('Error processing buzz:', error)
        callback({
          success: false,
          error: handleError(error),
        })
      }
    })

    // Handle buzzer reset
    socket.on('reset-buzzer', () => {
      try {
        const { playerId, roomId } = socket.data

        if (!playerId || !roomId) {
          throw new Error('Not in a room')
        }

        const room = roomService.getRoomById(roomId)
        if (!room) {
          throw new Error('Room not found')
        }

        // Reset buzzer
        gameService.resetBuzzer(room, playerId)

        console.log(`Buzzer reset in room ${room.code}`)

        // Notify all players in the room
        io.to(room.id).emit('buzzer-reset')
      } catch (error) {
        console.error('Error resetting buzzer:', error)
        socket.emit('error', { message: handleError(error) })
      }
    })

    // Handle score update
    socket.on('update-score', (data: UpdateScorePayload) => {
      try {
        const { playerId, roomId } = socket.data

        if (!playerId || !roomId) {
          throw new Error('Not in a room')
        }

        const room = roomService.getRoomById(roomId)
        if (!room) {
          throw new Error('Room not found')
        }

        // Validate input
        const validated = UpdateScoreSchema.parse(data)

        // Update score
        gameService.updateScore(
          room,
          playerId,
          validated.playerId,
          validated.points
        )

        const targetPlayer = playerService.getPlayer(room, validated.playerId)
        if (targetPlayer) {
          console.log(
            `Score updated for ${targetPlayer.username}: ${targetPlayer.score}`
          )

          // Notify all players in the room
          io.to(room.id).emit('score-updated', {
            playerId: targetPlayer.id,
            newScore: targetPlayer.score,
          })

          // Send updated player list
          io.to(room.id).emit('player-list-updated', {
            players: playerService.getPublicPlayers(room),
          })
        }
      } catch (error) {
        console.error('Error updating score:', error)
        socket.emit('error', { message: handleError(error) })
      }
    })

    // Handle leaving a room
    socket.on('leave-room', () => {
      handlePlayerLeave(socket, io)
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
      handlePlayerLeave(socket, io)
    })
  })
}

/**
 * Handles a player leaving a room
 */
function handlePlayerLeave(socket: TypedSocket, io: TypedServer) {
  const { playerId, roomId } = socket.data

  if (!playerId || !roomId) {
    return
  }

  const room = roomService.getRoomById(roomId)
  if (!room) {
    return
  }

  // Remove player from room
  const removed = playerService.removePlayer(room, playerId)

  if (removed) {
    console.log(`Player ${playerId} left room ${room.code}`)

    // Leave socket room
    socket.leave(roomId)

    // Notify others in the room
    socket.to(roomId).emit('player-left', { playerId })

    // Send updated player list
    io.to(roomId).emit('player-list-updated', {
      players: playerService.getPublicPlayers(room),
    })

    // If room is empty, clean it up
    if (room.players.size === 0) {
      roomService.deleteRoom(roomId)
      console.log(`Room ${room.code} deleted (empty)`)
    }
    // If host left, assign new host
    else if (room.hostId === playerId) {
      const newHost = Array.from(room.players.values())[0]
      room.hostId = newHost.id
      console.log(`New host assigned in room ${room.code}: ${newHost.username}`)
    }
  }

  // Clear socket data
  socket.data.playerId = undefined
  socket.data.roomId = undefined
}
