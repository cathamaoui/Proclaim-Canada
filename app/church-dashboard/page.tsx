'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'
import PreacherTicker from '@/components/PreacherTicker'

export default function ChurchDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchCountry, setSearchCountry] = useState('')
  const [searchState, setSearchState] = useState('')

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings?churchOnly=true')
        const data = await response.json()
        setListings(data.listings || [])
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'CHURCH') {
      fetchListings()
    }
  }, [session])

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
      OPEN: { bg: 'bg-green-100', text: 'text-green-800' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800' },
      FILLED: { bg: 'bg-gray-100', text: 'text-gray-800' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
    }
    const style = statusStyles[status] || statusStyles.OPEN
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>{status}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/church-home" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition cursor-pointer">
              <Logo />
              <span><span className="text-white">Proclaim </span><span className="text-lime-300">Canada</span></span>
            </Link>
            <div className="flex items-center gap-6">
              <span className="text-green-50">Welcome, {session?.user?.name || 'Church'}</span>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-lime-400 hover:bg-lime-500 text-green-900 px-5 py-2 rounded-lg font-bold transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Church Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your service opportunities and applications</p>
        </div>

        {/* Preacher Ticker */}
        <div className="mb-12">
          <PreacherTicker />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <Link href="/listings/new" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-600 cursor-pointer hover:translate-y-[-4px]">
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Post New Opportunity</h2>
              <p className="text-gray-600 text-sm">Create a new preacher opportunity</p>
            </div>
          </Link>

          <div className="block">
            <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-lime-500 cursor-pointer hover:translate-y-[-4px]">
              <div className="text-4xl mb-3">📊</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Active Postings</h2>
              <p className="text-3xl font-bold text-green-600 mt-4">{listings.filter(l => l.status === 'OPEN').length}</p>
              <p className="text-gray-600 text-sm mt-2">Open opportunities</p>
            </div>
          </div>

          <Link href="/church-dashboard?tab=applications" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-600 cursor-pointer hover:translate-y-[-4px]">
              <div className="text-4xl mb-3">📥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Applications Inbox</h2>
              <p className="text-gray-600 text-sm">Review preacher applications</p>
            </div>
          </Link>

          <Link href="/church-dashboard?tab=settings" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-600 cursor-pointer hover:translate-y-[-4px]">
              <div className="text-4xl mb-3">⚙️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600 text-sm">Manage your church profile</p>
            </div>
          </Link>

          <Link href="/browse/preachers" className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-600 cursor-pointer hover:translate-y-[-4px]">
              <div className="text-4xl mb-3">🔍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Search Resume Database</h2>
              <p className="text-gray-600 text-sm">Find pastors by name or location</p>
            </div>
          </Link>
        </div>

        {/* Pastor Name Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Search Preacher Database</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Pastor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pastor Name</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">-- All Countries --</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
              </select>
            </div>

            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
              <input
                type="text"
                placeholder="e.g., Ontario, Texas..."
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  if (searchName) params.append('name', searchName)
                  if (searchCountry) params.append('country', searchCountry)
                  if (searchState) params.append('state', searchState)
                  
                  const queryString = params.toString()
                  router.push(`/browse/preachers${queryString ? '?' + queryString : ''}`)
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 border border-green-200">
          <h3 className="text-xl font-bold text-green-900 mb-3">Need Help?</h3>
          <p className="text-gray-700 mb-4">Have questions about posting opportunities or managing applications?</p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
