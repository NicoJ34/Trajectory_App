import Link from 'next/link'
import type { Session, SessionLog } from '@trajectory/shared'

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

const RPE_LABELS: Record<string, string> = {
  easy: 'Facile',
  moderate: 'Modéré',
  hard: 'Intense',
}

interface TodaySessionCardProps {
  sessions: Session[]
  logs: Map<string, SessionLog>
  hasActivePlan: boolean
}

export default function TodaySessionCard({ sessions, logs, hasActivePlan }: TodaySessionCardProps) {
  if (!hasActivePlan) {
    return (
      <div className="rounded-xl border border-border p-6">
        <p className="text-sm text-muted-foreground mb-3">Aucun plan actif.</p>
        <Link
          href="/onboarding"
          className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Créer mon plan →
        </Link>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-border p-6">
        <p className="text-sm font-medium text-muted-foreground">Séance du jour</p>
        <p className="mt-2 text-foreground">Aujourd&apos;hui c&apos;est repos. La récupération fait partie de l&apos;entraînement.</p>
      </div>
    )
  }

  const session = sessions[0]
  const log = logs.get(session.id)

  if (log && !log.isSkipped) {
    const messages = [
      'Bien joué ! Continue comme ça.',
      'Séance dans la boîte. À demain !',
      'Excellent travail. Chaque séance compte.',
    ]
    const msg = messages[new Date().getDate() % messages.length]
    return (
      <div className="rounded-xl border border-border p-6">
        <p className="text-sm font-medium text-muted-foreground">Séance du jour</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-green-500 text-lg">✓</span>
          <span className="font-semibold">{SESSION_LABELS[session.type] ?? session.type}</span>
        </div>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          {log.distanceKm && <span>{log.distanceKm} km</span>}
          {log.durationMin && <span>{log.durationMin} min</span>}
          {log.rpe && <span>{RPE_LABELS[log.rpe]}</span>}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{msg}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border p-6">
      <p className="text-sm font-medium text-muted-foreground">Séance du jour</p>
      <h2 className="text-xl font-semibold mt-1">{SESSION_LABELS[session.type] ?? session.type}</h2>
      <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
        {session.prescribedDistanceKm && <span>{session.prescribedDistanceKm} km</span>}
        {session.prescribedDurationMin && <span>~{session.prescribedDurationMin} min</span>}
        <span className="capitalize">{INTENSITY_LABELS[session.targetIntensity]}</span>
      </div>
      <div className="flex gap-3 mt-4">
        <Link
          href="/logger"
          className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          ✓ Enregistrer la séance
        </Link>
        <Link
          href={`/plan`}
          className="text-sm font-medium px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors"
        >
          › Voir les détails
        </Link>
      </div>
    </div>
  )
}
