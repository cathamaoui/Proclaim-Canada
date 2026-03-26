'use client'

import { useState, useEffect } from 'react'

interface Application {
  id: string
  applicantId: string
  applicant: {
    name: string
    email: string
  }
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  pipelineStatus: 'APPLIED' | 'REVIEWED' | 'INTERVIEWED' | 'OFFERED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN'
  appliedAt: string
}

interface CandidatePipelineProps {
  listingId: string
}

const pipelineStages = [
  { status: 'APPLIED', label: 'Applied', icon: '📋', color: 'bg-blue-100 text-blue-800' },
  { status: 'REVIEWED', label: 'Reviewed', icon: '👁️', color: 'bg-purple-100 text-purple-800' },
  { status: 'INTERVIEWED', label: 'Interviewed', icon: '💬', color: 'bg-orange-100 text-orange-800' },
  { status: 'OFFERED', label: 'Offered', icon: '🎁', color: 'bg-yellow-100 text-yellow-800' },
  { status: 'HIRED', label: 'Hired', icon: '✓', color: 'bg-green-100 text-green-800' },
]

export default function CandidatePipeline({ listingId }: CandidatePipelineProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStage, setSelectedStage] = useState<string | null>('APPLIED')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}/applications`)
        if (res.ok) {
          const data = await res.json()
          setApplications(data.applications || [])
        } else {
          setError('Failed to load applications')
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (listingId) {
      fetchApplications()
    }
  }, [listingId])

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineStatus: newStatus })
      })

      if (res.ok) {
        setApplications(apps =>
          apps.map(app =>
            app.id === applicationId
              ? { ...app, pipelineStatus: newStatus as any }
              : app
          )
        )
      } else {
        setError('Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      setError('An error occurred')
    }
  }

  // Group applications by pipeline stage
  const groupedByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.status] = applications.filter(app => app.pipelineStatus === stage.status)
    return acc
  }, {} as Record<string, Application[]>)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading pipeline...</p>
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

  if (applications.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No applications yet for this listing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-gray-900 mb-4">Recruitment Pipeline</h3>
        
        {/* Pipeline Stages */}
        <div className="space-y-4">
          {pipelineStages.map((stage) => {
            const stageApps = groupedByStage[stage.status] || []
            const isSelected = selectedStage === stage.status

            return (
              <button
                key={stage.status}
                onClick={() => setSelectedStage(isSelected ? null : stage.status)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  isSelected
                    ? 'border-lime-500 bg-lime-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stage.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{stage.label}</h4>
                      <p className="text-sm text-gray-600">
                        {stageApps.length} candidate{stageApps.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-bold ${stage.color}`}>
                    {stageApps.length}
                  </div>
                </div>

                {/* Expanded Candidates */}
                {isSelected && stageApps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-gray-50 rounded p-3 flex items-start justify-between"
                      >
                        <div>
                          <h5 className="font-semibold text-gray-900">{app.applicant.name}</h5>
                          <p className="text-sm text-gray-600">{app.applicant.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Status Actions */}
                        {stage.status !== 'HIRED' && stage.status !== 'REJECTED' && stage.status !== 'WITHDRAWN' && (
                          <div className="flex gap-1">
                            {stage.status !== 'OFFERED' && (
                              <button
                                onClick={() => {
                                  const nextStageIndex = pipelineStages.findIndex(
                                    s => s.status === stage.status
                                  )
                                  if (nextStageIndex < pipelineStages.length - 2) {
                                    const nextStage = pipelineStages[nextStageIndex + 1].status
                                    handleStatusChange(app.id, nextStage)
                                  }
                                }}
                                className="px-3 py-1 bg-lime-500 hover:bg-lime-600 text-white text-xs rounded font-medium transition"
                              >
                                Advance
                              </button>
                            )}
                            {stage.status === 'OFFERED' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(app.id, 'HIRED')}
                                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded font-medium transition"
                                >
                                  Hire
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleStatusChange(app.id, 'REJECTED')}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded font-medium transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Final Status */}
                        {(stage.status === 'HIRED' || stage.status === 'REJECTED' || stage.status === 'WITHDRAWN') && (
                          <div className={`px-3 py-1 rounded font-semibold text-sm ${stage.color}`}>
                            {stage.label}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {pipelineStages.map((stage) => {
          const count = (groupedByStage[stage.status] || []).length
          return (
            <div key={stage.status} className={`rounded-lg p-4 ${stage.color}`}>
              <p className="text-sm font-medium opacity-75">{stage.label}</p>
              <p className="text-3xl font-bold">{count}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
