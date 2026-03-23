'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import ServiceTypeSelector from '@/components/ServiceTypeSelector'

// Denomination categories - sorted alphabetically within each category
const DENOMINATIONS = {
  'Evangelical & Baptist': [
    'Canadian Baptists of Atlantic Canada (CBAC)',
    'Charismatic / Full Gospel',
    'Evangelical Free Church of Canada (EFCC)',
    'Fellowship of Evangelical Baptist Churches (Fellowship Atlantic)',
    'Pentecostal Assemblies of Canada (PAOC)',
    'The Alliance Canada (Christian and Missionary Alliance)',
  ],
  'Mainline Protestant': [
    'Evangelical Lutheran Church in Canada (ELCIC)',
    'The Anglican Church of Canada',
    'The Presbyterian Church in Canada',
    'The United Church of Canada',
  ],
  'Other Christian Traditions': [
    'Roman Catholic',
    'Seventh-day Adventist',
    'The Salvation Army',
    'Wesleyan Church',
  ],
  'General Options': [
    'Inter-denominational',
    'Non-denominational',
    'Other (Please specify)',
  ],
}

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'preacher'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    churchName: '',
    organizationName: '',
    denomination: '',
    specifyAffiliation: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    website: '',
    averageAttendance: '',
    serviceTypes: [] as string[],
    customService: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [choicesInstance, setChoicesInstance] = useState<any>(null)

  // Initialize Choices.js when component mounts
  useEffect(() => {
    if (type === 'church') {
      // Load Choices.js library dynamically
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js'
      script.async = true
      script.onload = () => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css'
        document.head.appendChild(link)

        // Initialize Choices.js on the denomination select
        const denominationSelect = document.getElementById('denomination') as HTMLSelectElement
        if (denominationSelect) {
          const choices = new (window as any).Choices(denominationSelect, {
            searchEnabled: true,
            searchChoices: true,
            shouldSort: false,
            placeholderValue: 'Search denominations...',
            noResultsText: 'No results found',
            noChoicesText: 'No choices available',
          })
          setChoicesInstance(choices)
        }
      }
      document.head.appendChild(script)
    }

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy()
      }
    }
  }, [type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value
    
    // Auto-prepend https:// to website URL if it doesn't have a protocol
    if (e.target.name === 'website' && value && !value.match(/^https?:\/\//i)) {
      value = `https://${value}`
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleServiceTypeChange = (services: string[]) => {
    setFormData({
      ...formData,
      serviceTypes: services,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    // Validate required church fields
    if (type === 'church') {
      if (!formData.churchName || !formData.city || !formData.province || !formData.postalCode || !formData.denomination || !formData.averageAttendance) {
        setError('Please fill in all required church fields')
        setLoading(false)
        return
      }
      if (formData.denomination === 'Other (Please specify)' && !formData.specifyAffiliation) {
        setError('Please specify your church affiliation')
        setLoading(false)
        return
      }
    }

    // Validate required preacher fields
    if (type === 'preacher') {
      if (!formData.serviceTypes || formData.serviceTypes.length === 0) {
        setError('Please select at least one service type you are willing to preach')
        setLoading(false)
        return
      }
      if (formData.serviceTypes.includes('Other (Please specify)') && !formData.customService) {
        setError('Please specify your custom service type')
        setLoading(false)
        return
      }
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: type.toUpperCase(),
          ...(type === 'church' && {
            churchName: formData.churchName,
            organizationName: formData.organizationName,
            denomination: formData.denomination,
            specifyAffiliation: formData.specifyAffiliation || null,
            street: formData.street,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            website: formData.website,
            averageAttendance: formData.averageAttendance,
          }),
          ...(type === 'preacher' && {
            serviceTypes: formData.serviceTypes,
            customService: formData.customService || null,
          }),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create account')
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/dashboard/profile/complete')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Redirecting to login...
          </p>
          <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign In Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sign Up as {type === 'church' ? 'Church' : 'Preacher'}
        </h1>
        <p className="text-gray-600 mb-8">Join Proclaim Canada today</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* CHURCH SPECIFIC FIELDS */}
          {type === 'church' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Church Information</h3>
              
              {/* Church Name */}
              <div className="mb-4">
                <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                  Church/Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="churchName"
                  type="text"
                  name="churchName"
                  value={formData.churchName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Grace Community Church"
                />
              </div>

              {/* Organization Name */}
              <div className="mb-4">
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Organization Name
                </label>
                <input
                  id="organizationName"
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="e.g., Grace Community Church Inc."
                />
              </div>

              {/* Denomination - Searchable with Choices.js */}
              <div className="mb-4">
                <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                  Denomination/Affiliation <span className="text-red-500">*</span>
                </label>
                <select
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                >
                  <option value="">-- Select a denomination --</option>
                  {Object.entries(DENOMINATIONS).map(([category, options]) => (
                    <optgroup key={category} label={category}>
                      {options.sort().map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Conditional: Specify Affiliation (if "Other" selected) */}
              {formData.denomination === 'Other (Please specify)' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label htmlFor="specifyAffiliation" className="block text-sm font-medium text-gray-700 mb-2">
                    Please Specify Your Church Affiliation <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="specifyAffiliation"
                    type="text"
                    name="specifyAffiliation"
                    value={formData.specifyAffiliation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Enter your church affiliation"
                  />
                </div>
              )}

              {/* Average Sunday Attendance */}
              <div className="mb-4">
                <label htmlFor="averageAttendance" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Sunday Attendance <span className="text-red-500">*</span>
                </label>
                <select
                  id="averageAttendance"
                  name="averageAttendance"
                  value={formData.averageAttendance}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                >
                  <option value="">-- Select attendance range --</option>
                  <option value="<50">Less than 50</option>
                  <option value="50-100">50 - 100</option>
                  <option value="100-250">100 - 250</option>
                  <option value="250-500">250 - 500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              {/* Website */}
              <div className="mb-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="www.example.com or https://www.example.com"
                />
                <p className="text-xs text-gray-500 mt-1">https:// will be added automatically if not provided</p>
              </div>
            </div>
          )}

          {/* ADDRESS SECTION (Church Only) */}
          {type === 'church' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Address</h3>
              
              {/* Street Address */}
              <div className="mb-4">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="street"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Toronto"
                />
              </div>

              {/* Province/State */}
              <div className="mb-4">
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  Province/State <span className="text-red-500">*</span>
                </label>
                <input
                  id="province"
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="Ontario"
                />
              </div>

              {/* Postal/Zip Code */}
              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal/Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="M5V 3A8"
                />
              </div>
            </div>
          )}

          {/* CONTACT INFORMATION SECTION */}
          <div className={type === 'church' ? 'border-b border-gray-200 pb-6' : ''}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {type === 'church' ? 'Primary Contact Information' : 'Personal Information'}
            </h3>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'church' ? 'Primary Contact Person' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* PREACHER SERVICE TYPES SECTION */}
          {type === 'preacher' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ministry Service Types</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select the types of services you are willing to preach at <span className="text-red-500">*</span>
              </p>
              <ServiceTypeSelector
                selectedServices={formData.serviceTypes}
                onSelectionChange={handleServiceTypeChange}
                showCustomField={true}
              />
              
              {/* Custom Service Type Input */}
              {formData.serviceTypes.includes('Other (Please specify)') && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <label htmlFor="customService" className="block text-sm font-medium text-gray-700 mb-2">
                    Please Specify Your Service Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customService"
                    type="text"
                    name="customService"
                    value={formData.customService}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="e.g., Prison Ministry, Hospital Chaplaincy"
                  />
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT SECURITY SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Security</h3>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.95 0-9.305 3.36-10.633 8 .235.987.407 2.006.542 3.03l2.01-2.01A4 4 0 0110 5.5c2.21 0 4.105 1.688 4.472 3.834l2.01-2.01C14.658 3.792 12.456 3 10 3zm3.068 5.932A4 4 0 0110 14.5H8.414l2.01 2.01c.94.195 1.91.305 2.916.305 4.95 0 9.305-3.36 10.633-8-.167-.557-.39-1.09-.656-1.595l-2.01 2.01a4 4 0 00-.068-.392z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.95 0-9.305 3.36-10.633 8 .235.987.407 2.006.542 3.03l2.01-2.01A4 4 0 0110 5.5c2.21 0 4.105 1.688 4.472 3.834l2.01-2.01C14.658 3.792 12.456 3 10 3zm3.068 5.932A4 4 0 0110 14.5H8.414l2.01 2.01c.94.195 1.91.305 2.916.305 4.95 0 9.305-3.36 10.633-8-.167-.557-.39-1.09-.656-1.595l-2.01 2.01a4 4 0 00-.068-.392z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors duration-200"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600 mb-2">Not a {type === 'church' ? 'Church' : 'Preacher'}?</p>
          <Link 
            href={`/auth/signup?type=${type === 'church' ? 'preacher' : 'church'}`}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Sign up as {type === 'church' ? 'Preacher' : 'Church'} instead
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
