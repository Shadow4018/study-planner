import TaskItem from './TaskItem'
import type { Task } from '../types/task'

interface TaskListProps {
  /** Вже відфільтрований список для відображення. */
  tasks: Task[]
  /** Загальна кількість завдань (без урахування фільтра). */
  totalCount: number
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
}

function TaskList({ tasks, totalCount, onToggleTask, onDeleteTask }: TaskListProps) {
  // Умовний рендеринг: два різні повідомлення для порожнього стану.
  if (tasks.length === 0) {
    return totalCount === 0 ? (
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
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
