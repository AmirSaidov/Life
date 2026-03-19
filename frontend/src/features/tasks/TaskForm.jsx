import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import Button from '@/components/UI/Button'
import DatePicker from '@/components/UI/DatePicker'
import Dropdown from '@/components/UI/Dropdown'
import { useCreateTask } from '@/hooks/useTasks'

const PRIORITIES = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочно' }
]

const CATEGORIES = [
  { value: 'general', label: 'Общее' },
  { value: 'work', label: 'Работа' },
  { value: 'home', label: 'Дом' },
  { value: 'health', label: 'Здоровье' },
  { value: 'finance', label: 'Финансы' },
  { value: 'shopping', label: 'Покупки' },
  { value: 'family', label: 'Семья' }
]

const initial = { title: '', description: '', priority: 'medium', category: 'general', dueDate: null }

export default function TaskForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const create = useCreateTask()

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Введите название задачи'); return }
    setError('')
    create.mutate(
      { ...form, title: form.title.trim() },
      { onSuccess: () => { setForm(initial); setOpen(false) } }
    )
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full glass-card border-dashed border-white/10 p-4 flex items-center gap-2 text-muted hover:text-accent hover:border-accent/30 transition-all duration-200 rounded-2xl"
        >
          <Plus size={18} />
          <span className="text-sm">Добавить задачу</span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card p-4 space-y-3"
            onSubmit={handleSubmit}
          >
            <input
              autoFocus
              className="input-field text-sm"
              placeholder="Название задачи..."
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
            {error && <p className="text-danger text-xs">{error}</p>}
            <textarea
              className="input-field text-sm resize-none h-16"
              placeholder="Описание (необязательно)"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Dropdown value={form.priority} onChange={(v) => set('priority', v)} options={PRIORITIES} />
              <Dropdown value={form.category} onChange={(v) => set('category', v)} options={CATEGORIES} />
            </div>
            <DatePicker
              value={form.dueDate}
              onChange={(v) => set('dueDate', v)}
              placeholder="Срок выполнения"
            />
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" loading={create.isPending} className="flex-1">
                Добавить
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setOpen(false); setForm(initial); setError('') }}
              >
                <X size={16} />
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  )
}
