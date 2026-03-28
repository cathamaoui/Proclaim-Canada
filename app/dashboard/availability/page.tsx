'use client'

import { useSession } from 'next-auth/react'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import { useState } from 'react'

export default function AvailabilityPage() {
  const { data: session } = useSession()
  const [refreshKey, setRefreshKey] = useState(0)

  if (!session?.user) {
    return <div className="text-center py-8">Please sign in to manage availability.</div>
  }

  const handleSlotChange = () => {
    // Refresh calendar when slots are added/removed
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
        <p className="text-gray-600 mt-2">Manage your speaking availability to let churches know when you're free</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar - Main Column */}
        <div className="lg:col-span-3">
          <AvailabilityCalendar key={refreshKey} userId={session.user.id} editable={true} />
        </div>

        {/* Sidebar - Info & Tips */}
        <div className="space-y-6">
          {/* How It Works */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
            <p className="text-sm text-blue-800 mb-4">
              Churches can see your availability when browsing preachers. Keep it updated to avoid conflicts.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Tips for Success</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Add slots at least 2 weeks in advance</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Include buffer time before/after slots</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Update travel range in your profile</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Remove slots when you're no longer available</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-sm text-gray-700 mb-4">
              Your profile's travel range determines which churches can see your availability.
            </p>
            <a 
              href="/dashboard/profile" 
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              Update Travel Range →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
