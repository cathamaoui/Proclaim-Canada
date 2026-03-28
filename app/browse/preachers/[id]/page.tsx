'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import TestimonialCarousel from '@/components/TestimonialCarousel'

interface Testimonial {
  id: string
  quote: string
  author: string
  churchName: string
  denomination: string
  rating: number
}

interface PreacherData {
  id: string
  name: string
  image: string
  preacherProfile: {
    yearsOfExperience: number
    denomination: string
    bio: string
    verified: boolean
    rating: number
    totalRatings: number
    resumeUrl: string | null
  }
  receivedRatings: Array<{
    id: string
    rating: number
    comment: string
    createdAt: string
    ratedBy: {
      name: string
      churchProfile: {
        churchName: string
        denomination: string
      } | null
    }
  }>
}

export default function PreacherDetailPage() {
  const params = useParams()
  const preacherId = params.id as string
  const [preacher, setPreacher] = useState<PreacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    const fetchPreacher = async () => {
      try {
        const response = await fetch(`/api/preachers/${preacherId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch preacher')
        }
        const data = await response.json()
        setPreacher(data.data)

        // Convert ratings to testimonials
        if (data.data.receivedRatings) {
          const convertedTestimonials = data.data.receivedRatings
            .filter((r: any) => r.comment && r.comment.trim().length > 0)
            .map((rating: any) => ({
              id: rating.id,
              quote: rating.comment,
              author: rating.ratedBy.name,
              churchName: rating.ratedBy.churchProfile?.churchName || 'Church',
              denomination: rating.ratedBy.churchProfile?.denomination || 'Evangelical',
              rating: rating.rating,
            }))
          setTestimonials(convertedTestimonials)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (preacherId) {
      fetchPreacher()
    }
  }, [preacherId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading preacher profile...</p>
        </div>
      </div>
    )
  }

  if (error || !preacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Logo />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
            <p className="text-red-600 mb-6">{error || 'Preacher not found'}</p>
            <Link 
              href="/browse/preachers"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Back to Preachers
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const { preacherProfile } = preacher

  return (
    <div className="min-h-screen bg-gray-50">
      <Logo />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <Link 
          href="/browse/preachers"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          ← Back to Preachers
        </Link>

        {/* Preacher Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-40 h-40 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-6xl">
                {preacher.image || '👨‍💼'}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{preacher.name}</h1>
                  <p className="text-lg text-gray-600">{preacherProfile.denomination}</p>
                </div>
                {preacherProfile.verified && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                    ✓ Verified
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Experience:</span> {preacherProfile.yearsOfExperience} years
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Rating:</span> 
                  <span className="ml-2 text-amber-500">★</span>
                  {preacherProfile.rating ? Number(preacherProfile.rating).toFixed(1) : 'N/A'}/5 
                  <span className="text-gray-500"> ({preacherProfile.totalRatings} reviews)</span>
                </p>
              </div>

              {/* Resume Download Button */}
              {preacherProfile.resumeUrl && (
                <a
                  href={preacherProfile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  📄 View Resume
                </a>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {preacherProfile.bio}
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        {testimonials.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">What Churches Are Saying</h2>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center text-gray-600 mb-12">
            <p className="text-lg">No testimonials yet. This preacher is just getting started!</p>
          </div>
        )}

        {/* Action Button */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interested?</h3>
          <p className="text-gray-600 mb-6">
            Contact {preacher.name} to book for your church's next service.
          </p>
          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
            Request Booking
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
