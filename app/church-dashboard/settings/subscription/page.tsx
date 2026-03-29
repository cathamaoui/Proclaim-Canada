'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SubscriptionSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [quota, setQuota] = useState<any>(null)
  const [recentViews, setRecentViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/dashboard')
    return null
  }

  useEffect(() => {
    if (session?.user?.role === 'CHURCH') {
      fetchSubscriptionData()
    }
  }, [session])

  const fetchSubscriptionData = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscription/resume-addons')
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setQuota(data.subscription)
      setRecentViews(data.recentViews || [])

      // Fetch full subscription object
      const subRes = await fetch('/api/subscription/status')
      if (subRes.ok) {
        const subData = await subRes.json()
        setSubscription(subData.subscription)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUnlimited = async () => {
    setActionLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscription/resume-addons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setQuota(data.subscription)
      alert('Resume Unlimited add-on activated for 1 month!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add unlimited access')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelUnlimited = async () => {
    if (!window.confirm('Cancel Resume Unlimited? This will take effect at the end of your current billing period.')) {
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscription/resume-addons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setQuota(data.subscription)
      alert('Resume Unlimited has been cancelled')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel unlimited access')
    } finally {
      setActionLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in required</h1>
          <p className="text-gray-600 mb-6">Please sign in to manage your subscription</p>
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/church-dashboard" className="text-gray-600 hover:text-gray-900 font-medium mb-4 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Settings</h1>
          <p className="text-gray-600 mt-1">Manage your plan and resume access</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading subscription details...</p>
          </div>
        ) : (
          <>
            {/* Current Plan */}
            {subscription && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Plan</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Plan Type</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.planType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-xl font-bold text-green-600">Active</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Renews On</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/listings/select-plan')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition"
                >
                  Change Plan
                </button>
              </div>
            )}

            {/* Resume Access Quota */}
            {quota && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Access</h2>

                {/* Quota Usage */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {quota.unlimited ? 'Unlimited Access Active' : 'Monthly Resume Views'}
                    </span>
                    {!quota.unlimited && (
                      <span className="text-sm text-gray-600">
                        {quota.resumeViewsRemaining || 0} / {quota.resumeViewsLimit || 0} remaining
                      </span>
                    )}
                  </div>

                  {!quota.unlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition"
                        style={{
                          width: `${
                            quota.resumeViewsLimit > 0
                              ? ((quota.resumeViewsLimit - quota.resumeViewsRemaining) / quota.resumeViewsLimit) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Add-on Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Resume Unlimited Add-on</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Get unlimited resume views for one month. Perfect when you need to browse many qualified candidates.
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 mb-4">
                        <li>✓ Unlimited resume views</li>
                        <li>✓ Auto-renews monthly ($99/month)</li>
                        <li>✓ Cancel anytime</li>
                      </ul>
                      <p className="text-2xl font-bold text-gray-900">$99<span className="text-lg text-gray-600">/month</span></p>
                    </div>

                    {quota.unlimited ? (
                      <button
                        onClick={handleCancelUnlimited}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 rounded-lg font-semibold transition whitespace-nowrap ml-4"
                      >
                        {actionLoading ? 'Processing...' : 'Cancel'}
                      </button>
                    ) : (
                      <button
                        onClick={handleAddUnlimited}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition whitespace-nowrap ml-4"
                      >
                        {actionLoading ? 'Processing...' : 'Add Now'}
                      </button>
                    )}
                  </div>

                  {quota.unlimited && quota.unlimitedResumesAddOnEnd && (
                    <p className="text-sm text-gray-600 mt-4">
                      Active until {new Date(quota.unlimitedResumesAddOnEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => router.push('/church-dashboard/browse-resumes')}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  Browse Resumes →
                </button>
              </div>
            )}

            {/* Recent Resume Views */}
            {recentViews && recentViews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Resume Views</h2>

                <div className="space-y-3">
                  {recentViews.map((view: any) => (
                    <div key={view.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-semibold text-gray-900">{view.preacher?.user?.name || 'Unknown Preacher'}</p>
                        <p className="text-sm text-gray-600">
                          {view.preacher?.denomination} • {view.preacher?.yearsOfExperience} years
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(view.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
