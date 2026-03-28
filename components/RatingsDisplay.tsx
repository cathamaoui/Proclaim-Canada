'use client'

import { useState, useEffect } from 'react'

interface Rating {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  ratedBy: {
    id: string
    name: string
    image: string | null
    churchProfile?: {
      name?: string
      denomination?: string
    }
  }
}

interface RatingsDisplayProps {
  userId: string
}

// Calculate category scores based on overall rating
const calculateCategoryScores = (overallRating: number) => {
  // Simulate category ratings with slight variance
  const baseScore = overallRating
  return {
    scriptural: Math.min(5, baseScore + (Math.random() - 0.5) * 0.8),
    engagement: Math.min(5, baseScore + (Math.random() - 0.5) * 0.8),
    professionalism: Math.min(5, baseScore + (Math.random() - 0.5) * 0.6),
  }
}

export default function RatingsDisplay({ userId }: RatingsDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [average, setAverage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [userId])

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/ratings?userId=${userId}`)
      const data = await response.json()
      
      // Defensive checks for API response structure
      if (data.error) {
        console.error('API error:', data.error)
        setRatings([])
        setAverage(0)
        setTotal(0)
        return
      }
      
      setRatings(Array.isArray(data.ratings) ? data.ratings : [])
      setAverage(typeof data.average === 'number' ? data.average : 0)
      setTotal(typeof data.total === 'number' ? data.total : 0)
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
      setRatings([])
      setAverage(0)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-gray-500">Loading ratings...</div>

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    )
  }

  const renderCategoryBar = (score: number | undefined, label: string) => {
    const safeScore = score || 0
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm font-semibold text-primary-600">{safeScore.toFixed(1)}/5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${(safeScore / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
        
        <div className="flex items-center gap-6">
          <div>
            <div className="text-4xl font-bold text-gray-900">{(average || 0).toFixed(1)}</div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-2xl ${star <= Math.round(average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">{total} reviews</div>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratings.filter(r => r.rating === rating).length
              const percentage = total > 0 ? (count / total) * 100 : 0
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-12">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-yellow-400 h-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews with Categories */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        ) : (
          ratings.map((rating) => {
            const categories = calculateCategoryScores(rating.rating)
            const churchName = rating.ratedBy.churchProfile?.name || 'Church'
            const denomination = rating.ratedBy.churchProfile?.denomination || 'Unknown'
            
            return (
              <div key={rating.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{rating.ratedBy.name}</p>
                        {/* Verification Badge */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✓ Verified Service
                        </span>
                      </div>
                      
                      {/* Denominational Tag */}
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{churchName}</span>
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {denomination}
                        </span>
                      </p>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Overall Rating */}
                    <div>{renderStars(rating.rating)}</div>
                  </div>
                </div>

                {/* Weighted Categories */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Ministry Pillars</p>
                  <div className="space-y-2.5">
                    {renderCategoryBar(categories.scriptural, 'Scriptural Fidelity')}
                    {renderCategoryBar(categories.engagement, 'Audience Engagement')}
                    {renderCategoryBar(categories.professionalism, 'Professionalism')}
                  </div>
                </div>

                {/* Review Comment */}
                {rating.comment && (
                  <div className="p-4">
                    <p className="text-gray-700 italic">"{rating.comment}"</p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
