'use client'

import { useCallback, useEffect, useRef } from 'react'

// Type for Window with webkit AudioContext support (Safari compatibility)
type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext
}

// Define sound types
type SoundType = 'buzz' | 'correct' | 'incorrect' | 'join' | 'leave'

// Simple Web Audio API based sound generator
class SoundGenerator {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext ||
        (window as WindowWithWebkitAudio).webkitAudioContext)()
    }
  }

  // Game show buzzer sound
  playBuzz() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime) // A4 note
    oscillator.frequency.exponentialRampToValueAtTime(
      220,
      this.audioContext.currentTime + 0.3
    )

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // Correct answer sound (pleasant chime)
  playCorrect() {
    if (!this.audioContext) return

    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 (C major chord)
    const now = this.audioContext.currentTime

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)

      oscillator.frequency.setValueAtTime(freq, now)
      gainNode.gain.setValueAtTime(0.15, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

      oscillator.start(now + index * 0.1)
      oscillator.stop(now + index * 0.1 + 0.4)
    })
  }

  // Incorrect answer sound (descending tone)
  playIncorrect() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      150,
      this.audioContext.currentTime + 0.3
    )

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // Player join sound (short ascending tone)
  playJoin() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      800,
      this.audioContext.currentTime + 0.1
    )

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // Player leave sound (short descending tone)
  playLeave() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      300,
      this.audioContext.currentTime + 0.1
    )

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    )

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }
}

export function useSounds() {
  const soundGenerator = useRef<SoundGenerator | null>(null)

  useEffect(() => {
    soundGenerator.current = new SoundGenerator()
  }, [])

  const playSound = useCallback((type: SoundType) => {
    if (!soundGenerator.current) return

    switch (type) {
      case 'buzz':
        soundGenerator.current.playBuzz()
        break
      case 'correct':
        soundGenerator.current.playCorrect()
        break
      case 'incorrect':
        soundGenerator.current.playIncorrect()
        break
      case 'join':
        soundGenerator.current.playJoin()
        break
      case 'leave':
        soundGenerator.current.playLeave()
        break
    }
  }, [])

  return { playSound }
}
