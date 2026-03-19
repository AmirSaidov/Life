import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckSquare, Zap, Wallet, ShoppingCart, ArrowRight, CheckCheck, CalendarDays } from 'lucide-react'
import Card from '@/components/UI/Card'
import { SkeletonCard } from '@/components/UI/Skeleton'
import { useTasks } from '@/hooks/useTasks'
import { useHabits } from '@/hooks/useHabits'
import { useTransactions, useBudgetCategories } from '@/hooks/useFinance'
import { useShoppingItems } from '@/hooks/useShopping'
import { formatCurrency, formatRelativeDate } from '@/utils/formatters'
import { format } from 'date-fns'

const now = new Date()
const MONTH = now.getMonth() + 1
const YEAR = now.getFullYear()

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -2 }}
        className="glass-card glass-card-hover p-5 flex flex-col gap-3 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <ArrowRight size={14} className="text-muted" />
        </div>
        <div>
          <p className="text-2xl font-bold font-display text-white">{value}</p>
          <p className="text-sm text-muted mt-0.5">{label}</p>
          {sub && <p className="text-xs mt-1" style={{ color }}>{sub}</p>}
        </div>
      </motion.div>
    </Link>
  )
}

export default function Dashboard() {
  const { data: allTasks = [], isPending: tasksPending } = useTasks('today')
  const { data: habits = [], isPending: habitsPending } = useHabits()
  const { data: transactions = [], isPending: transPending } = useTransactions(YEAR, MONTH)
  const { data: budgetCats = [] } = useBudgetCategories()
  const { data: shopping = [] } = useShoppingItems()

  const today = format(now, 'yyyy-MM-dd')
  const loggedToday = habits.filter((h) => h.logs?.some((l) => format(new Date(l.date), 'yyyy-MM-dd') === today))
  const doneTasks = allTasks.filter((t) => t.done)
  const uncheckedShopping = shopping.filter((s) => !s.checked)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const budgetPct = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20 animate-blob" style={{ background: '#00D4AA', filter: 'blur(60px)' }} aria-hidden="true" />
        <div className="absolute -top-10 right-10 w-48 h-48 rounded-full opacity-15 animate-blob" style={{ background: '#7C3AED', filter: 'blur(60px)', animationDelay: '4s' }} aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tasksPending ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={CheckSquare}
              label="Задач сегодня"
              value={`${doneTasks.length}/${allTasks.length}`}
              sub={allTasks.length > 0 ? `${Math.round((doneTasks.length / allTasks.length) * 100)}% выполнено` : null}
              color="#00D4AA"
              to="/tasks"
            />
            <StatCard
              icon={Zap}
              label="Привычки"
              value={`${loggedToday.length}/${habits.length}`}
              sub={habits.length > 0 ? `${Math.round((loggedToday.length / habits.length) * 100)}% выполнено` : null}
              color="#7C3AED"
              to="/habits"
            />
            <StatCard
              icon={Wallet}
              label="Расходы / доходы"
              value={`${budgetPct}%`}
              sub={`${formatCurrency(totalExpenses)} / ${formatCurrency(totalIncome)}`}
              color={budgetPct > 80 ? '#EF4444' : '#F59E0B'}
              to="/finance"
            />
            <StatCard
              icon={ShoppingCart}
              label="В списке покупок"
              value={uncheckedShopping.length}
              sub={uncheckedShopping.length > 0 ? 'товаров к покупке' : 'Всё куплено!'}
              color="#06B6D4"
              to="/shopping"
            />
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display text-white">Задачи на сегодня</h2>
            <Link to="/tasks" className="text-xs text-accent hover:underline">Все задачи</Link>
          </div>
          {tasksPending ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : allTasks.length === 0 ? (
            <p className="text-muted text-sm py-6 text-center">На сегодня задач нет</p>
          ) : (
            <ul className="space-y-2">
              {allTasks.slice(0, 6).map((task) => (
                <li key={task.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 ${task.done ? 'bg-accent border-accent' : 'border-white/20'}`}>
                    {task.done && <CheckCheck size={10} className="text-surface" />}
                  </div>
                  <span className={`text-sm flex-1 truncate ${task.done ? 'line-through text-muted' : 'text-white'}`}>{task.title}</span>
                  {task.dueDate && <span className="text-xs text-muted shrink-0">{formatRelativeDate(task.dueDate)}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display text-white">Последние транзакции</h2>
            <Link to="/finance" className="text-xs text-accent hover:underline">Все</Link>
          </div>
          {transPending ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : recentTransactions.length === 0 ? (
            <p className="text-muted text-sm py-6 text-center">Транзакций нет</p>
          ) : (
            <ul className="space-y-2">
              {recentTransactions.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${t.type === 'income' ? 'bg-accent/15 text-accent' : 'bg-danger/15 text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}
                  </div>
                  <span className="text-sm text-white flex-1 truncate">{t.title}</span>
                  <span className={`text-sm font-medium shrink-0 ${t.type === 'income' ? 'text-accent' : 'text-white'}`}>
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
