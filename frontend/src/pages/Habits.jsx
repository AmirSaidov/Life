import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Flame } from 'lucide-react'
import HabitCard from '@/features/habits/HabitCard'
import HabitHeatmap from '@/features/habits/HabitHeatmap'
import EmptyState from '@/components/UI/EmptyState'
import Skeleton from '@/components/UI/Skeleton'
import Button from '@/components/UI/Button'
import Modal from '@/components/UI/Modal'
import Card from '@/components/UI/Card'
import { useHabits, useCreateHabit } from '@/hooks/useHabits'

const COLORS = ['#00D4AA', '#7C3AED', '#F59E0B', '#EF4444', '#06B6D4', '#10B981', '#EC4899']
const initial = { name: '', description: '', color: '#00D4AA', goal: 30 }

function CreateHabitModal({ open, onClose }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const create = useCreateHabit()
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Введите название'); return }
    setError('')
    create.mutate({ ...form, name: form.name.trim() }, {
      onSuccess: () => { setForm(initial); onClose() }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Новая привычка">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input autoFocus className="input-field" placeholder="Название привычки" value={form.name} onChange={(e) => set('name', e.target.value)} />
          {error && <p className="text-danger text-xs mt-1">{error}</p>}
        </div>
        <textarea className="input-field resize-none h-16 text-sm" placeholder="Описание (необяз.)" value={form.description} onChange={(e) => set('description', e.target.value)} />
        <div>
          <p className="text-xs text-muted mb-2">Цвет</p>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('color', c)}
                className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'scale-125 ring-2 ring-white/30' : ''}`}
                style={{ background: c }}
                aria-label={`Цвет ${c}`}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Цель (дней в месяц): {form.goal}</label>
          <input type="range" min={1} max={31} value={form.goal} onChange={(e) => set('goal', parseInt(e.target.value))} className="w-full accent-accent" />
        </div>
        <Button type="submit" className="w-full" loading={create.isPending}>Создать привычку</Button>
      </form>
    </Modal>
  )
}

export default function Habits() {
  const { data: habits = [], isPending, isError, refetch } = useHabits()
  const [showCreate, setShowCreate] = useState(false)

  const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0)
  const totalLogs = habits.reduce((s, h) => s + (h.logs?.length || 0), 0)

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-display text-white">Привычки</h1>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <Plus size={15} /> Добавить
        </Button>
      </div>

      {habits.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
              <Flame size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">{maxStreak}</p>
              <p className="text-xs text-muted">Лучший стрик</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <span className="text-accent font-bold text-lg">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-white">{totalLogs}</p>
              <p className="text-xs text-muted">Всего отметок</p>
            </div>
          </Card>
        </div>
      )}

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card h-52 animate-pulse" />)}
        </div>
      ) : isError ? (
        <EmptyState type="error" action={refetch} />
      ) : habits.length === 0 ? (
        <EmptyState
          title="Нет привычек"
          description="Начните отслеживать свои ежедневные привычки"
          action={() => setShowCreate(true)}
          actionLabel="Добавить первую"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </AnimatePresence>
          </div>

          <Card>
            <p className="text-sm font-semibold text-white mb-4">Активность за месяц</p>
            <HabitHeatmap habits={habits} />
          </Card>
        </>
      )}

      <CreateHabitModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
