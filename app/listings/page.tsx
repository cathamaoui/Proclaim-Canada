'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect /listings to /browse
export default function ListingsRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/browse')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to listings...</p>
    </div>
  )
}
