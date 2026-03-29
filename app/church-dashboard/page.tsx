'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'

export default function ChurchDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [churchProfile, setChurchProfile] = useState<any>(null)
  const [setupComplete, setSetupComplete] = useState(false)

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch church profile
        const profileRes = await fetch('/api/profile')
        const profileData = await profileRes.json()
        if (profileData.profile) {
          setChurchProfile(profileData.profile)
          setSetupComplete(!!profileData.profile.churchName)
        }

        // Fetch listings
        const listingsRes = await fetch('/api/listings?churchOnly=true')
        const listingsData = await listingsRes.json()
        setListings(listingsData.listings || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'CHURCH') {
      fetchData()
    }
  }, [session])

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      OPEN: { bg: 'bg-green-100', text: 'text-green-800' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800' },
      FILLED: { bg: 'bg-gray-100', text: 'text-gray-800' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
    }
    return colors[status] || colors.OPEN
  }

  const activeListings = listings.filter(l => l.status === 'OPEN').length
  const totalApplications = listings.reduce((sum, l) => sum + (l._count?.applications || 0), 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/church-home" className="flex items-center gap-2 text-xl font-bold">
              <Logo />
              <span>
                <span className="text-gray-900">Proclaim</span>
                <span className="text-lime-600">Canada</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Welcome, {session?.user?.name || 'Church'}</span>
              <button
                onClick={() => router.push('/auth/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and find the right preacher for your ministry</p>
        </div>

        {/* Setup Banner */}
        {!setupComplete && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-1">Complete Your Church Profile</h2>
                <p className="text-blue-800 mb-4">Add your church details to start posting opportunities</p>
              </div>
              <Link
                href="/church-dashboard/setup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-2">Active Postings</p>
            <p className="text-4xl font-bold text-gray-900">{activeListings}</p>
            <p className="text-gray-500 text-sm mt-2">Open opportunities</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Applications</p>
            <p className="text-4xl font-bold text-gray-900">{totalApplications}</p>
            <p className="text-gray-500 text-sm mt-2">From preachers</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Postings</p>
            <p className="text-4xl font-bold text-gray-900">{listings.length}</p>
            <p className="text-gray-500 text-sm mt-2">All time</p>
          </div>

          <Link href="/church-dashboard/setup" className="block">
            <div className="bg-lime-50 rounded-lg p-6 border border-lime-200 hover:border-lime-400 transition h-full flex flex-col justify-center">
              <p className="text-lime-600 text-sm font-medium mb-2">Quick Setup</p>
              <p className="text-gray-900 font-semibold mb-3">Update Profile</p>
              <span className="text-lime-600 font-semibold text-sm">Go to Settings →</span>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/listings/new" className="block">
              <div className="bg-white border border-gray-200 rounded-lg p-8 hover:border-lime-400 hover:shadow-md transition">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Post a New Job</h3>
                <p className="text-gray-600 mb-4">Create a service opportunity for preachers in your area</p>
                <span className="text-lime-600 font-semibold">Get Started →</span>
              </div>
            </Link>

            <Link href="/church-dashboard/setup" className="block">
              <div className="bg-white border border-gray-200 rounded-lg p-8 hover:border-lime-400 hover:shadow-md transition">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-600 mb-4">Update your church profile, email, password, and preferences</p>
                <span className="text-lime-600 font-semibold">Go to Settings →</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Listings */}
        {!loading && listings.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Postings</h2>
            <div className="space-y-4">
              {listings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        📍 {listing.location || 'Location TBD'}
                        {listing.date && ` • 📅 ${new Date(listing.date).toLocaleDateString()}`}
                      </p>
                      <div className="flex gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(listing.status).bg} ${getStatusColor(listing.status).text}`}>
                          {listing.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {listing._count?.applications || 0} applications
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-lime-600 hover:text-lime-700 font-semibold text-sm whitespace-nowrap ml-4"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {listings.length > 5 && (
              <Link href="/church-dashboard/listings" className="text-lime-600 hover:text-lime-700 font-semibold mt-4 inline-block">
                View all {listings.length} postings →
              </Link>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h2>
              <p className="text-gray-600">Have questions about posting opportunities or managing applications?</p>
            </div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
