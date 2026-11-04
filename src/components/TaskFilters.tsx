import { filterLabels, filterOptions } from '../data/labels'
import type { Task, TaskFilter } from '../types/task'

interface TaskFiltersProps {
  tasks: Task[]
  activeFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

function countByFilter(tasks: Task[], filter: TaskFilter): number {
  if (filter === 'completed') return tasks.filter((task) => task.completed).length
  if (filter === 'active') return tasks.filter((task) => !task.completed).length
  return tasks.length
}

function TaskFilters({ tasks, activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {filterOptions.map((filter) => {
        const isActive = filter === activeFilter
        return (
          <button
            key={filter}
            type="button"
            className={
              isActive
                ? 'task-filters__button task-filters__button--active'
                : 'task-filters__button'
            }
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter)}
          >
            {filterLabels[filter]}
            <span className="task-filters__count">
              {countByFilter(tasks, filter)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TaskFilters
