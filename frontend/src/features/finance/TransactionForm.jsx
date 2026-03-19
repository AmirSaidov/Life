import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '@/components/UI/Button'
import DatePicker from '@/components/UI/DatePicker'
import Modal from '@/components/UI/Modal'
import Dropdown from '@/components/UI/Dropdown'
import { useCreateTransaction } from '@/hooks/useFinance'
import { useBudgetCategories } from '@/hooks/useFinance'

const TYPES = [
  { value: 'expense', label: 'Расход' },
  { value: 'income', label: 'Доход' },
  { value: 'transfer', label: 'Перевод' }
]

const initial = {
  title: '',
  amount: '',
  type: 'expense',
  date: new Date().toISOString(),
  note: '',
  budgetCategoryId: ''
}

export default function TransactionForm({ open, onClose }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const create = useCreateTransaction()
  const { data: categories = [] } = useBudgetCategories()

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Введите название'
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = 'Введите сумму'
    if (!form.date) e.date = 'Выберите дату'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    create.mutate(
      {
        ...form,
        title: form.title.trim(),
        amount: parseFloat(form.amount),
        budgetCategoryId: form.budgetCategoryId || null
      },
      {
        onSuccess: () => {
          setForm(initial)
          setErrors({})
          onClose()
        }
      }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Новая транзакция">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set('type', t.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                form.type === t.value
                  ? 'bg-accent/15 text-accent border border-accent/25'
                  : 'bg-white/4 text-muted border border-white/8 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <input
            className="input-field"
            placeholder="Название"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
          {errors.title && <p className="text-danger text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <input
            type="number"
            className="input-field"
            placeholder="Сумма, ₽"
            value={form.amount}
            min="0.01"
            step="0.01"
            onChange={(e) => set('amount', e.target.value)}
          />
          {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <DatePicker value={form.date} onChange={(v) => set('date', v)} placeholder="Дата" />
          {errors.date && <p className="text-danger text-xs mt-1">{errors.date}</p>}
        </div>

        {categories.length > 0 && (
          <Dropdown
            value={form.budgetCategoryId}
            onChange={(v) => set('budgetCategoryId', v)}
            placeholder="Категория (необяз.)"
            options={[
              { value: '', label: 'Категория (необяз.)' },
              ...categories.filter((c) => c.type === form.type).map((c) => ({ value: c.id, label: c.name }))
            ]}
          />
        )}

        <textarea
          className="input-field resize-none h-16 text-sm"
          placeholder="Заметка (необяз.)"
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
        />

        <Button type="submit" className="w-full" loading={create.isPending}>
          Добавить
        </Button>
      </form>
    </Modal>
  )
}
