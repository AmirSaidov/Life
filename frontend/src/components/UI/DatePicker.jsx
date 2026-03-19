import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { Calendar, X } from 'lucide-react'
import 'react-day-picker/dist/style.css'

export default function DatePicker({ value, onChange, placeholder = 'Выбрать дату', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = value ? new Date(value) : undefined
  const label = selected ? format(selected, 'd MMM yyyy', { locale: ru }) : placeholder

  return (
    <div className={`relative ${open ? 'z-[120]' : 'z-10'} ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center gap-2 text-left"
      >
        <Calendar size={15} className="text-muted shrink-0" />
        <span className={selected ? 'text-white' : 'text-muted'}>{label}</span>
        {selected && (
          <X
            size={14}
            className="text-muted hover:text-white ml-auto shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
          />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 mt-2 z-[130] glass-card p-2 shadow-2xl"
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onChange(date ? date.toISOString() : null)
                setOpen(false)
              }}
              locale={ru}
              showOutsideDays
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
