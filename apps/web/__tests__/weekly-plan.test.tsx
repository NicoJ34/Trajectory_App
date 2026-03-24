import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SessionRow from '../app/plan/components/SessionRow'
import WeekHeader from '../app/plan/components/WeekHeader'
import WeekFooter from '../app/plan/components/WeekFooter'
import type { Session, SessionLog, Week } from '@trajectory/shared'

// ─── SessionRow ───────────────────────────────────────────────────────────────

describe('SessionRow', () => {
  it('affiche Repos si session null', () => {
    render(<SessionRow dateStr="2026-03-25" session={null} log={undefined} />)
    expect(screen.getByText('Repos')).toBeTruthy()
  })

  it('affiche le type et la distance si session prévue', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'tempo_run', scheduledDate: '2026-04-01',
      prescribedDistanceKm: 7, targetIntensity: 'moderate', isCustom: false,
    }
    render(<SessionRow dateStr="2026-04-01" session={session} log={undefined} />)
    expect(screen.getByText('Tempo')).toBeTruthy()
    expect(screen.getByText(/7 km/)).toBeTruthy()
  })

  it('affiche ✓ Fait si séance logguée', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'easy_run', scheduledDate: '2026-03-24',
      targetIntensity: 'easy', isCustom: false,
    }
    const log: SessionLog = {
      id: 'l1', sessionId: 's1', loggedAt: '2026-03-24T10:00:00Z',
      rpe: 'easy', isSkipped: false,
    }
    render(<SessionRow dateStr="2026-03-24" session={session} log={log} />)
    expect(screen.getByText('✓ Fait')).toBeTruthy()
  })

  it('affiche – Manqué pour une séance passée sans log', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'easy_run', scheduledDate: '2020-01-01',
      targetIntensity: 'easy', isCustom: false,
    }
    render(<SessionRow dateStr="2020-01-01" session={session} log={undefined} />)
    expect(screen.getByText('– Manqué')).toBeTruthy()
  })

  it('affiche ○ Prévu pour une séance future sans log', () => {
    const session: Session = {
      id: 's1', weekId: 'w1', type: 'long_run', scheduledDate: '2099-12-31',
      targetIntensity: 'easy', isCustom: false,
    }
    render(<SessionRow dateStr="2099-12-31" session={session} log={undefined} />)
    expect(screen.getByText('○ Prévu')).toBeTruthy()
  })
})

// ─── WeekHeader ───────────────────────────────────────────────────────────────

describe('WeekHeader', () => {
  const week: Week = {
    id: 'w1', planId: 'p1', weekNumber: 4, phase: 'build',
    startDate: '2026-03-23', totalVolumeKm: 40, adjustmentsMade: false,
  }

  it('affiche le numéro de semaine et la phase', () => {
    render(
      <WeekHeader week={week} onPrev={vi.fn()} onNext={vi.fn()} canGoPrev={true} canGoNext={true} />
    )
    expect(screen.getByText(/Semaine 4/)).toBeTruthy()
    expect(screen.getByText(/Intensif/)).toBeTruthy()
  })

  it('désactive le bouton prev si canGoPrev=false', () => {
    render(
      <WeekHeader week={week} onPrev={vi.fn()} onNext={vi.fn()} canGoPrev={false} canGoNext={true} />
    )
    const prevBtn = screen.getByText(/Sem\. 3/).closest('button')
    expect(prevBtn).toBeDisabled()
  })

  it('désactive le bouton next si canGoNext=false', () => {
    render(
      <WeekHeader week={week} onPrev={vi.fn()} onNext={vi.fn()} canGoPrev={true} canGoNext={false} />
    )
    const nextBtn = screen.getByText(/Sem\. 5/).closest('button')
    expect(nextBtn).toBeDisabled()
  })
})

// ─── WeekFooter ───────────────────────────────────────────────────────────────

describe('WeekFooter', () => {
  it('affiche le volume total', () => {
    render(<WeekFooter sessions={[]} totalVolumeKm={35} />)
    expect(screen.getByText('35 km')).toBeTruthy()
  })

  it('affiche la durée estimée si sessions avec durée', () => {
    const sessions: Session[] = [
      { id: 's1', weekId: 'w1', type: 'easy_run', scheduledDate: '2026-03-24', targetIntensity: 'easy', isCustom: false, prescribedDurationMin: 50 },
      { id: 's2', weekId: 'w1', type: 'long_run', scheduledDate: '2026-03-28', targetIntensity: 'easy', isCustom: false, prescribedDurationMin: 80 },
    ]
    render(<WeekFooter sessions={sessions} totalVolumeKm={20} />)
    expect(screen.getByText(/2h10/)).toBeTruthy()
  })
})
