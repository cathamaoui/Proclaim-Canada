'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  overview: {
    totalListings: number
    openListings: number
    filledListings: number
    totalApplications: number
    conversionRate: number
    avgTimeToHire: number
    avgResponseTimeHours: number
  }
  pipelineBreakdown: {
    applied: number
    reviewed: number
    interviewed: number
    offered: number
    hired: number
    rejected: number
  }
  topListings: Array<{
    id: string
    title: string
    applicationCount: number
    status: string
    createdAt: string
  }>
  recentActivity: Array<any>
  stats: {
    respondedApplications: number
    pendingApplications: number
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics/church')
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
        } else {
          setError('Failed to load analytics')
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No analytics data available yet.</p>
      </div>
    )
  }

  const { overview, pipelineBreakdown, topListings, recentActivity, stats } = analytics

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your recruitment performance and pipeline health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Listings</p>
          <p className="text-3xl font-bold text-gray-900">{overview.totalListings}</p>
          <p className="text-xs text-green-600 mt-2">{overview.openListings} open</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900">{overview.totalApplications}</p>
          <p className="text-xs text-gray-600 mt-2">{stats.pendingApplications} pending</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-green-600">{overview.conversionRate}%</p>
          <p className="text-xs text-gray-600 mt-2">{pipelineBreakdown.hired} hired</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
          <p className="text-gray-600 text-sm font-medium mb-1">Avg. Response Time</p>
          <p className="text-3xl font-bold text-gray-900">{overview.avgResponseTimeHours}h</p>
          <p className="text-xs text-gray-600 mt-2">For {stats.respondedApplications} responses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recruitment Pipeline</h2>
          
          <div className="space-y-3">
            {[
              { label: 'Applied', count: pipelineBreakdown.applied, color: 'bg-blue-100 text-blue-800' },
              { label: 'Reviewed', count: pipelineBreakdown.reviewed, color: 'bg-purple-100 text-purple-800' },
              { label: 'Interviewed', count: pipelineBreakdown.interviewed, color: 'bg-orange-100 text-orange-800' },
              { label: 'Offered', count: pipelineBreakdown.offered, color: 'bg-yellow-100 text-yellow-800' },
              { label: 'Hired', count: pipelineBreakdown.hired, color: 'bg-green-100 text-green-800' },
              { label: 'Rejected', count: pipelineBreakdown.rejected, color: 'bg-red-100 text-red-800' }
            ].map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-700">{stage.label}</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${stage.color}`}>
                    {stage.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stage.color.split(' ')[0].replace('100', '500')}`}
                    style={{
                      width: `${overview.totalApplications > 0 ? (stage.count / overview.totalApplications) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Avg. Time to Hire:</strong> {overview.avgTimeToHire} days
            </p>
          </div>
        </div>

        {/* Top Performing Listings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Listings</h2>
          
          {topListings.length === 0 ? (
            <p className="text-gray-600 text-sm">No listings with applications yet.</p>
          ) : (
            <div className="space-y-3">
              {topListings.map((listing, idx) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition block border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                        <h3 className="font-semibold text-gray-900 text-sm">{listing.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-lime-600">{listing.applicationCount}</div>
                      <p className="text-xs text-gray-600">applications</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        
        {recentActivity.length === 0 ? (
          <p className="text-gray-600 text-sm">No recent activity yet.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {activity.applicantName}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {activity.applicantEmail}
                    </p>
                    <p className="text-sm text-gray-700">
                      Applied for <strong>{activity.listingTitle}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.pipelineStatus === 'HIRED' ? 'bg-green-100 text-green-800' :
                      activity.pipelineStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      activity.pipelineStatus === 'OFFERED' ? 'bg-yellow-100 text-yellow-800' :
                      activity.pipelineStatus === 'INTERVIEWED' ? 'bg-orange-100 text-orange-800' :
                      activity.pipelineStatus === 'REVIEWED' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.pipelineStatus}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(activity.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
