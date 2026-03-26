'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ApplicationQuestionsEditor from '@/components/ApplicationQuestionsEditor'

export default function ListingQuestionsPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id as string
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchListing()
  }, [listingId])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/listings/${listingId}`)
      if (res.ok) {
        const data = await res.json()
        setListing(data.listing)
      } else {
        setError('Listing not found')
      }
    } catch (err) {
      console.error('Error fetching listing:', err)
      setError('Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center text-gray-500">Loading listing...</div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || 'Listing not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Screening Questions</h1>
        <p className="text-gray-600">
          <strong>{listing.title}</strong> at {listing.churchName}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            💡 Add custom questions to help screen applicants before they submit. Churches can add up to 10 questions.
          </p>
        </div>

        <ApplicationQuestionsEditor
          listingId={listingId}
          onQuestionsChange={() => {
            // Could refresh listing data here if needed
          }}
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={() => router.push(`/church-dashboard`)}
            className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
