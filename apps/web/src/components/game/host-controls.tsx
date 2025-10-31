'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGame } from '@/contexts/game-context'

export function HostControls() {
  const { players, playerId, hostId, resetBuzzer, updateScore, buzzerLocked } =
    useGame()
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)

  const isHost = playerId === hostId

  if (!isHost) {
    return null
  }

  const handleResetBuzzer = () => {
    resetBuzzer()
  }

  const handleAwardPoints = (points: number) => {
    if (!selectedPlayer) return
    updateScore({ playerId: selectedPlayer, points })
    setSelectedPlayer(null)
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-(--text-primary)">
          Управление ведущего
        </h3>
        <Badge variant="accent" size="sm">
          Только ведущий
        </Badge>
      </div>

      {/* Buzzer control */}
      <div className="mb-6">
        <h4 className="mb-2 text-sm font-medium text-(--text-secondary)">
          Кнопка
        </h4>
        <Button
          variant="secondary"
          fullWidth
          onClick={handleResetBuzzer}
          disabled={!buzzerLocked}
        >
          Сбросить кнопку
        </Button>
      </div>

      {/* Score management */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-(--text-secondary)">
          Начислить очки
        </h4>

        {/* Player selection */}
        <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player.id)}
              className={`w-full rounded p-2 text-left transition-colors ${
                selectedPlayer === player.id
                  ? 'border-accent border-2 bg-(--accent-light)'
                  : 'border-2 border-transparent bg-(--surface-hover) hover:border-(--border-hover)'
              } `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-(--text-primary)">
                  {player.username}
                </span>
                <span className="font-mono text-sm text-(--text-secondary)">
                  {player.score} очк.
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Point buttons */}
        <div className="mb-2 grid grid-cols-4 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAwardPoints(10)}
            disabled={!selectedPlayer}
          >
            +10
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAwardPoints(5)}
            disabled={!selectedPlayer}
          >
            +5
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAwardPoints(-5)}
            disabled={!selectedPlayer}
          >
            -5
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAwardPoints(-10)}
            disabled={!selectedPlayer}
          >
            -10
          </Button>
        </div>

        {selectedPlayer && (
          <p className="text-center text-xs text-(--text-secondary)">
            Выбрано: {players.find((p) => p.id === selectedPlayer)?.username}
          </p>
        )}
      </div>
    </Card>
  )
}
