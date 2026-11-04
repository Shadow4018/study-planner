import { useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskStats from './components/TaskStats'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import { initialTasks } from './data/initialTasks'
import type { NewTaskData, Task, TaskFilter } from './types/task'

function App() {
  // Єдине джерело правди: state живе в найближчому спільному батьку.
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<TaskFilter>('all')

  // Всі оновлення — незмінні (immutable): створюємо новий масив / об'єкт.
  const handleAddTask = (data: NewTaskData) => {
    setTasks((prev) => {
      const nextId = prev.reduce((max, task) => Math.max(max, task.id), 0) + 1
      const newTask: Task = { id: nextId, completed: false, ...data }
      return [...prev, newTask]
    })
  }

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  // Похідні дані обчислюються під час рендеру, окремий state не потрібен.
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  })

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <TaskForm onAddTask={handleAddTask} />
        <TaskStats tasks={tasks} onClearCompleted={handleClearCompleted} />
        <TaskFilters tasks={tasks} activeFilter={filter} onFilterChange={setFilter} />
        <TaskList
          tasks={visibleTasks}
          totalCount={tasks.length}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </main>
    </div>
  )
}

export default App
