import { initialTasks } from '../data/initialTasks'
import type { NewTaskData, Task } from '../types/task'

export interface PendingDeletion {
  ids: number[]
  seq: number
}

export interface TaskState {
  tasks: Task[]
  pending: PendingDeletion | null
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

function removePending(state: TaskState): Task[] {
  if (!state.pending) return state.tasks
  const { ids } = state.pending
  return state.tasks.filter((task) => !ids.includes(task.id))
}

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
      const exhaustive: never = action
      return exhaustive
    }
  }
}
