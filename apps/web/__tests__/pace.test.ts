import { describe, it, expect } from 'vitest'
import { calculatePace, formatPace, estimateDuration, getDefaultPace } from '@trajectory/shared'

describe('calculatePace', () => {
  it('calcule correctement 10km en 60min → 6.0', () => {
    expect(calculatePace(10, 60)).toBe(6.0)
  })

  it('calcule 42.195km en 210min → ~4.977', () => {
    expect(calculatePace(42.195, 210)).toBeCloseTo(4.977, 2)
  })

  it('retourne 0 si distance ou durée nulle', () => {
    expect(calculatePace(0, 60)).toBe(0)
    expect(calculatePace(10, 0)).toBe(0)
  })
})

describe('formatPace', () => {
  it('formate 5.5 → "5\'30\""', () => {
    expect(formatPace(5.5)).toBe("5'30\"")
  })

  it('formate 6.0 → "6\'00\""', () => {
    expect(formatPace(6.0)).toBe("6'00\"")
  })

  it('formate 4.25 → "4\'15\""', () => {
    expect(formatPace(4.25)).toBe("4'15\"")
  })

  it('retourne "0\'00\"" pour une allure nulle', () => {
    expect(formatPace(0)).toBe("0'00\"")
  })
})

describe('estimateDuration', () => {
  it('estime 10km à 6 min/km → 60min', () => {
    expect(estimateDuration(10, 6)).toBe(60)
  })

  it('retourne 0 si distance ou allure nulle', () => {
    expect(estimateDuration(0, 6)).toBe(0)
    expect(estimateDuration(10, 0)).toBe(0)
  })
})

describe('getDefaultPace', () => {
  it('beginner easy → 7.0', () => {
    expect(getDefaultPace('beginner', 'easy')).toBe(7.0)
  })

  it('intermediate tempo → 5.0', () => {
    expect(getDefaultPace('intermediate', 'tempo')).toBe(5.0)
  })

  it('advanced easy → 5.0', () => {
    expect(getDefaultPace('advanced', 'easy')).toBe(5.0)
  })
})
