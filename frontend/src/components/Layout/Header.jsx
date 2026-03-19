import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, User2, Settings, LogOut, X } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import useUiStore from '@/store/uiStore'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { DropdownMenu } from '@/components/UI/Dropdown'
import ConfirmDialog from '@/components/UI/ConfirmDialog'

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
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const searchQuery = useUiStore((s) => s.searchQuery)
  const setSearchQuery = useUiStore((s) => s.setSearchQuery)
  const notifications = useUiStore((s) => s.notifications)
  const markNotificationsRead = useUiStore((s) => s.markNotificationsRead)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const title = PAGE_TITLES[location.pathname] || 'LifeFlow'
  const today = format(new Date(), 'EEEE, d MMMM', { locale: ru })
  const hasNewNotifications = notifications.some((n) => n.isNew)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    navigate('/tasks')
  }

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-white/5 px-4 md:px-6 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold font-display text-white truncate">{title}</h1>
        <p className="text-xs text-muted hidden sm:block capitalize">
          {getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} · {today}
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2 w-72">
        <Search size={15} className="text-muted shrink-0" />
        <input
          className="bg-transparent border-0 outline-none text-sm text-white placeholder:text-muted w-full"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="text-muted hover:text-white transition-colors"
            onClick={() => setSearchQuery('')}
            aria-label="Очистить поиск"
          >
            <X size={14} />
          </button>
        )}
      </form>

      <DropdownMenu
        className="z-[80]"
        align="right"
        trigger={
          <div className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-colors">
            <Bell size={20} />
            {hasNewNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
            )}
          </div>
        }
      >
        <div className="w-72">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-white/8 mb-2">
            <p className="text-sm font-semibold text-white">Уведомления</p>
            <button
              type="button"
              className="text-xs text-accent hover:underline"
              onClick={markNotificationsRead}
            >
              Прочитать все
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted px-2 py-3">Уведомлений пока нет</p>
          ) : (
            <ul className="space-y-1">
              {notifications.slice(0, 8).map((notification) => (
                <li key={notification.id} className="rounded-lg px-2 py-2 bg-white/4">
                  <p className="text-sm text-white">{notification.title}</p>
                  {notification.text && <p className="text-xs text-muted mt-0.5">{notification.text}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DropdownMenu>

      {user && (
        <DropdownMenu
          className="z-[80]"
          align="right"
          trigger={
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-sm font-bold font-display shrink-0 hover:bg-accent/30 transition-colors">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          }
        >
          <div className="w-52 space-y-1">
            <div className="px-2 pb-2 border-b border-white/8 mb-1">
              <p className="text-sm text-white truncate">{user.name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-200 hover:bg-white/6"
            >
              <User2 size={14} />
              Профиль
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-200 hover:bg-white/6"
            >
              <Settings size={14} />
              Настройки
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-danger hover:bg-danger/10"
            >
              <LogOut size={14} />
              Выйти
            </button>
          </div>
        </DropdownMenu>
      )}

      <ConfirmDialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout()
          navigate('/login')
        }}
        title="Подтвердите выход"
        message="Вы действительно хотите выйти из аккаунта?"
        confirmLabel="Выйти"
      />
    </header>
  )
}
