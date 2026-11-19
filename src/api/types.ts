/**
 * DTO — формат даних, у якому їх віддає DummyJSON.
 * Ці типи використовують тільки api/ та repositories/; UI працює з доменною моделлю Task.
 */
export interface ApiTodo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface TodosResponse {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}
