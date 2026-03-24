'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

const NO_SIDEBAR_ROUTES = ['/onboarding', '/create-objective', '/add-session']

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = !NO_SIDEBAR_ROUTES.some((route) => pathname.startsWith(route))

  if (!showSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen max-w-[1400px] mx-auto">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
