import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Sidebar from '../components/layout/Sidebar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('Sidebar', () => {
  it('affiche les 5 liens de navigation', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Nouvel objectif')).toBeInTheDocument()
    expect(screen.getByText('Logger séance')).toBeInTheDocument()
    expect(screen.getByText('Météo')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('les liens pointent vers les bonnes routes', () => {
    render(<Sidebar />)
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard')
    expect(screen.getByText('Nouvel objectif').closest('a')).toHaveAttribute('href', '/create-objective')
    expect(screen.getByText('Logger séance').closest('a')).toHaveAttribute('href', '/logger')
    expect(screen.getByText('Météo').closest('a')).toHaveAttribute('href', '/weather')
    expect(screen.getByText('Profil').closest('a')).toHaveAttribute('href', '/profile')
  })

  it('met en évidence le lien actif', () => {
    render(<Sidebar />)
    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('bg-accent')
  })

  it('n\'inclut pas les anciennes routes', () => {
    render(<Sidebar />)
    expect(screen.queryByText('Plan semaine')).not.toBeInTheDocument()
    expect(screen.queryByText('Calendrier')).not.toBeInTheDocument()
    expect(screen.queryByText('Historique')).not.toBeInTheDocument()
    expect(screen.queryByText('Réglages')).not.toBeInTheDocument()
  })
})
