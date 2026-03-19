import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, ChevronDown, ChevronUp, CalendarDays, RepeatIcon } from 'lucide-react'
import Badge from '@/components/UI/Badge'
import { PRIORITY_COLORS, CATEGORY_COLORS } from '@/styles/tokens'
import { formatRelativeDate } from '@/utils/formatters'
import { useToggleTask, useDeleteTask } from '@/hooks/useTasks'
import ConfirmDialog from '@/components/UI/ConfirmDialog'

const PRIORITY_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий', urgent: 'Срочно' }
const PRIORITY_BADGE = { low: 'neutral', medium: 'info', high: 'warning', urgent: 'danger' }

export default function TaskItem({ task }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const toggle = useToggleTask()
  const deleteTask = useDeleteTask()

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-card glass-card-hover"
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className="w-1 self-stretch rounded-full shrink-0 mt-1"
            style={{ backgroundColor: PRIORITY_COLORS[task.priority] || '#8892A4' }}
          />
          <button
            onClick={() => toggle.mutate(task.id)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
              task.done
                ? 'bg-accent border-accent'
                : 'border-white/20 hover:border-accent/50'
            }`}
            aria-label={task.done ? 'Снять отметку' : 'Отметить выполненной'}
          >
            <AnimatePresence>
              {task.done && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={12} className="text-surface" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-medium leading-snug transition-all duration-300 ${
                  task.done ? 'line-through text-muted' : 'text-white'
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                {task.recurring && (
                  <RepeatIcon size={13} className="text-muted" aria-label="Повторяющаяся задача" />
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-muted hover:text-white transition-colors p-0.5"
                  aria-label={expanded ? 'Свернуть' : 'Развернуть'}
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-muted hover:text-danger transition-colors p-0.5"
                  aria-label="Удалить задачу"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={PRIORITY_BADGE[task.priority] || 'neutral'}>
                {PRIORITY_LABELS[task.priority] || task.priority}
              </Badge>
              {task.category && task.category !== 'general' && (
                <Badge variant="neutral">{task.category}</Badge>
              )}
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  <CalendarDays size={11} />
                  {formatRelativeDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && task.description && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted px-4 pb-4 pl-[calc(1rem+0.25rem+1.25rem+0.75rem)]">
                {task.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteTask.mutate(task.id, { onSuccess: () => setConfirmDelete(false) })
        }}
        title="Удалить задачу?"
        message={`«${task.title}» будет удалена без возможности восстановления.`}
        loading={deleteTask.isPending}
      />
    </>
  )
}
