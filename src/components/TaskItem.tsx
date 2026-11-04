import { priorityLabels } from '../data/labels'
import type { Task } from '../types/task'

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { id, title, description, category, priority, completed } = task

  const className = completed ? 'task-item task-item--completed' : 'task-item'

  return (
    <li className={className}>
      <div className="task-item__body">
        <h3 className="task-item__title">{title}</h3>
        {description && <p className="task-item__description">{description}</p>}

        <div className="task-item__meta">
          <span className="task-item__badge task-item__badge--category">
            {category}
          </span>
          <span
            className={`task-item__badge task-item__badge--priority-${priority}`}
          >
            {priorityLabels[priority]}
          </span>
          <span
            className={
              completed
                ? 'task-item__status task-item__status--done'
                : 'task-item__status'
            }
          >
            {completed ? '✓ Виконано' : 'У процесі'}
          </span>
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button task-item__button--toggle"
          onClick={() => onToggle(id)}
        >
          {completed ? 'Повернути' : 'Виконано'}
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          onClick={() => onDelete(id)}
          aria-label={`Видалити завдання «${title}»`}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
