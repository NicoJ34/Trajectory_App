import type { Race } from '@trajectory/shared'

interface RaceCountdownProps {
  race: Race
  daysToRace: number
}

export default function RaceCountdown({ race, daysToRace }: RaceCountdownProps) {
  const raceName = race.name ?? 'Ma course'

  const targetDate = new Date(race.targetDate)
  const createdAt = new Date(race.createdAt)
  const totalDays = Math.ceil(
    (targetDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )
  const elapsed = Math.max(0, totalDays - daysToRace)
  const progress = totalDays > 0 ? Math.min(100, Math.round((elapsed / totalDays) * 100)) : 0

  return (
    <div className="rounded-xl border border-border p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Compte à rebours</p>
      <p className="text-3xl font-bold">{daysToRace}</p>
      <p className="text-sm text-muted-foreground mt-0.5">
        {daysToRace === 1 ? 'jour' : 'jours'} · {raceName}
      </p>
      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{progress}% du plan effectué</p>
    </div>
  )
}
