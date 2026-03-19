import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
import useAuthStore from '@/store/authStore'

export function formatCurrency(amount, currency) {
  const resolvedCurrency = currency || useAuthStore.getState().user?.currency || 'RUB'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: resolvedCurrency,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatRelativeDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isToday(date)) return 'Сегодня'
  if (isTomorrow(date)) return 'Завтра'
  if (isPast(date)) return `Просрочено: ${format(date, 'd MMM', { locale: ru })}`
  return format(date, 'd MMM', { locale: ru })
}

export function formatDate(dateString, fmt = 'd MMM yyyy') {
  if (!dateString) return ''
  return format(new Date(dateString), fmt, { locale: ru })
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || 'other'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {})
}
