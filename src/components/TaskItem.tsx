import { priorityLabels } from '../data/labels'
import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types/task'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps) {
  const { editingTask, pendingDeletion, toggleTask, requestDelete, startEditing } =
    useTaskContext()

  const { id, title, description, category, priority, completed } = task

  const isPendingDelete = pendingDeletion?.ids.includes(id) ?? false
  const isEditing = editingTask?.id === id

  const classNames = ['task-item']
  if (completed) classNames.push('task-item--completed')
  if (isPendingDelete) classNames.push('task-item--pending-delete')
  if (isEditing) classNames.push('task-item--editing')

  return (
    <li className={classNames.join(' ')}>
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
          {isPendingDelete ? (
            <span className="task-item__status task-item__status--pending">
              Буде видалено
            </span>
          ) : (
            <span
              className={
                completed
                  ? 'task-item__status task-item__status--done'
                  : 'task-item__status'
              }
            >
              {completed ? '✓ Виконано' : 'У процесі'}
            </span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button task-item__button--toggle"
          onClick={() => toggleTask(id)}
          disabled={isPendingDelete}
        >
          {completed ? 'Повернути' : 'Виконано'}
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--edit"
          onClick={() => startEditing(id)}
          disabled={isPendingDelete}
          aria-label={`Редагувати завдання «${title}»`}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          onClick={() => requestDelete(id)}
          disabled={isPendingDelete}
          aria-label={`Видалити завдання «${title}»`}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
