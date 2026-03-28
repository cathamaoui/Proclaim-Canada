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
  }
}

interface RatingsDisplayProps {
  userId: string
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
      setRatings(data.ratings)
      setAverage(data.average)
      setTotal(data.total)
    } catch (error) {
      console.error('Failed to fetch ratings:', error)
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

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
        
        <div className="flex items-center gap-6">
          <div>
            <div className="text-4xl font-bold text-gray-900">{average.toFixed(1)}</div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-2xl ${star <= Math.round(average) ? 'text-yellow-400' : 'text-gray-300'}`}>
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

      {/* Individual Reviews */}
      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{rating.ratedBy.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(rating.rating)}
              </div>
              {rating.comment && (
                <p className="text-gray-700 mt-3">{rating.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
