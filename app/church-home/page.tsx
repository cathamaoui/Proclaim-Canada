'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ChurchHomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  // If already logged in as church, redirect to dashboard
  if (session?.user?.role === 'CHURCH') {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <span>✝️</span>
              <span><span className="text-white">Proclaim </span><span className="text-lime-500">Canada</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/browse/preachers" className="text-gray-200 hover:text-white transition">
                Find Evangelists
              </Link>
              <Link href="/browse" className="text-gray-200 hover:text-white transition">
                Browse Opportunities
              </Link>
              <a href="#how-it-works" className="text-gray-200 hover:text-white transition">
                How It Works
              </a>
            </div>
            <div className="flex items-center gap-4">
              {!session ? (
                <>
                  <Link href="/auth/login" className="text-gray-200 hover:text-white transition">
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup?type=church"
                    className="bg-lime-500 hover:bg-lime-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Church Sign Up
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="text-gray-200 hover:text-white transition">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Qualified Preachers<br />
            <span className="text-lime-400">When You Need Them Most</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with talented preachers and evangelists to fill your pulpit. Post your opportunity and receive applications from verified candidates aligned with your church's mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=church"
              className="inline-block bg-lime-500 hover:bg-lime-600 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Get Started Free →
            </Link>
            <a
              href="#how-it-works"
              className="inline-block border-2 border-lime-500 text-lime-400 hover:bg-lime-500 hover:text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Learn More
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            ✓ Free 7-day trial • ✓ 1 free posting included • ✓ No credit card required
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your church account in minutes. Tell us about your congregation and staffing needs.',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Post an Opportunity',
                description: 'Describe the service, compensation, and requirements. Choose from our flexible pricing plans.',
                icon: '📢',
              },
              {
                step: '3',
                title: 'Review & Hire',
                description: 'Receive applications from qualified preachers. Message candidates and manage your search in one place.',
                icon: '✅',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="inline-block bg-lime-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-r from-lime-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Proclaim Canada?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Verified Candidates',
                description: 'Access a curated network of verified preachers and evangelists from across Canada and the US.',
                icon: '🔒',
              },
              {
                title: 'Mission-Aligned',
                description: 'Find candidates who share your theological beliefs, worship style, and ecclesiastical vision.',
                icon: '⛪',
              },
              {
                title: 'Quick Response',
                description: 'Post an opportunity in minutes. Receive qualified applications within hours.',
                icon: '⚡',
              },
              {
                title: 'Affordable Plans',
                description: 'From $50 urgent postings to unlimited yearly subscriptions. Pay only for what you need.',
                icon: '💰',
              },
              {
                title: 'Full Communication Suite',
                description: 'Message candidates directly, schedule calls, and manage your entire hiring process in one place.',
                icon: '💬',
              },
              {
                title: 'Candidate Management',
                description: 'Track applications, ratings, and history. Build a network for future staffing needs.',
                icon: '📊',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Choose the plan that fits your church's needs
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Free Trial',
                price: '$0',
                duration: '7 days',
                postings: '1 free posting',
                highlight: false,
              },
              {
                name: 'One Month',
                price: '$99',
                duration: '30 days',
                postings: 'Unlimited postings',
                highlight: true,
              },
              {
                name: 'Unlimited Yearly',
                price: '$1,700',
                duration: '365 days',
                postings: 'Unlimited postings',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-8 text-center transition transform hover:scale-105 ${
                  plan.highlight
                    ? 'bg-lime-500 text-white shadow-xl ring-2 ring-lime-600'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-lime-100' : 'text-gray-600'}`}>
                  {plan.duration}
                </p>
                <div className="text-4xl font-bold mb-4">{plan.price}</div>
                <p className={`mb-6 font-semibold ${plan.highlight ? 'text-lime-100' : 'text-gray-700'}`}>
                  {plan.postings}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/listings/pricing"
              className="inline-block text-lime-600 hover:text-lime-700 font-semibold"
            >
              View all plans and pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Fill Your Pulpit?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your free 7-day trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=church"
              className="inline-block bg-lime-500 hover:bg-lime-600 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Sign Up Free
            </Link>
            <a
              href="mailto:support@proclaimcanada.com"
              className="inline-block border-2 border-lime-500 text-lime-400 hover:bg-lime-500 hover:text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Proclaim Canada</h4>
              <p className="text-sm">Connecting churches with qualified preachers and evangelists across North America.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Churches</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/church-home" className="hover:text-white">Home</Link></li>
                <li><Link href="/listings/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/auth/signup?type=church" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Preachers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse" className="hover:text-white">Browse Opportunities</Link></li>
                <li><Link href="/auth/signup?role=PREACHER" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
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
