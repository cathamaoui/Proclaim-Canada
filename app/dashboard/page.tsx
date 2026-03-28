'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProfileCompletionWidget from '@/components/ProfileCompletionWidget'

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name || 'Church'} 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your ministry opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Total Listings</p>
                <p className="text-4xl font-bold text-blue-600">{churchStats?.totalListings || 0}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Open Listings</p>
                <p className="text-4xl font-bold text-green-600">{churchStats?.openListings || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Total Applications</p>
                <p className="text-4xl font-bold text-purple-600">{churchStats?.totalApplications || 0}</p>
              </div>
              <div className="text-4xl">📨</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
              View All <span>→</span>
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4 text-lg">No listings yet</p>
              <Link
                href="/listings/new"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold"
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
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">📍 {listing.location}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ml-4 ${
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name || 'Evangelist'} 👋
          </h1>
          <p className="text-gray-600 mt-2">Track your ministry applications and opportunities</p>
        </div>
        
        <ProfileCompletionWidget />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Total Applications</p>
                <p className="text-4xl font-bold text-blue-600">{preacherStats?.totalApplications || 0}</p>
              </div>
              <div className="text-4xl">📨</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Pending Review</p>
                <p className="text-4xl font-bold text-yellow-600">{preacherStats?.pendingApplications || 0}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">Accepted</p>
                <p className="text-4xl font-bold text-green-600">{preacherStats?.acceptedApplications || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
              View All <span>→</span>
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4 text-lg">No applications yet</p>
              <Link
                href="/browse"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold"
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
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{app.listing?.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">📍 {app.listing?.location}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ml-4 ${
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
