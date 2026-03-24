import { describe, it, expect, vi } from 'vitest'
import type { UserProfile, Race } from '@trajectory/shared'

// vi.mock est hoissé avant les imports — le mock est appliqué avant le chargement du module
vi.mock('localforage', () => {
  const stores: Record<string, Record<string, unknown>> = {}

  function getOrCreateStore(name: string) {
    if (!stores[name]) stores[name] = {}
    return stores[name]
  }

  return {
    default: {
      createInstance: ({ storeName }: { storeName: string }) => {
        const store = getOrCreateStore(storeName)
        return {
          getItem: vi.fn(async (key: string) => store[key] ?? null),
          setItem: vi.fn(async (key: string, value: unknown) => {
            store[key] = value
          }),
          removeItem: vi.fn(async (key: string) => {
            delete store[key]
          }),
          clear: vi.fn(async () => {
            Object.keys(store).forEach((k) => delete store[k])
          }),
          iterate: vi.fn(async (fn: (value: unknown) => void) => {
            Object.values(store).forEach(fn)
          }),
        }
      },
    },
  }
})

import { db } from '@trajectory/shared'

const makeProfile = (): UserProfile => ({
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
})

const makeRace = (id: string): Race => ({
  id,
  distance: 'marathon',
  distanceKm: 42.195,
  targetDate: '2026-10-15',
  status: 'planned',
  order: 0,
  createdAt: new Date().toISOString(),
})

describe('db — Profile', () => {
  it('retourne null si aucun profil', async () => {
    const profile = await db.getProfile()
    expect(profile).toBeNull()
  })

  it('sauvegarde et relit le profil', async () => {
    const profile = makeProfile()
    await db.saveProfile(profile)
    const result = await db.getProfile()
    expect(result).toEqual(profile)
  })
})

describe('db — Races', () => {
  it('sauvegarde et liste les courses', async () => {
    const r1 = makeRace('r1')
    const r2 = makeRace('r2')
    await db.saveRace(r1)
    await db.saveRace(r2)
    const races = await db.listRaces()
    expect(races.length).toBeGreaterThanOrEqual(2)
  })

  it('getRace retourne null pour un id inconnu', async () => {
    const result = await db.getRace('unknown-id')
    expect(result).toBeNull()
  })

  it('deleteRace supprime la course', async () => {
    const r = makeRace('r-to-delete')
    await db.saveRace(r)
    await db.deleteRace(r.id)
    const result = await db.getRace(r.id)
    expect(result).toBeNull()
  })
})

describe('db — clearAll', () => {
  it('vide tous les stores', async () => {
    await db.saveProfile(makeProfile())
    await db.clearAll()
    const profile = await db.getProfile()
    expect(profile).toBeNull()
  })
})
