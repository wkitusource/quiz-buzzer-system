'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useGame } from '@/contexts/game-context'

export function HostControls() {
  const { playerId, hostId, resetBuzzer, buzzerLocked } = useGame()

  const isHost = playerId === hostId

  if (!isHost) {
    return null
  }

  const handleResetBuzzer = () => {
    resetBuzzer()
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-(--text-primary)">
          Управление ведущего
        </h3>
      </div>

      {/* Buzzer control */}
      <Button
        variant="secondary"
        fullWidth
        onClick={handleResetBuzzer}
        disabled={!buzzerLocked}
      >
        Сбросить кнопку
      </Button>
    </Card>
  )
}
