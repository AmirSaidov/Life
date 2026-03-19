import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, ShoppingBag } from 'lucide-react'
import Badge from '@/components/UI/Badge'
import ConfirmDialog from '@/components/UI/ConfirmDialog'
import { useToggleShoppingItem, useDeleteShoppingItem } from '@/hooks/useShopping'

const CATEGORY_LABELS = {
  dairy: 'Молочное',
  vegetables: 'Овощи',
  fruits: 'Фрукты',
  meat: 'Мясо',
  bakery: 'Выпечка',
  drinks: 'Напитки',
  frozen: 'Заморозка',
  household: 'Хозтовары',
  other: 'Другое'
}

export default function ShoppingItem({ item }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const toggle = useToggleShoppingItem()
  const deleteItem = useDeleteShoppingItem()

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
          item.checked
            ? 'bg-white/2 border-white/5'
            : 'bg-white/4 border-white/8 hover:border-white/12'
        }`}
      >
        <button
          onClick={() => toggle.mutate(item.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
            item.checked ? 'bg-accent border-accent' : 'border-white/20 hover:border-accent/50'
          }`}
          aria-label={item.checked ? 'Снять отметку' : 'Отметить куплено'}
        >
          <AnimatePresence>
            {item.checked && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={12} className="text-surface" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${item.checked ? 'line-through text-muted' : 'text-white'}`}>
            {item.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-muted">
              {item.qty} {item.unit}
            </span>
            {item.category && item.category !== 'other' && (
              <Badge variant="neutral" className="text-[10px]">
                {CATEGORY_LABELS[item.category] || item.category}
              </Badge>
            )}
            {item.store && <span className="text-xs text-muted">{item.store}</span>}
          </div>
        </div>

        {item.price && (
          <span className="text-sm text-white font-medium shrink-0">
            {item.price * item.qty} ₽
          </span>
        )}

        <button
          onClick={() => setConfirmDelete(true)}
          className="text-muted hover:text-danger transition-colors p-1 shrink-0"
          aria-label="Удалить товар"
        >
          <Trash2 size={14} />
        </button>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteItem.mutate(item.id, { onSuccess: () => setConfirmDelete(false) })}
        title="Удалить товар?"
        message={`«${item.name}» будет удалён из списка.`}
        loading={deleteItem.isPending}
      />
    </>
  )
}
