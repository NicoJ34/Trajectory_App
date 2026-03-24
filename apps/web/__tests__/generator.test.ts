import { describe, it, expect } from 'vitest'
import { generatePlan } from '@trajectory/shared'
import type { UserProfile, Race } from '@trajectory/shared'

const profile: UserProfile = {
  id: 'p1',
  experience: 'intermediate',
  weeklyVolume: 40,
  availableDays: 5,
  terrain: 'road',
  preferredLongRunDay: 'sunday',
  crossTraining: 'strength',
  units: 'km',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function makeRace(weeksFromNow: number): Race {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + weeksFromNow * 7)
  return {
    id: 'r1',
    distance: 'marathon',
    distanceKm: 42.195,
    targetDate: d.toISOString().split('T')[0],
    status: 'planned',
    order: 0,
    createdAt: new Date().toISOString(),
  }
}

describe('generatePlan — structure', () => {
  it('génère le bon nombre de semaines', () => {
    const { weeks } = generatePlan(profile, makeRace(14))
    expect(weeks.length).toBe(14)
  })

  it('retourne autant de semaines que durationWeeks dans le plan', () => {
    const { plan, weeks } = generatePlan(profile, makeRace(10))
    expect(weeks.length).toBe(plan.durationWeeks)
  })

  it('plan < 8 semaines — pas d\'exception, phases compressées', () => {
    expect(() => generatePlan(profile, makeRace(4))).not.toThrow()
    const { weeks } = generatePlan(profile, makeRace(4))
    expect(weeks.length).toBe(4)
  })

  it('weekNumber commence à 1 et est séquentiel', () => {
    const { weeks } = generatePlan(profile, makeRace(10))
    weeks.forEach((w, i) => expect(w.weekNumber).toBe(i + 1))
  })
})

describe('generatePlan — phases', () => {
  it('dernière semaine = race_week', () => {
    const { weeks } = generatePlan(profile, makeRace(10))
    expect(weeks[weeks.length - 1].phase).toBe('race_week')
  })

  it('avant-dernière semaine = taper', () => {
    const { weeks } = generatePlan(profile, makeRace(10))
    expect(weeks[weeks.length - 2].phase).toBe('taper')
  })

  it('semaine N-3 = peak', () => {
    const { weeks } = generatePlan(profile, makeRace(10))
    expect(weeks[weeks.length - 3].phase).toBe('peak')
  })

  it('premières semaines = base pour un plan > 7 semaines', () => {
    const { weeks } = generatePlan(profile, makeRace(14))
    expect(weeks[0].phase).toBe('base')
    expect(weeks[1].phase).toBe('base')
  })
})

describe('generatePlan — volumes', () => {
  it('volume de départ ≥ 20 km même si profil < 20', () => {
    const lowProfile = { ...profile, weeklyVolume: 10 }
    const { weeks } = generatePlan(lowProfile, makeRace(10))
    expect(weeks[0].totalVolumeKm).toBeGreaterThanOrEqual(20)
  })

  it('progression semaine à semaine ≤ 10% hors décharge', () => {
    const { weeks } = generatePlan(profile, makeRace(14))
    const baseWeeks = weeks.filter((w) => w.phase === 'base')
    for (let i = 1; i < baseWeeks.length; i++) {
      const prev = baseWeeks[i - 1].totalVolumeKm
      const curr = baseWeeks[i].totalVolumeKm
      // Ignorer les semaines de décharge (volume inférieur)
      if (curr > prev) {
        const increase = (curr - prev) / prev
        expect(increase).toBeLessThanOrEqual(0.11) // tolérance arrondi
      }
    }
  })

  it('taper ≈ 55% du volume peak', () => {
    const { weeks } = generatePlan(profile, makeRace(14))
    const peak = weeks.find((w) => w.phase === 'peak')!
    const taper = weeks.find((w) => w.phase === 'taper')!
    const ratio = taper.totalVolumeKm / peak.totalVolumeKm
    expect(ratio).toBeGreaterThan(0.45)
    expect(ratio).toBeLessThan(0.70)
  })
})

describe('generatePlan — sessions', () => {
  it('chaque semaine a au moins une session', () => {
    const { weeks, sessions } = generatePlan(profile, makeRace(10))
    weeks.forEach((w) => {
      const ws = sessions.filter((s) => s.weekId === w.id)
      expect(ws.length).toBeGreaterThan(0)
    })
  })

  it('long_run présent dans les semaines base', () => {
    const { weeks, sessions } = generatePlan(profile, makeRace(14))
    const baseWeeks = weeks.filter((w) => w.phase === 'base')
    baseWeeks.forEach((w) => {
      const ws = sessions.filter((s) => s.weekId === w.id)
      expect(ws.some((s) => s.type === 'long_run')).toBe(true)
    })
  })

  it('tempo_run présent dans les semaines build/peak', () => {
    const { weeks, sessions } = generatePlan(profile, makeRace(14))
    const intensityWeeks = weeks.filter((w) => w.phase === 'build' || w.phase === 'peak')
    intensityWeeks.forEach((w) => {
      const ws = sessions.filter((s) => s.weekId === w.id)
      expect(ws.some((s) => s.type === 'tempo_run')).toBe(true)
    })
  })

  it('long_run sur le bon jour (dimanche=0)', () => {
    const { weeks, sessions } = generatePlan(profile, makeRace(10))
    const longRuns = sessions.filter((s) => s.type === 'long_run')
    longRuns.forEach((s) => {
      const d = new Date(s.scheduledDate + 'T00:00:00Z')
      expect(d.getUTCDay()).toBe(0) // dimanche
    })
  })

  it('long_run sur samedi si préférence samedi', () => {
    const satProfile = { ...profile, preferredLongRunDay: 'saturday' as const }
    const { sessions } = generatePlan(satProfile, makeRace(10))
    const longRuns = sessions.filter((s) => s.type === 'long_run')
    longRuns.forEach((s) => {
      const d = new Date(s.scheduledDate + 'T00:00:00Z')
      expect(d.getUTCDay()).toBe(6) // samedi
    })
  })
})
