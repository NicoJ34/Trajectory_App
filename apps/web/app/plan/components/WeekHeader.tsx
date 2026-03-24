import type { Week } from '@trajectory/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PHASE_LABELS: Record<string, string> = {
  base: 'Base',
  build: 'Intensif',
  peak: 'Peak',
  taper: 'Affûtage',
  race_week: 'Semaine de course',
}

function formatDateRange(startDate: string, daysCount = 6): string {
  const start = new Date(startDate + 'T00:00:00Z')
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + daysCount)

  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', timeZone: 'UTC' }
  const startStr = start.toLocaleDateString('fr-FR', opts)
  const endStr = end.toLocaleDateString('fr-FR', opts)
  return `${startStr} – ${endStr}`
}

interface WeekHeaderProps {
  week: Week
  onPrev: () => void
  onNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}

export default function WeekHeader({ week, onPrev, onNext, canGoPrev, canGoNext }: WeekHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Sem. {week.weekNumber - 1}
      </button>

      <div className="text-center">
        <p className="text-sm font-semibold">
          Semaine {week.weekNumber} · {PHASE_LABELS[week.phase] ?? week.phase}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatDateRange(week.startDate)}</p>
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Sem. {week.weekNumber + 1}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
