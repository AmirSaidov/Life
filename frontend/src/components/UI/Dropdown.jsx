import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const panelClass =
  'absolute top-full mt-2 z-[110] min-w-full rounded-xl border border-white/10 bg-[#141720] shadow-2xl p-2'

export function DropdownMenu({
  trigger,
  children,
  className = '',
  panelClassName = '',
  align = 'left'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const alignClass = align === 'right' ? 'right-0' : 'left-0'

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`${panelClass} ${alignClass} ${panelClassName}`}
          >
            <div onClick={() => setOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Выберите',
  className = '',
  buttonClassName = '',
  panelClassName = '',
  icon: Icon,
  disabled = false
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const selected = useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value]
  )

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={`input-field flex items-center gap-2 text-left py-2.5 px-3 ${buttonClassName}`}
      >
        {Icon && <Icon size={15} className="text-muted shrink-0" />}
        <span className={selected ? 'text-white flex-1' : 'text-muted flex-1'}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className={`${panelClass} ${panelClassName}`}
          >
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {options.map((option) => {
                const active = String(option.value) === String(value)
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                        active
                          ? 'bg-accent/15 text-accent border border-accent/25'
                          : 'text-slate-200 hover:bg-white/6'
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
