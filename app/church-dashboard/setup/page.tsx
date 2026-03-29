'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function ChurchSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  // Profile form state
  const [profile, setProfile] = useState({
    churchName: '',
    denomination: '',
    website: '',
    phone: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
  })

  // Email form state
  const [emailForm, setEmailForm] = useState({
    email: '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Redirect non-church users
  if (session && session.user.role !== 'CHURCH') {
    router.push('/browse')
    return null
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
          setEmailForm({ email: session?.user?.email || '' })
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchProfile()
      setEmailForm({ email: session.user.email || '' })
    }
  }, [session])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccessMsg('Church profile updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/profile/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm.email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update email')
      }

      setSuccessMsg('Email updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccessMsg('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update password')
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setSuccessMsg('Password updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/church-home" className="flex items-center gap-2 text-xl font-bold">
              <Logo />
              <span>
                <span className="text-gray-900">Proclaim</span>
                <span className="text-lime-600">Canada</span>
              </span>
            </Link>
            <Link
              href="/church-dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your church profile, account information, and preferences</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            {successMsg}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-12 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-lime-600 text-lime-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Church Profile
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'email'
                ? 'border-lime-600 text-lime-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Email Address
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'password'
                ? 'border-lime-600 text-lime-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Password
          </button>
        </div>

        {/* Church Profile Section */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Church Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Church Name *
                </label>
                <input
                  type="text"
                  name="churchName"
                  value={profile.churchName}
                  onChange={handleProfileChange}
                  required
                  placeholder="Full name of your church or ministry"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              {/* Denomination */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Denomination / Type
                </label>
                <input
                  type="text"
                  name="denomination"
                  value={profile.denomination}
                  onChange={handleProfileChange}
                  placeholder="e.g., Pentecostal, Baptist, Independent"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              {/* Location Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleProfileChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* State/Province & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleProfileChange}
                    placeholder="e.g., Ontario, Texas"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={profile.country}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">Select country</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleProfileChange}
                    placeholder="https://yourchurch.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  About Your Church
                </label>
                <textarea
                  name="description"
                  value={profile.description}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Tell preachers about your church mission, values, and what you're looking for..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Church Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Email Section */}
        {activeTab === 'email' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Address</h2>
            <p className="text-gray-600 mb-6">Update the email you use to sign in and receive account notifications</p>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Email'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Section */}
        {activeTab === 'password' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password</h2>
            <p className="text-gray-600 mb-6">Choose a strong password to keep your account secure</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value
                  })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-lime-600 hover:bg-lime-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h2>
              <p className="text-gray-600">Contact our support team if you have any questions or need assistance</p>
            </div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
