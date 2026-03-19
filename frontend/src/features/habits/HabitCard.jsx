import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trash2 } from 'lucide-react'
import ProgressRing from '@/components/UI/ProgressRing'
import ConfirmDialog from '@/components/UI/ConfirmDialog'
import { useLogHabit, useUnlogHabit, useDeleteHabit } from '@/hooks/useHabits'
import { format } from 'date-fns'
import confetti from 'canvas-confetti'

function isLoggedToday(logs = []) {
  const today = format(new Date(), 'yyyy-MM-dd')
  return logs.some((l) => format(new Date(l.date), 'yyyy-MM-dd') === today)
}

function getMonthProgress(logs = [], goal = 30) {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthLogs = logs.filter((l) => {
    const d = new Date(l.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  return Math.round((monthLogs.length / daysInMonth) * 100)
}

export default function HabitCard({ habit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const log = useLogHabit()
  const unlog = useUnlogHabit()
  const deleteHabit = useDeleteHabit()
  const logged = isLoggedToday(habit.logs)
  const progress = getMonthProgress(habit.logs, habit.goal)

  const handleToggle = () => {
    if (logged) {
      unlog.mutate(habit.id)
    } else {
      log.mutate(habit.id, {
        onSuccess: () => {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
            colors: [habit.color || '#00D4AA', '#7C3AED', '#F59E0B']
          })
        }
      })
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glass-card-hover p-4 flex flex-col items-center gap-3"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-warning" />
            <span className="text-xs font-semibold text-white">{habit.streak}</span>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-muted hover:text-danger transition-colors p-1"
            aria-label="Удалить привычку"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <ProgressRing
          value={progress}
          max={100}
          size={88}
          strokeWidth={7}
          color={habit.color || '#00D4AA'}
          label={habit.name}
        >
          <span className="text-sm font-bold font-display text-white">{progress}%</span>
        </ProgressRing>

        <p className="text-sm font-semibold text-white text-center leading-tight">{habit.name}</p>

        <button
          onClick={handleToggle}
          disabled={log.isPending || unlog.isPending}
          className={`w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            logged
              ? 'bg-white/5 text-muted hover:bg-danger/10 hover:text-danger'
              : 'bg-accent/15 text-accent hover:bg-accent/25'
          }`}
          style={!logged ? { borderColor: habit.color || '#00D4AA' } : undefined}
        >
          {logged ? 'Снять отметку' : 'Отметить сегодня'}
        </button>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteHabit.mutate(habit.id, { onSuccess: () => setConfirmDelete(false) })}
        title="Удалить привычку?"
        message={`«${habit.name}» и все записи будут удалены.`}
        loading={deleteHabit.isPending}
      />
    </>
  )
}
