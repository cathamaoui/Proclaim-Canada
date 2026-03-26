'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProfileScore {
  completionPercentage: number
  score: number
  missing: string[]
  recommendations: string[]
}

export default function ProfileCompletionWidget() {
  const [score, setScore] = useState<ProfileScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch('/api/profile-completion')
        if (!response.ok) throw new Error('Failed to fetch profile completion')
        const data = await response.json()
        setScore(data.score)
      } catch (err) {
        console.error('Error fetching profile completion:', err)
        setError('Could not load profile completion data')
      } finally {
        setLoading(false)
      }
    }

    fetchScore()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (error || !score) {
    return null
  }

  if (score.completionPercentage === 100) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">✓</div>
          <div>
            <h3 className="font-semibold text-green-900">Profile Complete!</h3>
            <p className="text-sm text-green-700">Your profile is fully optimized for maximum visibility</p>
          </div>
        </div>
      </div>
    )
  }

  const getColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTextColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-900'
    if (percentage >= 60) return 'text-blue-900'
    if (percentage >= 40) return 'text-yellow-900'
    return 'text-red-900'
  }

  const getBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50'
    if (percentage >= 60) return 'bg-blue-50'
    if (percentage >= 40) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  return (
    <div className={`rounded-lg p-6 ${getBgColor(score.completionPercentage)}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold text-lg ${getTextColor(score.completionPercentage)}`}>
            Profile Completion
          </h3>
          <span className={`text-2xl font-bold ${getTextColor(score.completionPercentage)}`}>
            {score.completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getColor(score.completionPercentage)}`}
            style={{ width: `${score.completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {score.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Recommended Next Steps:</h4>
          <ul className="space-y-2">
            {score.recommendations.slice(0, 3).map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/dashboard/profile"
        className={`inline-block px-4 py-2 rounded font-medium text-white transition-colors ${
          score.completionPercentage >= 80
            ? 'bg-green-600 hover:bg-green-700'
            : score.completionPercentage >= 60
            ? 'bg-blue-600 hover:bg-blue-700'
            : score.completionPercentage >= 40
            ? 'bg-yellow-600 hover:bg-yellow-700'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        Complete Your Profile
      </Link>
    </div>
  )
}
