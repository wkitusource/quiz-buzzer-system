'use client'

import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'

import { connect, getSocket, isConnected } from '@/lib/socket'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/types/socket-events.types'

export function useSocket() {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(
    () => getSocket()
  )
  const [connected, setConnected] = useState(() => isConnected())

  useEffect(() => {
    // Connect on mount
    connect()

    // Update connection state
    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    // Cleanup: disconnect on unmount
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      // Note: we don't disconnect here to allow persistent connection
      // across page navigation. We'll handle disconnection in specific scenarios.
    }
  }, [socket])

  return { socket, connected }
}
