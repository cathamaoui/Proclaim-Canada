'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-700">Proclaim Canada</div>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Preachers with Churches
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Proclaim Canada connects passionate preachers with churches looking for speakers. 
            Whether you're a preacher seeking opportunities or a church searching for the perfect speaker, we've got you covered.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href="/auth/signup?type=preacher" className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 font-semibold text-lg">
              I'm a Preacher
            </Link>
            <Link href="/auth/signup?type=church" className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-primary-600">
              I'm a Church
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Build Your Calendar</h3>
              <p className="text-gray-600">Preachers share their availability and qualifications</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Find & Connect</h3>
              <p className="text-gray-600">Churches search and connect with available preachers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Confirm & Serve</h3>
              <p className="text-gray-600">Agree on details and move forward together</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Proclaim Canada. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
