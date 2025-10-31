'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGame } from '@/contexts/game-context'

export function RoomHeader() {
  const { roomCode, players, connected } = useGame()
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    if (!roomCode) return

    try {
      // Copy room code to clipboard
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy room code:', error)
    }
  }

  const handleCopyLink = async () => {
    if (!roomCode) return

    try {
      const url = `${window.location.origin}/room/${roomCode}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className="bg-surface border-border border-b shadow-(--shadow-sm)">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Room info */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-(--text-primary)">
                Викторина
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-(--text-secondary)">
                  Код комнаты:
                </span>
                <Badge variant="accent" className="px-3 py-1 font-mono text-lg">
                  {roomCode}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions and status */}
          <div className="flex items-center gap-3">
            {/* Player count */}
            <Badge variant="default">
              {players.length}{' '}
              {players.length === 1
                ? 'Игрок'
                : players.length < 5
                  ? 'Игрока'
                  : 'Игроков'}
            </Badge>

            {/* Connection status */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  connected ? 'bg-success' : 'bg-error'
                }`}
              />
              <span className="text-sm text-(--text-secondary)">
                {connected ? 'Подключено' : 'Отключено'}
              </span>
            </div>

            {/* Copy buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
                disabled={!roomCode}
              >
                {copied ? 'Скопировано!' : 'Скопировать код'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                disabled={!roomCode}
              >
                Поделиться ссылкой
              </Button>
            </div>
          </div>
        </div>

        {/* Copied confirmation */}
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-success mt-2 text-sm"
          >
            Скопировано в буфер обмена!
          </motion.div>
        )}
      </div>
    </div>
  )
}
