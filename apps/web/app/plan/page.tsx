'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { useWeeklyPlan } from '@/hooks/useWeeklyPlan'
import { toISODate } from '@trajectory/shared'
import WeekHeader from './components/WeekHeader'
import SessionRow from './components/SessionRow'
import WeekFooter from './components/WeekFooter'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className ?? ''}`} />
}

export default function PlanPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const { loading, week, sessions, logs, adaptationLogs, canGoPrev, canGoNext } =
    useWeeklyPlan(weekOffset)

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-10" />
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    )
  }

  if (!week) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Mon Plan</h1>
        <p className="text-muted-foreground mb-4">Aucun plan actif.</p>
        <Link
          href="/onboarding"
          className="inline-block bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Créer mon plan →
        </Link>
      </div>
    )
  }

  // Générer les 7 jours de la semaine (Lun → Dim)
  const weekStartDate = new Date(week.startDate + 'T00:00:00Z')
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStartDate)
    d.setUTCDate(d.getUTCDate() + i)
    return toISODate(d)
  })

  const nonRestSessions = sessions.filter((s) => s.type !== 'rest')

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Mon Plan</h1>

      <WeekHeader
        week={week}
        onPrev={() => setWeekOffset((o) => o - 1)}
        onNext={() => setWeekOffset((o) => o + 1)}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />

      {/* Banner adaptation */}
      {week.adjustmentsMade && adaptationLogs.length > 0 && (
        <div className="flex items-start gap-3 p-3 mb-4 rounded-lg border border-border bg-accent/30 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          <div>
            <span className="font-medium">Plan ajusté cette semaine</span>
            {adaptationLogs[0].changesMade && (
              <p className="text-muted-foreground mt-0.5">{adaptationLogs[0].changesMade}</p>
            )}
          </div>
        </div>
      )}

      {/* Grille 7 jours */}
      <div className="space-y-1">
        {days.map((dateStr) => {
          const session = sessions.find((s) => s.scheduledDate === dateStr && s.type !== 'rest') ?? null
          const restOnly = sessions.some((s) => s.scheduledDate === dateStr && s.type === 'rest') && !session
          const log = session ? logs.get(session.id) : undefined

          return (
            <SessionRow
              key={dateStr}
              dateStr={dateStr}
              session={restOnly ? null : session}
              log={log}
            />
          )
        })}
      </div>

      <WeekFooter sessions={nonRestSessions} totalVolumeKm={week.totalVolumeKm} />

      {/* Bouton contrainte (placeholder Sprint 4) */}
      <div className="mt-6">
        <button
          disabled
          className="w-full text-sm border border-border rounded-md py-2.5 text-muted-foreground cursor-not-allowed opacity-60"
        >
          ⚠️ Signaler une contrainte cette semaine
        </button>
        <p className="text-xs text-muted-foreground text-center mt-1">Disponible au Sprint 4</p>
      </div>
    </div>
  )
}
