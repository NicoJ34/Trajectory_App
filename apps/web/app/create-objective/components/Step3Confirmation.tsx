'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generatePlan, db, generateId } from '@trajectory/shared'
import type { Race, RaceDistance, Plan, Week, Session } from '@trajectory/shared'

interface Step3Data {
  distance: RaceDistance
  distanceKm: number
  targetDate: string
  name?: string
  elevationGain?: number
  notes?: string
}

interface Step3ConfirmationProps {
  data: Step3Data
  onBack: () => void
}

interface PlanPreview {
  plan: Plan
  weeks: Week[]
  sessions: Session[]
}

const distanceLabel: Record<RaceDistance, string> = {
  '10k': '10 km',
  half: 'Semi-marathon',
  marathon: 'Marathon',
  custom: 'Trail / Autre',
}

const phaseLabels: Record<string, string> = {
  base: 'Base',
  build: 'Build',
  peak: 'Peak',
  taper: 'Taper',
  race_week: 'Race',
}

export default function Step3Confirmation({ data, onBack }: Step3ConfirmationProps) {
  const router = useRouter()
  const [preview, setPreview] = useState<PlanPreview | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function buildPreview() {
      const profile = await db.getProfile()
      if (!profile) {
        setError("Aucun profil trouvé. Veuillez compléter l'onboarding d'abord.")
        return
      }
      const now = new Date().toISOString()
      const fakeRace: Race = {
        ...data,
        id: 'preview',
        status: 'planned',
        order: 0,
        createdAt: now,
      }
      const result = generatePlan(profile, fakeRace)
      setPreview(result)
    }
    buildPreview()
  }, [data])

  async function handleConfirm() {
    if (!preview) return
    setSaving(true)
    try {
      const profile = await db.getProfile()
      if (!profile) return

      const now = new Date().toISOString()
      const raceId = generateId()

      const races = await db.listRaces()
      const nextOrder = races.length

      const savedRace: Race = {
        ...data,
        id: raceId,
        status: 'planned',
        order: nextOrder,
        createdAt: now,
      }
      await db.saveRace(savedRace)

      const savedPlan = { ...preview.plan, id: generateId(), raceId }
      await db.savePlan(savedPlan)

      await Promise.all(preview.weeks.map((w) => db.saveWeek({ ...w, planId: savedPlan.id })))
      await Promise.all(preview.sessions.map((s) => db.saveSession(s)))

      router.replace('/dashboard')
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div>
        <p className="text-destructive text-sm">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 border border-border rounded-md py-2.5 px-4 text-sm font-medium hover:bg-accent transition-colors"
        >
          ← Retour
        </button>
      </div>
    )
  }

  const phaseCounts = preview
    ? preview.weeks.reduce<Record<string, number>>((acc, w) => {
        acc[w.phase] = (acc[w.phase] ?? 0) + 1
        return acc
      }, {})
    : {}

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Confirme ton objectif</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Vérifie les informations avant de créer le plan.
      </p>

      {/* Résumé course */}
      <div className="bg-muted/50 rounded-lg p-4 mb-5">
        <div className="text-sm font-medium mb-1">
          {data.name ?? distanceLabel[data.distance]}
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>Distance : {data.distanceKm} km</div>
          <div>Date : {data.targetDate}</div>
          {data.elevationGain !== undefined && (
            <div>Dénivelé : +{data.elevationGain} m</div>
          )}
        </div>
      </div>

      {/* Plan preview */}
      {!preview ? (
        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          Génération en cours…
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 mb-8">
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
          onClick={handleConfirm}
          disabled={!preview || saving}
          className="flex-1 bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
        >
          {saving ? 'Enregistrement…' : 'Créer l\'objectif'}
        </button>
      </div>
    </div>
  )
}
