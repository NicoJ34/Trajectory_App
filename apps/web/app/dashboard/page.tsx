'use client'

import { useDashboardData } from '@/hooks/useDashboardData'
import TodaySessionCard from './components/TodaySessionCard'
import RaceCountdown from './components/RaceCountdown'
import LastWeekSummary from './components/LastWeekSummary'
import WeekStrip from './components/WeekStrip'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-xl ${className ?? ''}`} />
}

export default function DashboardPage() {
  const {
    loading,
    profile,
    activeRace,
    plan,
    currentWeek,
    todaySessions,
    todayLogs,
    currentWeekSessions,
    currentWeekLogs,
    lastWeekSessions,
    lastWeekLogs,
    daysToRace,
  } = useDashboardData()

  const today = new Date()
  const dateLabel = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-36" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-24" />
      </div>
    )
  }

  const greeting = profile?.name ? `Bonjour, ${profile.name} 👋` : 'Bonjour 👋'

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{greeting}</h1>
        <p className="text-sm text-muted-foreground capitalize">{dateLabel}</p>
      </div>

      <TodaySessionCard
        sessions={todaySessions}
        logs={todayLogs}
        hasActivePlan={!!plan}
      />

      {activeRace && daysToRace !== null && daysToRace > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <RaceCountdown race={activeRace} daysToRace={daysToRace} />
          <LastWeekSummary sessions={lastWeekSessions} logs={lastWeekLogs} />
        </div>
      )}

      {currentWeek && (
        <WeekStrip
          week={currentWeek}
          sessions={currentWeekSessions}
          logs={currentWeekLogs}
        />
      )}
    </div>
  )
}
