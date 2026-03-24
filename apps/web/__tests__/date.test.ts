import { describe, it, expect } from 'vitest'
import { weeksBetween, getWeekStart, addWeeks, toISODate, getNextWeekday } from '@trajectory/shared'

describe('weeksBetween', () => {
  it('14 semaines entre deux dates', () => {
    const start = new Date('2026-01-05')
    const end = new Date('2026-04-13')
    expect(weeksBetween(start, end)).toBe(14)
  })

  it('retourne 0 si même date', () => {
    const d = new Date('2026-01-05')
    expect(weeksBetween(d, d)).toBe(0)
  })

  it('arrondit vers le bas', () => {
    const start = new Date('2026-01-05')
    const end = new Date('2026-01-15') // 10 jours = 1.4 semaines
    expect(weeksBetween(start, end)).toBe(1)
  })
})

describe('getWeekStart', () => {
  it('retourne le lundi depuis un mercredi', () => {
    const mercredi = new Date('2026-03-25') // mercredi
    const lundi = getWeekStart(mercredi)
    expect(toISODate(lundi)).toBe('2026-03-23')
  })

  it('retourne le lundi si déjà lundi', () => {
    const lundi = new Date('2026-03-23')
    expect(toISODate(getWeekStart(lundi))).toBe('2026-03-23')
  })

  it('retourne le lundi depuis un dimanche', () => {
    const dimanche = new Date('2026-03-29')
    expect(toISODate(getWeekStart(dimanche))).toBe('2026-03-23')
  })
})

describe('addWeeks', () => {
  it('ajoute 2 semaines', () => {
    const d = new Date('2026-01-05')
    expect(toISODate(addWeeks(d, 2))).toBe('2026-01-19')
  })

  it('ajoute 0 semaine → même date', () => {
    const d = new Date('2026-01-05')
    expect(toISODate(addWeeks(d, 0))).toBe('2026-01-05')
  })
})

describe('getNextWeekday', () => {
  it('prochain dimanche (0) depuis un lundi', () => {
    const lundi = new Date('2026-03-23')
    const dimanche = getNextWeekday(lundi, 0)
    expect(toISODate(dimanche)).toBe('2026-03-29')
  })

  it('prochain samedi (6) depuis un lundi', () => {
    const lundi = new Date('2026-03-23')
    const samedi = getNextWeekday(lundi, 6)
    expect(toISODate(samedi)).toBe('2026-03-28')
  })

  it('retourne la date elle-même si déjà le bon jour', () => {
    const dimanche = new Date('2026-03-29')
    expect(toISODate(getNextWeekday(dimanche, 0))).toBe('2026-03-29')
  })
})
