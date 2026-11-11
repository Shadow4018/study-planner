import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { PendingDeletion } from '../reducers/taskReducer'
import type { NewTaskData, Task, TaskFilter } from '../types/task'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastData {
  id: number
  message: string
  variant: ToastVariant
}

/**
 * Публічний API контексту. Компоненти бачать дані та операції,
 * але нічого не знають ні про reducer, ні про таймери.
 */
export interface TaskContextValue {
  tasks: Task[]
  filter: TaskFilter
  setFilter: Dispatch<SetStateAction<TaskFilter>>

  /** Завдання, яке зараз редагується (null — форма в режимі створення). */
  editingTask: Task | null
  startEditing: (id: number) => void
  cancelEditing: () => void

  addTask: (data: NewTaskData) => void
  updateTask: (id: number, data: NewTaskData) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: () => void
  clearCompleted: () => void
  resetTasks: () => void

  /** Активне Undoable Delete (null — нічого не очікує видалення). */
  pendingDeletion: PendingDeletion | null
  /** Поточне повідомлення Toast (null — нічого показувати). */
  toast: ToastData | null
  dismissToast: () => void
}

export const TaskContext = createContext<TaskContextValue | null>(null)
