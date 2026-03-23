'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChurchDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    // Redirect non-churches away
    if (session && (session.user as any)?.role !== 'CHURCH') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'CHURCH') {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 0 6px rgba(132,204,22,0.7)) drop-shadow(0 0 12px rgba(132,204,22,0.4))'}}>
                <path d="M25 35 L55 20 L55 70 L25 55 Z" fill="#84CC16"/>
                <path d="M55 15 Q80 10 85 5 L85 85 Q80 80 55 75 Z" fill="#84CC16"/>
                <rect x="15" y="38" width="12" height="14" rx="3" fill="#65A30D"/>
                <rect x="66" y="28" width="5" height="34" rx="1" fill="#FFFFFF"/>
                <rect x="56" y="40" width="25" height="5" rx="1" fill="#FFFFFF"/>
                <path d="M88 30 Q95 45 88 60" stroke="#84CC16" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M93 22 Q102 45 93 68" stroke="#84CC16" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <span className="text-white">Proclaim </span>
              <span className="text-lime-500">Canada</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{(session?.user as any)?.name || 'Church'}</span>
              <Link href="/dashboard" className="text-gray-300 hover:text-lime-400 transition text-sm">Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div 
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(51,65,85);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(30,41,59);stop-opacity:1" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad)"/></svg>\')',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Sound Doctrine. Solid Preachers.
            <br />
            Build A Roster of Trusted Shepherds.
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Find the perfect evangelists and preachers to inspire your congregation
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/browse/preachers" className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-8 py-4 rounded-lg font-bold transition text-lg">
              Find Evangelists
            </Link>
            <Link href="/listings/new" className="border-2 border-lime-500 text-white hover:bg-lime-500 hover:text-slate-900 px-8 py-4 rounded-lg font-bold transition text-lg">
              Post an Opportunity
            </Link>
          </div>
        </div>
      </div>

      {/* What's Included Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Find the Perfect Fit for Your Church</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Browse profiles of experienced evangelists, preachers, and worship leaders ready to serve</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Browse Profiles</h3>
              <p className="text-gray-600">Explore vetted evangelists and preachers with detailed profiles, experience, and ratings</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Post Opportunities</h3>
              <p className="text-gray-600">List your service opportunities and connect with speakers aligned with your church's mission</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Manage Applications</h3>
              <p className="text-gray-600">Review applications, connect with candidates, and confirm speakers for your services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-lg">Evangelists & Preachers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-lg">Vetted & Verified</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-lg">Support Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">Post your first opportunity and start receiving applications from qualified evangelists</p>
          <Link href="/listings/new" className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-12 py-4 rounded-lg font-bold transition text-lg inline-block">
            Post Your First Opportunity
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Proclaim Canada. Connecting churches with evangelists.</p>
        </div>
      </footer>
    </main>
  )
}
