import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Step1Distance from '../app/create-objective/components/Step1Distance'
import Step2Details from '../app/create-objective/components/Step2Details'

// ─── Step1Distance ─────────────────────────────────────────────────────────────

describe('Step1Distance', () => {
  it('bouton disabled si aucune distance sélectionnée', () => {
    render(<Step1Distance data={{}} onChange={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('bouton enabled si distance standard sélectionnée', () => {
    render(
      <Step1Distance
        data={{ distance: 'marathon', distanceKm: 42.195 }}
        onChange={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Continuer →')).not.toBeDisabled()
  })

  it('sélection Marathon appelle onChange avec distanceKm = 42.195', () => {
    const onChange = vi.fn()
    render(<Step1Distance data={{}} onChange={onChange} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText('Marathon'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ distance: 'marathon', distanceKm: 42.195 })
    )
  })

  it('sélection 10 km appelle onChange avec distanceKm = 10', () => {
    const onChange = vi.fn()
    render(<Step1Distance data={{}} onChange={onChange} onNext={vi.fn()} />)
    // The button contains "10 km" as its heading — use getAllByText and pick the button
    const buttons = screen.getAllByRole('button')
    const btn10k = buttons.find((b) => b.textContent?.includes('10 km') && !b.textContent?.includes('Semi'))!
    fireEvent.click(btn10k)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ distance: '10k', distanceKm: 10 })
    )
  })

  it('bouton disabled si custom sélectionné sans distance', () => {
    render(
      <Step1Distance data={{ distance: 'custom' }} onChange={vi.fn()} onNext={vi.fn()} />
    )
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('bouton enabled si custom avec distanceKm > 0', () => {
    render(
      <Step1Distance
        data={{ distance: 'custom', distanceKm: 80 }}
        onChange={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Continuer →')).not.toBeDisabled()
  })

  it('appelle onNext quand le bouton est cliqué avec données valides', () => {
    const onNext = vi.fn()
    render(
      <Step1Distance
        data={{ distance: 'half', distanceKm: 21.097 }}
        onChange={vi.fn()}
        onNext={onNext}
      />
    )
    fireEvent.click(screen.getByText('Continuer →'))
    expect(onNext).toHaveBeenCalled()
  })
})

// ─── Step2Details ──────────────────────────────────────────────────────────────

describe('Step2Details', () => {
  const futureDate = (() => {
    const d = new Date()
    d.setUTCFullYear(d.getUTCFullYear() + 1)
    return d.toISOString().split('T')[0]
  })()

  it('bouton disabled si aucune date sélectionnée', () => {
    render(<Step2Details data={{}} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('bouton enabled si date valide dans le futur', () => {
    render(
      <Step2Details
        data={{ targetDate: futureDate }}
        onChange={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />
    )
    expect(screen.getByText('Continuer →')).not.toBeDisabled()
  })

  it('affiche le warning si < 8 semaines', () => {
    const soon = new Date()
    soon.setUTCDate(soon.getUTCDate() + 14)
    const soonDate = soon.toISOString().split('T')[0]
    render(
      <Step2Details
        data={{ targetDate: soonDate }}
        onChange={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />
    )
    expect(screen.getByText(/Moins de 8 semaines/)).toBeInTheDocument()
  })

  it('affiche l\'erreur si date dans le passé', () => {
    render(
      <Step2Details
        data={{ targetDate: '2020-01-01' }}
        onChange={vi.fn()}
        onNext={vi.fn()}
        onBack={vi.fn()}
      />
    )
    expect(screen.getByText(/La date doit être dans le futur/)).toBeInTheDocument()
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('appelle onBack quand le bouton retour est cliqué', () => {
    const onBack = vi.fn()
    render(
      <Step2Details data={{}} onChange={vi.fn()} onNext={vi.fn()} onBack={onBack} />
    )
    fireEvent.click(screen.getByText('← Retour'))
    expect(onBack).toHaveBeenCalled()
  })
})
