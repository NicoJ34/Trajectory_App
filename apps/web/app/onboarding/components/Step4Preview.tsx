'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generatePlan, db, generateId } from '@trajectory/shared'
import type { UserProfile, Race, Plan, Week, Session } from '@trajectory/shared'

interface Step4PreviewProps {
  profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
  race: Omit<Race, 'id' | 'status' | 'order' | 'createdAt'>
  onBack: () => void
}

interface PlanPreview {
  plan: Plan
  weeks: Week[]
  sessions: Session[]
}

export default function Step4Preview({ profile, race, onBack }: Step4PreviewProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<PlanPreview | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const now = new Date().toISOString()
    const fullProfile: UserProfile = { ...profile, id: 'preview', createdAt: now, updatedAt: now }
    const fullRace: Race = { ...race, id: 'preview', status: 'active', order: 0, createdAt: now }
    const result = generatePlan(fullProfile, fullRace)
    setPreview(result)
  }, [profile, race])

  async function handleStart() {
    if (!preview) return
    setSaving(true)
    try {
      const now = new Date().toISOString()
      const profileId = generateId()
      const raceId = generateId()

      const savedProfile: UserProfile = { ...profile, id: profileId, createdAt: now, updatedAt: now }
      await db.saveProfile(savedProfile)

      const savedRace: Race = { ...race, id: raceId, status: 'active', order: 0, createdAt: now }
      await db.saveRace(savedRace)

      const savedPlan = { ...preview.plan, id: generateId(), raceId }
      await db.savePlan(savedPlan)

      await Promise.all(
        preview.weeks.map((w) => db.saveWeek({ ...w, planId: savedPlan.id }))
      )
      await Promise.all(preview.sessions.map((s) => db.saveSession(s)))

      router.replace('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  const phaseCounts = preview
    ? preview.weeks.reduce<Record<string, number>>((acc, w) => {
        acc[w.phase] = (acc[w.phase] ?? 0) + 1
        return acc
      }, {})
    : {}

  const phaseLabels: Record<string, string> = {
    base: 'Base',
    build: 'Build',
    peak: 'Peak',
    taper: 'Taper',
    race_week: 'Race',
  }

  const week1 = preview?.weeks[0]
  const week1Sessions = preview
    ? preview.sessions.filter((s) => s.weekId === week1?.id)
    : []

  const sessionLabels: Record<string, string> = {
    easy_run: 'Footing facile',
    tempo_run: 'Tempo',
    long_run: 'Sortie longue',
    strength: 'Renforcement',
    swim: 'Natation',
    bike: 'Vélo',
    hike: 'Randonnée',
    rest: 'Repos',
    custom: 'Libre',
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Ton plan est prêt !</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Voici un aperçu de ce qui t&apos;attend.
      </p>

      {!preview ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Génération en cours…
        </div>
      ) : (
        <>
          {/* Résumé phases */}
          <div className="bg-muted/50 rounded-lg p-4 mb-5">
            <div className="text-sm font-medium mb-3">
              {preview.plan.durationWeeks} semaines de préparation
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(phaseCounts).map(([phase, count]) => (
                <span
                  key={phase}
                  className="text-xs bg-background border border-border rounded-full px-3 py-1"
                >
                  {phaseLabels[phase] ?? phase} · {count} sem.
                </span>
              ))}
            </div>
          </div>

          {/* Semaine 1 */}
          {week1 && (
            <div className="mb-8">
              <div className="text-sm font-medium mb-2">
                Semaine 1 — {week1.totalVolumeKm} km
              </div>
              <div className="space-y-1.5">
                {week1Sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-sm bg-muted/30 rounded-md px-3 py-2"
                  >
                    <span>{sessionLabels[s.type] ?? s.type}</span>
                    <span className="text-muted-foreground">
                      {s.prescribedDistanceKm
                        ? `${s.prescribedDistanceKm} km`
                        : s.prescribedDurationMin
                          ? `${s.prescribedDurationMin} min`
                          : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="flex-1 border border-border rounded-md py-2.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40"
            >
              ← Retour
            </button>
            <button
              type="button"
              onClick={handleStart}
              disabled={saving}
              className="flex-1 bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              {saving ? 'Enregistrement…' : 'Commencer 🚀'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
