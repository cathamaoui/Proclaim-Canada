'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                <Logo />
                <span className="text-white">Proclaim </span>
                <span className="text-lime-500">Canada</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/browse/preachers" className="text-white text-sm hover:text-lime-400 transition">Find Evangelists</Link>
              <Link href="/listings" className="text-white text-sm hover:text-lime-400 transition">Browse Opportunities</Link>
              <a href="#how-it-works" className="text-white text-sm hover:text-lime-400 transition">How It Works</a>
            </div>

            {/* Right Side - Buttons & Icons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/profiles" 
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3 py-1.5 rounded font-semibold transition text-xs"
              >
                Admin
              </Link>
              <Link 
                href="/church-home" 
                className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-3 py-1.5 rounded font-semibold transition text-sm"
              >
                Church Home
              </Link>
              <Link 
                href="/listings/pricing" 
                className="text-white hover:text-lime-400 transition text-sm"
              >
                Post Opportunity
              </Link>
              <Link href="/auth/login" className="text-white hover:text-lime-400 transition" title="Sign In">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/cart" className="text-white hover:text-lime-400 transition relative" title="Cart">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.99-1.243l-1.376-5.502A1 1 0 0012.25 3H2.75a1 1 0 00-.75.75zM16 16a2 2 0 11-4 0 2 2 0 014 0zM4 16a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner with Background */}
      <div 
        className="relative py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(51,65,85);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(30,41,59);stop-opacity:1" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad)"/><path d="M 200 400 L 200 100 L 250 150 L 300 100 L 300 400 Z" fill="rgba(255,255,255,0.1)" opacity="0.5"/></svg>\')',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
            Proclaim. Evangelize. Serve.
          </h1>
          <p className="text-2xl md:text-3xl text-white text-center mb-4 font-semibold">Your Next Ministry Assignment Starts Here.</p>
          <p className="text-lg md:text-xl text-lime-200 text-center mb-12">Discover church jobs across Canada and the United States.</p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/answer-the-call"
              className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-4 rounded font-bold transition text-lg"
            >
              Register as a Visiting Minister
            </Link>
          </div>
          <p className="text-sm text-white text-center mt-6">Looking to post a job? <Link href="/listings/pricing" className="text-white underline hover:text-lime-200 transition">Click here</Link></p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-lime-300 to-lime-400 text-white py-12">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Share Your Calling?</h2>
          <p className="text-lg md:text-xl mb-8 text-lime-100">Whether you're an evangelist, preacher, or worship leader, let us help you reach the churches that need you.</p>
          <Link href="/auth/signup?type=preacher" className="inline-block bg-white hover:bg-gray-100 text-lime-600 px-8 py-4 rounded-lg font-bold transition text-lg">
            Join as Evangelist
          </Link>
        </div>
      </div>

      {/* No Cost Section */}
      <div className="bg-gradient-to-br from-lime-50 to-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-lime-600">Completely Free. No Strings Attached.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 20v60c0 3.3 2.7 6 6 6h28c3.3 0 6-2.7 6-6v-60M36 35h28M36 50h28M36 65h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M50 10L40 25h20z" fill="currentColor"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Cost to Join</h3>
              <p className="text-gray-600">Start connecting with churches and evangelists at no charge. It's free to create your profile and begin your ministry journey.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="30" r="12" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M50 45v35M35 55c0-8.3 6.7-15 15-15s15 6.7 15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M65 75L85 95M35 75L15 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Cost to View</h3>
              <p className="text-gray-600">Browse all available opportunities and church profiles. Search, filter, and explore without any fees or hidden costs.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 15h20v70H40z" fill="currentColor" opacity="0.3"/>
                <path d="M50 20L40 35h20z" fill="currentColor"/>
                <path d="M45 50h10M40 60h20M40 72h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="text-xl font-bold mb-3 text-gray-900">No Cost to Post</h3>
              <p className="text-gray-600">Share your resume, availability, and ministry information for free.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Link href="/auth/signup?type=preacher" className="text-center hover:scale-105 transition-transform border-2 border-lime-500 rounded-lg p-6 glow-border">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 15L35 50v35h30V50z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
                <path d="M50 20v30M40 35h20M45 55h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="50" cy="30" r="6" fill="currentColor"/>
              </svg>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Join</h3>
              <p className="text-gray-600">Sign up as an evangelist and create your profile</p>
            </Link>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="20" width="40" height="50" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M40 30h20M40 42h20M40 54h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M50 65L45 75l10-5 5 10" fill="currentColor" opacity="0.5"/>
              </svg>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Build Your Calendar</h3>
              <p className="text-gray-600">Evangelists share availability and service preferences</p>
            </div>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="40" r="12" stroke="currentColor" strokeWidth="2.5"/>
                <circle cx="65" cy="40" r="12" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M47 40h6M35 55v15M65 55v15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Find & Connect</h3>
              <p className="text-gray-600">Search and apply for opportunities</p>
            </div>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20L40 35h8v35c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V35h8z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
                <path d="M35 50s5-8 15-8 15 8 15 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M30 75L70 75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Confirm & Serve</h3>
              <p className="text-gray-600">Receive messages from churches with opportunities, review offers, accept, and prepare for the service</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
