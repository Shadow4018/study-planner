import { useEffect } from 'react'
import type { ToastVariant } from '../context/TaskContext'
import './Toast.scss'

interface ToastProps {
  message: string
  variant?: ToastVariant
  /** Якщо задано — Toast сам зникає через цей час (викликає onClose). */
  autoCloseMs?: number
  onClose?: () => void
  /** Якщо задано — показується смужка прогресу такої тривалості. */
  progressMs?: number
  actionLabel?: string
  onAction?: () => void
}

function Toast({
  message,
  variant = 'success',
  autoCloseMs,
  onClose,
  progressMs,
  actionLabel,
  onAction,
}: ToastProps) {
  // Автозакриття — побічний ефект із таймером, тому cleanup обов'язковий.
  useEffect(() => {
    if (autoCloseMs === undefined || !onClose) return

    const timerId = setTimeout(onClose, autoCloseMs)
    return () => clearTimeout(timerId)
  }, [autoCloseMs, onClose])

  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === 'error' ? 'alert' : undefined}
    >
      <div className="toast__content">
        <p className="toast__message">{message}</p>

        {actionLabel && onAction && (
          <button className="toast__action" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}

        {onClose && (
          <button
            className="toast__close"
            type="button"
            aria-label="Закрити повідомлення"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>

      {progressMs !== undefined && (
        <div className="toast__progress" aria-hidden="true">
          <div
            className="toast__progress-bar"
            style={{ animationDuration: `${progressMs}ms` }}
          />
        </div>
      )}
    </div>
  )
}

export default Toast
