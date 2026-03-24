import type { ExperienceLevel, Terrain } from '@trajectory/shared'

interface Step1Data {
  experience?: ExperienceLevel
  weeklyVolume?: number
  availableDays?: number
  terrain?: Terrain
  injuries?: string
}

interface Step1ProfileProps {
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
}

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Débutant', desc: 'Moins de 6 mois de course' },
  { value: 'intermediate', label: 'Intermédiaire', desc: '6 mois à 3 ans de course' },
  { value: 'advanced', label: 'Avancé', desc: 'Plus de 3 ans, compétiteur' },
]

export default function Step1Profile({ data, onChange, onNext }: Step1ProfileProps) {
  const isValid =
    data.experience !== undefined &&
    data.weeklyVolume !== undefined &&
    data.weeklyVolume > 0 &&
    data.availableDays !== undefined &&
    data.availableDays >= 1 &&
    data.availableDays <= 7

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Ton profil de coureur</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Ces informations servent à calibrer ton plan d&apos;entraînement.
      </p>

      {/* Niveau */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Niveau</label>
        <div className="grid grid-cols-3 gap-3">
          {EXPERIENCE_OPTIONS.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...data, experience: value })}
              className={`p-3 rounded-lg border text-left transition-colors ${
                data.experience === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Volume + Jours */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Volume hebdo (km)
          </label>
          <input
            type="number"
            min={0}
            max={200}
            value={data.weeklyVolume ?? ''}
            onChange={(e) =>
              onChange({ ...data, weeklyVolume: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="ex: 40"
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Jours disponibles / sem
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={data.availableDays ?? ''}
            onChange={(e) =>
              onChange({ ...data, availableDays: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="ex: 5"
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Terrain */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">
          Terrain préféré{' '}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <div className="flex gap-3">
          {(['road', 'trail', 'both'] as Terrain[]).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="terrain"
                value={t}
                checked={data.terrain === t}
                onChange={() => onChange({ ...data, terrain: t })}
                className="accent-primary"
              />
              <span className="text-sm capitalize">
                {t === 'road' ? 'Route' : t === 'trail' ? 'Trail' : 'Les deux'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Blessures */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-1">
          Blessures récentes{' '}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <textarea
          rows={2}
          value={data.injuries ?? ''}
          onChange={(e) => onChange({ ...data, injuries: e.target.value || undefined })}
          placeholder="ex: tendinite genou droit il y a 2 mois"
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

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
