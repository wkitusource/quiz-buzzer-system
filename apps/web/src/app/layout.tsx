import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { GameProvider } from '@/contexts/game-context'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: 'variable',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: {
    default: 'Игра Викторина',
    template: '%s | Игра Викторина',
  },
  description:
    'Система викторины в реальном времени. Будьте первым, кто нажмет кнопку и выиграйте! Играйте с друзьями в собственных игровых комнатах.',
  keywords: [
    'викторина',
    'кнопка',
    'игра',
    'мультиплеер',
    'в реальном времени',
    'тривия',
    'игровое шоу',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
