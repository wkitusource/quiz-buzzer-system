'use client'

import { motion } from 'framer-motion'

import { useGame } from '@/contexts/game-context'

export function BuzzerButton() {
  const {
    buzz,
    buzzerLocked,
    buzzerLockedBy,
    playerId,
    lastBuzzer,
    connected,
  } = useGame()

  const isLockedByMe = buzzerLockedBy === playerId
  const isDisabled = buzzerLocked || !connected

  const handleBuzz = async () => {
    if (isDisabled) return
    await buzz()
  }

  // Handle keyboard shortcut (Space)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space' && !isDisabled) {
      e.preventDefault()
      handleBuzz()
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={handleBuzz}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        className={`relative h-48 w-48 rounded-full text-2xl font-bold transition-all duration-300 focus:ring-4 focus:outline-none ${
          buzzerLocked
            ? isLockedByMe
              ? 'bg-success focus:ring-success text-white shadow-lg'
              : 'cursor-not-allowed bg-gray-400 text-gray-600 opacity-60'
            : 'bg-accent focus:ring-accent cursor-pointer text-white shadow-xl hover:shadow-2xl'
        } disabled:cursor-not-allowed disabled:opacity-60`}
        aria-label="Кнопка ответа"
      >
        {buzzerLocked ? (
          isLockedByMe ? (
            <span>Вы нажали!</span>
          ) : (
            <span>Заблокировано</span>
          )
        ) : (
          <span>ЖМИ!</span>
        )}

        {/* Pulse animation when unlocked */}
        {!buzzerLocked && connected && (
          <motion.div
            className="bg-accent absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Status text */}
      <div className="text-center">
        {buzzerLocked && lastBuzzer && !isLockedByMe && (
          <p className="text-lg font-medium text-(--text-primary)">
            <span className="text-accent">{lastBuzzer.username}</span> нажал
            первым!
          </p>
        )}
        {!connected && (
          <p className="text-error text-sm">Отключено от сервера</p>
        )}
        {!buzzerLocked && connected && (
          <p className="text-sm text-(--text-secondary)">
            Нажмите кнопку или клавишу{' '}
            <kbd className="bg-surface border-border rounded border px-2 py-1 font-mono text-xs">
              Пробел
            </kbd>
          </p>
        )}
      </div>
    </div>
  )
}
