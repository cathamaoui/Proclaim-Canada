'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileChecked, setProfileChecked] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Check if preacher profile is incomplete
  useEffect(() => {
    if (!session?.user) {
      return
    }

    // For non-preachers, skip the profile check
    if (session.user.role !== 'PREACHER') {
      setProfileChecked(true)
      return
    }

    // For preachers, check if profile needs completion
    const checkProfile = async () => {
      try {
        const response = await fetch('/api/preacher/profile')
        const data = await response.json()
        
        // If no bio, redirect to profile completion
        if (!data.profile?.bio) {
          router.push('/dashboard/profile')
        }
      } catch (error) {
        console.error('Error checking profile:', error)
      } finally {
        setProfileChecked(true)
      }
    }

    checkProfile()
  }, [session, router])

  if (status === 'loading' || !profileChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-700">
              Proclaim Canada
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/browse" className="text-gray-700 hover:text-primary-600">
                Browse Opportunities
              </Link>
              {session.user.role === 'CHURCH' && (
                <Link href="/listings/new" className="text-gray-700 hover:text-primary-600">
                  Post Opening
                </Link>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {session.user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-primary-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                {session.user.role === 'CHURCH' ? (
                  <>
                    <Link
                      href="/dashboard/listings"
                      className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                    >
                      My Listings
                    </Link>
                    <Link
                      href="/dashboard/applications"
                      className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                    >
                      Applications
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/applications"
                      className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                    >
                      My Applications
                    </Link>
                    <Link
                      href="/dashboard/availability"
                      className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                    >
                      Availability
                    </Link>
                  </>
                )}
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600"
                >
                  Profile Settings
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
