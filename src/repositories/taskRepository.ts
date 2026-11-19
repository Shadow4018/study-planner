import { httpClient } from '../api/httpClient'
import type { ApiTodo, TodosResponse } from '../api/types'
import type { NewTaskData, Task } from '../types/task'

/**
 * Repository для Task: єдине місце, яке знає endpoint-и DummyJSON та формат DTO.
 * UI отримує й віддає лише доменну модель Task.
 */

const TODOS = '/todos'
const DEFAULT_USER_ID = 1

export interface TaskPage {
  tasks: Task[]
  total: number
  skip: number
  limit: number
}

export interface TaskPatch {
  title?: string
  completed?: boolean
}

interface GetAllParams {
  limit: number
  skip: number
  signal?: AbortSignal
}

// ── Mapping DTO ↔ domain ──────────────────────────────────────────────────

/**
 * DummyJSON не зберігає description, priority і category — вони лишаються
 * client-only metadata зі значеннями за замовчуванням (поля API не вигадуємо).
 */
function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
  }
}

function toApiPatch(patch: TaskPatch): Partial<Pick<ApiTodo, 'todo' | 'completed'>> {
  const body: Partial<Pick<ApiTodo, 'todo' | 'completed'>> = {}
  if (patch.title !== undefined) body.todo = patch.title
  if (patch.completed !== undefined) body.completed = patch.completed
  return body
}

// ── Завдання, створені в цій сесії ────────────────────────────────────────
//
// DummyJSON лише СИМУЛЮЄ створення: POST /todos/add завжди повертає той самий
// id (255), а запису на сервері не з'являється — тому GET/PATCH/DELETE за цим
// id повертають 404. Щоб створені завдання мали унікальні id і з ними можна
// було працювати (відкрити деталі, відмітити, перейменувати, видалити),
// repository видає їм клієнтські id та тримає їх у пам'яті. Для реального
// API цей блок не потрібен: його замінила б відповідь сервера.

const LOCAL_ID_START = 1_000_000
let nextLocalId = LOCAL_ID_START
const localTasks = new Map<number, Task>()

function isLocalId(id: number): boolean {
  return localTasks.has(id)
}

// ── Публічний API repository ──────────────────────────────────────────────

export const taskRepository = {
  /** Одна сторінка завдань (limit/skip). */
  async getAll({ limit, skip, signal }: GetAllParams): Promise<TaskPage> {
    const data = await httpClient.get<TodosResponse>(TODOS, {
      query: { limit, skip },
      signal,
    })
    return {
      tasks: data.todos.map(toTask),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    }
  },

  /** Актуальні дані одного завдання. */
  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const local = localTasks.get(id)
    if (local) return local

    return toTask(await httpClient.get<ApiTodo>(`${TODOS}/${id}`, { signal }))
  },

  async create(data: NewTaskData): Promise<Task> {
    // API отримує лише ті поля, які воно підтримує.
    const created = await httpClient.post<ApiTodo>(`${TODOS}/add`, {
      todo: data.title,
      completed: false,
      userId: DEFAULT_USER_ID,
    })

    const task: Task = {
      ...toTask(created),
      id: nextLocalId++, // див. коментар вище про id 255
      description: data.description,
      category: data.category,
      priority: data.priority,
    }
    localTasks.set(task.id, task)
    return task
  },

  async update(id: number, patch: TaskPatch): Promise<Task> {
    const local = localTasks.get(id)
    if (local) {
      const next = { ...local, ...patch }
      localTasks.set(id, next)
      return next
    }

    return toTask(
      await httpClient.patch<ApiTodo>(`${TODOS}/${id}`, toApiPatch(patch)),
    )
  },

  async delete(id: number): Promise<void> {
    if (isLocalId(id)) {
      localTasks.delete(id)
      return
    }

    await httpClient.delete(`${TODOS}/${id}`)
  },
}
