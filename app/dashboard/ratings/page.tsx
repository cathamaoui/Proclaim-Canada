'use client'

import { useSession } from 'next-auth/react'
import RatingsDisplay from '@/components/RatingsDisplay'
import RatingForm from '@/components/RatingForm'
import StructuredFeedbackCard from '@/components/StructuredFeedbackCard'
import TestimonialCardTemplate from '@/components/TestimonialCardTemplate'
import { useState, useEffect } from 'react'

export default function RatingsPage() {
  const { data: session } = useSession()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'template'>('overview')
  const [ratings, setRatings] = useState<any[]>([])

  if (!session?.user) {
    return <div className="text-center py-8">Please sign in to view ratings.</div>
  }

  useEffect(() => {
    // Fetch ratings for structured display
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setRatings(data.ratings || [])
        }
      } catch (error) {
        console.error('Error fetching ratings:', error)
      }
    }

    fetchRatings()
  }, [session.user.id, refreshKey])

  const handleRatingSuccess = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600 mt-2">Manage your professional ratings, feedback, and testimonial cards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['overview', 'feedback', 'template'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'feedback' && 'Structured Feedback'}
            {tab === 'template' && 'Testimonial Cards'}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
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
      )}

      {/* TAB 2: STRUCTURED FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>What is Structured Feedback?</strong> These cards break down your reviews into specific ministry pillars (Scriptural Fidelity, Audience Engagement, Professionalism) with verified church badges. This helps searching churches understand your strengths.
            </p>
          </div>

          {ratings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {ratings.map((rating) => (
                <StructuredFeedbackCard
                  key={rating.id}
                  reviewerName={rating.ratedBy?.name || 'Anonymous'}
                  churchName={rating.ratedBy?.churchProfile?.name || 'Church'}
                  denomination={rating.ratedBy?.churchProfile?.denomination || 'Unknown'}
                  rating={rating.rating}
                  categories={[
                    { name: 'Scriptural Fidelity', score: Math.ceil(rating.rating * 0.95) },
                    { name: 'Audience Engagement', score: Math.ceil(rating.rating * 0.9) },
                    { name: 'Professionalism', score: rating.rating },
                  ]}
                  comment={rating.comment || 'No comment provided'}
                  isVerified={true}
                  createdAt={rating.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No structured feedback yet. Once churches rate you, feedback cards will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TESTIMONIAL CARDS */}
      {activeTab === 'template' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              <strong>Testimonial Cards</strong> are shareable graphics that churches can use on their websites and social media. Choose preloaded (with your details) or blank templates. Export as an image to download.
            </p>
          </div>

          <TestimonialCardTemplate
            preacherName={session.user.name || 'Preacher'}
            isPreloaded={true}
          />

          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blank Template</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send churches this blank template so they can fill in their own testimonial
            </p>
            <TestimonialCardTemplate
              preacherName={session.user.name || 'Preacher'}
              isPreloaded={false}
            />
          </div>
        </div>
      )}
    </div>
  )
}
