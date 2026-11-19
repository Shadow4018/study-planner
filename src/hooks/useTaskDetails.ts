import { useCallback } from 'react'
import { taskRepository } from '../repositories/taskRepository'
import type { Task } from '../types/task'
import { useAsyncData } from './useAsyncData'
import type { AsyncResult } from './useAsyncData'

/**
 * Деталі одного завдання через taskRepository.getById(id).
 * Дані живуть у локальному state компонента, а не в глобальному Context.
 */
export function useTaskDetails(id: number): AsyncResult<Task> {
  const load = useCallback(
    (signal: AbortSignal) => taskRepository.getById(id, signal),
    [id],
  )
  return useAsyncData(load)
}
