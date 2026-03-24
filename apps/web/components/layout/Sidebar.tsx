'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, PenLine, CloudSun, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/create-objective', label: 'Nouvel objectif', icon: Target },
  { href: '/logger', label: 'Logger séance', icon: PenLine },
  { href: '/weather', label: 'Météo', icon: CloudSun },
  { href: '/profile', label: 'Profil', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] min-h-screen border-r border-border bg-background flex flex-col shrink-0">
      <div className="px-4 py-6 border-b border-border">
        <span className="text-lg font-semibold tracking-tight">Trajectory</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
