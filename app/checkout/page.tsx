'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Pricing plans
const PRICING_PLANS: Record<string, { name: string, price: number, duration: string, features: string[] }> = {
  free: {
    name: 'Free Trial',
    price: 0,
    duration: '30 days',
    features: ['1 Free Posting', 'Basic Search', 'Email Support'],
  },
  starter: {
    name: 'Starter',
    price: 49,
    duration: '/month',
    features: ['3 Active Postings', 'Full Database Access', 'Direct Messaging', 'Priority Support'],
  },
  professional: {
    name: 'Professional',
    price: 99,
    duration: '/month',
    features: ['Unlimited Postings', 'Featured Listings', 'Analytics Dashboard', 'Dedicated Support'],
  },
  annual: {
    name: 'Annual Unlimited',
    price: 840,
    duration: '/year',
    features: ['Everything in Professional', '2 Months Free', 'Custom Branding', 'API Access'],
  },
}

type PaymentMethod = 'card' | 'paypal' | 'bank' | 'interac'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const planId = searchParams.get('plan') || 'starter'
  const plan = PRICING_PLANS[planId] || PRICING_PLANS.starter

  const [step, setStep] = useState<'auth' | 'payment' | 'success'>('auth')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  // Auth form states
  const [isLogin, setIsLogin] = useState(true)
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  // Card form
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Canada',
  })

  // Auto-move to payment if user is already logged in  
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'CHURCH') {
      setStep('payment')
    }
  }, [status, session])

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Sign in
        const result = await signIn('credentials', {
          email: authForm.email,
          password: authForm.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Invalid email or password')
        }

        // Check if user is a church
        setStep('payment')
      } else {
        // Register
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
            name: authForm.name,
            role: 'CHURCH',
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Registration failed')
        }

        // Auto sign in after registration
        const result = await signIn('credentials', {
          email: authForm.email,
          password: authForm.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error('Registration successful, but login failed. Please try logging in.')
        }

        setStep('payment')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // For free plan, skip payment
      if (plan.price === 0) {
        const response = await fetch('/api/subscription/create-trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Failed to activate free trial')
        }

        setStep('success')
        return
      }

      // Process payment based on method
      if (paymentMethod === 'card') {
        // Stripe payment
        const response = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planType: planId.toUpperCase(),
            paymentMethod: 'card',
            cardDetails: cardForm,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Payment failed')
        }

        const data = await response.json()
        if (data.url) {
          // In production, this would redirect to Stripe Checkout
          // For MVP, we simulate success
          setStep('success')
        }
      } else if (paymentMethod === 'paypal') {
        // PayPal payment - would redirect to PayPal in production
        const response = await fetch('/api/checkout/paypal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType: planId.toUpperCase() }),
        })

        if (!response.ok) {
          throw new Error('PayPal checkout initialization failed')
        }

        const data = await response.json()
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl
        } else {
          // Mock success for MVP
          setStep('success')
        }
      } else if (paymentMethod === 'bank' || paymentMethod === 'interac') {
        // Bank transfer / Interac - generate invoice
        const response = await fetch('/api/checkout/invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planType: planId.toUpperCase(),
            paymentMethod,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate invoice')
        }

        setStep('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : v
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  // Success Page
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {plan.price === 0 ? 'Free Trial Activated!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-600 mb-6">
            {plan.price === 0
              ? 'Your 30-day free trial has been activated. You can now post your first opportunity.'
              : `Your ${plan.name} plan is now active. Thank you for your purchase!`}
          </p>
          <div className="space-y-3">
            <Link
              href="/listings/new"
              className="block w-full bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Post Your First Opportunity
            </Link>
            <Link
              href="/church-dashboard"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/church-home" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold">
                <span className="text-white">Proclaim</span>
                <span className="text-lime-500">Canada</span>
              </span>
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-400">Secure checkout</span>
              <span className="text-lime-500">🔒</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'auth' ? 'text-lime-600' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'auth' ? 'bg-lime-600 text-white' : step === 'payment' ? 'bg-lime-600 text-white' : 'bg-gray-300'
              }`}>1</span>
              <span className="font-medium">Account</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-lime-600' : 'text-gray-400'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-lime-600 text-white' : 'bg-gray-300'
              }`}>2</span>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Auth Step */}
            {step === 'auth' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isLogin ? 'Sign in to continue' : 'Create your account'}
                </h2>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Church / Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                        placeholder="First Baptist Church"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                      placeholder="••••••••"
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={authForm.confirmPassword}
                        onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Please wait...' : isLogin ? 'Sign In & Continue' : 'Create Account & Continue'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-lime-600 hover:text-lime-700 font-medium"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Credit/Debit Card */}
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      paymentMethod === 'card'
                        ? 'border-lime-600 bg-lime-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-medium text-sm text-gray-900">Credit/Debit</div>
                    <div className="text-xs text-gray-500 mt-1">Visa, MC, Amex</div>
                  </button>

                  {/* PayPal */}
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      paymentMethod === 'paypal'
                        ? 'border-lime-600 bg-lime-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🅿️</div>
                    <div className="font-medium text-sm text-gray-900">PayPal</div>
                    <div className="text-xs text-gray-500 mt-1">Quick & Secure</div>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      paymentMethod === 'bank'
                        ? 'border-lime-600 bg-lime-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-medium text-sm text-gray-900">Bank Transfer</div>
                    <div className="text-xs text-gray-500 mt-1">ACH/Wire</div>
                  </button>

                  {/* Interac (Canada) */}
                  <button
                    onClick={() => setPaymentMethod('interac')}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      paymentMethod === 'interac'
                        ? 'border-lime-600 bg-lime-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🍁</div>
                    <div className="font-medium text-sm text-gray-900">Interac</div>
                    <div className="text-xs text-gray-500 mt-1">Canada Only</div>
                  </button>
                </div>

                {/* Payment Forms */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Credit/Debit Card Form */}
                  {paymentMethod === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardForm.cardNumber}
                          onChange={(e) => setCardForm({ ...cardForm, cardNumber: formatCardNumber(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardForm.expiryDate}
                            onChange={(e) => setCardForm({ ...cardForm, expiryDate: formatExpiryDate(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardForm.cardholderName}
                          onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          placeholder="John Smith"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address
                        </label>
                        <input
                          type="text"
                          required
                          value={cardForm.billingAddress}
                          onChange={(e) => setCardForm({ ...cardForm, billingAddress: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={cardForm.city}
                            onChange={(e) => setCardForm({ ...cardForm, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            required
                            value={cardForm.postalCode}
                            onChange={(e) => setCardForm({ ...cardForm, postalCode: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            value={cardForm.country}
                            onChange={(e) => setCardForm({ ...cardForm, country: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                          >
                            <option>Canada</option>
                            <option>United States</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PayPal */}
                  {paymentMethod === 'paypal' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="text-4xl mb-4">🅿️</div>
                      <p className="text-gray-700 mb-4">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PayPal balance, credit/debit cards, and bank accounts.
                      </p>
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentMethod === 'bank' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Bank Transfer Instructions</h3>
                      <p className="text-gray-700 mb-4">
                        After confirming, you'll receive an invoice with our bank details. 
                        Your subscription will be activated once payment is confirmed (1-3 business days).
                      </p>
                      <div className="bg-white border border-gray-200 rounded p-4">
                        <p className="text-sm text-gray-600"><strong>Bank:</strong> TD Canada Trust</p>
                        <p className="text-sm text-gray-600"><strong>Account:</strong> Proclaim Canada Inc.</p>
                        <p className="text-sm text-gray-600"><strong>Reference:</strong> Invoice # (will be provided)</p>
                      </div>
                    </div>
                  )}

                  {/* Interac e-Transfer (Canada) */}
                  {paymentMethod === 'interac' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Interac e-Transfer</h3>
                      <p className="text-gray-700 mb-4">
                        Send your Interac e-Transfer to our email address. Use your invoice number as the message.
                      </p>
                      <div className="bg-white border border-orange-200 rounded p-4">
                        <p className="text-sm text-gray-600"><strong>Email:</strong> payments@proclaimcanada.com</p>
                        <p className="text-sm text-gray-600"><strong>Message:</strong> Your Invoice # (provided after checkout)</p>
                        <p className="text-sm text-gray-600"><strong>Auto-Deposit:</strong> Enabled (no password needed)</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-lime-600 hover:bg-lime-700 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50"
                    >
                      {loading
                        ? 'Processing...'
                        : plan.price === 0
                          ? 'Start Free Trial'
                          : `Pay $${plan.price.toFixed(2)} ${plan.duration}`}
                    </button>
                  </div>
                </form>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>🔒</span>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>💳</span>
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>✅</span>
                    <span>30-Day Guarantee</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{plan.name}</span>
                  <span className="font-bold text-lime-600">
                    ${plan.price.toFixed(2)}
                    <span className="text-sm text-gray-500">{plan.duration !== '30 days' ? plan.duration : ''}</span>
                  </span>
                </div>
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lime-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.price > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>${plan.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span className="text-lime-600">${plan.price.toFixed(2)}</span>
              </div>

              {plan.price === 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  No credit card required for free trial.
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href={`/church-home#pricing`}
                  className="text-sm text-lime-600 hover:text-lime-700"
                >
                  ← Change plan
                </Link>
              </div>
            </div>

            {/* Help Box */}
            <div className="bg-gray-50 rounded-xl p-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is available Mon-Fri, 9am-5pm EST.
              </p>
              <div className="space-y-2">
                <a href="mailto:support@proclaimcanada.com" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                  <span>📧</span>
                  <span>support@proclaimcanada.com</span>
                </a>
                <a href="tel:1-800-555-0123" className="flex items-center gap-2 text-sm text-lime-600 hover:text-lime-700">
                  <span>📞</span>
                  <span>1-800-555-0123</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
