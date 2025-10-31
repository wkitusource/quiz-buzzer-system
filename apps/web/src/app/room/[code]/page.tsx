'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { BuzzerButton } from '@/components/game/buzzer-button'
import { HostControls } from '@/components/game/host-controls'
import { Leaderboard } from '@/components/game/leaderboard'
import { PlayerList } from '@/components/game/player-list'
import { RoomHeader } from '@/components/game/room-header'
import { Scoreboard } from '@/components/game/scoreboard'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useGame } from '@/contexts/game-context'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomCode = (params.code as string)?.toUpperCase()

  const { roomId, leaveRoom, connected, buzz, buzzerLocked } = useGame()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [loading, setLoading] = useState(true)

  const onLoadingComplete = useEffectEvent(() => {
    setLoading(false)
  })

  useEffect(() => {
    // If we're not in the room yet, redirect to home
    // This happens when user navigates directly to room URL
    if (!roomId && roomCode) {
      // The actual joining should happen via the join flow from home page
      // For now, redirect to home if not already in a room
      const timer = setTimeout(() => {
        onLoadingComplete()
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      onLoadingComplete()
    }
  }, [roomId, roomCode])

  // Global Spacebar handler for buzzer
  useEffect(() => {
    if (!roomId) return

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Only handle Spacebar
      if (e.key !== ' ' && e.code !== 'Space') return

      // Don't trigger if typing in input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Only trigger in game view (not leaderboard)
      if (showLeaderboard) return

      // Only trigger if connected and buzzer not locked
      if (!connected || buzzerLocked) return

      e.preventDefault()
      await buzz()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [roomId, showLeaderboard, connected, buzzerLocked, buzz])

  const handleLeaveRoom = () => {
    leaveRoom()
    router.push('/')
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-(--text-secondary)">Загрузка комнаты...</p>
        </div>
      </div>
    )
  }

  // Not in room state
  if (!roomId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-2xl font-bold text-(--text-primary)">
            Комната не найдена
          </h2>
          <p className="mb-6 text-(--text-secondary)">
            Вы не находитесь в этой комнате. Пожалуйста, присоединитесь с
            главной страницы.
          </p>
          <Button onClick={() => router.push('/')}>На главную</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <RoomHeader />

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        {showLeaderboard ? (
          /* Leaderboard View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            <div className="mb-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowLeaderboard(false)}
              >
                Вернуться к игре
              </Button>
            </div>
            <Leaderboard />
          </motion.div>
        ) : (
          /* Game View */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Sidebar - Player List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <PlayerList />
            </motion.div>

            {/* Center - Buzzer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center py-12 lg:col-span-6"
            >
              <BuzzerButton />

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowLeaderboard(true)}
                >
                  Таблица лидеров
                </Button>
                <Button variant="ghost" onClick={handleLeaveRoom}>
                  Покинуть комнату
                </Button>
              </div>
            </motion.div>

            {/* Right Sidebar - Scoreboard and Host Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 lg:col-span-3"
            >
              <Scoreboard />
              <HostControls />
            </motion.div>
          </div>
        )}
      </div>

      {/* Connection Lost Warning */}
      {!connected && (
        <div className="bg-error fixed right-4 bottom-4 rounded-lg px-4 py-3 text-white shadow-lg">
          <p className="font-medium">Соединение потеряно</p>
          <p className="text-sm opacity-90">Попытка переподключения...</p>
        </div>
      )}
    </div>
  )
}
