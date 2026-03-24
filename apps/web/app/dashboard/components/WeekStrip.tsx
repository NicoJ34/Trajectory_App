import type { Week, Session, SessionLog } from '@trajectory/shared'
import { toISODate } from '@trajectory/shared'

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
// Index 0=Lun, 1=Mar, ..., 6=Dim (ISO week: Monday first)
// UTC day: 0=Sun, 1=Mon, ..., 6=Sat → ISO index = (utcDay + 6) % 7

interface WeekStripProps {
  week: Week
  sessions: Session[]
  logs: Map<string, SessionLog>
}

type DayStatus = 'rest' | 'planned' | 'done' | 'missed'

function getDayStatus(
  isoIndex: number,
  weekStartDate: Date,
  allSessions: Session[],
  logs: Map<string, SessionLog>,
  today: Date
): DayStatus {
  const dayDate = new Date(weekStartDate)
  dayDate.setUTCDate(dayDate.getUTCDate() + isoIndex)
  const dayStr = toISODate(dayDate)
  const todayStr = toISODate(today)

  const daySessions = allSessions.filter(
    (s) => s.scheduledDate === dayStr && s.type !== 'rest'
  )

  if (daySessions.length === 0) return 'rest'

  const anyLogged = daySessions.some((s) => {
    const log = logs.get(s.id)
    return log && !log.isSkipped
  })
  if (anyLogged) return 'done'

  if (dayStr < todayStr) return 'missed'
  return 'planned'
}

export default function WeekStrip({ week, sessions, logs }: WeekStripProps) {
  const today = new Date()
  const todayStr = toISODate(today)
  const weekStart = new Date(week.startDate + 'T00:00:00Z')

  return (
    <div className="rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
        Semaine {week.weekNumber} — aperçu
      </p>
      <div className="flex justify-between">
        {DAY_LABELS.map((label, isoIndex) => {
          const dayDate = new Date(weekStart)
          dayDate.setUTCDate(dayDate.getUTCDate() + isoIndex)
          const dayStr = toISODate(dayDate)
          const isToday = dayStr === todayStr
          const status = getDayStatus(isoIndex, weekStart, sessions, logs, today)

          return (
            <div key={isoIndex} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium',
                  isToday ? 'ring-2 ring-primary' : '',
                  status === 'done' ? 'bg-primary text-primary-foreground' : '',
                  status === 'planned' ? 'border border-border text-foreground' : '',
                  status === 'missed' ? 'bg-muted text-muted-foreground' : '',
                  status === 'rest' ? 'text-muted-foreground' : '',
                ].join(' ')}
              >
                {status === 'done' ? '●' : status === 'rest' ? '─' : '○'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
