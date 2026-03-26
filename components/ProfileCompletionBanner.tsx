'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProfileScore {
  completionPercentage: number
  score: number
  missing: string[]
  recommendations: string[]
}

export default function ProfileCompletionBanner() {
  const [score, setScore] = useState<ProfileScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed this banner
    const dismissed = localStorage.getItem('profileCompletionBannerDismissed')
    if (dismissed) {
      setDismissed(true)
    }

    const fetchScore = async () => {
      try {
        const response = await fetch('/api/profile-completion')
        if (!response.ok) throw new Error('Failed to fetch profile completion')
        const data = await response.json()
        setScore(data.score)
      } catch (err) {
        console.error('Error fetching profile completion:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchScore()
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('profileCompletionBannerDismissed', 'true')
  }

  if (loading || dismissed || !score || score.completionPercentage === 100) {
    return null
  }

  const getColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 border-green-400'
    if (percentage >= 60) return 'bg-blue-100 border-blue-400'
    if (percentage >= 40) return 'bg-yellow-100 border-yellow-400'
    return 'bg-red-100 border-red-400'
  }

  const getTextColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-900'
    if (percentage >= 60) return 'text-blue-900'
    if (percentage >= 40) return 'text-yellow-900'
    return 'text-red-900'
  }

  const getButtonColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600 hover:bg-green-700'
    if (percentage >= 60) return 'bg-blue-600 hover:bg-blue-700'
    if (percentage >= 40) return 'bg-yellow-600 hover:bg-yellow-700'
    return 'bg-red-600 hover:bg-red-700'
  }

  return (
    <div className={`border-l-4 p-4 mb-6 flex items-center justify-between ${getColor(score.completionPercentage)}`}>
      <div className="flex-1">
        <h3 className={`font-semibold mb-1 ${getTextColor(score.completionPercentage)}`}>
          Complete Your Profile ({score.completionPercentage}% done)
        </h3>
        <p className={`text-sm mb-3 ${getTextColor(score.completionPercentage)}`}>
          {score.recommendations[0] || 'Add more information to improve your chances'}
        </p>
        <div className="w-full bg-gray-300 rounded-full h-2 max-w-xs">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getButtonColor(score.completionPercentage)}`}
            style={{ width: `${score.completionPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Link
          href="/dashboard/profile"
          className={`px-4 py-2 rounded font-medium text-white transition-colors ${getButtonColor(score.completionPercentage)}`}
        >
          Complete
        </Link>
        <button
          onClick={handleDismiss}
          className={`px-3 py-2 rounded font-medium ${getTextColor(score.completionPercentage)} hover:opacity-75`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
