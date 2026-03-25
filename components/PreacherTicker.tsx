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
      <div className="relative w-28 h-36">
        {/* Bible Shape - more realistic */}
        <svg className="absolute inset-0" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back cover shadow */}
          <defs>
            <linearGradient id="bibieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#2d3f50', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#4a5f75', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#3d4f62', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#2a3a4a', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          {/* 3D effect - back page */}
          <rect x="4" y="6" width="58" height="128" fill="#1a2a3a" rx="2"/>
          
          {/* Front cover with gradient */}
          <rect x="0" y="2" width="60" height="132" fill="url(#coverGradient)" rx="2" stroke="#1a1f28" strokeWidth="1"/>
          
          {/* Page edges on right */}
          <line x1="60" y1="2" x2="64" y2="6" stroke="#2a3a4a" strokeWidth="1.5"/>
          <line x1="60" y1="134" x2="64" y2="138" stroke="#1a1f28" strokeWidth="1.5"/>
          <rect x="60" y="2" width="4" height="132" fill="#3a4a5a"/>
          
          {/* Cross symbol on cover */}
          <g transform="translate(30, 30)">
            <rect x="-2" y="-12" width="4" height="24" fill="#c9a961" opacity="0.8"/>
            <rect x="-10" y="-3" width="20" height="6" fill="#c9a961" opacity="0.8"/>
          </g>
          
          {/* Decorative border */}
          <rect x="6" y="12" width="48" height="110" fill="none" stroke="#8899aa" strokeWidth="1.5" opacity="0.4" rx="1"/>
          
          {/* Text lines */}
          <line x1="12" y1="35" x2="48" y2="35" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="45" x2="48" y2="45" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="55" x2="48" y2="55" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="75" x2="48" y2="75" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="85" x2="48" y2="85" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          <line x1="12" y1="95" x2="48" y2="95" stroke="#7a8a9a" strokeWidth="0.8" opacity="0.5"/>
          
          {/* Spine */}
          <line x1="68" y1="6" x2="68" y2="134" stroke="#2a3a4a" strokeWidth="3" opacity="0.7"/>
          <circle cx="68" cy="70" r="2.5" fill="#8899aa" opacity="0.5"/>
        </svg>
        
        {/* Counter Overlay */}
        <div className="absolute top-12 right-0 transform translate-x-4">
          <div className="bg-gradient-to-br from-lime-400 to-lime-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl ring-4 ring-white hover:shadow-lg transition-shadow">
            <div className="text-center">
              <p className="text-xl font-bold leading-tight">{loading ? '...' : count}+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
