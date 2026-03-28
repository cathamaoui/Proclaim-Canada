'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import NotificationBell from '@/components/NotificationBell'
import ProfileCompletionBanner from '@/components/ProfileCompletionBanner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [profileChecked, setProfileChecked] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    setProfileChecked(true)
  }, [])

  if (status === 'loading' || !profileChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Redirect non-preacher users away from preacher dashboard
  if (session && session.user.role !== 'PREACHER') {
    router.push('/browse')
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/applications', label: 'My Applications', icon: '📝' },
    { href: '/dashboard/availability', label: 'Availability', icon: '📅' },
    { href: '/dashboard/ratings', label: 'Ratings & Reviews', icon: '⭐' },
    { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Proclaim
              </div>
              <div className="text-sm font-semibold text-gray-600">Canada</div>
            </Link>

            <div className="flex items-center gap-8">
              <Link 
                href="/browse" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Browse Opportunities
              </Link>
              
              <NotificationBell />

              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">Preacher</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex">
        {/* Modern Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 shadow-sm">
          <nav className="p-6 space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Navigation</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 pt-8 pb-12">
          <div className="max-w-6xl mx-auto px-6">
            <ProfileCompletionBanner />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
