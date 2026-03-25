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
    <div className="bg-gradient-to-r from-green-500 via-lime-400 to-green-600 text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-green-100">PREACHERS SIGNED UP</p>
        <p className="text-4xl font-bold mt-1">{loading ? '...' : count.toLocaleString()}+</p>
      </div>
      <div className="text-5xl">✨</div>
    </div>
  )
}
