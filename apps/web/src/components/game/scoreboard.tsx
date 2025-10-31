'use client'

import { motion } from 'framer-motion'

import { Card } from '@/components/ui/card'
import { useGame } from '@/contexts/game-context'

export function Scoreboard() {
  const { players } = useGame()

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-(--text-primary)">
        Таблица очков
      </h3>

      <div className="space-y-2">
        {sortedPlayers.length === 0 ? (
          <p className="py-4 text-center text-sm text-(--text-secondary)">
            Пока нет очков
          </p>
        ) : (
          sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded p-2 transition-colors hover:bg-(--surface-hover)"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent w-6 text-lg font-bold">
                  #{index + 1}
                </span>
                <span className="font-medium text-(--text-primary)">
                  {player.username}
                </span>
              </div>

              <motion.span
                key={player.score}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-mono text-xl font-bold text-(--text-primary)"
              >
                {player.score}
              </motion.span>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  )
}
