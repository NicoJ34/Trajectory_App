'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@trajectory/shared'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    getProfile().then((profile) => {
      router.replace(profile ? '/dashboard' : '/onboarding')
    })
  }, [router])

  return null
}
