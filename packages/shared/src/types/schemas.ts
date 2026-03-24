import { z } from 'zod'

// ─── UserProfile ──────────────────────────────────────────────────────────────

export const UserProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  age: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  weeklyVolume: z.number().positive(),
  availableDays: z.number().int().min(1).max(7),
  terrain: z.enum(['road', 'trail', 'both']),
  injuries: z.string().optional(),
  preferredLongRunDay: z.enum(['saturday', 'sunday']),
  crossTraining: z.enum(['strength', 'swimming', 'cycling', 'hiking', 'none']),
  units: z.enum(['km', 'miles']),
  hrRest: z.number().int().positive().optional(),
  hrMax: z.number().int().positive().optional(),
  vma: z.number().positive().optional(),
  timezone: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// ─── Race ─────────────────────────────────────────────────────────────────────

export const RaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  distance: z.enum(['10k', 'half', 'marathon', 'custom']),
  distanceKm: z.number().positive(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetTime: z.string().optional(),
  elevationGain: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  status: z.enum(['planned', 'active', 'completed']),
  planId: z.string().optional(),
  order: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
})

// ─── SessionLog ───────────────────────────────────────────────────────────────

export const SessionLogSchema = z.object({
  id: z.string().min(1),
  sessionId: z.string().min(1),
  loggedAt: z.string().datetime(),
  distanceKm: z.number().positive().optional(),
  durationMin: z.number().positive().optional(),
  rpe: z.enum(['easy', 'moderate', 'hard']),
  paceMinPerKm: z.number().positive().optional(),
  elevationGainM: z.number().nonnegative().optional(),
  weather: z
    .array(z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'hot', 'cold']))
    .optional(),
  mood: z.enum(['bad', 'ok', 'good', 'excellent']).optional(),
  notes: z.string().optional(),
  isSkipped: z.boolean(),
})

// ─── UserConstraint ───────────────────────────────────────────────────────────

export const UserConstraintSchema = z.object({
  id: z.string().min(1),
  weekId: z.string().min(1),
  type: z.enum(['illness', 'travel', 'equipment_limit', 'time_limit', 'other']),
  severity: z.enum(['mild', 'moderate']).optional(),
  description: z.string().optional(),
  daysAffected: z.number().int().positive().optional(),
  roadOnly: z.boolean().optional(),
  unavailableEquipment: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
})

export type UserProfileInput = z.infer<typeof UserProfileSchema>
export type RaceInput = z.infer<typeof RaceSchema>
export type SessionLogInput = z.infer<typeof SessionLogSchema>
export type UserConstraintInput = z.infer<typeof UserConstraintSchema>
