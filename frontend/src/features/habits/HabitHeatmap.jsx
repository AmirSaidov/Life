import { useMemo } from 'react'
import { format, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { ru } from 'date-fns/locale'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getIntensity(count, total) {
  if (count === 0) return 0
  const pct = count / total
  if (pct >= 0.75) return 4
  if (pct >= 0.5) return 3
  if (pct >= 0.25) return 2
  return 1
}

const INTENSITY_STYLES = [
  'bg-white/5',
  'bg-accent/20',
  'bg-accent/40',
  'bg-accent/65',
  'bg-accent'
]

export default function HabitHeatmap({ habits }) {
  const logsByDate = useMemo(() => {
    const map = {}
    habits.forEach((habit) => {
      habit.logs?.forEach((log) => {
        const key = format(new Date(log.date), 'yyyy-MM-dd')
        map[key] = (map[key] || 0) + 1
      })
    })
    return map
  }, [habits])

  const totalHabits = habits.length

  const weeks = useMemo(() => {
    const today = new Date()
    const start = subMonths(startOfMonth(today), 0)
    const end = endOfMonth(today)
    const days = eachDayOfInterval({ start, end })

    const result = []
    let week = []
    const firstDayDow = (new Date(days[0]).getDay() + 6) % 7
    for (let i = 0; i < firstDayDow; i++) week.push(null)

    days.forEach((day) => {
      week.push(day)
      if (week.length === 7) {
        result.push(week)
        week = []
      }
    })
    if (week.length) {
      while (week.length < 7) week.push(null)
      result.push(week)
    }
    return result
  }, [])

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-muted">{d}</div>
        ))}
      </div>
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) return <div key={di} />
              const key = format(day, 'yyyy-MM-dd')
              const count = logsByDate[key] || 0
              const intensity = getIntensity(count, totalHabits)
              const label = `${format(day, 'd MMMM', { locale: ru })}: ${count} из ${totalHabits}`

              return (
                <div
                  key={key}
                  title={label}
                  aria-label={label}
                  className={`aspect-square rounded-sm transition-colors ${INTENSITY_STYLES[intensity]}`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-muted">Меньше</span>
        {INTENSITY_STYLES.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-[10px] text-muted">Больше</span>
      </div>
    </div>
  )
}
