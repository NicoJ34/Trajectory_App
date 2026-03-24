import type { Session, SessionLog } from '@trajectory/shared'

interface LastWeekSummaryProps {
  sessions: Session[]
  logs: Map<string, SessionLog>
}

function getEncouragingMessage(done: number, total: number): string {
  if (total === 0) return 'Pas de séances prévues la semaine passée.'
  const ratio = done / total
  if (ratio >= 1) return 'Semaine parfaite ! Tout accompli.'
  if (ratio >= 0.8) return 'Très bonne semaine !'
  if (ratio >= 0.5) return 'Bonne semaine, continue !'
  return 'Chaque séance compte, bravo pour l\'effort !'
}

export default function LastWeekSummary({ sessions, logs }: LastWeekSummaryProps) {
  const total = sessions.length
  const done = sessions.filter((s) => {
    const log = logs.get(s.id)
    return log && !log.isSkipped
  }).length

  return (
    <div className="rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Semaine passée</p>
      <p className="text-3xl font-bold">
        {done} <span className="text-muted-foreground text-xl font-normal">/ {total}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-0.5">séances complétées</p>
      <p className="text-sm mt-3">{getEncouragingMessage(done, total)}</p>
    </div>
  )
}
