'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name: string
  role: string
  isAdmin: boolean
  isBanned: boolean
  bannedReason?: string
  bannedUntil?: string
  preacherProfile?: { rating: number; totalRatings: number }
  churchProfile?: { rating: number; totalRatings: number; verified: boolean }
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<'ban' | 'unban' | 'makeAdmin' | 'removeAdmin' | null>(null)
  const [banReason, setBanReason] = useState('')
  const [banDays, setBanDays] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  async function fetchUsers() {
    try {
      setLoading(true)
      const query = new URLSearchParams({ page: page.toString() })
      if (search) query.append('search', search)

      const response = await fetch(`/api/admin/users?${query}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users')
    } finally {
      setLoading(false)
    }
  }

  async function handleUserAction() {
    if (!selectedUser || !actionType) return

    try {
      const response = await fetch(`/api/admin/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: actionType,
          reason: banReason || undefined,
          durationDays: banDays ? parseInt(banDays) : undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to update user')

      setSelectedUser(null)
      setActionType(null)
      setBanReason('')
      setBanDays('')
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error performing action')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, bans, and admin roles</p>
        </div>
        <Link href="/admin" className="text-primary-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search by email or name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
        />
      </div>

      {/* User Modal */}
      {selectedUser && actionType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'ban'
                ? 'Ban User'
                : actionType === 'unban'
                ? 'Unban User'
                : actionType === 'makeAdmin'
                ? 'Make Admin'
                : 'Remove Admin'}
            </h3>

            <p className="text-gray-600 mb-4">
              User: <strong>{selectedUser.name}</strong> ({selectedUser.email})
            </p>

            {(actionType === 'ban') && (
              <>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason
                    </label>
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Why is this user being banned?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ban Duration (days, leave empty for permanent)
                    </label>
                    <input
                      type="number"
                      value={banDays}
                      onChange={(e) => setBanDays(e.target.value)}
                      placeholder="e.g., 30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedUser(null)
                  setActionType(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUserAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  actionType === 'ban'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {user.role}
                      </span>
                      {user.isAdmin && (
                        <span className="inline-block ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.preacherProfile ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.preacherProfile.rating.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user.preacherProfile.totalRatings} ratings
                          </p>
                        </div>
                      ) : user.churchProfile ? (
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.churchProfile.rating.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user.churchProfile.totalRatings} ratings
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">N/A</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isBanned ? (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          Banned
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.isBanned ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('unban')
                            }}
                            className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('ban')
                            }}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            Ban
                          </button>
                        )}
                        {user.isAdmin ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('removeAdmin')
                            }}
                            className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded"
                          >
                            Remove Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setActionType('makeAdmin')
                            }}
                            className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing page {page} ({users.length} users, {total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-50"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * 20 >= total}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
