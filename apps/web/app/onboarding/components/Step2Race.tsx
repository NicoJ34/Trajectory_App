import { weeksBetween, toISODate } from '@trajectory/shared'
import type { RaceDistance } from '@trajectory/shared'

interface Step2Data {
  distance?: RaceDistance
  distanceKm?: number
  targetDate?: string
  name?: string
  elevationGain?: number
}

interface Step2RaceProps {
  data: Step2Data
  onChange: (data: Step2Data) => void
  onNext: () => void
  onBack: () => void
}

const DISTANCE_OPTIONS: { value: RaceDistance; label: string; km: number }[] = [
  { value: '10k', label: '10 km', km: 10 },
  { value: 'half', label: 'Semi-marathon', km: 21.097 },
  { value: 'marathon', label: 'Marathon', km: 42.195 },
  { value: 'custom', label: 'Trail / Autre', km: 0 },
]

const today = toISODate(new Date())

export default function Step2Race({ data, onChange, onNext, onBack }: Step2RaceProps) {
  const weeksCount =
    data.targetDate
      ? weeksBetween(new Date(), new Date(data.targetDate + 'T00:00:00Z'))
      : null

  const dateIsPast = data.targetDate ? data.targetDate < today : false
  const showWarning = weeksCount !== null && weeksCount < 8 && !dateIsPast

  const isValid =
    data.distance !== undefined &&
    data.targetDate !== undefined &&
    !dateIsPast &&
    (data.distance !== 'custom' || (data.distanceKm !== undefined && data.distanceKm > 0))

  function handleDistanceSelect(opt: (typeof DISTANCE_OPTIONS)[number]) {
    onChange({
      ...data,
      distance: opt.value,
      distanceKm: opt.km > 0 ? opt.km : data.distanceKm,
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Ta course cible</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Le plan sera construit jusqu&apos;à cette date.
      </p>

      {/* Distance */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Distance</label>
        <div className="grid grid-cols-2 gap-3">
          {DISTANCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleDistanceSelect(opt)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                data.distance === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              {opt.km > 0 && (
                <div className="text-xs text-muted-foreground">{opt.km} km</div>
              )}
            </button>
          ))}
        </div>

        {data.distance === 'custom' && (
          <div className="mt-3">
            <input
              type="number"
              min={1}
              value={data.distanceKm ?? ''}
              onChange={(e) =>
                onChange({ ...data, distanceKm: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="Distance en km"
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}
      </div>

      {/* Date */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">Date de la course</label>
        <input
          type="date"
          min={today}
          value={data.targetDate ?? ''}
          onChange={(e) => onChange({ ...data, targetDate: e.target.value || undefined })}
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {dateIsPast && (
          <p className="text-destructive text-xs mt-1">La date doit être dans le futur.</p>
        )}
        {showWarning && (
          <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
            ⚠ Moins de 8 semaines — le plan sera compressé, mais c&apos;est possible.
          </p>
        )}
        {weeksCount !== null && !dateIsPast && (
          <p className="text-muted-foreground text-xs mt-1">
            {weeksCount} semaine{weeksCount > 1 ? 's' : ''} de préparation
          </p>
        )}
      </div>

      {/* Nom (optionnel) */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-1">
          Nom de la course{' '}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <input
          type="text"
          value={data.name ?? ''}
          onChange={(e) => onChange({ ...data, name: e.target.value || undefined })}
          placeholder="ex: Marathon de Paris 2026"
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Dénivelé (optionnel) */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-1">
          Dénivelé positif (m){' '}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <input
          type="number"
          min={0}
          value={data.elevationGain ?? ''}
          onChange={(e) =>
            onChange({ ...data, elevationGain: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="ex: 800"
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-border rounded-md py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          Continuer →
        </button>
      </div>
    </div>
  )
}
