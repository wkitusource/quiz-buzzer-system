import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { GameProvider } from '@/contexts/game-context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
  authors: [{ name: 'Команда Игры Викторина' }],
  openGraph: {
    title: 'Игра Викторина',
    description: 'Система викторины в реальном времени',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Игра Викторина',
    description: 'Система викторины в реальном времени',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  )
}
