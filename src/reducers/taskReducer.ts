import { initialTasks } from '../data/initialTasks'
import type { NewTaskData, Task } from '../types/task'

/**
 * Видалення, яке ще можна скасувати.
 * `seq` збільшується при кожному новому запиті — за ним UI та Effect
 * відрізняють «нове» очікуване видалення від попереднього.
 */
export interface PendingDeletion {
  ids: number[]
  seq: number
}

export interface TaskState {
  tasks: Task[]
  pending: PendingDeletion | null
  /** Лічильник запитів на видалення (потрібен для PendingDeletion.seq). */
  deleteSeq: number
}

export type TaskAction =
  | { type: 'add'; payload: NewTaskData }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; data: NewTaskData } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset' }

export function createInitialState(tasks: Task[] = initialTasks): TaskState {
  return { tasks, pending: null, deleteSeq: 0 }
}

/**
 * Остаточно прибирає з масиву завдання, що очікували видалення.
 * Використовується в confirmDelete і коли починається нове видалення,
 * поки попереднє ще не завершилось.
 */
function removePending(state: TaskState): Task[] {
  if (!state.pending) return state.tasks
  const { ids } = state.pending
  return state.tasks.filter((task) => !ids.includes(task.id))
}

/**
 * Чиста функція: ні таймерів, ні DOM, ні localStorage, ні UI.
 * Така ж пара (state, action) завжди дає той самий результат.
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const nextId = state.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1
      const task: Task = { id: nextId, completed: false, ...action.payload }
      return { ...state, tasks: [...state.tasks, task] }
    }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task,
        ),
      }

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.data }
            : task,
        ),
      }

    case 'requestDelete': {
      const { id } = action.payload
      if (!state.tasks.some((task) => task.id === id)) return state
      if (state.pending?.ids.includes(id)) return state

      // Підтримується одне активне видалення: якщо попереднє ще не завершилось,
      // воно підтверджується одразу, і починається нове.
      const seq = state.deleteSeq + 1
      return {
        tasks: removePending(state),
        pending: { ids: [id], seq },
        deleteSeq: seq,
      }
    }

    case 'clearCompleted': {
      const base = removePending(state)
      const ids = base.filter((task) => task.completed).map((task) => task.id)
      if (ids.length === 0) return state

      const seq = state.deleteSeq + 1
      return { tasks: base, pending: { ids, seq }, deleteSeq: seq }
    }

    case 'confirmDelete':
      if (!state.pending) return state
      return { ...state, tasks: removePending(state), pending: null }

    case 'undoDelete':
      if (!state.pending) return state
      return { ...state, pending: null }

    case 'reset':
      return createInitialState()

    default: {
      // Якщо додати нову дію й забути обробити її, TypeScript підкаже помилку.
      const exhaustive: never = action
      return exhaustive
    }
  }
}
