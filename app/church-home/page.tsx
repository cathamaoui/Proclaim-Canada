'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/Logo'
import PreacherTicker from '@/components/PreacherTicker'

export default function ChurchHomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showPromo, setShowPromo] = useState(true)

  return (
    <div className="min-h-screen bg-white">
      {/* Spring Deal Popup */}
      {showPromo && (
        <div className="fixed bottom-5 right-5 z-40 bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl shadow-2xl p-5 w-72 text-white">
          <button
            onClick={() => setShowPromo(false)}
            className="absolute top-3 right-3 text-white hover:text-gray-200 text-xl font-bold"
          >
            ✕
          </button>
          <div className="text-center pt-2">
            <div className="text-xs font-bold text-blue-100 mb-1 tracking-wide">SPRING DEAL</div>
            <div className="text-4xl font-black mb-2">$50 OFF</div>
            <div className="text-sm font-semibold mb-3">ANY LISTING POST</div>
            <div className="text-xs bg-white bg-opacity-20 rounded px-2 py-1 inline-block">
              Use code: SPRING50
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <Logo />
              <span><span className="text-white">Proclaim </span><span className="text-lime-300">Canada</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-green-50 hover:text-white transition font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-green-50 hover:text-white transition font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-green-50 hover:text-white transition font-medium">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-green-50 hover:text-white transition font-medium">
                Log In
              </Link>
              <Link
                href="/auth/signup?type=church"
                className="bg-lime-400 hover:bg-lime-500 text-green-900 px-5 py-2 rounded-lg font-bold transition"
              >
                Find Preachers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(22, 163, 74, 0.7) 0%, rgba(16, 185, 129, 0.7) 100%), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%234b5563%22 width=%221200%22 height=%22600%22/%3E%3Ccircle cx=%22200%22 cy=%22100%22 r=%2280%22 fill=%22%236b7485%22 opacity=%220.5%22/%3E%3Ccircle cx=%221000%22 cy=%22500%22 r=%22150%22 fill=%22%236b7485%22 opacity=%220.3%22/%3E%3Crect x=%22400%22 y=%22250%22 width=%22400%22 height=%22200%22 fill=%22%236b7485%22 opacity=%220.2%22 rx=%2220%22/%3E%3C/svg%3E")'
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        
        <div className="relative text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Build Your Dream Team<br />
            <span className="text-lime-200">on the #1 church staffing site.</span>
          </h1>
          <Link
            href="/auth/signup?type=church"
            className="inline-block bg-lime-400 hover:bg-lime-500 text-green-900 px-10 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg"
          >
            START HERE →
          </Link>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's grow your team together.
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              With the help of hiring tools from Proclaim Canada, you'll reach hundreds of job seekers who are not only talented and qualified, but also aligned with your mission.
            </p>
            <Link
              href="/listings/pricing"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              POST YOUR LISTING NOW!
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Included with your Listing Post
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📢',
                title: 'Listing Syndication',
                description: 'Reach job seekers through our strategic site partnerships and reach thousands of qualified candidates.'
              },
              {
                icon: '📋',
                title: 'Candidate Database Access',
                description: 'Get exclusive access to 500+ qualified preachers and evangelists with advanced filtering options.'
              },
              {
                icon: '📊',
                title: 'Unlimited Applicants',
                description: 'Receive application information from interested job seekers for as long as your listing is active.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Sign Up',
                description: 'Create your account and set up your church profile in minutes.'
              },
              {
                step: 2,
                title: 'Post a Listing',
                description: 'Describe your opportunity and choose from flexible pricing plans.'
              },
              {
                step: 3,
                title: 'Review Applications',
                description: 'Receive applications and access our candidate database simultaneously.'
              },
              {
                step: 4,
                title: 'Hire & Connect',
                description: 'Message candidates, schedule calls, and secure your next preacher.'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border-t-4 border-green-500">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold mb-4 text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              From posting to hiring, Proclaim Canada makes finding your next preacher simple and efficient.
            </p>
            <Link
              href="/auth/signup?type=church"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            View A Few Simple Plans
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Whether you need an urgent posting or year-round staffing, we have a plan for you.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                badge: 'URGENT',
                name: 'Immediate Call',
                duration: '3 days',
                price: '$50',
                features: ['Quick turnaround', 'Job post distribution', 'Application management']
              },
              {
                name: '1 Month',
                duration: '30 days',
                price: '$99',
                features: ['30-day listing', 'Job post distribution', 'Application management', '1 Month Browse Access'],
                highlight: true
              },
              {
                badge: 'BEST VALUE',
                name: 'Unlimited Yearly',
                duration: '365 days',
                price: '$1,700',
                features: ['Unlimited postings', 'Full year access', 'Job post distribution', '12 Months Browse Access']
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl transition transform hover:scale-105 relative ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl ring-4 ring-green-300 scale-105'
                    : 'bg-white shadow-lg text-gray-900'
                }`}
                style={plan.highlight ? { boxShadow: '0 20px 50px rgba(34, 197, 94, 0.3)' } : {}}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 right-6 px-4 py-1 rounded-full text-sm font-bold text-white ${
                    plan.badge === 'BEST VALUE' ? 'bg-blue-600' : 'bg-red-600'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : ''}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? 'text-green-50' : 'text-gray-500'}`}>
                    {plan.duration}
                  </p>
                  <div className={`text-4xl font-black mb-6 ${plan.highlight ? 'text-lime-200' : 'text-green-600'}`}>
                    {plan.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className={`flex items-center gap-3 ${plan.highlight ? 'text-green-50' : 'text-gray-700'}`}>
                        <span className="text-xl">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/listings/pricing"
                    className={`block w-full text-center py-3 rounded-lg font-bold transition ${
                      plan.highlight
                        ? 'bg-white text-green-600 hover:bg-lime-50'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    Choose Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/listings/pricing"
              className="text-green-600 hover:text-green-700 font-bold text-lg"
            >
              View all pricing options & multi-job packs →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
            Join hundreds of churches already using Proclaim Canada to find qualified preachers and evangelists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=church"
              className="bg-lime-400 hover:bg-lime-500 text-green-900 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Sign Up Free
            </Link>
            <a
              href="mailto:support@proclaimcanada.com"
              className="border-2 border-lime-400 text-lime-300 hover:bg-lime-400 hover:text-green-900 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Contact Support
            </a>
          </div>
          <p className="text-sm text-green-100 mt-8">
            Free signup • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>✝️</span>
                <span>Proclaim Canada</span>
              </h4>
              <p className="text-sm">Connecting churches with qualified preachers and evangelists across North America.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Churches</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/church-home" className="hover:text-white">Home</Link></li>
                <li><Link href="/listings/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Preachers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="hover:text-white">Browse</Link></li>
                <li><Link href="/auth/signup?type=preacher" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Proclaim Canada. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

