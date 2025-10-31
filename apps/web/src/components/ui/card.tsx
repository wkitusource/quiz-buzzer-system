'use client'

import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const baseStyles =
    'bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-[var(--shadow-sm)]'

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  )
}
