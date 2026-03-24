// ─── Enums ────────────────────────────────────────────────────────────────────

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type Terrain = 'road' | 'trail' | 'both'
export type CrossTraining = 'strength' | 'swimming' | 'cycling' | 'hiking' | 'none'
export type Units = 'km' | 'miles'

export type RaceDistance = '10k' | 'half' | 'marathon' | 'custom'
export type RaceStatus = 'planned' | 'active' | 'completed'

export type PlanPhase = 'base' | 'build' | 'peak' | 'taper' | 'race_week'

export type SessionType =
  | 'easy_run'
  | 'tempo_run'
  | 'long_run'
  | 'strength'
  | 'swim'
  | 'bike'
  | 'hike'
  | 'rest'
  | 'custom'
export type IntensityLevel = 'easy' | 'moderate' | 'hard'

export type RPELevel = 'easy' | 'moderate' | 'hard'
export type MoodLevel = 'bad' | 'ok' | 'good' | 'excellent'
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'windy' | 'hot' | 'cold'

export type ConstraintType =
  | 'illness'
  | 'travel'
  | 'equipment_limit'
  | 'time_limit'
  | 'other'
export type ConstraintSeverity = 'mild' | 'moderate'

export type AdaptationTrigger =
  | 'pace_drop'
  | 'rpe_high'
  | 'user_signal'
  | 'low_consistency'
  | 'positive_progression'
  | 'other'

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name?: string
  age?: number
  weight?: number
  height?: number
  experience: ExperienceLevel
  weeklyVolume: number
  availableDays: number
  terrain: Terrain
  injuries?: string
  preferredLongRunDay: 'saturday' | 'sunday'
  crossTraining: CrossTraining
  units: Units
  hrRest?: number
  hrMax?: number
  vma?: number
  timezone?: string
  createdAt: string
  updatedAt: string
}

export interface Race {
  id: string
  name?: string
  distance: RaceDistance
  distanceKm: number
  targetDate: string
  targetTime?: string
  elevationGain?: number
  notes?: string
  status: RaceStatus
  planId?: string
  order: number
  createdAt: string
}

export interface Plan {
  id: string
  raceId: string
  startDate: string
  endDate: string
  durationWeeks: number
  currentWeekNumber: number
  createdAt: string
}

export interface Week {
  id: string
  planId: string
  weekNumber: number
  phase: PlanPhase
  startDate: string
  totalVolumeKm: number
  adjustmentsMade: boolean
  adjustmentReason?: string
}

export interface Session {
  id: string
  weekId: string
  type: SessionType
  scheduledDate: string
  prescribedDistanceKm?: number
  prescribedDurationMin?: number
  targetIntensity: IntensityLevel
  terrain?: Terrain
  notes?: string
  isCustom: boolean
  isRecurring?: boolean
  recurringDay?: number
}

export interface SessionLog {
  id: string
  sessionId: string
  loggedAt: string
  distanceKm?: number
  durationMin?: number
  rpe: RPELevel
  paceMinPerKm?: number
  elevationGainM?: number
  weather?: WeatherCondition[]
  mood?: MoodLevel
  notes?: string
  isSkipped: boolean
}

export interface UserConstraint {
  id: string
  weekId: string
  type: ConstraintType
  severity?: ConstraintSeverity
  description?: string
  daysAffected?: number
  roadOnly?: boolean
  unavailableEquipment?: string[]
  createdAt: string
}

export interface AdaptationLog {
  id: string
  planId: string
  weekId: string
  triggerReason: AdaptationTrigger
  signalStrength: 'low' | 'medium' | 'high'
  changesMade: string
  createdAt: string
}

export interface ReferenceTime {
  id: string
  name?: string
  type: 'run' | 'trail' | 'bike' | 'swim'
  distanceKm: number
  duration: string
  paceMinPerKm?: number
  elevationGain?: number
  date: string
  location?: string
  createdAt: string
}

export interface TrainingLocation {
  id: string
  name: string
  latitude?: number
  longitude?: number
  elevation?: number
  isDefault: boolean
}
