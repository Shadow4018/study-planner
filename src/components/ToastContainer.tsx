import { TOAST_DURATION_MS, UNDO_DELAY_MS } from '../constants'
import { useTaskContext } from '../hooks/useTaskContext'
import Toast from './Toast'
import './ToastContainer.scss'

function ToastContainer() {
  const { pendingDeletion, undoDelete, toast, dismissToast } = useTaskContext()

  const pendingCount = pendingDeletion?.ids.length ?? 0

  return (
    <div className="toast-container" aria-live="polite">
      {pendingDeletion && (
        // key=seq: при новому видаленні смужка прогресу стартує заново.
        <Toast
          key={`undo-${pendingDeletion.seq}`}
          variant="info"
          message={
            pendingCount === 1
              ? 'Завдання буде видалено'
              : `Завдань буде видалено: ${pendingCount}`
          }
          progressMs={UNDO_DELAY_MS}
          actionLabel="Скасувати"
          onAction={undoDelete}
        />
      )}

      {toast && (
        <Toast
          key={toast.id}
          variant={toast.variant}
          message={toast.message}
          autoCloseMs={TOAST_DURATION_MS}
          onClose={dismissToast}
        />
      )}
    </div>
  )
}

export default ToastContainer
