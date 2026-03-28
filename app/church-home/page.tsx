'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

// Service Types/Roles
const SERVICE_CATEGORIES = [
  { name: 'Pulpit Supply', slug: 'sermon', icon: '🎤', description: 'Sunday preaching opportunities' },
  { name: 'Revival Speaker', slug: 'revival', icon: '🔥', description: 'Multi-day revival meetings' },
  { name: 'Youth Ministry', slug: 'workshop', icon: '👥', description: 'Youth conferences and workshops' },
  { name: 'Special Services', slug: 'special_service', icon: '⭐', description: 'Holidays and special events' },
  { name: 'Worship Leader', slug: 'worship', icon: '🎵', description: 'Worship and music ministry' },
  { name: 'Teaching/Training', slug: 'other', icon: '📖', description: 'Bible studies and seminars' },
]

// Canadian Provinces & US States for browsing
const REGIONS = {
  canada: [
    { name: 'Ontario', slug: 'ontario' },
    { name: 'Alberta', slug: 'alberta' },
    { name: 'British Columbia', slug: 'british-columbia' },
    { name: 'Quebec', slug: 'quebec' },
    { name: 'Manitoba', slug: 'manitoba' },
    { name: 'Saskatchewan', slug: 'saskatchewan' },
  ],
  usa: [
    { name: 'Texas', slug: 'texas' },
    { name: 'Georgia', slug: 'georgia' },
    { name: 'Florida', slug: 'florida' },
    { name: 'Illinois', slug: 'illinois' },
    { name: 'California', slug: 'california' },
    { name: 'New York', slug: 'new-york' },
  ],
}

// Pricing plans - competitive with free tier
const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    duration: '30 days',
    features: ['1 Free Posting', 'Basic Candidate Search', 'Email Support'],
    cta: 'Start Free',
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    duration: '/month',
    features: ['3 Active Postings', 'Full Candidate Database', 'Direct Messaging', 'Priority Support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$99',
    duration: '/month',
    features: ['Unlimited Postings', 'Featured Listings', 'Advanced Filters', 'Analytics Dashboard', 'Dedicated Support'],
    cta: 'Go Professional',
    popular: true,
  },
  {
    id: 'annual',
    name: 'Annual Unlimited',
    price: '$840',
    duration: '/year',
    savings: 'Save $348',
    features: ['Everything in Professional', '2 Months Free', 'Custom Branding', 'API Access', 'White-Glove Onboarding'],
    cta: 'Best Value',
    popular: false,
  },
]

interface Listing {
  id: string
  title: string
  churchName: string
  location: string
  type: string
  compensation: string
  date: string
  createdAt: string
}

interface Testimonial {
  churchName: string
  location: string
  quote: string
  contactName: string
  role: string
}

export default function ChurchHomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [testimonials, setTestimonials] = useState<{ churchTestimonials: Testimonial[], pastorTestimonials: any[] }>({ churchTestimonials: [], pastorTestimonials: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch recent listings
    fetch('/api/listings?limit=6')
      .then(res => res.json())
      .then(data => {
        setRecentListings(data.listings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Fetch testimonials
    fetch('/data/testimonials.json')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(console.error)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/browse/preachers?q=${encodeURIComponent(searchQuery)}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Posted today'
    if (diffDays === 1) return 'Posted yesterday'
    if (diffDays < 7) return `Posted ${diffDays} days ago`
    return `Posted ${date.toLocaleDateString()}`
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SERMON: 'bg-blue-100 text-blue-800',
      REVIVAL: 'bg-orange-100 text-orange-800',
      WORKSHOP: 'bg-purple-100 text-purple-800',
      SPECIAL_SERVICE: 'bg-green-100 text-green-800',
      OTHER: 'bg-gray-100 text-gray-800',
    }
    return colors[type] || colors.OTHER
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/church-home" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold">
                <span className="text-gray-900">Proclaim</span>
                <span className="text-lime-600">Canada</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900 font-medium">
                Browse Preachers
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
                How It Works
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                For Preachers
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <Link
                  href="/church-dashboard"
                  className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login?type=church"
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup?type=church"
                    className="bg-lime-600 hover:bg-lime-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                  >
                    Post a Job Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Qualified Preachers &<br />
            <span className="text-lime-400">Ministry Speakers</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Connect with experienced pastors, evangelists, and speakers for your pulpit supply, 
            revivals, conferences, and special services across Canada and the United States.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by denomination, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              <button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition"
              >
                Search
              </button>
            </div>
          </form>

          <p className="text-gray-400">
            <span className="text-lime-400 font-semibold">500+</span> qualified preachers available • 
            <span className="text-lime-400 font-semibold"> Free</span> to post your first opportunity
          </p>
        </div>
      </section>

      {/* Recently Posted Opportunities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recently Posted Opportunities</h2>
            <Link href="/browse" className="text-lime-600 hover:text-lime-700 font-semibold flex items-center gap-2">
              View All <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-2xl">
                      🏛️
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(listing.type)}`}>
                      {listing.type.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-lime-600 transition">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-1">{listing.churchName || 'Church Name'}</p>
                  <p className="text-gray-500 text-sm mb-3">📍 {listing.location}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-lime-600 font-semibold">{listing.compensation || 'Honorarium Provided'}</span>
                    <span className="text-gray-400 text-sm">{formatDate(listing.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Popular Ministry Roles</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Browse qualified speakers by ministry type. We have preachers experienced in every area of church ministry.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/browse/preachers?type=${category.slug}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100 group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-lime-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Region */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Browse Preachers by Region</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Canada */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🇨🇦 Canada
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {REGIONS.canada.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/browse/preachers?province=${region.slug}`}
                    className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-lime-50 transition border border-gray-100"
                  >
                    <span className="text-gray-700">{region.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* USA */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                🇺🇸 United States
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {REGIONS.usa.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/browse/preachers?state=${region.slug}`}
                    className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-lime-50 transition border border-gray-100"
                  >
                    <span className="text-gray-700">{region.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Post Your Opportunity in 3 Easy Steps</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find the perfect preacher for your church in minutes. It's free to get started!
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Enter your church name, location, and contact information. 
                Registration is completely free.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Post Your Opportunity</h3>
              <p className="text-gray-600">
                Describe your service needs, date, compensation, and what 
                you're looking for in a preacher.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Applications</h3>
              <p className="text-gray-600">
                Review preacher profiles, watch sermon samples, and message 
                candidates directly.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/auth/signup?type=church"
              className="inline-block bg-lime-600 hover:bg-lime-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Post Your First Opportunity Free
            </Link>
          </div>
        </div>
      </section>

      {/* Church Testimonials */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Trusted by Churches Across North America</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            See what church leaders are saying about finding preachers through Proclaim Canada.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.churchTestimonials.slice(0, 6).map((testimonial, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.contactName}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-lime-400 text-sm">{testimonial.churchName}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What Preachers Are Saying</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Join hundreds of preachers who have found meaningful ministry opportunities through our platform.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.pastorTestimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.denomination}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>📍 {testimonial.location}</span>
                  <span>{testimonial.yearsExperience}+ years ministry</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="text-lime-600 hover:text-lime-700 font-semibold"
            >
              Are you a preacher? Create your profile →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Start free and scale as you need. No hidden fees, cancel anytime.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-6 ${
                  plan.popular
                    ? 'bg-lime-600 text-white ring-4 ring-lime-200 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-white text-lime-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    MOST POPULAR
                  </span>
                )}
                {plan.savings && (
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${
                    plan.popular ? 'bg-white/20 text-white' : 'bg-lime-100 text-lime-800'
                  }`}>
                    {plan.savings}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>
                    {plan.duration}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${
                      plan.popular ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      <span className={plan.popular ? 'text-white' : 'text-lime-600'}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth/church-checkout?plan=${plan.id}`}
                  className={`block text-center py-3 px-4 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-white text-lime-600 hover:bg-gray-100'
                      : 'bg-lime-600 text-white hover:bg-lime-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            All plans include: 30-day money-back guarantee • Secure payments via Stripe • 24/7 support
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-lime-500 to-lime-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Next Speaker?
          </h2>
          <p className="text-xl text-lime-100 mb-8">
            Join hundreds of churches who have connected with qualified preachers through Proclaim Canada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=church"
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Post Opportunity Free
            </Link>
            <Link
              href="/browse/preachers"
              className="bg-white hover:bg-gray-100 text-lime-600 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Browse Preachers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

