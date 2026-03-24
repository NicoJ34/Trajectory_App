import type { ExperienceLevel } from '../types/index'

export function calculatePace(distanceKm: number, durationMin: number): number {
  if (distanceKm <= 0 || durationMin <= 0) return 0
  return durationMin / distanceKm
}

export function formatPace(paceMinPerKm: number): string {
  if (paceMinPerKm <= 0) return "0'00\""
  const minutes = Math.floor(paceMinPerKm)
  const seconds = Math.round((paceMinPerKm - minutes) * 60)
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`
}

export function estimateDuration(distanceKm: number, paceMinPerKm: number): number {
  if (distanceKm <= 0 || paceMinPerKm <= 0) return 0
  return distanceKm * paceMinPerKm
}

const DEFAULT_PACES: Record<ExperienceLevel, { easy: number; tempo: number }> = {
  beginner:     { easy: 7.0, tempo: 6.0 },
  intermediate: { easy: 6.0, tempo: 5.0 },
  advanced:     { easy: 5.0, tempo: 4.0 },
}

export function getDefaultPace(level: ExperienceLevel, type: 'easy' | 'tempo'): number {
  return DEFAULT_PACES[level][type]
}
