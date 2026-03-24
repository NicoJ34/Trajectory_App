import type {
  UserProfile,
  Race,
  Plan,
  Week,
  Session,
  PlanPhase,
  SessionType,
  CrossTraining,
} from '../types/index'
import { generateId } from '../utils/id'
import {
  weeksBetween,
  getWeekStart,
  addWeeks,
  toISODate,
  getNextWeekday,
} from '../utils/date'
import { getDefaultPace, estimateDuration } from '../utils/pace'

// ─── Phase assignment ─────────────────────────────────────────────────────────

function assignPhases(totalWeeks: number): PlanPhase[] {
  const phases: PlanPhase[] = new Array(totalWeeks).fill('base')

  if (totalWeeks >= 2) phases[totalWeeks - 1] = 'race_week'
  if (totalWeeks >= 3) phases[totalWeeks - 2] = 'taper'
  if (totalWeeks >= 4) phases[totalWeeks - 3] = 'peak'
  if (totalWeeks >= 5) phases[totalWeeks - 4] = 'build'
  if (totalWeeks >= 6) phases[totalWeeks - 5] = 'build'
  if (totalWeeks >= 7) phases[totalWeeks - 6] = 'build'

  return phases
}

// ─── Volume calculation ───────────────────────────────────────────────────────

function calculateWeekVolumes(
  totalWeeks: number,
  startVolume: number,
  phases: PlanPhase[]
): number[] {
  const volumes: number[] = []
  let current = startVolume

  // Trouver l'indice de la dernière semaine build/peak pour reference
  let peakVolume = startVolume

  for (let i = 0; i < totalWeeks; i++) {
    const phase = phases[i]
    const weekNumber = i + 1

    if (phase === 'race_week') {
      volumes.push(Math.round(peakVolume * 0.25))
    } else if (phase === 'taper') {
      volumes.push(Math.round(peakVolume * 0.55))
    } else if (phase === 'peak') {
      // peak = volume courant (après build)
      volumes.push(Math.round(current))
      peakVolume = current
    } else {
      // base ou build : progression +10%, décharge toutes les 4 semaines
      const isDeload = weekNumber % 4 === 0
      if (isDeload) {
        const deload = Math.round(current * 0.8)
        volumes.push(deload)
        // Reprendre la progression depuis le volume de décharge
        current = Math.round(deload * 1.1)
      } else {
        volumes.push(Math.round(current))
        peakVolume = current
        current = Math.round(current * 1.1)
      }
    }
  }

  return volumes
}

// ─── Cross-training session type ─────────────────────────────────────────────

const CROSS_TRAINING_SESSION: Record<CrossTraining, SessionType> = {
  strength: 'strength',
  swimming: 'swim',
  cycling:  'bike',
  hiking:   'hike',
  none:     'rest',
}

// ─── Session generation ───────────────────────────────────────────────────────

function generateWeekSessions(
  weekId: string,
  weekStart: Date,
  phase: PlanPhase,
  weekVolumeKm: number,
  profile: UserProfile
): Session[] {
  const sessions: Session[] = []
  const { experience, preferredLongRunDay, crossTraining, availableDays } = profile

  const longRunDay = preferredLongRunDay === 'sunday' ? 0 : 6
  const longRunDate = getNextWeekday(weekStart, longRunDay)

  const easyPace = getDefaultPace(experience, 'easy')
  const tempoPace = getDefaultPace(experience, 'tempo')

  // Répartition du volume : long run = ~35%, easy = ~30% chacun
  const longRunKm = Math.round(weekVolumeKm * 0.35)
  const easyKm = Math.round(weekVolumeKm * 0.25)
  const tempoKm = Math.round(weekVolumeKm * 0.15)

  const crossType = CROSS_TRAINING_SESSION[crossTraining]

  // Jours disponibles pour placer les sessions (lun=1 à dim=0)
  // Long run réservé sur le jour préféré
  // On place les autres sessions sur les jours restants dans la semaine
  const allDays = [1, 2, 3, 4, 5, 6, 0] // lun → dim
  const otherDays = allDays.filter((d) => d !== longRunDay)

  // Long run
  if (phase !== 'race_week') {
    const kmReduced = phase === 'taper' ? Math.round(longRunKm * 0.7) : longRunKm
    sessions.push({
      id: generateId(),
      weekId,
      type: 'long_run',
      scheduledDate: toISODate(longRunDate),
      prescribedDistanceKm: kmReduced,
      prescribedDurationMin: Math.round(estimateDuration(kmReduced, easyPace)),
      targetIntensity: 'easy',
      isCustom: false,
    })
  }

  // Easy runs (2 par semaine)
  const easyCount = phase === 'taper' ? 2 : 2
  for (let i = 0; i < easyCount; i++) {
    const day = otherDays[i]
    const date = getNextWeekday(weekStart, day)
    sessions.push({
      id: generateId(),
      weekId,
      type: 'easy_run',
      scheduledDate: toISODate(date),
      prescribedDistanceKm: easyKm,
      prescribedDurationMin: Math.round(estimateDuration(easyKm, easyPace)),
      targetIntensity: 'easy',
      isCustom: false,
    })
  }

  // Tempo (build et peak uniquement)
  if (phase === 'build' || phase === 'peak') {
    const day = otherDays[2]
    const date = getNextWeekday(weekStart, day)
    sessions.push({
      id: generateId(),
      weekId,
      type: 'tempo_run',
      scheduledDate: toISODate(date),
      prescribedDistanceKm: tempoKm,
      prescribedDurationMin: Math.round(estimateDuration(tempoKm, tempoPace)),
      targetIntensity: 'hard',
      isCustom: false,
    })
  }

  // Cross-training (pas en taper ni race_week)
  if (phase !== 'taper' && phase !== 'race_week' && crossType !== 'rest') {
    const slotIndex = phase === 'base' ? 2 : 3
    const day = otherDays[slotIndex] ?? otherDays[otherDays.length - 1]
    const date = getNextWeekday(weekStart, day)
    sessions.push({
      id: generateId(),
      weekId,
      type: crossType,
      scheduledDate: toISODate(date),
      prescribedDurationMin: 45,
      targetIntensity: 'moderate',
      isCustom: false,
    })
  }

  // Compléter avec des repos jusqu'à `availableDays`
  const usedDays = new Set(sessions.map((s) => {
    const d = new Date(s.scheduledDate + 'T00:00:00Z')
    return d.getUTCDay()
  }))

  const restDays = allDays.filter((d) => !usedDays.has(d))
  const maxRest = Math.max(0, availableDays - sessions.length)

  for (let i = 0; i < Math.min(maxRest, restDays.length); i++) {
    const date = getNextWeekday(weekStart, restDays[i])
    sessions.push({
      id: generateId(),
      weekId,
      type: 'rest',
      scheduledDate: toISODate(date),
      targetIntensity: 'easy',
      isCustom: false,
    })
  }

  return sessions
}

// ─── Main function ────────────────────────────────────────────────────────────

export function generatePlan(
  profile: UserProfile,
  race: Race
): { plan: Plan; weeks: Week[]; sessions: Session[] } {
  const today = new Date()
  const raceDate = new Date(race.targetDate + 'T00:00:00Z')
  const planStart = getWeekStart(today)

  const totalWeeks = Math.max(1, weeksBetween(planStart, raceDate))
  const startVolume = Math.max(profile.weeklyVolume, 20)

  const phases = assignPhases(totalWeeks)
  const volumes = calculateWeekVolumes(totalWeeks, startVolume, phases)

  const planId = generateId()
  const allWeeks: Week[] = []
  const allSessions: Session[] = []

  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = addWeeks(planStart, i)
    const weekId = generateId()
    const phase = phases[i]
    const volumeKm = volumes[i]

    const week: Week = {
      id: weekId,
      planId,
      weekNumber: i + 1,
      phase,
      startDate: toISODate(weekStart),
      totalVolumeKm: volumeKm,
      adjustmentsMade: false,
    }
    allWeeks.push(week)

    const sessions = generateWeekSessions(weekId, weekStart, phase, volumeKm, profile)
    allSessions.push(...sessions)
  }

  const plan: Plan = {
    id: planId,
    raceId: race.id,
    startDate: toISODate(planStart),
    endDate: toISODate(addWeeks(planStart, totalWeeks)),
    durationWeeks: totalWeeks,
    currentWeekNumber: 1,
    createdAt: new Date().toISOString(),
  }

  return { plan, weeks: allWeeks, sessions: allSessions }
}
