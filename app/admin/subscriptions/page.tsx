'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SubscriptionData {
  id: string
  userId: string
  planType: string
  status: string
  startDate: string
  renewalDate: string
  postingsRemaining: number
  postingsLimit: number
  resumeViewsLimit: number
  resumeViewsUsed: number
  hasUnlimitedResumes: boolean
  user: {
    name: string
    email: string
  }
}

export default function AdminSubscriptionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Redirect non-admin users
  if (session && session.user.role !== 'ADMIN') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchSubscriptions()
    }
  }, [session, filter])

  const fetchSubscriptions = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        ...(filter !== 'all' && { status: filter }),
      })

      const response = await fetch(`/api/admin/subscriptions?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setSubscriptions(data.subscriptions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-1">View and manage all active subscriptions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Church name or email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilter('all')
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {/* Subscriptions Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No subscriptions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Church</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Postings</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resume Views</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Renews</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{sub.user?.name}</p>
                          <p className="text-xs text-gray-500">{sub.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{sub.planType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sub.postingsRemaining} / {sub.postingsLimit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sub.resumeViewsUsed} / {sub.resumeViewsLimit}
                        {sub.hasUnlimitedResumes && (
                          <span className="ml-2 text-green-600 font-semibold">∞</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sub.renewalDate
                          ? new Date(sub.renewalDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
