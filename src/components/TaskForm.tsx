import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { priorityLabels, priorityOptions } from '../data/labels'
import { useTaskContext } from '../hooks/useTaskContext'
import type { Priority } from '../types/task'
import './TaskForm.scss'

const DEFAULT_CATEGORY = 'Загальне'

/**
 * Одна форма для двох режимів: створення і редагування.
 * Режим визначається за `editingTask` з контексту. Початкові значення полів
 * беруться з цього завдання; щоб форма «перезавантажувалась» при зміні
 * завдання, App ставить їй key={editingTask?.id}.
 */
function TaskForm() {
  const { addTask, updateTask, editingTask, cancelEditing } = useTaskContext()
  const isEditing = editingTask !== null

  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [description, setDescription] = useState(editingTask?.description ?? '')
  const [category, setCategory] = useState(editingTask?.category ?? '')
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority ?? 'medium',
  )
  const [error, setError] = useState('')

  const titleRef = useRef<HTMLInputElement>(null)

  // При вході в режим редагування переносимо фокус у форму (і прокручуємо до неї).
  useEffect(() => {
    if (isEditing) titleRef.current?.focus()
  }, [isEditing])

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    if (error) setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (trimmedTitle === '') {
      setError('Вкажіть назву завдання.')
      return
    }

    const data = {
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || DEFAULT_CATEGORY,
      priority,
    }

    if (editingTask) {
      // Зміна проходить через dispatch → reducer, а не мутує об'єкт напряму.
      updateTask(editingTask.id, data)
      return
    }

    addTask(data)

    // Очищення форми після успішного додавання.
    setTitle('')
    setDescription('')
    setCategory('')
    setPriority('medium')
    setError('')
  }

  return (
    <form
      className={isEditing ? 'task-form task-form--editing' : 'task-form'}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="task-form__title">
        {isEditing ? 'Редагування завдання' : 'Нове завдання'}
      </h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          Назва *
        </label>
        <input
          id="task-title"
          ref={titleRef}
          className={
            error
              ? 'task-form__input task-form__input--invalid'
              : 'task-form__input'
          }
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Наприклад, Вивчити useReducer"
          aria-invalid={error !== ''}
          aria-describedby={error ? 'task-title-error' : undefined}
        />
        {error && (
          <p className="task-form__error" id="task-title-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-description">
          Опис
        </label>
        <textarea
          id="task-description"
          className="task-form__input task-form__input--textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Короткий опис завдання"
          rows={2}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            className="task-form__input"
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder={DEFAULT_CATEGORY}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            className="task-form__input"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {priorityLabels[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit">
          {isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {isEditing && (
          <button
            className="task-form__cancel"
            type="button"
            onClick={cancelEditing}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
