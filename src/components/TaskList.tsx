import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

function TaskList() {
  const { tasks, filter } = useTaskContext()

  // Відфільтрований список — derived state: обчислюється під час рендеру.
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'active') return !task.completed
    return true
  })

  if (visibleTasks.length === 0) {
    return tasks.length === 0 ? (
      <div className="task-list task-list--empty">
        <p className="task-list__message">Завдань поки немає.</p>
        <p className="task-list__hint">Додайте перше навчальне завдання.</p>
      </div>
    ) : (
      <div className="task-list task-list--empty">
        <p className="task-list__message">За цим фільтром завдань немає.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
