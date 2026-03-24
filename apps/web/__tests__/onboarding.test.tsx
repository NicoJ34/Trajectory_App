import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Step1Profile from '../app/onboarding/components/Step1Profile'
import Step2Race from '../app/onboarding/components/Step2Race'
import Step3Preferences from '../app/onboarding/components/Step3Preferences'

// ─── Step1Profile ─────────────────────────────────────────────────────────────

describe('Step1Profile', () => {
  it('bouton disabled si aucun champ rempli', () => {
    render(<Step1Profile data={{}} onChange={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('bouton enabled si tous les champs requis sont remplis', () => {
    const data = { experience: 'intermediate' as const, weeklyVolume: 40, availableDays: 5 }
    render(<Step1Profile data={data} onChange={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getByText('Continuer →')).not.toBeDisabled()
  })

  it('appelle onChange quand on clique sur un niveau', () => {
    const onChange = vi.fn()
    render(<Step1Profile data={{}} onChange={onChange} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText('Débutant'))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ experience: 'beginner' }))
  })

  it('appelle onNext quand le bouton est cliqué', () => {
    const onNext = vi.fn()
    const data = { experience: 'intermediate' as const, weeklyVolume: 40, availableDays: 5 }
    render(<Step1Profile data={data} onChange={vi.fn()} onNext={onNext} />)
    fireEvent.click(screen.getByText('Continuer →'))
    expect(onNext).toHaveBeenCalled()
  })
})

// ─── Step2Race ────────────────────────────────────────────────────────────────

describe('Step2Race', () => {
  const futureDate = (() => {
    const d = new Date()
    d.setUTCFullYear(d.getUTCFullYear() + 1)
    return d.toISOString().split('T')[0]
  })()

  it('bouton disabled si aucune distance sélectionnée', () => {
    render(<Step2Race data={{}} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('Continuer →')).toBeDisabled()
  })

  it('bouton enabled si distance + date valides', () => {
    const data = { distance: 'marathon' as const, distanceKm: 42.195, targetDate: futureDate }
    render(<Step2Race data={data} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('Continuer →')).not.toBeDisabled()
  })

  it('affiche le warning si < 8 semaines', () => {
    const soon = new Date()
    soon.setUTCDate(soon.getUTCDate() + 14)
    const data = {
      distance: 'half' as const,
      distanceKm: 21.097,
      targetDate: soon.toISOString().split('T')[0],
    }
    render(<Step2Race data={data} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText(/Moins de 8 semaines/)).toBeInTheDocument()
  })

  it('sélection Marathon appelle onChange avec distanceKm = 42.195', () => {
    const onChange = vi.fn()
    render(<Step2Race data={{}} onChange={onChange} onNext={vi.fn()} onBack={vi.fn()} />)
    fireEvent.click(screen.getByText('Marathon'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ distance: 'marathon', distanceKm: 42.195 })
    )
  })

  it('appelle onBack quand le bouton retour est cliqué', () => {
    const onBack = vi.fn()
    render(<Step2Race data={{}} onChange={vi.fn()} onNext={vi.fn()} onBack={onBack} />)
    fireEvent.click(screen.getByText('← Retour'))
    expect(onBack).toHaveBeenCalled()
  })
})

// ─── Step3Preferences ─────────────────────────────────────────────────────────

describe('Step3Preferences', () => {
  it('bouton disabled si préférences non sélectionnées', () => {
    render(<Step3Preferences data={{}} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('Voir mon plan →')).toBeDisabled()
  })

  it('bouton enabled si tous les champs requis sont remplis', () => {
    const data = {
      preferredLongRunDay: 'sunday' as const,
      crossTraining: 'strength' as const,
      units: 'km' as const,
    }
    render(<Step3Preferences data={data} onChange={vi.fn()} onNext={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText('Voir mon plan →')).not.toBeDisabled()
  })

  it('appelle onChange quand on sélectionne Dimanche', () => {
    const onChange = vi.fn()
    render(<Step3Preferences data={{}} onChange={onChange} onNext={vi.fn()} onBack={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Dimanche'))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ preferredLongRunDay: 'sunday' })
    )
  })
})
