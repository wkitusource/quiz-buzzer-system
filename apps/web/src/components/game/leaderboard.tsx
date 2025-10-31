'use client'

import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useGame } from '@/contexts/game-context'

export function Leaderboard() {
  const { players, playerId, hostId } = useGame()

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <Card className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-(--text-primary)">
        Таблица лидеров
      </h2>

      <div className="space-y-3">
        {sortedPlayers.length === 0 ? (
          <p className="py-8 text-center text-(--text-secondary)">
            Пока нет игроков
          </p>
        ) : (
          sortedPlayers.map((player, index) => {
            const isMe = player.id === playerId
            const isHost = player.id === hostId
            const isTopThree = index < 3

            const rankColors = [
              'text-yellow-500',
              'text-gray-400',
              'text-orange-600',
            ]
            const rankEmoji = ['🥇', '🥈', '🥉']

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg border-2 p-4 transition-all ${
                  isMe
                    ? 'border-accent bg-(--accent-light) shadow-md'
                    : 'bg-surface border-border hover:border-(--border-hover)'
                } `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex h-12 w-12 items-center justify-center">
                      {isTopThree ? (
                        <span className="text-3xl">{rankEmoji[index]}</span>
                      ) : (
                        <span className={`text-2xl font-bold ${rankColors[0]}`}>
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Player info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-(--text-primary)">
                          {player.username}
                        </span>
                        {isMe && (
                          <Badge variant="accent" size="sm">
                            Вы
                          </Badge>
                        )}
                        {isHost && (
                          <Badge variant="default" size="sm">
                            Ведущий
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            player.connected ? 'bg-success' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-xs text-(--text-secondary)">
                          {player.connected ? 'В сети' : 'Не в сети'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <motion.div
                    key={player.score}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-accent font-mono text-3xl font-bold"
                  >
                    {player.score}
                  </motion.div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </Card>
  )
}
