import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import ConfirmDialog from '@/components/UI/ConfirmDialog'
import { useDeleteTransaction } from '@/hooks/useFinance'
import { formatCurrency } from '@/utils/formatters'

export default function TransactionItem({ transaction, currency }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteTransaction = useDeleteTransaction()
  const isIncome = transaction.type === 'income'

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-white/3 hover:bg-white/5 transition-colors group"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-accent/10' : 'bg-danger/10'}`}>
          {isIncome
            ? <ArrowUpCircle size={18} className="text-accent" />
            : <ArrowDownCircle size={18} className="text-danger" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{transaction.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted">
              {format(new Date(transaction.date), 'd MMM', { locale: ru })}
            </span>
            {transaction.budgetCategory && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: `${transaction.budgetCategory.color}15`,
                  color: transaction.budgetCategory.color
                }}
              >
                {transaction.budgetCategory.name}
              </span>
            )}
          </div>
        </div>

        <span className={`text-sm font-semibold shrink-0 ${isIncome ? 'text-accent' : 'text-white'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </span>

        <button
          onClick={() => setConfirmDelete(true)}
          className="text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 p-1"
          aria-label="Удалить транзакцию"
        >
          <Trash2 size={14} />
        </button>
      </motion.div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteTransaction.mutate(transaction.id, { onSuccess: () => setConfirmDelete(false) })}
        title="Удалить транзакцию?"
        message={`«${transaction.title}» будет удалена.`}
        loading={deleteTransaction.isPending}
      />
    </>
  )
}
