'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useGame } from '@/contexts/game-context'

export function PlayerList() {
  const { players, playerId, hostId } = useGame()

  return (
    <Card className="h-full">
      <h3 className="mb-4 text-lg font-semibold text-(--text-primary)">
        Игроки ({players.length})
      </h3>

      <div className="space-y-2">
        {players.length === 0 ? (
          <p className="py-4 text-center text-sm text-(--text-secondary)">
            Пока нет игроков
          </p>
        ) : (
          players.map((player) => {
            const isMe = player.id === playerId
            const isHost = player.id === hostId

            return (
              <div
                key={player.id}
                className={`rounded-lg border p-3 transition-colors ${
                  isMe
                    ? 'border-accent bg-(--accent-light)'
                    : 'bg-surface border-border'
                } `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${player.connected ? 'bg-success' : 'bg-gray-400'} `}
                      title={player.connected ? 'В сети' : 'Не в сети'}
                    />
                    <span className="font-medium text-(--text-primary)">
                      {player.username}
                      {isMe && (
                        <span className="ml-1 text-(--text-secondary)">
                          (Вы)
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHost && (
                      <Badge variant="accent" size="sm">
                        Ведущий
                      </Badge>
                    )}
                    <span className="font-mono text-sm text-(--text-secondary)">
                      {player.score} очк.
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
