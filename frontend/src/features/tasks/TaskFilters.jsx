const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'today', label: 'Сегодня' },
  { value: 'urgent', label: 'Срочные' },
  { value: 'done', label: 'Завершённые' }
]

export default function TaskFilters({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Фильтры задач">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          role="tab"
          aria-selected={value === f.value}
          onClick={() => onChange(f.value)}
          className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            value === f.value
              ? 'bg-accent/15 text-accent border border-accent/25'
              : 'text-muted hover:text-white bg-white/4 border border-transparent'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
