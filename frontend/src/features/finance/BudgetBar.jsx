import { formatCurrency } from '@/utils/formatters'

export default function BudgetBar({ category, spent = 0, currency = 'RUB' }) {
  const pct = category.limit > 0 ? Math.min((spent / category.limit) * 100, 100) : 0
  const isOver = pct >= 100
  const isWarn = pct >= 80

  const barColor = isOver
    ? '#EF4444'
    : isWarn
    ? '#F59E0B'
    : category.color || '#00D4AA'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: category.color || '#00D4AA' }}
          />
          <span className="text-sm text-white">{category.name}</span>
        </div>
        <span className={`text-xs font-medium ${isOver ? 'text-danger' : isWarn ? 'text-warning' : 'text-muted'}`}>
          {formatCurrency(spent, currency)} / {formatCurrency(category.limit, currency)}
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  )
}
