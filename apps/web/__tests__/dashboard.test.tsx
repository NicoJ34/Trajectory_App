import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TodaySessionCard from '../app/dashboard/components/TodaySessionCard'
import RaceCountdown from '../app/dashboard/components/RaceCountdown'
import LastWeekSummary from '../app/dashboard/components/LastWeekSummary'
import WeekStrip from '../app/dashboard/components/WeekStrip'
import type { Session, SessionLog, Race, Week } from '@trajectory/shared'

// ─── TodaySessionCard ─────────────────────────────────────────────────────────

describe('TodaySessionCard', () => {
  it('affiche CTA onboarding si aucun plan actif', () => {
    render(<TodaySessionCard sessions={[]} logs={new Map()} hasActivePlan={false} />)
    expect(screen.getByText('Créer mon plan →')).toBeTruthy()
  })

  it('affiche repos si aucune session prévue', () => {
    render(<TodaySessionCard sessions={[]} logs={new Map()} hasActivePlan={true} />)
    expect(screen.getByText(/repos/i)).toBeTruthy()
  })

  it('affiche les détails de la séance si prévue', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'easy_run', scheduledDate: '2026-03-24',
      prescribedDistanceKm: 8, prescribedDurationMin: 50,
      targetIntensity: 'easy', isCustom: false,
    }
    render(<TodaySessionCard sessions={[session]} logs={new Map()} hasActivePlan={true} />)
    expect(screen.getByText('Course facile')).toBeTruthy()
    expect(screen.getByText(/8 km/)).toBeTruthy()
  })

  it('affiche résumé si séance logguée', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'easy_run', scheduledDate: '2026-03-24',
      targetIntensity: 'easy', isCustom: false,
    }
    const log: SessionLog = {
      id: 'l1', sessionId: 's1', loggedAt: '2026-03-24T10:00:00Z',
      distanceKm: 8.2, durationMin: 52, rpe: 'easy', isSkipped: false,
    }
    render(<TodaySessionCard sessions={[session]} logs={new Map([['s1', log]])} hasActivePlan={true} />)
    expect(screen.getByText('✓')).toBeTruthy()
    expect(screen.getByText(/8.2 km/)).toBeTruthy()
  })
})

// ─── RaceCountdown ────────────────────────────────────────────────────────────

describe('RaceCountdown', () => {
  it('affiche le nombre de jours et le nom de la course', () => {
    const race: Race = {
      id: 'r1', distance: 'marathon', distanceKm: 42,
      targetDate: '2026-10-01', status: 'active', order: 0,
      createdAt: '2026-01-01T00:00:00Z',
      name: 'Marseille-Cassis',
    }
    render(<RaceCountdown race={race} daysToRace={84} />)
    expect(screen.getByText('84')).toBeTruthy()
    expect(screen.getByText(/Marseille-Cassis/)).toBeTruthy()
  })

  it('affiche "jour" au singulier pour 1 jour', () => {
    const race: Race = {
      id: 'r1', distance: 'half', distanceKm: 21,
      targetDate: '2026-03-25', status: 'active', order: 0,
      createdAt: '2026-01-01T00:00:00Z',
    }
    render(<RaceCountdown race={race} daysToRace={1} />)
    expect(screen.getByText(/jour\s·/)).toBeTruthy()
  })
})

// ─── LastWeekSummary ──────────────────────────────────────────────────────────

describe('LastWeekSummary', () => {
  const makeSession = (id: string): Session => ({
    id, weekId: 'w0', type: 'easy_run', scheduledDate: '2026-03-17',
    targetIntensity: 'easy', isCustom: false,
  })

  it('affiche 0 / 0 si aucune session', () => {
    render(<LastWeekSummary sessions={[]} logs={new Map()} />)
    expect(screen.getAllByText(/0/).length).toBeGreaterThan(0)
  })

  it('affiche le bon ratio de séances complétées', () => {
    const s1 = makeSession('s1')
    const s2 = makeSession('s2')
    const log: SessionLog = {
      id: 'l1', sessionId: 's1', loggedAt: '2026-03-17T10:00:00Z',
      rpe: 'easy', isSkipped: false,
    }
    render(<LastWeekSummary sessions={[s1, s2]} logs={new Map([['s1', log]])} />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText(/\/ 2/)).toBeTruthy()
  })

  it('affiche un message positif quelle que soit la valeur', () => {
    render(<LastWeekSummary sessions={[makeSession('s1')]} logs={new Map()} />)
    const msgs = screen.getAllByText(/effort|bonne|parfaite|chaque|compte/i)
    expect(msgs.length).toBeGreaterThan(0)
  })
})

// ─── WeekStrip ────────────────────────────────────────────────────────────────

describe('WeekStrip', () => {
  const week: Week = {
    id: 'w1', planId: 'p1', weekNumber: 3, phase: 'base',
    startDate: '2026-03-23', totalVolumeKm: 35, adjustmentsMade: false,
  }

  it('affiche 7 cases', () => {
    render(<WeekStrip week={week} sessions={[]} logs={new Map()} />)
    // 7 tirets de repos
    const dashes = screen.getAllByText('─')
    expect(dashes).toHaveLength(7)
  })

  it('affiche le numéro de semaine', () => {
    render(<WeekStrip week={week} sessions={[]} logs={new Map()} />)
    expect(screen.getByText(/Semaine 3/)).toBeTruthy()
  })
})
