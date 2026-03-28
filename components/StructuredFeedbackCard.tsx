'use client'

import { format } from 'date-fns'
import { Star } from 'lucide-react'

interface FeedbackCategory {
  name: string
  score: number
  description?: string
}

interface StructuredFeedbackCardProps {
  reviewerName: string
  churchName: string
  denomination: string
  rating: number
  categories: FeedbackCategory[]
  comment: string
  isVerified: boolean
  serviceDate?: string
  createdAt: string
}

export default function StructuredFeedbackCard({
  reviewerName,
  churchName,
  denomination,
  rating,
  categories,
  comment,
  isVerified,
  serviceDate,
  createdAt,
}: StructuredFeedbackCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{reviewerName}</h3>
            {isVerified && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified Service
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{churchName}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{denomination}</span>
          </div>
          {serviceDate && (
            <p className="text-xs text-gray-500 mt-1">
              Service: {format(new Date(serviceDate), 'MMM d, yyyy')}
            </p>
          )}
        </div>

        {/* Overall Rating Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
        <p className="text-sm font-semibold text-gray-900 mb-3">Ministry Pillars</p>
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">{category.name}</label>
              <span className="text-sm font-semibold text-primary-600">{category.score}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(category.score / 5) * 100}%` }}
              ></div>
            </div>
            {category.description && (
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 italic">"{comment}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
        <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
        <span className="text-primary-600 font-semibold">Helpful Review</span>
      </div>
    </div>
  )
}
