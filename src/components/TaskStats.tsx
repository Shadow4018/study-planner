import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

function TaskStats() {
  const { tasks } = useTaskContext()

  // Похідні дані: рахуються під час рендеру, без окремого state та useEffect.
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
    </section>
  )
}

export default TaskStats
