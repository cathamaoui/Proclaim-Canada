'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

const PRICING_PLANS = [
  {
    category: 'Subscription Options (1 Job Posting)',
    plans: [
      {
        id: 'urgent-3-days',
        duration: 'Immediate Call Posting',
        days: '3 days',
        price: '$50',
        badge: 'URGENT',
        description: 'Perfect when you\'re in a pinch',
      },
      {
        id: 'single-1-month',
        duration: '1 month',
        days: '30 days',
        price: '$99',
        description: 'Perfect for one-time opportunities',
        incentive: '+ 1 Month Full Access\n✓ Includes Free Registration',
      },
      {
        id: 'single-2-months',
        duration: '2 months',
        days: '60 days',
        pricePerMonth: '$92.50/month',
        totalPrice: '$185',
        description: 'Extended visibility',
        incentive: '+ 1 Month Full Access\n✓ Includes Free Registration',
      },
      {
        id: 'single-3-months',
        duration: '3 months',
        days: '90 days',
        pricePerMonth: '$85/month',
        totalPrice: '$255',
        description: 'Better reach',
        incentive: '+ 1 Month Full Access\n✓ Includes Free Registration',
      },
      {
        id: 'single-6-months',
        duration: '6 months',
        days: '180 days',
        pricePerMonth: '$75/month',
        totalPrice: '$450',
        description: 'Maximum exposure',
        incentive: '+ 1 Month Full Access\n✓ Includes Free Registration',
      },
      {
        id: 'unlimited-yearly',
        duration: 'Unlimited Yearly',
        days: '365 days - unlimited postings',
        price: '$840',
        badge: 'BEST VALUE',
        badgeColor: 'bg-blue-600',
        description: 'For churches with ongoing staffing needs',
        incentive: '+ 12 Months Full Access\n+ 1 Month Full Access\n✓ Includes Free Registration',
      },
    ],
  },
  {
    category: 'Ongoing Listing Plans (Unlimited Postings)',
    plans: [
      {
        id: 'multi-3-months',
        duration: '3 months',
        days: '90 days - unlimited postings',
        price: '$285',
        pricePerMonth: '$95/month',
        description: 'For active recruiting seasons',
        incentive: '+ 3 Months Full Access\n✓ Includes Free Registration\n✓ Unlimited Job Postings',
      },
      {
        id: 'multi-6-months',
        duration: '6 months',
        days: '180 days - unlimited postings',
        price: '$510',
        pricePerMonth: '$85/month',
        description: 'Great for ongoing needs',
        incentive: '+ 6 Months Full Access\n✓ Includes Free Registration\n✓ Unlimited Job Postings',
      },
      {
        id: 'multi-yearly',
        duration: 'Annual Unlimited',
        days: '365 days - unlimited postings',
        price: '$900',
        badge: 'BEST VALUE',
        badgeColor: 'bg-blue-600',
        pricePerMonth: '$75/month',
        description: 'Maximum flexibility for your church',
        incentive: '+ 12 Months Full Access\n✓ Includes Free Registration\n✓ Unlimited Job Postings',
      },
    ],
  },
]

const FEATURES = [
  {
    icon: '📡',
    title: 'Job Post Distribution',
    description: 'Obtain wider reach through strategic site partnerships',
  },
  {
    icon: '📊',
    title: 'Application Management',
    description: 'Receive applications and manage all candidates in one place',
  },
  {
    icon: '💌',
    title: 'Communication Tools',
    description: 'Message candidates directly and manage your pipeline',
  },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Logo />
              <Link href="/" className="text-2xl font-bold">
                <span className="text-white">Proclaim </span>
                <span className="text-lime-500">Canada</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/church-home" className="text-white font-medium hover:text-lime-400 transition">
                Church Home
              </Link>
              <Link href="/listings/pricing" className="text-white font-medium hover:text-lime-400 transition">
                Post a Job
              </Link>
              <Link href="/browse/preachers" className="text-white font-medium hover:text-lime-400 transition">
                Browse Preachers
              </Link>
              <a href="#how-it-works" className="text-white font-medium hover:text-lime-400 transition">
                How It Works
              </a>
              <a href="#" className="text-white font-medium hover:text-lime-400 transition">
                Help
              </a>
            </div>

            {/* Right Side - Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/browse/preachers" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Browse Preachers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-lime-50 to-emerald-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the right plan for your church's staffing needs. Connect with qualified preachers and evangelists today.
          </p>
        </div>
      </div>

      {/* Pricing Plans Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {PRICING_PLANS.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {section.category}
            </h2>
            <div className={`grid grid-cols-1 ${section.category === 'Subscription Options (1 Job Posting)' ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-3'} gap-6 auto-rows-fr`}>
              {section.plans.map((plan, planIdx) => (
                <div
                  key={planIdx}
                  className={`relative flex flex-col bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition min-h-full pt-12 ${
                    'badge' in plan && plan.badge === 'BEST VALUE' ? 'border-blue-500 border-2' : 'badge' in plan ? 'border-lime-500 border-2' : 'border-gray-200'
                  }`}
                >
                  {('badge' in plan) && (
                    <div className={`absolute top-2 right-2 ${('badgeColor' in plan) ? plan.badgeColor : 'bg-lime-500'} text-white px-4 py-2 rounded-bl-lg text-sm font-bold`}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {'duration' in plan ? plan.duration : 'jobCount' in plan ? plan.jobCount : ''}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {'days' in plan ? plan.days : ''}
                    </p>
                    <div className="mb-1">
                      <span className="text-3xl font-bold text-lime-600">
                        {'price' in plan ? plan.price : ''}
                      </span>
                    </div>
                    {'pricePerMonth' in plan && (
                      <p className="text-sm text-gray-600">
                        {plan.pricePerMonth}
                      </p>
                    )}
                    {'pricePerPosting' in plan && (
                      <p className="text-sm text-gray-600">
                        {plan.pricePerPosting}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex-1">
                    {plan.description}
                  </p>
                  {'incentive' in plan && (
                    <p className="text-sm text-lime-600 font-semibold mb-3 whitespace-pre-line">
                      {plan.incentive}
                    </p>
                  )}
                  <button
                    onClick={() => window.location.href = `/auth/church-checkout?plan=${('id' in plan) ? plan.id : 'standard'}`}
                    className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Terms Notice */}
      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            All subscriptions automatically renew at the end of your billing period. You can cancel anytime from your account settings.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Included with Every Job Post
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-lime-500 to-emerald-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Next Preacher?</h2>
          <p className="text-lg mb-8 text-lime-100">
            Start posting opportunities today and connect with qualified speakers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {
                if (session?.user.role === 'CHURCH') {
                  router.push('/listings/new')
                } else {
                  router.push('/auth/signup?type=church')
                }
              }}
              className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-3 rounded-lg font-bold transition"
            >
              Post an Opportunity
            </button>
            <Link
              href="/"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-lg font-bold transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">How long does a job posting stay active?</h3>
            <p className="text-gray-600">
              Job postings remain active for the duration of your chosen plan. You can renew or modify your posting at any time.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Can I cancel my subscription?</h3>
            <p className="text-gray-600">
              Yes, you can cancel anytime. Remaining credits will be honored at their pro-rata value.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Do you offer discounts for annual subscriptions?</h3>
            <p className="text-gray-600">
              Contact our team to discuss volume discounts and customized plans for larger organizations.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for large orders.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
