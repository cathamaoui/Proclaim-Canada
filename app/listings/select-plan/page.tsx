'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'TRIAL',
    name: 'Trial Plan',
    description: 'Perfect for getting started',
    price: 'FREE',
    duration: '7 days',
    resumes: '0 views',
    features: [
      '1 free job posting',
      'Basic applicant filtering',
      'Email support',
      '7-day access',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'IMMEDIATE_CALL',
    name: 'Immediate Call',
    description: 'For urgent needs',
    price: '$29',
    duration: 'one-time',
    resumes: '10 views',
    features: [
      '1 job posting',
      'Priority placement',
      '30-day visibility',
      'Applicant filtering',
      '10 resume views',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'ONE_MONTH',
    name: '1 Month',
    description: 'Most popular for active searches',
    price: '$49',
    duration: '/month',
    resumes: '25 views/month',
    features: [
      '3 job postings',
      'Priority placement',
      '1-month visibility per posting',
      'Advanced filtering & sorting',
      '25 resume views per month',
      'Phone & email support',
      'Candidate insights',
    ],
    cta: 'Choose Plan',
    popular: false,
  },
  {
    id: 'THREE_MONTHS',
    name: '3 Months',
    description: 'For ongoing recruitment',
    price: '$129',
    duration: '/3 months',
    resumes: '75 views/month',
    features: [
      '10 job postings',
      'Priority placement',
      '3-month visibility per posting',
      'Advanced filtering & sorting',
      '75 resume views per month',
      'Phone & email support',
      'Candidate insights',
      'Dedicated account manager',
    ],
    cta: 'Choose Plan',
    popular: false,
  },
  {
    id: 'SIX_MONTHS',
    name: '6 Months',
    description: 'Best value for growing churches',
    price: '$229',
    duration: '/6 months',
    resumes: '150 views/month',
    features: [
      'Unlimited job postings',
      'Priority placement',
      '6-month visibility per posting',
      'Advanced filtering & sorting',
      '150 resume views per month',
      'Phone & email support',
      'Candidate insights',
      'Dedicated account manager',
      'Custom branding',
    ],
    cta: 'Choose Plan',
    popular: false,
  },
  {
    id: 'UNLIMITED_YEARLY',
    name: 'Unlimited Yearly',
    description: 'Complete access for a year',
    price: '$399',
    duration: '/year',
    resumes: '100 views/month',
    features: [
      'Unlimited job postings',
      'Priority placement',
      'Unlimited visibility',
      'Advanced filtering & sorting',
      '100 resume views per month',
      'Priority phone & email support',
      'Candidate insights & analytics',
      'Dedicated account manager',
      'Custom branding',
      'API access',
      'Add-on: Resume Unlimited (+$99/mo)',
    ],
    cta: 'Choose Plan',
    popular: false,
  },
]

export default function SelectPlanPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId)
    setLoading(true)
    setError(null)

    try {
      // For trial, skip payment and go directly to job posting
      if (planId === 'TRIAL') {
        const res = await fetch('/api/subscription/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType: 'TRIAL' }),
        })

        if (!res.ok) throw new Error('Failed to activate trial')
        router.push('/listings/new')
      } else {
        // For paid plans, go to checkout
        router.push(`/checkout?plan=${planId}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSelectedPlan(null)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/church-dashboard" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a membership plan to start posting job opportunities and finding the perfect preacher for your church.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-800">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border-2 transition ${
                plan.popular
                  ? 'border-green-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              } overflow-hidden`}
            >
              {plan.popular && (
                <div className="bg-green-500 text-white text-center py-2 font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.duration}</span>
                  </div>
                </div>

                {/* Resume Access Badge */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900">📋 Resume Access</p>
                  <p className="text-lg font-bold text-blue-600">{plan.resumes}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading && selectedPlan === plan.id ? 'Processing...' : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-Ons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Add-Ons</h2>
          <p className="text-gray-600 mb-8">Enhance your plan with optional add-ons to unlock more features</p>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Resume Unlimited</h3>
                <p className="text-gray-600 mb-6">Get unlimited access to our resume library. View as many preacher resumes as you need without monthly limits.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Unlimited resume views (no monthly cap)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Advanced filters (denomination, location, experience)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Download & share resumes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Auto-renews monthly (cancel anytime)</span>
                  </li>
                </ul>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  $99 <span className="text-lg text-gray-600">/month</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Add to Plan
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <p className="text-sm text-gray-600 mb-4">💡 <strong>Pro Tip:</strong></p>
                <p className="text-gray-600 mb-4">The Unlimited Yearly plan includes 100 free resume views per month. Add Resume Unlimited to get <strong>unlimited views</strong> for just $99/month.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800">Best Value</p>
                  <p className="text-sm text-green-700">Save time finding qualified candidates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-lg p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Your new terms will take effect at the beginning of your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee if you're not satisfied with our service. No questions asked.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">What happens after my trial ends?</h3>
              <p className="text-gray-600 text-sm">
                After your 7-day trial, you can choose to upgrade to a paid plan or let your account return to free basic features.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Do you have discounts for annual plans?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Our Unlimited Yearly plan offers the best value, with an effective monthly cost of just $33, plus 100 free resume views per month.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">How do resume views work?</h3>
              <p className="text-gray-600 text-sm">
                Each plan includes a certain number of resume views per month. When you view a preacher's resume, one view is counted. Monthly views reset on your billing date. Upgrade to Resume Unlimited for unlimited views.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I get more resume views?</h3>
              <p className="text-gray-600 text-sm">
                Yes! Add our Resume Unlimited add-on for $99/month to get unlimited resume access. You can add or cancel this add-on anytime in your subscription settings.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely. Cancel your subscription anytime, no penalties or long-term contracts required.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Need more help?</h3>
              <p className="text-gray-600 text-sm">
                Contact our support team at support@proclaimcanada.com or call 1-800-PROCLAIM for personalized assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
