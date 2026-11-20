import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import {
  FILTER_STORAGE_KEY,
  TASKS_STORAGE_KEY,
  UNDO_DELAY_MS,
} from '../constants'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { createInitialState, taskReducer } from '../reducers/taskReducer'
import type { NewTaskData, TaskFilter } from '../types/task'
import { isTaskFilter, isTaskList } from '../utils/guards'
import { readStorage, writeStorage } from '../utils/storage'
import { TaskContext } from './TaskContext'
import type { TaskContextValue, ToastData, ToastVariant } from './TaskContext'

interface TaskProviderProps {
  children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, undefined, () =>
    createInitialState(readStorage(TASKS_STORAGE_KEY, initialTasks, isTaskList)),
  )

  const [filter, setFilter] = useLocalStorage<TaskFilter>(
    FILTER_STORAGE_KEY,
    'all',
    isTaskFilter,
  )

  const [editingId, setEditingId] = useState<number | null>(null)
  const [toast, setToast] = useState<ToastData | null>(null)
  const toastSeq = useRef(0)

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      toastSeq.current += 1
      setToast({ id: toastSeq.current, message, variant })
    },
    [],
  )

  const dismissToast = useCallback(() => setToast(null), [])

  // ── Effect 1: таймер Undoable Delete ────────────────────────────────────
  // Таймер — побічний ефект, тому він тут, а не в reducer. Cleanup гарантує,
  // що при Undo, новому видаленні або unmount старий таймер буде скасовано.
  const { pending } = state
  useEffect(() => {
    if (!pending) return

    const { ids } = pending
    const timerId = setTimeout(() => {
      dispatch({ type: 'confirmDelete' })
      setEditingId((current) =>
        current !== null && ids.includes(current) ? null : current,
      )
      showToast(
        ids.length === 1
          ? 'Завдання видалено'
          : `Видалено завдань: ${ids.length}`,
      )
    }, UNDO_DELAY_MS)

    return () => clearTimeout(timerId)
  }, [pending, showToast])

  // ── Effect 2: синхронізація tasks - localStorage ────────────────────────
  useEffect(() => {
    const saved = writeStorage(TASKS_STORAGE_KEY, state.tasks)
    if (!saved) showToast('Не вдалося зберегти дані в браузері', 'error')
  }, [state.tasks, showToast])

  // ── Операції для компонентів ────────────────────────────────────────────
  const addTask = useCallback(
    (data: NewTaskData) => {
      dispatch({ type: 'add', payload: data })
      showToast('Завдання створено')
    },
    [showToast],
  )

  const updateTask = useCallback(
    (id: number, data: NewTaskData) => {
      dispatch({ type: 'update', payload: { id, data } })
      setEditingId(null)
      showToast('Зміни збережено')
    },
    [showToast],
  )

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } })
  }, [])

  const requestDelete = useCallback((id: number) => {
    dispatch({ type: 'requestDelete', payload: { id } })
    setEditingId((current) => (current === id ? null : current))
  }, [])

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' })
    showToast('Видалення скасовано', 'info')
  }, [showToast])

  const clearCompleted = useCallback(() => {
    const hasCompleted = state.tasks.some(
      (task) => task.completed && !state.pending?.ids.includes(task.id),
    )
    if (!hasCompleted) {
      showToast('Немає виконаних завдань для очищення', 'error')
      return
    }
    dispatch({ type: 'clearCompleted' })
  }, [state.tasks, state.pending, showToast])

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' })
    setFilter('all')
    setEditingId(null)
    showToast('Дані скинуто до початкових', 'info')
  }, [setFilter, showToast])

  const startEditing = useCallback((id: number) => setEditingId(id), [])
  const cancelEditing = useCallback(() => setEditingId(null), [])

  // Завдання, яке вже очікує видалення, редагувати не можна.
  const editingTask = useMemo(() => {
    if (editingId === null || state.pending?.ids.includes(editingId)) {
      return null
    }
    return state.tasks.find((task) => task.id === editingId) ?? null
  }, [editingId, state.tasks, state.pending])

  // Значення контексту мемоїзоване: новий об'єкт створюється лише тоді,
  // коли змінилось щось із того, що в ньому лежить.
  const value = useMemo<TaskContextValue>(
    () => ({
      tasks: state.tasks,
      filter,
      setFilter,
      editingTask,
      startEditing,
      cancelEditing,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      pendingDeletion: state.pending,
      toast,
      dismissToast,
    }),
    [
      state.tasks,
      state.pending,
      filter,
      setFilter,
      editingTask,
      startEditing,
      cancelEditing,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      toast,
      dismissToast,
    ],
  )

  return <TaskContext value={value}>{children}</TaskContext>
}
