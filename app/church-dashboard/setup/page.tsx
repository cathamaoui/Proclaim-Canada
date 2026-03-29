'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

// Denomination options
const DENOMINATIONS = [
  'Any',
  'Anglican',
  'Assemblies of God',
  'Baptist',
  'Baptist: American',
  'Baptist: SBC',
  'Bible Church',
  'Brethren',
  'Calvary Chapel',
  'Catholic',
  'Christian Church',
  'Christian Missionary Alliance',
  'Church of Christ',
  'Church of God: Anderson',
  'Church of God: Cleveland',
  'Church of the Nazarene',
  'Churches of God: General Conference',
  'Congregational',
  'Disciples of Christ',
  'Episcopal',
  'Evangelical Covenant',
  'Evangelical Free',
  'Evangelical Friends',
  'Foursquare',
  'Free Methodist',
  'General Association of Regular Baptist',
  'Global Methodist',
  'Grace Brethren',
  'Lutheran',
  'Mennonite',
  'Missionary Church',
  'Non-Denominational',
  'Pentecostal',
  'Presbyterian',
  'Presbyterian: PCA',
  'Presbyterian: PCUSA',
  'Primitive Methodist',
  'Reformed',
  'Salvation Army',
  'United Brethren',
  'United Church of Christ',
  'United Methodist',
  'Vineyard',
  'Wesleyan',
]

// Country/State/City data
const STATES = {
  'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'],
  'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
}

const CITIES_US = {
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Garland'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale', 'Hialeah', 'Lakeland', 'Boca Raton'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Yonkers', 'Troy', 'Utica', 'Binghamton', 'Syracuse', 'Glens Falls'],
  'Georgia': ['Atlanta', 'Augusta', 'Savannah', 'Athens', 'Columbus', 'Macon', 'Dalton', 'Marietta', 'Sandy Springs', 'Roswell'],
  // Add more as needed
}

const CITIES_CANADA = {
  'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Brampton', 'Windsor', 'Kitchener', 'Thunder Bay', 'Sudbury'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Kelowna', 'Abbotsford', 'Coquitlam', 'Nanaimo', 'Prince George', 'Vernon'],
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie', 'Okotoks', 'Fort McMurray', 'Grande Prairie', 'Lacombe', 'Camrose'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Saint-Hyacinthe', 'Sherbrooke', 'Trois-Rivières', 'Terrebonne', 'Saint-Laurent'],
  // Add more as needed
}

export default function ChurchSetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  // Profile form state - expanded with new fields
  const [profile, setProfile] = useState({
    // Basic info
    churchName: '',
    denomination: '',
    avgAttendance: '',
    
    // Contact info
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    
    // Location
    country: 'Canada',
    state: '',
    city: '',
    address: '',
    website: '',
    
    // Full description
    description: '',
    
    // Church Identity & Culture
    mission: '',
    worshipStyle: '',
    theologicalPerspective: '',
    strengthsChallenges: '',
    ageDistribution: '',
    communityContext: '',
    facilities: '',
    searchProcess: '',
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
        <div className="flex gap-2 mb-12 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Church Profile
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'identity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Identity & Culture
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'staff'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Staff Profiles
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'messaging'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Inbox & Messages
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
              activeTab === 'locations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setActiveTab('hiring')}
            className={`px-4 py-3 font-medium border-b-2 transition text-sm whitespace-nowrap ${
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
                <h2 className="text-2xl font-bold text-gray-900">Church Information</h2>

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
                    placeholder="Full name of your church"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Person (who is signing up) *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={profile.contactPerson}
                      onChange={handleProfileChange}
                      required
                      placeholder="Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={profile.contactEmail}
                        onChange={handleProfileChange}
                        required
                        placeholder="email@church.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={profile.contactPhone}
                        onChange={handleProfileChange}
                        required
                        placeholder="(123) 456-7890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={profile.country}
                      onChange={handleProfileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Canada">Canada</option>
                      <option value="United States">United States</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Province / State *
                      </label>
                      <select
                        name="state"
                        value={profile.state}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select {profile.country === 'Canada' ? 'Province' : 'State'}</option>
                        {STATES[profile.country as keyof typeof STATES]?.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City *
                      </label>
                      <select
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select City</option>
                        {profile.state && (
                          <>
                            {profile.country === 'Canada' && CITIES_CANADA[profile.state as keyof typeof CITIES_CANADA]?.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                            {profile.country === 'United States' && CITIES_US[profile.state as keyof typeof CITIES_US]?.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
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
                </div>

                {/* Denomination & Size */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Church Details</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Denomination *
                      </label>
                      <select
                        name="denomination"
                        value={profile.denomination}
                        onChange={handleProfileChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Denomination</option>
                        {DENOMINATIONS.map(denom => (
                          <option key={denom} value={denom}>{denom}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Average Attendance
                      </label>
                      <select
                        name="avgAttendance"
                        value={profile.avgAttendance}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Size</option>
                        <option value="under50">Under 50</option>
                        <option value="50-100">50-100</option>
                        <option value="100-250">100-250</option>
                        <option value="250-500">250-500</option>
                        <option value="500-1000">500-1,000</option>
                        <option value="1000+">1,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profile.website}
                      onChange={handleProfileChange}
                      placeholder="https://yourchurch.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Church Description */}
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Church Description
                  </label>
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleProfileChange}
                    rows={4}
                    placeholder="Brief overview of your church and congregation..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Church Profile'}
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
                      <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                      <p className="text-sm text-gray-600 mt-1">Fill in all sections to attract more qualified candidates.</p>
                    </div>
                  </div>
                </div>

                {/* Enhancement Options */}
                <div className="space-y-3">
                  {/* Identity & Culture */}
                  <button onClick={() => setActiveTab('identity')} className="block w-full text-left">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📖</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Church Identity</h4>
                            <p className="text-xs text-gray-600 mt-1">Mission, vision, and culture</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </button>

                  {/* Staff Profiles */}
                  <button onClick={() => setActiveTab('staff')} className="block w-full text-left">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👥</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Staff Profiles</h4>
                            <p className="text-xs text-gray-600 mt-1">Team members and bios</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </button>

                  {/* Photos */}
                  <button onClick={() => setActiveTab('photos')} className="block w-full text-left">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📸</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Photos & Videos</h4>
                            <p className="text-xs text-gray-600 mt-1">Gallery and intro video</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </button>

                  {/* Messaging */}
                  <button onClick={() => setActiveTab('messaging')} className="block w-full text-left">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💬</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">Messages</h4>
                            <p className="text-xs text-gray-600 mt-1">Inbox and live chat</p>
                          </div>
                        </div>
                        <span className="text-gray-400">→</span>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Complete Setup Button */}
                <div className="bg-blue-600 text-white rounded-full p-4 text-center sticky bottom-6">
                  <p className="font-semibold">Complete Church Setup</p>
                  <p className="text-xs mt-1">45% complete</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Section */}
        {activeTab === 'identity' && (
          <div className="max-w-4xl">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Church Identity & Culture</h2>
              <p className="text-gray-600">Help candidates understand your church's heart, values, and vision for the future.</p>

              {/* Mission & Vision */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mission & Vision Statement
                </label>
                <textarea
                  name="mission"
                  value={profile.mission}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="What is your church's core purpose? Where do you believe God is leading your congregation in the next 5-10 years?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Worship Style & Ethos */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Worship Style & Ethos
                </label>
                <textarea
                  name="worshipStyle"
                  value={profile.worshipStyle}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Describe your typical service (traditional, contemporary, blended) and the general 'vibe' of your church—formal, relaxed, highly community-focused, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Theological Perspective */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Theological Perspective
                </label>
                <textarea
                  name="theologicalPerspective"
                  value={profile.theologicalPerspective}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Detail your denomination, stance on Scripture, and core doctrinal positions to ensure alignment with candidates."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Strengths & Challenges */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Strengths & Challenges
                </label>
                <textarea
                  name="strengthsChallenges"
                  value={profile.strengthsChallenges}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="What does your church do well? What are the specific growing pains or challenges the next leader will address?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Age Distribution */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Age Distribution (Optional)
                </label>
                <input
                  type="text"
                  name="ageDistribution"
                  value={profile.ageDistribution}
                  onChange={handleProfileChange}
                  placeholder="e.g., Mix of young families and retirees, predominantly young adults, multigenerational..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Community Context */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Community Context
                </label>
                <textarea
                  name="communityContext"
                  value={profile.communityContext}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Is it rural, suburban, or urban? Mention local schools, industries, and growth trends that might affect a candidate's family."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Facilities & Parsonage */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Facilities & Parsonage
                </label>
                <textarea
                  name="facilities"
                  value={profile.facilities}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Any recent or projected building programs? Is housing (parsonage) provided?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search Process & Timeline */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Search Process & Timeline
                </label>
                <textarea
                  name="searchProcess"
                  value={profile.searchProcess}
                  onChange={handleProfileChange}
                  rows={4}
                  placeholder="Outline the steps of your hiring process and provide an estimated timeline so candidates know when to expect updates."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Identity & Culture'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff Profiles */}
        {activeTab === 'staff' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff & Search Committee Profiles</h2>
            <p className="text-gray-600 mb-8">Add photos and brief bios of your staff and search committee members. Real photos help build trust and make the process more personal.</p>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-3">📸</p>
                <p className="text-gray-700 font-medium mb-2">Add Staff Member</p>
                <p className="text-gray-500 text-sm">Upload a photo and bio for each team member</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> Use "real" photos of your congregation and staff rather than stock images to showcase your church's authentic community.
              </p>
            </div>
          </div>
        )}

        {/* Messaging & Inbox */}
        {activeTab === 'messaging' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Inbox & Messages</h2>
            <p className="text-gray-600 mb-8">View all messages from preachers interested in your opportunities. When you're both online, start a live chat session.</p>
            
            <div className="space-y-4">
              {/* Online Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-green-900">You are online</p>
                  <p className="text-sm text-green-800">Preachers can see you're available for live chat</p>
                </div>
              </div>

              {/* Message List Placeholder */}
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-lg mb-2">📬</p>
                <p className="text-gray-700 font-medium">No new messages</p>
                <p className="text-gray-500 text-sm mt-1">Messages from interested preachers will appear here</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-2xl mb-3">💬</p>
                <h3 className="font-semibold text-gray-900 mb-2">Email Messages</h3>
                <p className="text-sm text-gray-600">All inquiries sent to your email account</p>
              </div>
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-2xl mb-3">⚡</p>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Real-time chat when both users are online</p>
              </div>
            </div>
          </div>
        )}

        {/* Photos */}
        {activeTab === 'photos' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos & Video</h2>
            <p className="text-gray-600 mb-6">Upload church photos and a welcome video from your leader or search chair.</p>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-3xl mb-3">📷</p>
                <p className="text-gray-700 font-medium mb-1">Upload Church Photos</p>
                <p className="text-gray-500 text-sm">Add multiple photos of your church, facilities, and congregation</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-3xl mb-3">🎥</p>
                <p className="text-gray-700 font-medium mb-1">Upload Welcome Video</p>
                <p className="text-gray-500 text-sm">A short video from a leader welcoming candidates</p>
              </div>
            </div>
          </div>
        )}

        {/* Locations */}
        {activeTab === 'locations' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Church Locations</h2>
            <p className="text-gray-600 mb-6">Manage multiple church locations if applicable.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Add Location
            </button>
          </div>
        )}

        {/* Hiring Process */}
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
