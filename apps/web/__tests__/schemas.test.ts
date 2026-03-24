import { describe, it, expect } from 'vitest'
import {
  UserProfileSchema,
  RaceSchema,
  SessionLogSchema,
  UserConstraintSchema,
} from '@trajectory/shared'

const validProfile = {
  id: 'p1',
  experience: 'intermediate' as const,
  weeklyVolume: 40,
  availableDays: 5,
  terrain: 'road' as const,
  preferredLongRunDay: 'sunday' as const,
  crossTraining: 'strength' as const,
  units: 'km' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const validRace = {
  id: 'r1',
  distance: 'marathon' as const,
  distanceKm: 42.195,
  targetDate: '2026-10-15',
  status: 'planned' as const,
  order: 0,
  createdAt: new Date().toISOString(),
}

const validLog = {
  id: 'l1',
  sessionId: 's1',
  loggedAt: new Date().toISOString(),
  rpe: 'moderate' as const,
  isSkipped: false,
}

const validConstraint = {
  id: 'c1',
  weekId: 'w1',
  type: 'travel' as const,
  createdAt: new Date().toISOString(),
}

describe('UserProfileSchema', () => {
  it('valide un profil correct', () => {
    expect(() => UserProfileSchema.parse(validProfile)).not.toThrow()
  })

  it('rejette availableDays > 7', () => {
    expect(() =>
      UserProfileSchema.parse({ ...validProfile, availableDays: 8 })
    ).toThrow()
  })

  it('rejette weeklyVolume négatif', () => {
    expect(() =>
      UserProfileSchema.parse({ ...validProfile, weeklyVolume: -5 })
    ).toThrow()
  })

  it('rejette experience invalide', () => {
    expect(() =>
      UserProfileSchema.parse({ ...validProfile, experience: 'expert' })
    ).toThrow()
  })
})

describe('RaceSchema', () => {
  it('valide une course correcte', () => {
    expect(() => RaceSchema.parse(validRace)).not.toThrow()
  })

  it('rejette une date au mauvais format', () => {
    expect(() =>
      RaceSchema.parse({ ...validRace, targetDate: '15/10/2026' })
    ).toThrow()
  })

  it('rejette une distance négative', () => {
    expect(() =>
      RaceSchema.parse({ ...validRace, distanceKm: -1 })
    ).toThrow()
  })
})

describe('SessionLogSchema', () => {
  it('valide un log correct', () => {
    expect(() => SessionLogSchema.parse(validLog)).not.toThrow()
  })

  it('accepte weather comme tableau optionnel', () => {
    const withWeather = { ...validLog, weather: ['rainy', 'windy'] }
    expect(() => SessionLogSchema.parse(withWeather)).not.toThrow()
  })

  it('rejette un rpe invalide', () => {
    expect(() =>
      SessionLogSchema.parse({ ...validLog, rpe: 'brutal' })
    ).toThrow()
  })
})

describe('UserConstraintSchema', () => {
  it('valide une contrainte correcte', () => {
    expect(() => UserConstraintSchema.parse(validConstraint)).not.toThrow()
  })

  it('rejette un type invalide', () => {
    expect(() =>
      UserConstraintSchema.parse({ ...validConstraint, type: 'vacation' })
    ).toThrow()
  })
})
