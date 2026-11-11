import { useState } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import './TaskActions.scss'

/** Масові дії: «Очистити виконані» (з Undo) та «Скинути дані» (з підтвердженням). */
function TaskActions() {
  const { clearCompleted, resetTasks } = useTaskContext()
  // Підтвердження скидання — просто локальний стан UI (без window.confirm/alert).
  const [isConfirmingReset, setIsConfirmingReset] = useState(false)

  const handleReset = () => {
    resetTasks()
    setIsConfirmingReset(false)
  }

  return (
    <div className="task-actions">
      <button
        className="task-actions__button"
        type="button"
        onClick={clearCompleted}
      >
        Очистити виконані
      </button>

      {isConfirmingReset ? (
        <div className="task-actions__confirm">
          <span className="task-actions__question">
            Усі зміни буде втрачено. Скинути?
          </span>
          <button
            className="task-actions__button task-actions__button--danger"
            type="button"
            onClick={handleReset}
          >
            Так, скинути
          </button>
          <button
            className="task-actions__button"
            type="button"
            onClick={() => setIsConfirmingReset(false)}
          >
            Ні
          </button>
        </div>
      ) : (
        <button
          className="task-actions__button task-actions__button--danger"
          type="button"
          onClick={() => setIsConfirmingReset(true)}
        >
          Скинути дані
        </button>
      )}
    </div>
  )
}

export default TaskActions
