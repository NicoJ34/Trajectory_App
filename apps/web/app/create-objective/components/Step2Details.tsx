import { weeksBetween, toISODate } from '@trajectory/shared'

interface Step2Data {
  targetDate?: string
  name?: string
  elevationGain?: number
  notes?: string
}

interface Step2DetailsProps {
  data: Step2Data
  onChange: (data: Step2Data) => void
  onNext: () => void
  onBack: () => void
}

const today = toISODate(new Date())

export default function Step2Details({ data, onChange, onNext, onBack }: Step2DetailsProps) {
  const weeksCount =
    data.targetDate
      ? weeksBetween(new Date(), new Date(data.targetDate + 'T00:00:00Z'))
      : null

  const dateIsPast = data.targetDate ? data.targetDate < today : false
  const showWarning = weeksCount !== null && weeksCount < 8 && !dateIsPast

  const isValid = data.targetDate !== undefined && !dateIsPast

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Les détails</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Date et informations complémentaires sur ta course.
      </p>

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
      <div className="mb-5">
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

      {/* Notes (optionnel) */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-1">
          Notes{' '}
          <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <textarea
          value={data.notes ?? ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value || undefined })}
          placeholder="Objectif de temps, motivation..."
          rows={3}
          className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
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
