import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import Button from '@/components/UI/Button'
import { useCreateShoppingItem } from '@/hooks/useShopping'

const CATEGORIES = [
  { value: 'dairy', label: 'Молочное' },
  { value: 'vegetables', label: 'Овощи' },
  { value: 'fruits', label: 'Фрукты' },
  { value: 'meat', label: 'Мясо' },
  { value: 'bakery', label: 'Выпечка' },
  { value: 'drinks', label: 'Напитки' },
  { value: 'household', label: 'Хозтовары' },
  { value: 'other', label: 'Другое' }
]

const initial = { name: '', category: 'other', qty: '1', unit: 'шт', price: '', store: '' }

export default function ShoppingForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const create = useCreateShoppingItem()

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Введите название товара'); return }
    setError('')
    create.mutate(
      { ...form, name: form.name.trim(), price: form.price ? parseFloat(form.price) : undefined },
      { onSuccess: () => { setForm(initial); setOpen(false) } }
    )
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full glass-card border-dashed border-white/10 p-3 flex items-center gap-2 text-muted hover:text-accent hover:border-accent/30 transition-all duration-200 rounded-2xl"
        >
          <Plus size={16} />
          <span className="text-sm">Добавить товар</span>
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
            <input autoFocus className="input-field text-sm" placeholder="Название товара..." value={form.name} onChange={(e) => set('name', e.target.value)} />
            {error && <p className="text-danger text-xs">{error}</p>}
            <div className="grid grid-cols-3 gap-2">
              <input type="number" className="input-field text-sm" placeholder="Кол-во" value={form.qty} min="0.1" step="0.1" onChange={(e) => set('qty', e.target.value)} />
              <input className="input-field text-sm" placeholder="Ед. (шт)" value={form.unit} onChange={(e) => set('unit', e.target.value)} />
              <input type="number" className="input-field text-sm" placeholder="Цена ₽" value={form.price} min="0" onChange={(e) => set('price', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="input-field text-sm" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value} style={{ background: '#141720' }}>{c.label}</option>)}
              </select>
              <input className="input-field text-sm" placeholder="Магазин (необяз.)" value={form.store} onChange={(e) => set('store', e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={create.isPending} className="flex-1">Добавить</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); setForm(initial); setError('') }}><X size={16} /></Button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  )
}
