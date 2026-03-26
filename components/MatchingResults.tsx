'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MatchScore {
  preacherId: string
  preacherName: string
  preacherEmail: string
  profilePhotoUrl?: string
  rating: number
  yearsOfExperience: number
  matchScore: number
  matchDetails: {
    serviceTypeMatch: number
    denominationMatch: number
    experienceScore: number
    languageMatch: number
    answersQuality: number
    ratingBonus: number
    travelDistance: number
    overallFit: number
  }
  reasonsForMatch: string[]
  reasonsAgainstMatch: string[]
}

interface MatchingResult {
  listing: {
    id: string
    title: string
    serviceType: string
    denomination: string
  }
  matches: MatchScore[]
  totalMatches: number
}

export default function MatchingResults({ listingId }: { listingId: string }) {
  const [results, setResults] = useState<MatchingResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}/matches`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        } else {
          setError('Failed to calculate matches')
        }
      } catch (err) {
        console.error('Error fetching matches:', err)
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchMatches()
    }
  }, [listingId])

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    if (score >= 55) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'from-green-400 to-green-600'
    if (score >= 70) return 'from-blue-400 to-blue-600'
    if (score >= 55) return 'from-yellow-400 to-yellow-600'
    return 'from-gray-400 to-gray-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Calculating best matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  if (!results || results.matches.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No matching candidates found for this listing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
        <p className="text-lime-800 font-medium">
          Found <span className="font-bold">{results.totalMatches}</span> potential candidates. 
          Below are the top matches ranked by compatibility.
        </p>
      </div>

      <div className="space-y-3">
        {results.matches.map((match) => (
          <div
            key={match.preacherId}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {/* Header with score */}
            <button
              onClick={() =>
                setExpandedId(
                  expandedId === match.preacherId ? null : match.preacherId
                )
              }
              className="w-full p-4 flex items-start gap-4 hover:bg-gray-50 focus:outline-none"
            >
              {/* Photo */}
              {match.profilePhotoUrl ? (
                <img
                  src={match.profilePhotoUrl}
                  alt={match.preacherName}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xl">
                  👤
                </div>
              )}

              {/* Info */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900">{match.preacherName}</h3>
                <p className="text-sm text-gray-600">{match.preacherEmail}</p>
                <div className="flex gap-3 mt-2 text-sm">
                  <span>📊 {match.yearsOfExperience} years exp.</span>
                  <span>⭐ {match.rating.toFixed(1)}/5.0</span>
                </div>
              </div>

              {/* Match Score */}
              <div className="text-right flex-shrink-0">
                <div className={`inline-block relative w-20 h-20 rounded-full ${getScoreBg(match.matchScore)} flex items-center justify-center`}>
                  <div className="text-center text-white font-bold">
                    <div className="text-2xl">{Math.round(match.matchScore)}</div>
                    <div className="text-xs">match</div>
                  </div>
                </div>
              </div>

              {/* Chevron */}
              <div className="text-gray-400">
                <svg
                  className={`w-6 h-6 transition-transform ${
                    expandedId === match.preacherId ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === match.preacherId && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* Match Details Grid */}
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Match Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Service Type</p>
                      <p className="text-lg font-bold text-green-700">
                        {match.matchDetails.serviceTypeMatch}/25
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Denomination</p>
                      <p className="text-lg font-bold text-blue-700">
                        {match.matchDetails.denominationMatch}/20
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Experience</p>
                      <p className="text-lg font-bold text-purple-700">
                        {match.matchDetails.experienceScore}/15
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Languages</p>
                      <p className="text-lg font-bold text-orange-700">
                        {match.matchDetails.languageMatch.toFixed(1)}/10
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Screening Answers</p>
                      <p className="text-lg font-bold text-pink-700">
                        {match.matchDetails.answersQuality}/15
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded">
                      <p className="text-xs text-gray-600">Rating Bonus</p>
                      <p className="text-lg font-bold text-yellow-700">
                        {match.matchDetails.ratingBonus.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Positive Reasons */}
                  {match.reasonsForMatch.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">✓</span> Strengths
                      </h5>
                      <ul className="space-y-1">
                        {match.reasonsForMatch.map((reason, idx) => (
                          <li key={idx} className="text-sm text-green-800">
                            • {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Negative Reasons */}
                  {match.reasonsAgainstMatch.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <h5 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">!</span> Considerations
                      </h5>
                      <ul className="space-y-1">
                        {match.reasonsAgainstMatch.map((reason, idx) => (
                          <li key={idx} className="text-sm text-yellow-800">
                            • {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/browse/preachers/${match.preacherId}`}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition text-center text-sm"
                  >
                    View Profile
                  </Link>
                  <button
                    className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-medium rounded-lg transition text-sm"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
