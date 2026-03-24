import type {
  UserProfile,
  Race,
  Plan,
  Week,
  Session,
  SessionLog,
  UserConstraint,
  AdaptationLog,
  ReferenceTime,
  TrainingLocation,
} from '../types/index'

export interface DB {
  // Profile
  getProfile(): Promise<UserProfile | null>
  saveProfile(profile: UserProfile): Promise<void>

  // Races
  getRace(id: string): Promise<Race | null>
  listRaces(): Promise<Race[]>
  saveRace(race: Race): Promise<Race>
  deleteRace(id: string): Promise<void>

  // Plans
  getPlan(id: string): Promise<Plan | null>
  getPlanByRaceId(raceId: string): Promise<Plan | null>
  savePlan(plan: Plan): Promise<Plan>
  deletePlan(id: string): Promise<void>

  // Weeks
  getWeek(id: string): Promise<Week | null>
  listWeeksByPlan(planId: string): Promise<Week[]>
  saveWeek(week: Week): Promise<Week>

  // Sessions
  getSession(id: string): Promise<Session | null>
  listSessionsByWeek(weekId: string): Promise<Session[]>
  listSessionsByDate(date: string): Promise<Session[]>
  saveSession(session: Session): Promise<Session>
  deleteSession(id: string): Promise<void>

  // Session Logs
  getSessionLog(sessionId: string): Promise<SessionLog | null>
  listRecentLogs(limit: number): Promise<SessionLog[]>
  saveSessionLog(log: SessionLog): Promise<SessionLog>

  // Constraints
  listConstraintsByWeek(weekId: string): Promise<UserConstraint[]>
  saveConstraint(constraint: UserConstraint): Promise<UserConstraint>

  // Adaptation Logs
  listAdaptationLogsByWeek(weekId: string): Promise<AdaptationLog[]>
  saveAdaptationLog(log: AdaptationLog): Promise<AdaptationLog>

  // Reference Times
  listReferenceTimes(): Promise<ReferenceTime[]>
  saveReferenceTime(rt: ReferenceTime): Promise<ReferenceTime>
  deleteReferenceTime(id: string): Promise<void>

  // Locations
  listLocations(): Promise<TrainingLocation[]>
  saveLocation(loc: TrainingLocation): Promise<TrainingLocation>
  deleteLocation(id: string): Promise<void>

  // Bulk
  exportAll(): Promise<Record<string, unknown>>
  clearAll(): Promise<void>
}
