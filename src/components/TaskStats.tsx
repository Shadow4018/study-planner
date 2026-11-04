import type { Task } from '../types/task'

interface TaskStatsProps {
  tasks: Task[]
  onClearCompleted: () => void
}

function TaskStats({ tasks, onClearCompleted }: TaskStatsProps) {
  // Лічильники виводяться з поточного масиву — окремий state не потрібен.
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const active = total - completed

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <dl className="task-stats__list">
        <div className="task-stats__item">
          <dt className="task-stats__label">Всього</dt>
          <dd className="task-stats__value">{total}</dd>
        </div>
        <div className="task-stats__item task-stats__item--completed">
          <dt className="task-stats__label">Виконано</dt>
          <dd className="task-stats__value">{completed}</dd>
        </div>
        <div className="task-stats__item task-stats__item--active">
          <dt className="task-stats__label">Не виконано</dt>
          <dd className="task-stats__value">{active}</dd>
        </div>
      </dl>

      {completed > 0 && (
        <button
          className="task-stats__clear"
          type="button"
          onClick={onClearCompleted}
        >
          Очистити виконані
        </button>
      )}
    </section>
  )
}

export default TaskStats
