'use client'

import { useEffect, useState } from 'react'
import { db } from '@trajectory/shared'
import type { Week, Session, SessionLog, AdaptationLog } from '@trajectory/shared'
import { toISODate, getWeekStart } from '@trajectory/shared'

export interface WeeklyPlanData {
  loading: boolean
  week: Week | null
  sessions: Session[]
  logs: Map<string, SessionLog>
  adaptationLogs: AdaptationLog[]
  canGoPrev: boolean
  canGoNext: boolean
}

export function useWeeklyPlan(weekOffset: number): WeeklyPlanData {
  const [data, setData] = useState<WeeklyPlanData>({
    loading: true,
    week: null,
    sessions: [],
    logs: new Map(),
    adaptationLogs: [],
    canGoPrev: false,
    canGoNext: false,
  })

  useEffect(() => {
    async function load() {
      setData((d) => ({ ...d, loading: true }))

      const races = await db.listRaces()
      const activeRace = races.find((r) => r.status === 'active') ?? null
      if (!activeRace) {
        setData((d) => ({ ...d, loading: false }))
        return
      }

      const plan = await db.getPlanByRaceId(activeRace.id)
      if (!plan) {
        setData((d) => ({ ...d, loading: false }))
        return
      }

      const weeks = await db.listWeeksByPlan(plan.id)
      weeks.sort((a, b) => a.weekNumber - b.weekNumber)

      if (weeks.length === 0) {
        setData((d) => ({ ...d, loading: false }))
        return
      }

      // Trouver l'index de la semaine courante
      const today = new Date()
      const weekStart = toISODate(getWeekStart(today))
      const currentIndex = weeks.findIndex((w) => w.startDate === weekStart) !== -1
        ? weeks.findIndex((w) => w.startDate === weekStart)
        : weeks.findIndex((w) => w.startDate <= weekStart && w.weekNumber === Math.max(...weeks.filter((x) => x.startDate <= weekStart).map((x) => x.weekNumber)))

      const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex
      const targetIndex = safeCurrentIndex + weekOffset

      const clampedIndex = Math.max(0, Math.min(weeks.length - 1, targetIndex))
      const week = weeks[clampedIndex]

      const sessions = await db.listSessionsByWeek(week.id)
      const logs = new Map<string, SessionLog>()
      for (const s of sessions) {
        if (s.type !== 'rest') {
          const log = await db.getSessionLog(s.id)
          if (log) logs.set(s.id, log)
        }
      }

      const adaptationLogs = await db.listAdaptationLogsByWeek(week.id)

      setData({
        loading: false,
        week,
        sessions,
        logs,
        adaptationLogs,
        canGoPrev: clampedIndex > 0,
        canGoNext: clampedIndex < weeks.length - 1,
      })
    }

    load()
  }, [weekOffset])

  return data
}
