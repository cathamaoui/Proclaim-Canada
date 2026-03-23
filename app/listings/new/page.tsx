'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// Service Type Categories - searchable options
const SERVICE_TYPE_OPTIONS = {
  'Regular/Weekly Services': [
    { label: 'Midweek Service / Bible Study', value: 'SERMON' },
    { label: 'Sunday Evening Service', value: 'SERMON' },
    { label: 'Sunday Morning Service', value: 'SERMON' },
  ],
  'Special Events': [
    { label: 'Special Service (Holiday, Anniversary, etc.)', value: 'SPECIAL_SERVICE' },
    { label: 'Community Event / Festival', value: 'SPECIAL_SERVICE' },
    { label: 'Holiday Special Service', value: 'SPECIAL_SERVICE' },
  ],
  'Evangelism & Revival': [
    { label: 'Evangelistic Crusade / Rally', value: 'REVIVAL' },
    { label: 'Revival Meetings (Multi-day)', value: 'REVIVAL' },
    { label: 'Seeker-Sensitive / Guest Sunday', value: 'REVIVAL' },
  ],
  'Training & Workshops': [
    { label: 'Evangelism Workshop / Seminar', value: 'WORKSHOP' },
    { label: 'Leadership Development', value: 'WORKSHOP' },
    { label: 'VBS / Family Night Keynote', value: 'WORKSHOP' },
  ],
  'Targeted Ministry': [
    { label: 'Campus / University Outreach', value: 'OTHER' },
    { label: 'Men\'s / Women\'s Conference', value: 'OTHER' },
    { label: 'Young Adults Gathering', value: 'OTHER' },
    { label: 'Youth Rally / Youth Retreat', value: 'OTHER' },
  ],
  'Other': [
    { label: 'Other (Please specify)', value: 'OTHER' },
  ],
}

export default function NewListingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [choicesInstance, setChoicesInstance] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SERMON',
    date: '',
    time: '',
    address: '',
    city: '',
    province: '',
    country: 'Canada',
    customCountry: '',
    postalCode: '',
    compensation: '',
  })

  // Initialize Choices.js for searchable dropdown
  useEffect(() => {
    // Load Choices.js library dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js'
    script.async = true
    script.onload = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css'
      document.head.appendChild(link)

      // Initialize Choices.js on the service type select
      const typeSelect = document.getElementById('type') as HTMLSelectElement
      if (typeSelect) {
        const choices = new (window as any).Choices(typeSelect, {
          searchEnabled: true,
          searchChoices: true,
          shouldSort: false,
          placeholderValue: 'Search service types...',
          noResultsText: 'No service types found',
          noChoicesText: 'No choices available',
        })
        setChoicesInstance(choices)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy()
      }
    }
  }, [])

  if (session?.user.role !== 'CHURCH') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Only churches can post opportunities</p>
            <button
              onClick={() => router.push('/browse')}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Build location string from address components
      const country = formData.country === 'Other' ? formData.customCountry : formData.country
      const locationParts = [
        formData.address,
        formData.city,
        formData.province,
        country,
        formData.postalCode,
      ].filter(Boolean)
      const location = locationParts.join(', ')

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          date: formData.date ? `${formData.date}${formData.time ? 'T' + formData.time : ''}` : '',
          location: location,
          compensation: formData.compensation,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create listing')
      }

      const listing = await response.json()
      router.push(`/listings/${listing.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post an Opportunity</h1>
          <p className="text-gray-600 mb-8">Tell preachers about your upcoming service</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Position / Service Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Sunday Morning Pastor, Guest Speaker, Youth Revival Crusade"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <p className="text-sm text-gray-600 mt-1">Be specific about the type of service needed</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description / Details *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the service, expectations, denomination, themes, audience, and any other details preachers should know..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">-- Select a service type --</option>
                {Object.entries(SERVICE_TYPE_OPTIONS).map(([category, options]) => (
                  <optgroup key={category} label={category}>
                    {options.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">Type to search for service types</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Toronto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  Province/State *
                </label>
                <input
                  id="province"
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  placeholder="Ontario"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code/Zip Code *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder={formData.country === 'Canada' ? 'M5V 3A8' : formData.country === 'United States' ? '90210' : 'Postal Code'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            </div>

            {formData.country === 'Other' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label htmlFor="customCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Please Specify Country/Region *
                </label>
                <input
                  id="customCountry"
                  type="text"
                  name="customCountry"
                  value={formData.customCountry}
                  onChange={handleChange}
                  required
                  placeholder="Enter country or region"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            )}

            <div>
              <label htmlFor="compensation" className="block text-sm font-medium text-gray-700 mb-2">
                Compensation / Honorarium
              </label>
              <input
                id="compensation"
                type="text"
                name="compensation"
                value={formData.compensation}
                onChange={handleChange}
                placeholder="e.g., $500 honorarium, Travel covered, TBD"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <p className="text-sm text-gray-600 mt-1">Leave blank if not applicable</p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Creating...' : 'Post Opportunity'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
