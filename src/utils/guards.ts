import { filterOptions, priorityOptions } from '../data/labels'
import type { Priority, Task, TaskFilter } from '../types/task'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isTaskFilter(value: unknown): value is TaskFilter {
  return (
    typeof value === 'string' && (filterOptions as string[]).includes(value)
  )
}

function isPriority(value: unknown): value is Priority {
  return (
    typeof value === 'string' && (priorityOptions as string[]).includes(value)
  )
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.completed === 'boolean' &&
    isPriority(value.priority) &&
    typeof value.category === 'string'
  )
}

/** Перевіряє, що з localStorage прочитано саме масив коректних завдань. */
export function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
}
