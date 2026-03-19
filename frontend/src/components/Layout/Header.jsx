import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const PAGE_TITLES = {
  '/': 'Дашборд',
  '/tasks': 'Задачи',
  '/shopping': 'Покупки',
  '/finance': 'Финансы',
  '/habits': 'Привычки',
  '/settings': 'Настройки'
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
}

export default function Header() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const title = PAGE_TITLES[location.pathname] || 'LifeFlow'
  const today = format(new Date(), 'EEEE, d MMMM', { locale: ru })

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-white/5 px-4 md:px-6 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold font-display text-white truncate">{title}</h1>
        <p className="text-xs text-muted hidden sm:block capitalize">
          {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} · {today}
        </p>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2 w-56">
        <Search size={15} className="text-muted shrink-0" />
        <span className="text-muted text-sm">Поиск...</span>
      </div>

      <button
        className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Уведомления"
      >
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
      </button>

      {user && (
        <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-sm font-bold font-display shrink-0">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </header>
  )
}
