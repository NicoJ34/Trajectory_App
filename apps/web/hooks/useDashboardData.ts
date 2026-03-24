'use client'

import { useEffect, useState } from 'react'
import { db } from '@trajectory/shared'
import type { UserProfile, Race, Plan, Week, Session, SessionLog } from '@trajectory/shared'
import { toISODate, getWeekStart, addWeeks } from '@trajectory/shared'

export interface DashboardData {
  loading: boolean
  profile: UserProfile | null
  activeRace: Race | null
  plan: Plan | null
  currentWeek: Week | null
  todaySessions: Session[]
  todayLogs: Map<string, SessionLog>
  currentWeekSessions: Session[]
  currentWeekLogs: Map<string, SessionLog>
  lastWeekSessions: Session[]
  lastWeekLogs: Map<string, SessionLog>
  daysToRace: number | null
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    loading: true,
    profile: null,
    activeRace: null,
    plan: null,
    currentWeek: null,
    todaySessions: [],
    todayLogs: new Map(),
    currentWeekSessions: [],
    currentWeekLogs: new Map(),
    lastWeekSessions: [],
    lastWeekLogs: new Map(),
    daysToRace: null,
  })

  useEffect(() => {
    async function load() {
      const profile = await db.getProfile()
      if (!profile) {
        setData((d) => ({ ...d, loading: false }))
        return
      }

      const races = await db.listRaces()
      const activeRace = races.find((r) => r.status === 'active') ?? null

      if (!activeRace) {
        setData((d) => ({ ...d, loading: false, profile }))
        return
      }

      const plan = await db.getPlanByRaceId(activeRace.id)

      const today = new Date()
      const todayStr = toISODate(today)

      // Jours restants jusqu'à la course
      const raceDate = new Date(activeRace.targetDate)
      const daysToRace = Math.ceil(
        (raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Séances du jour
      const todaySessions = await db.listSessionsByDate(todayStr)
      const todayLogs = new Map<string, SessionLog>()
      for (const s of todaySessions) {
        const log = await db.getSessionLog(s.id)
        if (log) todayLogs.set(s.id, log)
      }

      // Semaine courante et semaine passée
      let currentWeek: Week | null = null
      let currentWeekSessions: Session[] = []
      const currentWeekLogs = new Map<string, SessionLog>()
      let lastWeekSessions: Session[] = []
      const lastWeekLogs = new Map<string, SessionLog>()

      if (plan) {
        const weeks = await db.listWeeksByPlan(plan.id)
        weeks.sort((a, b) => a.weekNumber - b.weekNumber)

        const weekStart = toISODate(getWeekStart(today))
        const weekEnd = toISODate(addWeeks(getWeekStart(today), 1))

        currentWeek =
          weeks.find((w) => w.startDate >= weekStart && w.startDate < weekEnd) ??
          weeks.find((w) => w.startDate <= weekStart) ??
          null

        // Sessions semaine courante pour le WeekStrip
        if (currentWeek) {
          currentWeekSessions = await db.listSessionsByWeek(currentWeek.id)
          for (const s of currentWeekSessions) {
            if (s.type !== 'rest') {
              const log = await db.getSessionLog(s.id)
              if (log) currentWeekLogs.set(s.id, log)
            }
          }
        }

        // Semaine précédente
        const prevWeekStart = toISODate(addWeeks(getWeekStart(today), -1))
        const prevWeek =
          weeks.find((w) => w.startDate >= prevWeekStart && w.startDate < weekStart) ?? null

        if (prevWeek) {
          lastWeekSessions = await db.listSessionsByWeek(prevWeek.id)
          for (const s of lastWeekSessions) {
            if (s.type !== 'rest') {
              const log = await db.getSessionLog(s.id)
              if (log) lastWeekLogs.set(s.id, log)
            }
          }
        }
      }

      setData({
        loading: false,
        profile,
        activeRace,
        plan,
        currentWeek,
        todaySessions: todaySessions.filter((s) => s.type !== 'rest'),
        todayLogs,
        currentWeekSessions,
        currentWeekLogs,
        lastWeekSessions: lastWeekSessions.filter((s) => s.type !== 'rest'),
        lastWeekLogs,
        daysToRace,
      })
    }

    load()
  }, [])

  return data
}
