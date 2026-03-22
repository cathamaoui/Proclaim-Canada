'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Statistics {
  users: {
    total: number
    preachers: number
    churches: number
    banned: number
    newLastWeek: number
  }
  listings: {
    total: number
    active: number
    removed: number
    newLastWeek: number
  }
  applications: {
    total: number
    pending: number
    accepted: number
    rejected: number
    newLastWeek: number
  }
  messages: {
    total: number
    newLastWeek: number
  }
  ratings: {
    total: number
  }
  recentActivity: any[]
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchStatistics()
    }
  }, [status, router])

  async function fetchStatistics() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin')
      if (response.status === 403) {
        setError('Admin access required')
        return
      }
      if (!response.ok) throw new Error('Failed to fetch statistics')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading statistics')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform management and moderation</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">Ban/unban users, manage roles</p>
        </Link>
        <Link
          href="/admin/listings"
          className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Listing Moderation</h3>
          <p className="text-gray-600">Remove inappropriate listings</p>
        </Link>
        <Link
          href="/admin/audit-logs"
          className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Logs</h3>
          <p className="text-gray-600">View all platform actions</p>
        </Link>
      </div>

      {/* Statistics Grid */}
      {stats && (
        <>
          {/* Users */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Users</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{stats.users.total}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.users.preachers}</p>
                <p className="text-sm text-gray-600">Preachers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats.users.churches}</p>
                <p className="text-sm text-gray-600">Churches</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.users.banned}</p>
                <p className="text-sm text-gray-600">Banned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+{stats.users.newLastWeek}</p>
                <p className="text-sm text-gray-600">Last Week</p>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{stats.listings.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.listings.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.listings.removed}</p>
                <p className="text-sm text-gray-600">Removed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+{stats.listings.newLastWeek}</p>
                <p className="text-sm text-gray-600">Last Week</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Applications</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{stats.applications.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.applications.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.applications.accepted}</p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.applications.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+{stats.applications.newLastWeek}</p>
                <p className="text-sm text-gray-600">Last Week</p>
              </div>
            </div>
          </div>

          {/* Other Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.messages.total}</p>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-xs text-gray-500 mt-2">+{stats.messages.newLastWeek} last week</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.ratings.total}</p>
              <p className="text-sm text-gray-600">Total Ratings</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-gray-600">
                {Math.round((stats.users.banned / stats.users.total) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Ban Rate</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {stats.recentActivity.map((log) => (
                <div key={log.id} className="text-sm p-2 bg-gray-50 rounded flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <p className="text-gray-600">by {log.user?.name || log.user?.email}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
