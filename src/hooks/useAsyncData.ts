import { useCallback, useEffect, useState } from 'react'
import { isAbortError, normalizeError } from '../api/errors'
import type { ApiError } from '../api/errors'

export type AsyncStatus = 'loading' | 'success' | 'error'

export interface AsyncResult<T> {
  status: AsyncStatus
  /** Останні успішно отримані дані (зберігаються і під час наступного loading). */
  data: T | null
  error: ApiError | null
  /** Повторити запит (наприклад, після помилки). */
  retry: () => void
  /** Локально змінити дані після успішної mutation (server state у клієнті). */
  mutate: (updater: (current: T) => T) => void
}

interface Settled<T> {
  /** Для якого запиту (load + номер спроби) отримано цей результат. */
  load: (signal: AbortSignal) => Promise<T>
  attempt: number
  outcome: 'success' | 'error'
  error: ApiError | null
}

/**
 * Асинхронне завантаження з можливістю скасування.
 *
 * - Запит запускається при монтуванні та щоразу, коли змінюється `load`
 *   (передавайте його через useCallback — зміна залежностей = новий запит).
 * - Cleanup викликає controller.abort(): попередній запит скасовується при
 *   переході на іншу сторінку та при unmount компонента.
 * - Скасований запит НЕ перетворюється на помилку й не змінює state.
 * - Статус `loading` — похідний: якщо результат належить іншому запиту, ніж
 *   поточний, інтерфейс одразу вважається таким, що завантажується.
 */
export function useAsyncData<T>(
  load: (signal: AbortSignal) => Promise<T>,
): AsyncResult<T> {
  const [attempt, setAttempt] = useState(0)
  const [data, setData] = useState<T | null>(null)
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    load(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setSettled({ load, attempt, outcome: 'success', error: null })
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted || isAbortError(cause)) return
        setSettled({ load, attempt, outcome: 'error', error: normalizeError(cause) })
      })

    return () => controller.abort()
  }, [load, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const mutate = useCallback((updater: (current: T) => T) => {
    setData((current) => (current === null ? current : updater(current)))
  }, [])

  const isCurrent =
    settled !== null && settled.load === load && settled.attempt === attempt

  return {
    status: isCurrent ? settled.outcome : 'loading',
    data,
    error: isCurrent ? settled.error : null,
    retry,
    mutate,
  }
}
