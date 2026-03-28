'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Listing {
  id: string
  title: string
  location: string
  status: string
  createdAt: string
  description?: string
}

export default function ListingsPage() {
  const { data: session } = useSession()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/listings?createdBy=${session?.user.id}`)
        const data = await res.json()
        setListings(data.listings || [])
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user.role === 'CHURCH' && session?.user.id) {
      fetchListings()
    }
  }, [session])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">Loading listings...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Service Listings</h1>
          <p className="text-gray-600 mt-2">Manage your ministry opportunity postings</p>
        </div>
        <Link
          href="/listings/new"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">No listings yet</p>
          <Link
            href="/listings/new"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <Link href={`/listings/${listing.id}`} className="flex-1 hover:no-underline">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">{listing.title}</h3>
                  <p className="text-gray-600 mt-1">📍 {listing.location}</p>
                  {listing.description && (
                    <p className="text-gray-700 mt-2 line-clamp-2">{listing.description}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Posted: {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ml-4 whitespace-nowrap ${
                    listing.status === 'OPEN'
                      ? 'bg-green-100 text-green-800'
                      : listing.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : listing.status === 'FILLED'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                  }`}
                >
                  {listing.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
