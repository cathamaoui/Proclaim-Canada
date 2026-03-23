'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ListingStats {
  totalListings: number
  openListings: number
  totalApplications: number
}

interface ApplicationStats {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<ListingStats | ApplicationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentItems, setRecentItems] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (session?.user.role === 'CHURCH') {
          const listingsRes = await fetch('/api/listings?createdBy=' + session.user.id)
          const listingsData = await listingsRes.json()

          const applicationsRes = await fetch('/api/applications')
          const applicationsData = await applicationsRes.json()

          setStats({
            totalListings: listingsData.total || 0,
            openListings: listingsData.listings?.filter((l: any) => l.status === 'OPEN').length || 0,
            totalApplications: applicationsData.applications?.length || 0,
          })
          setRecentItems(listingsData.listings?.slice(0, 5) || [])
        } else {
          const applicationsRes = await fetch('/api/applications')
          const applicationsData = await applicationsRes.json()

          setStats({
            totalApplications: applicationsData.applications?.length || 0,
            pendingApplications: applicationsData.applications?.filter((a: any) => a.status === 'PENDING').length || 0,
            acceptedApplications: applicationsData.applications?.filter((a: any) => a.status === 'ACCEPTED').length || 0,
          })
          setRecentItems(applicationsData.applications?.slice(0, 5) || [])
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (session?.user.role === 'CHURCH') {
    const churchStats = stats as ListingStats
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name || 'Church'} 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Listings</div>
            <div className="text-3xl font-bold text-primary-600">{churchStats?.totalListings || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Open Listings</div>
            <div className="text-3xl font-bold text-green-600">{churchStats?.openListings || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Applications</div>
            <div className="text-3xl font-bold text-blue-600">{churchStats?.totalApplications || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No listings yet</p>
              <Link
                href="/listings/new"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((listing: any) => (
                <Link
                  key={listing.id}
                  href={`/dashboard/listings/${listing.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      listing.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  } else {
    const preacherStats = stats as ApplicationStats
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name || 'Evangelist'} 👋
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Applications</div>
            <div className="text-3xl font-bold text-primary-600">{preacherStats?.totalApplications || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{preacherStats?.pendingApplications || 0}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Accepted</div>
            <div className="text-3xl font-bold text-green-600">{preacherStats?.acceptedApplications || 0}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No applications yet</p>
              <Link
                href="/browse"
                className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Browse Opportunities
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/dashboard/applications/${app.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.listing?.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{app.listing?.location}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}
