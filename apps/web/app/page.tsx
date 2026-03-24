'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@trajectory/shared'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    db.getProfile().then((profile) => {
      router.replace(profile ? '/dashboard' : '/onboarding')
    })
  }, [router])

  return null
}
