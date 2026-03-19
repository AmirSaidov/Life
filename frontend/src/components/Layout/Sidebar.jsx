import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CheckSquare,
  ShoppingCart,
  Wallet,
  Zap,
  Settings,
  Waves
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Дашборд', exact: true },
  { to: '/tasks', icon: CheckSquare, label: 'Задачи' },
  { to: '/shopping', icon: ShoppingCart, label: 'Покупки' },
  { to: '/finance', icon: Wallet, label: 'Финансы' },
  { to: '/habits', icon: Zap, label: 'Привычки' }
]

function NavItem({ to, icon: Icon, label, exact, collapsed }) {
  const location = useLocation()
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <NavLink
      to={to}
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden ${
        isActive
          ? 'bg-accent/10 text-accent'
          : 'text-muted hover:text-white hover:bg-white/5'
      }`}
      aria-label={label}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
        />
      )}
      <Icon size={20} className="shrink-0 ml-0.5" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <>
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 h-full z-30 flex-col py-5 px-2 bg-panel/80 backdrop-blur-md border-r border-white/5"
        initial={{ width: 64 }}
        whileHover={{ width: 220 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2.5 px-2 mb-8 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Waves size={16} className="text-accent" />
          </div>
          <motion.span
            className="text-sm font-bold font-display text-white whitespace-nowrap overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            LifeFlow
          </motion.span>
        </div>

        <nav className="flex flex-col gap-1 flex-1" role="navigation" aria-label="Основная навигация">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-white hover:bg-white/5'
            }`
          }
          aria-label="Настройки"
        >
          <Settings size={20} className="shrink-0 ml-0.5" />
        </NavLink>
      </motion.aside>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-panel/90 backdrop-blur-md border-t border-white/5 flex items-center justify-around px-2 h-16 safe-area-pb"
        role="navigation"
        aria-label="Нижняя навигация"
      >
        {navItems.map(({ to, icon: Icon, label, exact }) => {
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-muted'
                }`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-accent' : 'text-muted'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
