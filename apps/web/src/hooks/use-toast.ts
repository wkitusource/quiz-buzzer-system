'use client'

import { useCallback, useState } from 'react'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'warning' | 'info' = 'info'
    ) => {
      setToast({ message, type, isVisible: true })
    },
    []
  )

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  return {
    toast,
    showToast,
    hideToast,
  }
}
