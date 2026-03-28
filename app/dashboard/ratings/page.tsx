'use client'

import { useSession } from 'next-auth/react'
import RatingsDisplay from '@/components/RatingsDisplay'
import RatingForm from '@/components/RatingForm'
import { useState } from 'react'

export default function RatingsPage() {
  const { data: session } = useSession()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showForm, setShowForm] = useState(false)

  if (!session?.user) {
    return <div className="text-center py-8">Please sign in to view ratings.</div>
  }

  const handleRatingSuccess = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1) // Force refresh of ratings display
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600 mt-2">Manage your professional ratings and reviews</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ratings Display - Main Column */}
        <div className="lg:col-span-2">
          <RatingsDisplay key={refreshKey} userId={session.user.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* CTA for churches to rate */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Get More Reviews</h3>
            <p className="text-sm text-blue-800 mb-4">
              Ask churches you've worked with to leave a review and rating.
            </p>
            <p className="text-xs text-blue-700">
              Higher ratings help you stand out to churches looking for preachers.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Rating Tips</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Professionalism and punctuality matter</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Quality preaching and preparation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">✓</span>
                <span>Communication and responsiveness</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
