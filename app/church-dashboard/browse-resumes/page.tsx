'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const DENOMINATIONS = [
  'Any',
  'Anglican',
  'Baptist',
  'Christian Church',
  'Church of Christ',
  'Church of the Nazarene',
  'Evangelical',
  'Free Methodist',
  'Lutheran',
  'Methodist',
  'Non-Denominational',
  'Pentecostal',
  'Presbyterian',
  'Reformed',
  'United Church of Christ',
  'Wesleyan',
]

export default function BrowseResumesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [preachers, setPreachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quota, setQuota] = useState<any>(null)

  // Filters
  const [denomination, setDenomination] = useState('Any')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [page, setPage] = useState(1)

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  // Fetch resumes and quota
  useEffect(() => {
    if (session?.user?.role === 'CHURCH') {
      fetchResumesAndQuota()
    }
  }, [session, denomination, location, experience, page])

  const fetchResumesAndQuota = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch resumes
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(denomination && denomination !== 'Any' && { denomination }),
        ...(location && { location }),
        ...(experience && { experience }),
      })

      const resumesRes = await fetch(`/api/resumes?${params}`)
      const resumesData = await resumesRes.json()

      if (!resumesRes.ok) throw new Error(resumesData.error)
      setPreachers(resumesData.preachers)

      // Fetch quota
      const quotaRes = await fetch('/api/subscription/resume-addons')
      const quotaData = await quotaRes.json()

      if (quotaRes.ok) {
        setQuota(quotaData.subscription)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleViewResume = async (preacherId: string) => {
    try {
      const res = await fetch(`/api/resumes/${preacherId}`)
      const data = await res.json()

      if (!res.ok) {
        if (data.upgrade) {
          // Show upgrade prompt
          const action = window.confirm(
            `You've used all your resume views this month.\n\n${data.upgrade.message}\n\nClick OK to upgrade to Resume Unlimited ($99/month)`
          )
          if (action) {
            router.push(data.upgrade.url)
          }
        } else {
          setError(data.error)
        }
        return
      }

      // Show resume preview/details
      alert(`Resume loaded: ${data.resume.user.name}`)
      // In production, show a modal or navigate to detail page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in required</h1>
          <p className="text-gray-600 mb-6">Please sign in to browse resumes</p>
          <Link href="/auth/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/church-dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
              ← Back to Dashboard
            </Link>
            {quota && (
              <div className="text-sm">
                {quota.unlimited ? (
                  <span className="text-green-600 font-semibold">Unlimited Resume Access ✓</span>
                ) : (
                  <div>
                    <span className="text-gray-600">Resume Views: </span>
                    <span className="font-bold text-gray-900">
                      {quota.resumeViewsRemaining} / {quota.resumeViewsLimit}
                    </span>
                    {quota.resumeViewsRemaining === 0 && (
                      <button
                        onClick={() => router.push('/settings/subscription')}
                        className="ml-4 text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Preachers</h1>
        <p className="text-gray-600 mb-8">Find and connect with qualified preachers in your area</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Denomination</label>
              <select
                value={denomination}
                onChange={(e) => {
                  setDenomination(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {DENOMINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setPage(1)
                }}
                placeholder="City or state"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Min Experience</label>
              <input
                type="number"
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value)
                  setPage(1)
                }}
                placeholder="Years"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setDenomination('Any')
                  setLocation('')
                  setExperience('')
                  setPage(1)
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading resumes...</p>
          </div>
        ) : preachers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No resumes found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {preachers.map((preacher) => (
                <div key={preacher.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{preacher.user?.name || 'Preacher'}</h3>
                        <p className="text-sm text-gray-600">{preacher.denomination}</p>
                      </div>
                      {preacher.verified && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        ⭐ {preacher.rating}/5 • {preacher.yearsOfExperience} years
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-3">{preacher.bio}</p>
                    </div>

                    {preacher.specialization && (
                      <p className="text-xs text-gray-500 mb-4">
                        <span className="font-semibold">Specialization:</span> {preacher.specialization}
                      </p>
                    )}

                    <button
                      onClick={() => handleViewResume(preacher.userId)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
