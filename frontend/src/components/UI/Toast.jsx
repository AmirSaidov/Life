import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import useUiStore from '@/store/uiStore'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const COLORS = {
  success: 'text-accent border-accent/20',
  error: 'text-danger border-danger/20',
  warning: 'text-warning border-warning/20',
  info: 'text-info border-info/20'
}

function Toast({ id, type = 'info', message }) {
  const removeToast = useUiStore((s) => s.removeToast)
  const Icon = ICONS[type] || Info

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3500)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 glass-card border px-4 py-3 min-w-[260px] max-w-[340px] shadow-lg ${COLORS[type]}`}
    >
      <Icon size={18} className="shrink-0" />
      <p className="text-sm text-white flex-1">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="text-muted hover:text-white transition-colors shrink-0"
        aria-label="Закрыть"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function ToastProvider() {
  const toasts = useUiStore((s) => s.toasts)
  const portal = document.getElementById('portal-root') || document.body

  return ReactDOM.createPortal(
    <div className="fixed bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>,
    portal
  )
}

export function useToast() {
  const addToast = useUiStore((s) => s.addToast)
  return {
    success: (message) => addToast({ type: 'success', message }),
    error: (message) => addToast({ type: 'error', message }),
    warning: (message) => addToast({ type: 'warning', message }),
    info: (message) => addToast({ type: 'info', message })
  }
}
