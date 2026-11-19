/**
 * Централізована нормалізація помилок.
 * Що б не пішло не так (мережа, HTTP-статус, неправильний JSON, відсутній
 * VITE_API_URL), вищі рівні отримують один тип — ApiError — і не розбираються
 * у деталях fetch.
 */

export type ApiErrorKind = 'network' | 'http' | 'parse' | 'config'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  /** HTTP-статус; null, якщо відповіді взагалі не було. */
  readonly status: number | null

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

/** Скасований через AbortController запит — це не помилка для користувача. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/** Приводить будь-який виняток до ApiError. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  return new ApiError(
    'network',
    error instanceof Error ? error.message : 'Невідома помилка',
  )
}

/** Зрозуміле для користувача повідомлення (без технічних подробиць). */
export function getErrorMessage(error: ApiError): string {
  switch (error.kind) {
    case 'network':
      return 'Немає зв’язку з сервером. Перевірте інтернет-з’єднання.'
    case 'config':
      return 'Застосунок неправильно налаштований: не задано адресу API.'
    case 'parse':
      return 'Сервер повернув відповідь у неочікуваному форматі.'
    case 'http':
      if (error.status === 404) return 'Запис не знайдено.'
      if (error.status !== null && error.status >= 500) {
        return `Помилка на боці сервера (${error.status}). Спробуйте пізніше.`
      }
      return `Сервер відхилив запит (${error.status ?? '—'}).`
  }
}
