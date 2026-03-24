import type { CrossTraining, Units } from '@trajectory/shared'

interface Step3Data {
  preferredLongRunDay?: 'saturday' | 'sunday'
  crossTraining?: CrossTraining
  units?: Units
}

interface Step3PreferencesProps {
  data: Step3Data
  onChange: (data: Step3Data) => void
  onNext: () => void
  onBack: () => void
}

const CROSS_OPTIONS: { value: CrossTraining; label: string }[] = [
  { value: 'strength', label: 'Renforcement' },
  { value: 'swimming', label: 'Natation' },
  { value: 'cycling', label: 'Vélo' },
  { value: 'hiking', label: 'Randonnée' },
  { value: 'none', label: 'Aucun' },
]

export default function Step3Preferences({ data, onChange, onNext, onBack }: Step3PreferencesProps) {
  const isValid =
    data.preferredLongRunDay !== undefined &&
    data.crossTraining !== undefined &&
    data.units !== undefined

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Tes préférences</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Pour personnaliser la structure de tes semaines.
      </p>

      {/* Jour long run */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Jour de la sortie longue</label>
        <div className="flex gap-3">
          {(['saturday', 'sunday'] as const).map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="longRunDay"
                value={day}
                checked={data.preferredLongRunDay === day}
                onChange={() => onChange({ ...data, preferredLongRunDay: day })}
                className="accent-primary"
              />
              <span className="text-sm">{day === 'saturday' ? 'Samedi' : 'Dimanche'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cross-training */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2">Cross-training préféré</label>
        <div className="grid grid-cols-3 gap-2">
          {CROSS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...data, crossTraining: value })}
              className={`p-2.5 rounded-lg border text-sm transition-colors ${
                data.crossTraining === value
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Unités */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Unités</label>
        <div className="flex gap-3">
          {(['km', 'miles'] as Units[]).map((u) => (
            <label key={u} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="units"
                value={u}
                checked={data.units === u}
                onChange={() => onChange({ ...data, units: u })}
                className="accent-primary"
              />
              <span className="text-sm">{u}</span>
            </label>
          ))}
        </div>
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
          Voir mon plan →
        </button>
      </div>
    </div>
  )
}
