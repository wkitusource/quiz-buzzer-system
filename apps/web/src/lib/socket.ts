import { io, Socket } from 'socket.io-client'

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socket-events.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

/**
 * Get or create the socket connection
 * This is a singleton pattern to ensure only one connection exists
 */
export function getSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: false, // We'll connect manually
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    })

    // Global error handler
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    // Connection event logging
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })
  }

  return socket
}

/**
 * Connect to the socket server
 */
export function connect(): void {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
  }
}

/**
 * Disconnect from the socket server
 */
export function disconnect(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}

/**
 * Check if socket is connected
 */
export function isConnected(): boolean {
  return socket?.connected ?? false
}
