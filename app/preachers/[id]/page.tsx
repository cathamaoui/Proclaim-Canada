'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PreacherDetail {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  denomination: string
  yearsOfExperience: number
  rating: number
  totalRatings: number
  verified: boolean
  profilePhotoUrl: string
  resumeUrl: string
  website: string
  sermonVideoUrl: string
  specialization: string
  ordinationStatus: string
  speakingFeeRange: string
  travelRadiusKm: number
  languages: string[]
  preferredDenominations: string[]
  availability: string[]
  serviceTypes: string[]
}

export default function ResumeDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = useParams()

  const [preacher, setPreacher] = useState<PreacherDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    if (id && session?.user?.role === 'CHURCH') {
      fetchPreacherDetail()
    }
  }, [id, session])

  const fetchPreacherDetail = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/preachers/${id}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setPreacher(data.preacher)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preacher details')
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvite = async () => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: preacher?.id,
          subject: 'Opportunity Invitation',
          content: 'We have an exciting opportunity we think you would be perfect for. Would you be interested in learning more?',
        }),
      })

      if (!response.ok) throw new Error('Failed to send invite')

      alert('Invitation sent successfully!')
      setShowContactForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view resume details</p>
          <Link href="/auth/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading preacher details...</p>
      </div>
    )
  }

  if (error || !preacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/church-dashboard/browse-resumes" className="text-gray-600 hover:text-gray-900 font-medium mb-4 block">
            ← Back to Browse
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            {error || 'Failed to load resume details'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/church-dashboard/browse-resumes" className="text-gray-600 hover:text-gray-900 font-medium mb-4 block">
            ← Back to Browse
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{preacher.name}</h1>
              <p className="text-gray-600 mt-1">{preacher.denomination}</p>
            </div>
            {preacher.verified && (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="md:col-span-2">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ⭐ {preacher.rating}/5
                  </p>
                  <p className="text-xs text-gray-500">({preacher.totalRatings} reviews)</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Experience</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {preacher.yearsOfExperience}
                  </p>
                  <p className="text-xs text-gray-500">years</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Travel Radius</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {preacher.travelRadiusKm}
                  </p>
                  <p className="text-xs text-gray-500">km</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{preacher.bio}</p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications & Experience</h2>
              <div className="space-y-4">
                {preacher.ordinationStatus && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Ordination Status</p>
                    <p className="text-gray-700 capitalize">{preacher.ordinationStatus}</p>
                  </div>
                )}
                {preacher.specialization && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Specialization</p>
                    <p className="text-gray-700">{preacher.specialization}</p>
                  </div>
                )}
                {preacher.languages && preacher.languages.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Languages</p>
                    <p className="text-gray-700">{preacher.languages.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Preferences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service Preferences</h2>
              <div className="grid grid-cols-2 gap-6">
                {preacher.serviceTypes && preacher.serviceTypes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Service Types</p>
                    <div className="space-y-1">
                      {preacher.serviceTypes.map((type) => (
                        <p key={type} className="text-gray-700 text-sm">✓ {type}</p>
                      ))}
                    </div>
                  </div>
                )}
                {preacher.availability && preacher.availability.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Availability</p>
                    <div className="space-y-1">
                      {preacher.availability.map((avail) => (
                        <p key={avail} className="text-gray-700 text-sm">✓ {avail}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Media */}
            {(preacher.sermonVideoUrl || preacher.resumeUrl) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Media</h2>
                <div className="space-y-4">
                  {preacher.sermonVideoUrl && (
                    <div>
                      <a
                        href={preacher.sermonVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        🎥 Watch Sample Sermon
                      </a>
                    </div>
                  )}
                  {preacher.resumeUrl && (
                    <div>
                      <a
                        href={preacher.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        📄 Download Full Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>

              <div className="space-y-3 mb-6">
                {preacher.email && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Email</p>
                    <a href={`mailto:${preacher.email}`} className="text-blue-600 hover:text-blue-700 font-medium break-all">
                      {preacher.email}
                    </a>
                  </div>
                )}
                {preacher.phone && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Phone</p>
                    <a href={`tel:${preacher.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {preacher.phone}
                    </a>
                  </div>
                )}
                {preacher.website && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Website</p>
                    <a
                      href={preacher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium break-all"
                    >
                      {preacher.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
                >
                  Send Opportunity Invite
                </button>

                <button
                  onClick={() => {
                    // Start new application or message thread
                    router.push(`/listings/new?preacherId=${preacher.id}`)
                  }}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition"
                >
                  Create Listing for This Pastor
                </button>
              </div>

              {/* Fee Info */}
              {preacher.speakingFeeRange && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Speaking Fee Range</p>
                  <p className="text-gray-700 font-semibold">{preacher.speakingFeeRange}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal - Simple version */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Invitation</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendInvite()
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  required
                  placeholder="Invite this preacher to an opportunity..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
