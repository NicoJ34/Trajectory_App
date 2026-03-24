import localforage from 'localforage'
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
import type { DB } from './interface'

// ─── Store instances ───────────────────────────────────────────────────────────

function createStore(storeName: string) {
  return localforage.createInstance({ name: 'trajectory', storeName })
}

const stores = {
  profile: createStore('trajectory_profile'),
  races: createStore('trajectory_races'),
  plans: createStore('trajectory_plans'),
  weeks: createStore('trajectory_weeks'),
  sessions: createStore('trajectory_sessions'),
  sessionLogs: createStore('trajectory_session_logs'),
  constraints: createStore('trajectory_constraints'),
  adaptationLogs: createStore('trajectory_adaptation_logs'),
  referenceTimes: createStore('trajectory_reference_times'),
  locations: createStore('trajectory_locations'),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAll<T>(store: LocalForage): Promise<T[]> {
  const items: T[] = []
  await store.iterate<T, void>((value) => {
    items.push(value)
  })
  return items
}

// ─── Implementation ───────────────────────────────────────────────────────────

export const db: DB = {
  // Profile
  async getProfile() {
    return stores.profile.getItem<UserProfile>('profile')
  },
  async saveProfile(profile) {
    await stores.profile.setItem('profile', profile)
  },

  // Races
  async getRace(id) {
    return stores.races.getItem<Race>(id)
  },
  async listRaces() {
    return getAll<Race>(stores.races)
  },
  async saveRace(race) {
    await stores.races.setItem(race.id, race)
    return race
  },
  async deleteRace(id) {
    await stores.races.removeItem(id)
  },

  // Plans
  async getPlan(id) {
    return stores.plans.getItem<Plan>(id)
  },
  async getPlanByRaceId(raceId) {
    const plans = await getAll<Plan>(stores.plans)
    return plans.find((p) => p.raceId === raceId) ?? null
  },
  async savePlan(plan) {
    await stores.plans.setItem(plan.id, plan)
    return plan
  },
  async deletePlan(id) {
    await stores.plans.removeItem(id)
  },

  // Weeks
  async getWeek(id) {
    return stores.weeks.getItem<Week>(id)
  },
  async listWeeksByPlan(planId) {
    const weeks = await getAll<Week>(stores.weeks)
    return weeks.filter((w) => w.planId === planId).sort((a, b) => a.weekNumber - b.weekNumber)
  },
  async saveWeek(week) {
    await stores.weeks.setItem(week.id, week)
    return week
  },

  // Sessions
  async getSession(id) {
    return stores.sessions.getItem<Session>(id)
  },
  async listSessionsByWeek(weekId) {
    const sessions = await getAll<Session>(stores.sessions)
    return sessions.filter((s) => s.weekId === weekId)
  },
  async listSessionsByDate(date) {
    const sessions = await getAll<Session>(stores.sessions)
    return sessions.filter((s) => s.scheduledDate === date)
  },
  async saveSession(session) {
    await stores.sessions.setItem(session.id, session)
    return session
  },
  async deleteSession(id) {
    await stores.sessions.removeItem(id)
  },

  // Session Logs
  async getSessionLog(sessionId) {
    const logs = await getAll<SessionLog>(stores.sessionLogs)
    return logs.find((l) => l.sessionId === sessionId) ?? null
  },
  async listRecentLogs(limit) {
    const logs = await getAll<SessionLog>(stores.sessionLogs)
    return logs.sort((a, b) => b.loggedAt.localeCompare(a.loggedAt)).slice(0, limit)
  },
  async saveSessionLog(log) {
    await stores.sessionLogs.setItem(log.id, log)
    return log
  },

  // Constraints
  async listConstraintsByWeek(weekId) {
    const constraints = await getAll<UserConstraint>(stores.constraints)
    return constraints.filter((c) => c.weekId === weekId)
  },
  async saveConstraint(constraint) {
    await stores.constraints.setItem(constraint.id, constraint)
    return constraint
  },

  // Adaptation Logs
  async listAdaptationLogsByWeek(weekId) {
    const logs = await getAll<AdaptationLog>(stores.adaptationLogs)
    return logs.filter((l) => l.weekId === weekId)
  },
  async saveAdaptationLog(log) {
    await stores.adaptationLogs.setItem(log.id, log)
    return log
  },

  // Reference Times
  async listReferenceTimes() {
    return getAll<ReferenceTime>(stores.referenceTimes)
  },
  async saveReferenceTime(rt) {
    await stores.referenceTimes.setItem(rt.id, rt)
    return rt
  },
  async deleteReferenceTime(id) {
    await stores.referenceTimes.removeItem(id)
  },

  // Locations
  async listLocations() {
    return getAll<TrainingLocation>(stores.locations)
  },
  async saveLocation(loc) {
    await stores.locations.setItem(loc.id, loc)
    return loc
  },
  async deleteLocation(id) {
    await stores.locations.removeItem(id)
  },

  // Bulk
  async exportAll() {
    const [
      profile,
      races,
      plans,
      weeks,
      sessions,
      sessionLogs,
      constraints,
      adaptationLogs,
      referenceTimes,
      locations,
    ] = await Promise.all([
      stores.profile.getItem('profile'),
      getAll(stores.races),
      getAll(stores.plans),
      getAll(stores.weeks),
      getAll(stores.sessions),
      getAll(stores.sessionLogs),
      getAll(stores.constraints),
      getAll(stores.adaptationLogs),
      getAll(stores.referenceTimes),
      getAll(stores.locations),
    ])
    return {
      profile,
      races,
      plans,
      weeks,
      sessions,
      sessionLogs,
      constraints,
      adaptationLogs,
      referenceTimes,
      locations,
    }
  },

  async clearAll() {
    await Promise.all(Object.values(stores).map((store) => store.clear()))
  },
}
