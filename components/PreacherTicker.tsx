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
    <div className="relative w-32 h-40">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .counter-fall {
          animation: fall 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      
      {/* Bible */}
      <svg className="absolute inset-0" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bibleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#b8c5d6', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#8a9aaa', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        
        {/* Back cover shadow */}
        <rect x="4" y="6" width="58" height="128" fill="#6a7a8a" rx="2"/>
        
        {/* Front cover */}
        <rect x="0" y="2" width="60" height="132" fill="url(#bibleGradient)" rx="2" stroke="#5a6a7a" strokeWidth="1"/>
        
        {/* Page edges */}
        <line x1="60" y1="2" x2="64" y2="6" stroke="#6a7a8a" strokeWidth="1.5"/>
        <line x1="60" y1="134" x2="64" y2="138" stroke="#5a6a7a" strokeWidth="1.5"/>
        <rect x="60" y="2" width="4" height="132" fill="#7a8a9a"/>
        
        {/* Cross symbol */}
        <g transform="translate(30, 30)">
          <rect x="-2" y="-12" width="4" height="24" fill="#d4a574" opacity="0.9"/>
          <rect x="-10" y="-3" width="20" height="6" fill="#d4a574" opacity="0.9"/>
        </g>
        
        {/* Decorative border */}
        <rect x="6" y="12" width="48" height="110" fill="none" stroke="#a0b0c0" strokeWidth="1.5" opacity="0.5" rx="1"/>
        
        {/* Text lines */}
        <line x1="12" y1="35" x2="48" y2="35" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        <line x1="12" y1="45" x2="48" y2="45" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        <line x1="12" y1="55" x2="48" y2="55" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        <line x1="12" y1="75" x2="48" y2="75" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        <line x1="12" y1="85" x2="48" y2="85" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        <line x1="12" y1="95" x2="48" y2="95" stroke="#9aaa9a" strokeWidth="0.8" opacity="0.5"/>
        
        {/* Spine */}
        <line x1="68" y1="6" x2="68" y2="134" stroke="#5a6a7a" strokeWidth="3" opacity="0.7"/>
        <circle cx="68" cy="70" r="2.5" fill="#a0b0c0" opacity="0.5"/>
      </svg>
      
      {/* Counter with falling animation */}
      <div className="absolute bottom-8 right-0 counter-fall">
        <div className="bg-gradient-to-br from-lime-400 to-lime-500 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-2xl ring-4 ring-white hover:shadow-lg transition-shadow">
          <div className="text-center">
            <p className="text-xl font-bold leading-tight">{loading ? '...' : count}+</p>
          </div>
        </div>
      </div>
    </div>
  )
}
