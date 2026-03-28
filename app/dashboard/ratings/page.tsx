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
      setRatings(data.ratings || [])
      setUserProfile({
        id: session?.user?.id || '',
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        role: session?.user?.role || '',
        rating: data.average,
        totalRatings: data.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading ratings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitRating(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedUser) {
      setError('Please select a person to rate')
      return
    }

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratedUserId: selectedUser,
          ...formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit rating')
      }

      // Reset form
      setShowForm(false)
      setSelectedUser('')
      setFormData({ rating: 5, review: '', type: 'GENERAL' })
      await fetchRatings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting rating')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Reviews</h1>
          <p className="text-gray-600">See how others rate you and rate them</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Leave a Rating'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Your Rating Summary */}
      {userProfile && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Rating Summary</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-5xl font-bold text-primary-600 mb-2">
                {userProfile.rating?.toFixed(1) || 'N/A'}
              </p>
              <p className="text-gray-600">
                Based on {userProfile.totalRatings || 0} rating(s)
              </p>
            </div>
            <div className="text-right">
              <div className="flex justify-end mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(userProfile.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Leave a Rating</h3>
          <form onSubmit={handleSubmitRating} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who are you rating? (Church name or Preacher name)
              </label>
              <input
                type="text"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                placeholder="Enter name or email to search"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: In a full implementation, this would have autocomplete search
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
              >
                <option value="GENERAL">General Interaction</option>
                <option value="APPLICATION">Based on Application</option>
                <option value="LISTING">Based on Listing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5 stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: star })
                    }
                    className="focus:outline-none transition"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {formData.rating} out of 5 stars
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (optional)
              </label>
              <textarea
                value={formData.review}
                onChange={(e) =>
                  setFormData({ ...formData, review: e.target.value })
                }
                placeholder="Share your feedback..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Submit Rating
            </button>
          </form>
        </div>
      )}

      {/* Ratings List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ratings You've Received</h3>
        {ratings.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No ratings yet. Great things start with good collaborations!</p>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{rating.ratedByName}</p>
                  <p className="text-sm text-gray-600">{rating.ratedByRole}</p>
                </div>
                <div className="text-right">
                  <div className="flex justify-end mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {rating.review && (
                <p className="text-gray-700">{rating.review}</p>
              )}
              <p className="text-xs text-gray-500 mt-2 capitalize">
                {rating.type.replace('_', ' ')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
