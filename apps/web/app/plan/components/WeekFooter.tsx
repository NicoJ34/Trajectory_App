import type { Session } from '@trajectory/shared'

interface WeekFooterProps {
  sessions: Session[]
  totalVolumeKm: number
}

function formatDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60)
  const m = Math.round(totalMin % 60)
  if (h === 0) return `${m} min`
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

export default function WeekFooter({ sessions, totalVolumeKm }: WeekFooterProps) {
  const totalMin = sessions.reduce((sum, s) => {
    return sum + (s.prescribedDurationMin ?? 0)
  }, 0)

  return (
    <div className="flex items-center justify-between px-4 py-3 mt-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
      <span>
        Volume : <strong className="text-foreground">{totalVolumeKm} km</strong>
      </span>
      {totalMin > 0 && (
        <span>
          Durée estimée : <strong className="text-foreground">{formatDuration(totalMin)}</strong>
        </span>
      )}
    </div>
  )
}
