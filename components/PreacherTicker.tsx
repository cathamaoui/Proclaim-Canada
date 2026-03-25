'use client'

import { useState, useEffect } from 'react'

export default function PreacherTicker() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/stats/preachers')
        const data = await response.json()
        setCount(data.count || 0)
      } catch (error) {
        console.error('Failed to fetch preacher count:', error)
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [])

  return (
    <div className="bg-gradient-to-r from-green-500 via-lime-400 to-green-600 text-white py-3 px-4 rounded-lg shadow-lg w-fit">
      <p className="text-xs font-semibold text-green-100">PREACHERS SIGNED UP</p>
      <div className="flex items-center gap-3 mt-1">
        <p className="text-2xl font-bold">{loading ? '...' : count.toLocaleString()}+</p>
        <div className="text-3xl">✨</div>
      </div>
    </div>
  )
}
