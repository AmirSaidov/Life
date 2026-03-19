import { PackageOpen, AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

const icons = {
  empty: PackageOpen,
  error: AlertTriangle
}

export default function EmptyState({
  type = 'empty',
  title,
  description,
  action,
  actionLabel = 'Повторить'
}) {
  const Icon = icons[type] || PackageOpen
  const defaultTitle = type === 'error' ? 'Что-то пошло не так' : 'Пока ничего нет'
  const defaultDesc =
    type === 'error'
      ? 'Не удалось загрузить данные. Попробуйте ещё раз.'
      : 'Добавьте первый элемент, чтобы начать.'

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          type === 'error' ? 'bg-danger/10' : 'bg-white/5'
        }`}
      >
        <Icon size={28} className={type === 'error' ? 'text-danger' : 'text-muted'} />
      </div>
      <div>
        <p className="text-white font-semibold font-display">{title || defaultTitle}</p>
        <p className="text-muted text-sm mt-1">{description || defaultDesc}</p>
      </div>
      {action && (
        <Button variant={type === 'error' ? 'secondary' : 'primary'} onClick={action} size="sm">
          {type === 'error' && <RefreshCw size={14} />}
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
