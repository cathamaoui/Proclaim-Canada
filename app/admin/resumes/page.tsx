'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ResumeAnalytics {
  totalViews: number
  uniqueViewers: number
  topPreachers: Array<{
    id: string
    name: string
    denomination: string
    viewCount: number
    rating: number
  }>
  viewsTrend: Array<{
    date: string
    views: number
  }>
  conversionMetrics: {
    applicationsFromViews: number
    conversionRate: number
    averageViewsPerApplication: number
  }
}

export default function AdminResumesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<ResumeAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30') // days

  // Redirect non-admin users
  if (session && session.user.role !== 'ADMIN') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchAnalytics()
    }
  }, [session, dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ days: dateRange })
      const response = await fetch(`/api/admin/analytics/resumes?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setAnalytics(data.analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in as an administrator</p>
          <Link
            href="/auth/login"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 font-medium mb-4 block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Resume Analytics</h1>
          <p className="text-gray-600 mt-1">Track resume views and engagement metrics</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Date Range</label>
          <div className="flex gap-2">
            {['7', '30', '90', '365'].map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  dateRange === days
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Last {days === '7' ? '7 Days' : days === '30' ? '30 Days' : days === '90' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600 font-semibold text-sm mb-2">Total Resume Views</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalViews}</p>
                <p className="text-xs text-gray-500 mt-2">Across all preachers</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600 font-semibold text-sm mb-2">Unique Viewers</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.uniqueViewers}</p>
                <p className="text-xs text-gray-500 mt-2">Churches browsing resumes</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600 font-semibold text-sm mb-2">Conversion Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {(analytics.conversionMetrics?.conversionRate * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-2">Views to applications</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600 font-semibold text-sm mb-2">Avg Views per App</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.conversionMetrics?.averageViewsPerApplication.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Before application</p>
              </div>
            </div>

            {/* Top Preachers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Viewed Preachers</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preacher</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Denomination</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.topPreachers.map((preacher, index) => (
                      <tr key={preacher.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">#{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{preacher.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{preacher.denomination}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">⭐ {preacher.rating}/5</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                            {preacher.viewCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Views Trend</h2>
              <div className="text-center py-12">
                <p className="text-gray-500">Chart visualization coming soon</p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
