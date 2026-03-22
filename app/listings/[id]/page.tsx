'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Listing {
  id: string
  title: string
  description: string
  type: string
  date: string
  location: string
  compensation?: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    churchProfile?: {
      denomination?: string
      city?: string
      province?: string
      address?: string
    }
  }
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [listingId, setListingId] = useState<string>('')

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params
      setListingId(id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return
      try {
        const res = await fetch(`/api/listings/${listingId}`)
        if (!res.ok) throw new Error('Listing not found')
        const data = await res.json()
        setListing(data)

        // Check if user has already applied
        if (session?.user.role === 'PREACHER') {
          const appRes = await fetch('/api/applications')
          const appData = await appRes.json()
          const hasApp = appData.applications?.some(
            (app: any) => app.listingId === listingId
          )
          setHasApplied(!!hasApp)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listing')
      } finally {
        setLoading(false)
      }
    }

    if (session && listingId) {
      fetchListing()
    }
  }, [listingId, session])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplying(true)
    setError('')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listingId,
          coverLetter: coverLetter || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to apply')
      }

      setSuccess(true)
      setHasApplied(true)
      setCoverLetter('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Listing not found</p>
            <Link href="/browse" className="text-primary-600 hover:text-primary-700 font-semibold">
              Back to Opportunities
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/browse" className="text-primary-600 hover:text-primary-700 font-semibold mb-6 inline-block">
          ← Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <p className="text-gray-600">Posted by {listing.user.name}</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded ${
                    listing.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3">📍</span>
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3">📅</span>
                  <span>{new Date(listing.date).toLocaleDateString('en-CA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3">⛪</span>
                  <span>{listing.type.replace(/_/g, ' ')}</span>
                </div>
                {listing.compensation && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-2xl mr-3">💰</span>
                    <span>{listing.compensation}</span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Opportunity</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {listing.description}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Church Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Church Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Church Name</p>
                  <p className="font-semibold text-gray-900">{listing.user.name}</p>
                </div>
                {listing.user.churchProfile?.denomination && (
                  <div>
                    <p className="text-sm text-gray-600">Denomination</p>
                    <p className="font-semibold text-gray-900">{listing.user.churchProfile.denomination}</p>
                  </div>
                )}
                {listing.user.churchProfile?.city && (
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold text-gray-900">{listing.user.churchProfile.city}, {listing.user.churchProfile.province}</p>
                  </div>
                )}
                {listing.user.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <a href={`tel:${listing.user.phone}`} className="text-primary-600 hover:text-primary-700 font-semibold">
                      {listing.user.phone}
                    </a>
                  </div>
                )}
                {listing.user.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${listing.user.email}`} className="text-primary-600 hover:text-primary-700 font-semibold break-all">
                      {listing.user.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Section */}
            {session?.user.role === 'PREACHER' && listing.status === 'OPEN' && (
              <div className="bg-white rounded-lg shadow p-6">
                {success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold mb-2">✓ Application Sent!</p>
                    <p className="text-sm text-green-700">The church has received your application</p>
                  </div>
                ) : hasApplied ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800 font-semibold">Already Applied</p>
                    <p className="text-sm text-blue-700">You've already applied to this opportunity</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Apply Now</h3>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                        Message to Church (Optional)
                      </label>
                      <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell them why you're interested..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={applying}
                      className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold"
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {session?.user.role === 'CHURCH' && session.user.id === listing.user.id && (
              <div className="space-y-4">
                <Link
                  href={`/dashboard/listings/${listing.id}`}
                  className="w-full block text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold"
                >
                  View Applications
                </Link>
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="w-full block text-center border-2 border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 font-semibold"
                >
                  Edit Listing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
