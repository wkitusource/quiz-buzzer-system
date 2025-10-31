'use client'

import React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles =
      'px-4 py-2 rounded-lg border bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent'

    const errorStyles = error
      ? 'border-[var(--error)] focus:ring-[var(--error)]'
      : 'border-[var(--border)] hover:border-[var(--border-hover)]'

    const widthStyle = fullWidth ? 'w-full' : ''

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-(--text-primary)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${widthStyle} ${className}`}
          {...props}
        />
        {error && <p className="text-error mt-1.5 text-sm">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
