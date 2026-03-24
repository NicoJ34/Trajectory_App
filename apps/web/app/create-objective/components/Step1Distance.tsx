import type { RaceDistance } from '@trajectory/shared'

interface Step1Data {
  distance?: RaceDistance
  distanceKm?: number
}

interface Step1DistanceProps {
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
}

const DISTANCE_OPTIONS: { value: RaceDistance; label: string; km: number }[] = [
  { value: '10k', label: '10 km', km: 10 },
  { value: 'half', label: 'Semi-marathon', km: 21.097 },
  { value: 'marathon', label: 'Marathon', km: 42.195 },
  { value: 'custom', label: 'Trail / Autre', km: 0 },
]

export default function Step1Distance({ data, onChange, onNext }: Step1DistanceProps) {
  const isValid =
    data.distance !== undefined &&
    (data.distance !== 'custom' || (data.distanceKm !== undefined && data.distanceKm > 0))

  function handleSelect(opt: (typeof DISTANCE_OPTIONS)[number]) {
    onChange({
      ...data,
      distance: opt.value,
      distanceKm: opt.km > 0 ? opt.km : data.distanceKm,
    })
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Quelle distance ?</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Choisis la distance de ta prochaine course.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {DISTANCE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              data.distance === opt.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="font-medium text-sm">{opt.label}</div>
            {opt.km > 0 && (
              <div className="text-xs text-muted-foreground mt-0.5">{opt.km} km</div>
            )}
          </button>
        ))}
      </div>

      {data.distance === 'custom' && (
        <div className="mb-5">
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

      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        Continuer →
      </button>
    </div>
  )
}
