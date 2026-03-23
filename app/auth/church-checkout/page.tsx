'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const DENOMINATIONS = [
  'Baptist',
  'Pentecostal',
  'Anglican',
  'Catholic',
  'United Church',
  'Presbyterian',
  'Christian Alliance',
  'Evangelical',
  'Assembly of God',
  'Other',
]

const CHURCH_SIZES = [
  'Under 100 members',
  '100-250 members',
  '250-500 members',
  '500-1000 members',
  '1000+ members',
]

const COUNTRIES = [
  'Canada',
  'United States',
]

const PROVINCES_STATES: { [key: string]: string[] } = {
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ],
}

export default function ChurchCheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'monthly'
  
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [country, setCountry] = useState('Canada')

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    churchName: '',
    churchWebsite: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'Canada',
    postalCode: '',
    phone: '',
    denomination: '',
    churchSize: '',
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value
    if (e.target.name === 'country') {
      setCountry(value)
      setRegisterForm({
        ...registerForm,
        [e.target.name]: value,
        province: '',
      })
    } else {
      setRegisterForm({
        ...registerForm,
        [e.target.name]: value,
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      // After login, redirect to checkout with plan
      router.push(`/checkout?plan=${planId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerForm,
          role: 'CHURCH',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      // After registration, redirect to checkout with plan
      router.push(`/checkout?plan=${planId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">Proclaim </span>
            <span className="text-lime-500">Canada</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Login or Register to Continue Your Job Posting
          </h1>
          <p className="text-gray-600">
            Plan Selected: <span className="font-semibold capitalize">{planId}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Login to Your Account
            </h2>
            <p className="text-gray-600 mb-6">Already have an account? Sign in below.</p>

            {error && !isLogin && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="text-right">
                <a href="/auth/forgot-password" className="text-sm text-lime-600 hover:text-lime-700">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Register Section */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create a New Account
            </h2>
            <p className="text-gray-600 mb-6">New to Proclaim Canada? Register below.</p>

            {error && isLogin && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 max-h-96 overflow-y-auto">
              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Church Info */}
              <div>
                <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                  Church Name *
                </label>
                <input
                  id="churchName"
                  type="text"
                  name="churchName"
                  value={registerForm.churchName}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              {/* Church Website */}
              <div>
                <label htmlFor="churchWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                  Church Website
                </label>
                <input
                  id="churchWebsite"
                  type="url"
                  name="churchWebsite"
                  value={registerForm.churchWebsite}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="https://example.com"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  id="address1"
                  type="text"
                  name="address1"
                  value={registerForm.address1}
                  onChange={handleRegisterChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-2">
                  Address 2
                </label>
                <input
                  id="address2"
                  type="text"
                  name="address2"
                  value={registerForm.address2}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="Apt, Suite, etc."
                />
              </div>

              {/* City, Province/State, Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={registerForm.city}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province/State *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={registerForm.province}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">Select</option>
                    {PROVINCES_STATES[registerForm.country]?.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country & Postal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={registerForm.country}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal/Zip Code *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={registerForm.postalCode}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              {/* Denomination & Church Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                    Denomination *
                  </label>
                  <select
                    id="denomination"
                    name="denomination"
                    value={registerForm.denomination}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">Select</option>
                    {DENOMINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="churchSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Church Size *
                  </label>
                  <select
                    id="churchSize"
                    name="churchSize"
                    value={registerForm.churchSize}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">Select</option>
                    {CHURCH_SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account & Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
