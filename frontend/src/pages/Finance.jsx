import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Plus, AlertTriangle } from 'lucide-react'
import Card from '@/components/UI/Card'
import BudgetBar from '@/features/finance/BudgetBar'
import TransactionItem from '@/features/finance/TransactionItem'
import TransactionForm from '@/features/finance/TransactionForm'
import EmptyState from '@/components/UI/EmptyState'
import Skeleton from '@/components/UI/Skeleton'
import Button from '@/components/UI/Button'
import Dropdown from '@/components/UI/Dropdown'
import { useTransactions, useBudgetCategories } from '@/hooks/useFinance'
import { formatCurrency } from '@/utils/formatters'
import { colors } from '@/styles/tokens'
import { format, getDaysInMonth } from 'date-fns'
import { ru } from 'date-fns/locale'

function buildChartData(transactions, year, month) {
  const days = getDaysInMonth(new Date(year, month - 1))
  const result = []
  for (let d = 1; d <= days; d++) {
    const key = format(new Date(year, month - 1, d), 'yyyy-MM-dd')
    const dayTx = transactions.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === key)
    result.push({
      day: d,
      Расходы: dayTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      Доходы: dayTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    })
  }
  return result
}

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

export default function Finance() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [showForm, setShowForm] = useState(false)

  const { data: transactions = [], isPending, isError, refetch } = useTransactions(year, month)
  const { data: categories = [] } = useBudgetCategories()

  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses
  const chartData = buildChartData(transactions, year, month)

  const catsWithSpent = categories.map((cat) => ({
    ...cat,
    spent: transactions
      .filter((t) => t.budgetCategoryId === cat.id && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)
  }))

  const overBudget = catsWithSpent.filter((c) => c.limit > 0 && c.spent > c.limit * 0.8)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold font-display text-white">Финансы</h1>
          <div className="flex items-center gap-2 mt-1">
            <Dropdown
              className="w-36"
              buttonClassName="py-2"
              value={month}
              onChange={(v) => setMonth(Number(v))}
              options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))}
            />
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-16 text-sm text-muted bg-transparent border-none outline-none"
            />
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus size={15} /> Добавить
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Доходы', value: totalIncome, color: colors.accent },
          { label: 'Расходы', value: totalExpenses, color: colors.danger },
          { label: 'Баланс', value: balance, color: balance >= 0 ? colors.accent : colors.danger }
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-xs text-muted mb-1">{s.label}</p>
            <p className="text-lg font-bold font-display" style={{ color: s.color }}>
              {formatCurrency(s.value)}
            </p>
          </Card>
        ))}
      </div>

      {overBudget.length > 0 && (
        <div className="glass-card border-warning/20 p-4 flex gap-3">
          <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Превышение бюджета</p>
            <p className="text-xs text-muted mt-0.5">
              {overBudget.map((c) => c.name).join(', ')} — расходы приближаются к лимиту
            </p>
          </div>
        </div>
      )}

      <Card>
        <p className="text-sm font-semibold text-white mb-4">Расходы и доходы</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.danger} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.danger} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#8892A4', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#8892A4', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#141720', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#E2E8F0', fontSize: 12 }}
              cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#8892A4' }} />
            <Area type="monotone" dataKey="Расходы" stroke={colors.danger} strokeWidth={2} fill="url(#gradExpense)" dot={false} />
            <Area type="monotone" dataKey="Доходы" stroke={colors.accent} strokeWidth={2} fill="url(#gradIncome)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {catsWithSpent.filter((c) => c.type === 'expense' && c.limit > 0).length > 0 && (
        <Card>
          <p className="text-sm font-semibold text-white mb-4">Категории расходов</p>
          <div className="space-y-4">
            {catsWithSpent.filter((c) => c.type === 'expense' && c.limit > 0).map((cat) => (
              <BudgetBar key={cat.id} category={cat} spent={cat.spent} />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p className="text-sm font-semibold text-white mb-4">Транзакции</p>
        {isPending ? (
          <Skeleton count={4} />
        ) : isError ? (
          <EmptyState type="error" action={refetch} />
        ) : transactions.length === 0 ? (
          <EmptyState title="Транзакций нет" description="Добавьте первую транзакцию" action={() => setShowForm(true)} actionLabel="Добавить" />
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {transactions.map((t) => (
                <TransactionItem key={t.id} transaction={t} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      <TransactionForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}
