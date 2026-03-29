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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to Proclaim Canada 👋</p>
        </div>

        {/* Get Started Banner */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 hover:shadow-md transition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Get started by posting your first job opening!</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your church exists to take the most important message to your mission field. We're here to help you accomplish God's purposes for your church by finding the ideal candidate.
              </p>
              <Link
                href="/listings/new"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Post a Job
              </Link>
            </div>
            <div className="text-right hidden md:block">
              <div className="bg-gradient-to-br from-green-100 to-lime-50 rounded-lg p-8">
                <div className="text-6xl mb-4">👤</div>
                <p className="font-semibold text-gray-900">Ready to serve</p>
                <p className="text-sm text-gray-600">Qualified candidates waiting for opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <p className="text-blue-600 font-semibold text-sm mb-2">Active Postings</p>
              <p className="text-3xl font-bold text-gray-900">{activeListings}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
              <p className="text-purple-600 font-semibold text-sm mb-2">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
              <p className="text-orange-600 font-semibold text-sm mb-2">Total Postings</p>
              <p className="text-3xl font-bold text-gray-900">{listings.length}</p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Everything you get with a job posting.</h2>
          <p className="text-gray-600 mb-8">In addition to a job posting on the largest job board for churches, ministries, and non-profits, you get...</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Post with Seminaries & Bible Colleges</h3>
              <p className="text-gray-600 text-sm">
                Share your job with students and alumni from seminaries and bible colleges across the country. Quickly invite them to apply.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm mt-4">Learn More →</button>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Access to 1000+ Resumes</h3>
              <p className="text-gray-600 text-sm">
                Browse resumes of candidates in your denomination specifically aligned with your job. Quickly invite them to apply.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm mt-4">Learn More →</button>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Sort, Review, and Filter Applicants</h3>
              <p className="text-gray-600 text-sm">
                Collect applications from qualified candidates and easily sort them by experience, location, education, and more.
              </p>
              <button className="text-green-600 hover:text-green-700 font-semibold text-sm mt-4">Learn More →</button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Questions Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Have questions about posting on Proclaim Canada?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Do you have questions about your job listing? Can't figure out how to use Proclaim Canada? Book a time with an Proclaim Canada team member – we are here to help!
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
              Book a Demo →
            </button>
          </div>

          {/* Switch Account Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Looking to find work instead?</h3>
            <p className="text-gray-600 text-sm mb-6">
              If you registered to post jobs but are actually looking for work, you can switch to a candidate account to browse and apply for positions.
            </p>
            <button className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-semibold transition">
              Switch to Candidate Account
            </button>
          </div>
        </div>

        {/* Recent Postings */}
        {!loading && listings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Job Postings</h2>
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
                      <div className="flex gap-3 flex-wrap">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(listing.status).bg} ${getStatusColor(listing.status).text}`}>
                          {listing.status}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {listing._count?.applications || 0} applications
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm whitespace-nowrap ml-4"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {listings.length > 5 && (
              <Link href="/church-dashboard/listings" className="text-green-600 hover:text-green-700 font-semibold mt-6 inline-block">
                View all {listings.length} postings →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
