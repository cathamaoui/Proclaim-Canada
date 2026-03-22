'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
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
  user: {
    name: string
    churchProfile?: {
      denomination?: string
    }
  }
  _count?: {
    applications: number
  }
}

export default function BrowsePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const take = 12

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.append('q', search)
        if (location) params.append('location', location)
        if (type) params.append('type', type)
        params.append('skip', skip.toString())
        params.append('take', take.toString())

        const res = await fetch(`/api/listings/search?${params}`)
        const data = await res.json()
        setListings(data.listings || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [search, location, type, skip])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSkip(0)
    const params = new URLSearchParams()
    if (search) params.append('q', search)
    if (location) params.append('location', location)
    if (type) params.append('type', type)
    router.push(`/browse?${params}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Opportunities</h1>
          <p className="text-gray-600">Find speaking opportunities that match your qualifications</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Title or Description
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Province..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">All Types</option>
                  <option value="SERMON">Sermon</option>
                  <option value="SPECIAL_SERVICE">Special Service</option>
                  <option value="REVIVAL">Revival</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No opportunities found matching your criteria</p>
            <button
              onClick={() => {
                setSearch('')
                setLocation('')
                setType('')
              }}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{listing.title}</h3>
                      <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-primary-100 text-primary-800">
                        {listing.type}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="mr-2">📍</span>
                        {listing.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="mr-2">📅</span>
                        {new Date(listing.date).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      {listing.compensation && (
                        <div className="flex items-center text-sm text-gray-700">
                          <span className="mr-2">💰</span>
                          {listing.compensation}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">{listing.user.name}</div>
                        {listing.user.churchProfile?.denomination && (
                          <div className="text-gray-600">{listing.user.churchProfile.denomination}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(`/listings/${listing.id}`)
                        }}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm font-semibold"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {total > take && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Showing {skip + 1} to {Math.min(skip + take, total)} of {total} opportunities
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - take))}
                    disabled={skip === 0}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setSkip(skip + take)}
                    disabled={skip + take >= total}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
