'use client'

import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'accent'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-md'

  const variantStyles = {
    default:
      'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]',
    success: 'bg-[var(--success-light)] text-[var(--success)]',
    error: 'bg-[var(--error-light)] text-[var(--error)]',
    warning: 'bg-[var(--warning-light)] text-[var(--warning)]',
    accent: 'bg-[var(--accent-light)] text-[var(--accent)]',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
