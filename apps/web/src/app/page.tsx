'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Modal } from '@/components/ui/modal'
import { useGame } from '@/contexts/game-context'

export default function Home() {
  const router = useRouter()
  const { createRoom, joinRoom, connected } = useGame()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Create room form
  const [createUsername, setCreateUsername] = useState('')
  const [maxPlayers, setMaxPlayers] = useState<number>(10)

  // Join room form
  const [joinRoomCode, setJoinRoomCode] = useState('')
  const [joinUsername, setJoinUsername] = useState('')

  const [error, setError] = useState<string | null>(null)

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await createRoom({
        username: createUsername,
        maxPlayers,
      })

      if (response.success && response.roomCode) {
        router.push(`/room/${response.roomCode}`)
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      console.error(err)
      setError('Не удалось создать комнату')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await joinRoom({
        roomCode: joinRoomCode.toUpperCase(),
        username: joinUsername,
      })

      if (response.success) {
        router.push(`/room/${joinRoomCode.toUpperCase()}`)
      } else if (response.error) {
        setError(response.error)
      }
    } catch (err) {
      console.error(err)
      setError('Не удалось присоединиться к комнате')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-4xl text-center"
      >
        <h1 className="mb-4 text-5xl font-bold text-(--text-primary) sm:text-6xl">
          Игра Викторина
        </h1>
        <p className="mb-8 text-xl text-(--text-secondary)">
          Система викторины в реальном времени. Будьте первым, кто нажмет кнопку
          и выиграйте!
        </p>

        {/* Connection status */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              connected ? 'bg-success' : 'bg-error'
            }`}
          />
          <span className="text-sm text-(--text-secondary)">
            {connected ? 'Подключено к серверу' : 'Подключение...'}
          </span>
        </div>
      </motion.div>

      {/* Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* Create Room Card */}
        <Card className="transition-shadow hover:shadow-(--shadow-md)">
          <h2 className="mb-4 text-2xl font-bold text-(--text-primary)">
            Создать комнату
          </h2>
          <p className="mb-6 text-(--text-secondary)">
            Создайте новую игровую комнату и пригласите друзей присоединиться
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setShowCreateModal(true)}
            disabled={!connected}
          >
            Создать новую комнату
          </Button>
        </Card>

        {/* Join Room Card */}
        <Card className="transition-shadow hover:shadow-(--shadow-md)">
          <h2 className="mb-4 text-2xl font-bold text-(--text-primary)">
            Присоединиться
          </h2>
          <p className="mb-6 text-(--text-secondary)">
            Введите код комнаты, чтобы присоединиться к существующей игре
          </p>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => setShowJoinModal(true)}
            disabled={!connected}
          >
            Присоединиться к комнате
          </Button>
        </Card>
      </motion.div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setError(null)
        }}
        title="Создать комнату"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <Input
            label="Ваше имя"
            placeholder="Введите ваше имя"
            value={createUsername}
            onChange={(e) => setCreateUsername(e.target.value)}
            required
            fullWidth
            maxLength={50}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--text-primary)">
              Максимум игроков (необязательно)
            </label>
            <Input
              type="number"
              placeholder="10"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 10)}
              min={2}
              max={20}
              fullWidth
            />
          </div>

          {error && (
            <p className="text-error rounded bg-(--error-light) p-3 text-sm">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false)
                setError(null)
              }}
              disabled={loading}
              fullWidth
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!createUsername.trim() || loading}
              fullWidth
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Создать комнату'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false)
          setError(null)
        }}
        title="Присоединиться"
      >
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <Input
            label="Код комнаты"
            placeholder="Введите 6-значный код"
            value={joinRoomCode}
            onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
            required
            fullWidth
            maxLength={6}
            className="font-mono uppercase"
          />

          <Input
            label="Ваше имя"
            placeholder="Введите ваше имя"
            value={joinUsername}
            onChange={(e) => setJoinUsername(e.target.value)}
            required
            fullWidth
            maxLength={50}
          />

          {error && (
            <p className="text-error rounded bg-(--error-light) p-3 text-sm">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowJoinModal(false)
                setError(null)
              }}
              disabled={loading}
              fullWidth
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!joinRoomCode.trim() || !joinUsername.trim() || loading}
              fullWidth
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Присоединиться'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
