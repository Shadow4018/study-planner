import Header from './components/Header'
import TaskActions from './components/TaskActions'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import ToastContainer from './components/ToastContainer'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useTaskContext } from './hooks/useTaskContext'
import './App.scss'

// Весь стан і операції тепер у TaskContext (див. main.tsx → TaskProvider),
// тому App не передає tasks, filter і callback-и дітям через props.
function App() {
  const { tasks, editingTask } = useTaskContext()

  // Effect: заголовок вкладки показує кількість невиконаних завдань.
  const activeCount = tasks.filter((task) => !task.completed).length
  useDocumentTitle(
    `Study Planner — ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`,
  )

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        {/* key перезапускає форму при зміні завдання, що редагується */}
        <TaskForm key={editingTask?.id ?? 'new'} />
        <TaskStats />
        <TaskFilters />
        <TaskList />
        <TaskActions />
      </main>
      <ToastContainer />
    </div>
  )
}

export default App
