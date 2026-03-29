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
    avgAttendance: '',
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            <Link href="/church-dashboard" className="text-blue-600 hover:underline">Your Church</Link>
            <span className="text-gray-400 mx-2">›</span>
            <span className="text-gray-700">Edit Church Profile</span>
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Church Profile</h1>
          <p className="text-gray-600">Tell us about your church. This information will be displayed on your church profile and job listings.</p>
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
            className={`px-4 py-3 font-medium border-b-2 transition text-sm ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Church Profile
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm ${
              activeTab === 'photos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm ${
              activeTab === 'locations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setActiveTab('hiring')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm ${
              activeTab === 'hiring'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Hiring Process
          </button>
        </div>

        {/* Church Profile Section */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Denomination & Church Size */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Denomination
                    </label>
                    <input
                      type="text"
                      name="denomination"
                      value={profile.denomination}
                      onChange={handleProfileChange}
                      placeholder="e.g., Pentecostal, Baptist"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Church Size
                    </label>
                    <select
                      name="avgAttendance"
                      value={profile.avgAttendance}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="under50">Under 50</option>
                      <option value="50-100">50-100</option>
                      <option value="100-250">100-250</option>
                      <option value="250-500">250-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      State / Province
                    </label>
                    <select
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Alaska">Alaska</option>
                      <option value="Alabama">Alabama</option>
                      <option value="Ontario">Ontario</option>
                      <option value="Quebec">Quebec</option>
                      {/* Add more states/provinces */}
                    </select>
                  </div>
                </div>

                {/* Church Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Church Description
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-white">
                    <div className="flex gap-2 mb-3 border-b border-gray-200 pb-2">
                      <button type="button" className="p-2 hover:bg-gray-100 rounded" title="Bold">
                        <span className="font-bold">B</span>
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-100 rounded" title="Italic">
                        <span className="italic">I</span>
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-100 rounded" title="Underline">
                        <span className="underline">U</span>
                      </button>
                      <div className="border-l border-gray-300 ml-2"></div>
                      <button type="button" className="p-2 hover:bg-gray-100 rounded" title="Bullet list">
                        ○ •
                      </button>
                      <button type="button" className="p-2 hover:bg-gray-100 rounded" title="Number list">
                        1. 2.
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={profile.description}
                      onChange={handleProfileChange}
                      rows={6}
                      placeholder="Tell preachers about your church mission, values, and what you're looking for..."
                      className="w-full border-0 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update church profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* View Profile Link */}
                <Link
                  href="/church-home"
                  className="block text-right text-blue-600 hover:text-blue-700 font-semibold text-sm mb-6"
                >
                  View Church Profile →
                </Link>

                {/* Enhance Profile Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-blue-600 text-lg">✦</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Enhance Your Church Profile</h3>
                      <p className="text-sm text-gray-600 mt-1">Complete your church profile to attract top ministry candidates.</p>
                    </div>
                  </div>
                </div>

                {/* Enhancement Options */}
                <div className="space-y-3">
                  {/* Add Logo & Photos */}
                  <Link href="#" className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📸</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Add Logo & Photos</h4>
                            <p className="text-xs text-gray-600 mt-1">Upload church logo and gallery photos</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </Link>

                  {/* Add Locations */}
                  <Link href="#" className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📍</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Add Locations</h4>
                            <p className="text-xs text-gray-600 mt-1">Manage multiple church locations</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </Link>

                  {/* Modify Candidate Pipeline */}
                  <Link href="#" className="block">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📋</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Modify Candidate Pipeline</h4>
                            <p className="text-xs text-gray-600 mt-1">Customize your hiring process stages</p>
                          </div>
                        </div>
                        <span className="text-green-500">✓</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Complete Setup Button */}
                <div className="bg-blue-600 text-white rounded-full p-4 text-center sticky bottom-6">
                  <p className="font-semibold">Complete Church Setup</p>
                  <p className="text-xs mt-1">25% complete</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Section */}
        {activeTab === 'photos' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Photos</h2>
            <p className="text-gray-600 mb-6">Upload your church logo and gallery photos to attract candidates.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-600">Coming soon - Photo upload feature</p>
            </div>
          </div>
        )}

        {/* Locations Section */}
        {activeTab === 'locations' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Church Locations</h2>
            <p className="text-gray-600 mb-6">Manage multiple church locations if applicable.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Add Location
            </button>
          </div>
        )}

        {/* Hiring Process Section */}
        {activeTab === 'hiring' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hiring Process</h2>
            <p className="text-gray-600 mb-6">Customize your candidate pipeline and hiring stages.</p>
            <p className="text-gray-600">Coming soon - Hiring pipeline customization</p>
          </div>
        )}
      </div>
    </div>
  )
}
