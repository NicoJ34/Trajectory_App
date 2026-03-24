import Link from 'next/link'
import { Footprints, Zap, Dumbbell, Waves, Bike } from 'lucide-react'
import type { Session, SessionLog } from '@trajectory/shared'
import { toISODate } from '@trajectory/shared'

const SESSION_LABELS: Record<string, string> = {
  easy_run: 'Course facile',
  tempo_run: 'Tempo',
  long_run: 'Longue sortie',
  strength: 'Renforcement',
  swim: 'Natation',
  bike: 'Vélo',
  hike: 'Marche',
  rest: 'Repos',
  custom: 'Séance libre',
}

const INTENSITY_LABELS: Record<string, string> = {
  easy: 'Facile',
  moderate: 'Modéré',
  hard: 'Intense',
}

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function SessionIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4 shrink-0'
  if (type === 'easy_run' || type === 'long_run') return <Footprints className={cls} />
  if (type === 'tempo_run') return <Zap className={cls} />
  if (type === 'strength') return <Dumbbell className={cls} />
  if (type === 'swim') return <Waves className={cls} />
  if (type === 'bike') return <Bike className={cls} />
  return null
}

type SessionStatus = 'rest' | 'planned' | 'done' | 'missed' | 'skipped'

function getStatus(session: Session | null, log: SessionLog | undefined, dateStr: string): SessionStatus {
  if (!session || session.type === 'rest') return 'rest'
  if (!log) {
    const today = toISODate(new Date())
    return dateStr < today ? 'missed' : 'planned'
  }
  if (log.isSkipped) return 'skipped'
  return 'done'
}

const STATUS_BADGE: Record<SessionStatus, { label: string; className: string }> = {
  rest: { label: '─', className: 'text-muted-foreground' },
  planned: { label: '○ Prévu', className: 'text-muted-foreground' },
  done: { label: '✓ Fait', className: 'text-green-500' },
  missed: { label: '– Manqué', className: 'text-muted-foreground/50' },
  skipped: { label: '→ Passé', className: 'text-muted-foreground' },
}

interface SessionRowProps {
  dateStr: string
  session: Session | null
  log: SessionLog | undefined
}

export default function SessionRow({ dateStr, session, log }: SessionRowProps) {
  const date = new Date(dateStr + 'T00:00:00Z')
  const dayLabel = DAY_LABELS[date.getUTCDay()]
  const dayNum = date.getUTCDate()
  const todayStr = toISODate(new Date())
  const isToday = dateStr === todayStr

  const status = getStatus(session, log, dateStr)
  const badge = STATUS_BADGE[status]

  const isRest = status === 'rest'

  const rowContent = (
    <div
      className={[
        'flex items-center gap-4 px-4 py-3 rounded-lg transition-colors',
        isToday ? 'bg-accent/50' : '',
        !isRest && status !== 'done' ? 'hover:bg-accent/30 cursor-pointer' : '',
        status === 'missed' ? 'opacity-50' : '',
      ].join(' ')}
    >
      {/* Jour */}
      <div className={`w-12 shrink-0 ${isToday ? 'font-semibold' : 'text-muted-foreground'}`}>
        <span className="text-xs">{dayLabel}</span>
        <span className="text-sm ml-1">{dayNum}</span>
      </div>

      {/* Séance */}
      <div className="flex-1 flex items-center gap-2">
        {!isRest && session && <SessionIcon type={session.type} />}
        <div>
          {isRest || !session ? (
            <span className="text-sm text-muted-foreground">Repos</span>
          ) : (
            <>
              <span className="text-sm font-medium">{SESSION_LABELS[session.type] ?? session.type}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {session.prescribedDistanceKm && `${session.prescribedDistanceKm} km`}
                {session.prescribedDurationMin && ` · ${session.prescribedDurationMin} min`}
                {` · ${INTENSITY_LABELS[session.targetIntensity] ?? session.targetIntensity}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Statut */}
      <span className={`text-xs shrink-0 ${badge.className}`}>{badge.label}</span>
    </div>
  )

  if (!isRest && status !== 'done') {
    return <Link href="/logger">{rowContent}</Link>
  }

  return rowContent
}
