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
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold text-gray-700">PREACHERS SIGNED UP</p>
      <div className="relative w-24 h-32">
        {/* Bible Shape */}
        <svg className="absolute inset-0" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left page */}
          <path d="M 10 10 L 35 10 L 35 110 L 10 110 Q 5 110 5 105 L 5 15 Q 5 10 10 10 Z" fill="#4b5563" stroke="#2c3e50" strokeWidth="1.5"/>
          {/* Right page */}
          <path d="M 35 10 L 70 10 Q 75 10 75 15 L 75 105 Q 75 110 70 110 L 35 110 Z" fill="#6b7485" stroke="#2c3e50" strokeWidth="1.5"/>
          {/* Spine */}
          <line x1="35" y1="10" x2="35" y2="110" stroke="#2c3e50" strokeWidth="2"/>
          {/* Page lines */}
          <line x1="15" y1="25" x2="30" y2="25" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
          <line x1="15" y1="35" x2="30" y2="35" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
          <line x1="15" y1="45" x2="30" y2="45" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
          <line x1="40" y1="25" x2="65" y2="25" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
          <line x1="40" y1="35" x2="65" y2="35" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
          <line x1="40" y1="45" x2="65" y2="45" stroke="#8899aa" strokeWidth="0.8" opacity="0.6"/>
        </svg>
        
        {/* Counter Overlay */}
        <div className="absolute top-1/4 right-0 transform translate-x-2">
          <div className="bg-lime-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg ring-4 ring-white">
            <div className="text-center">
              <p className="text-2xl font-bold">{loading ? '...' : count}+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
