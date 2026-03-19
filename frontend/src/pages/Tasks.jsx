import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TaskItem from '@/features/tasks/TaskItem'
import TaskForm from '@/features/tasks/TaskForm'
import TaskFilters from '@/features/tasks/TaskFilters'
import EmptyState from '@/components/UI/EmptyState'
import Skeleton from '@/components/UI/Skeleton'
import { useTasks } from '@/hooks/useTasks'
import useUiStore from '@/store/uiStore'

export default function Tasks() {
  const [filter, setFilter] = useState('all')
  const searchQuery = useUiStore((s) => s.searchQuery)
  const { data: tasks = [], isPending, isError, refetch } = useTasks(filter)
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredTasks = normalizedQuery
    ? tasks.filter(
        (task) =>
          task.title?.toLowerCase().includes(normalizedQuery) ||
          task.description?.toLowerCase().includes(normalizedQuery) ||
          task.category?.toLowerCase().includes(normalizedQuery)
      )
    : tasks

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-display text-white">Задачи</h1>
        <span className="text-sm text-muted">{filteredTasks.length} задач</span>
      </div>

      <TaskFilters value={filter} onChange={setFilter} />
      <TaskForm />

      {isPending ? (
        <Skeleton count={4} />
      ) : isError ? (
        <EmptyState type="error" action={refetch} actionLabel="Повторить" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="Задач нет"
          description={
            normalizedQuery
              ? 'По вашему запросу задачи не найдены'
              : filter === 'done'
              ? 'Нет завершённых задач'
              : filter === 'today'
              ? 'На сегодня задач нет. Отличный день!'
              : 'Добавьте первую задачу выше'
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
