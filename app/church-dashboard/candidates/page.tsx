'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface PreacherProfile {
  id: string
  user: {
    id: string
    email: string
    name: string
  }
  bio: string
  denomination: string
  yearsOfExperience: number
  profilePhotoUrl?: string
  rating: number
  totalRatings: number
  serviceTypes: string[]
  languages: string[]
  travelRadiusKm?: number
  verified: boolean
}

interface SearchResults {
  preachers: PreacherProfile[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

const serviceTypeOptions = [
  'SERMON', 'SPECIAL_SERVICE', 'REVIVAL', 'WORKSHOP', 'OTHER'
]

const denominationOptions = [
  'Assemblies of God', 'Baptist', 'Pentecostal', 'Foursquare',
  'Church of God in Christ', 'Christian and Missionary Alliance',
  'Evangelical Free Church', 'Wesleyan', 'Evangelical Covenant',
  'Christian Brethren', 'Missionary Church', 'Other', 'Interdenominational'
]

const languageOptions = [
  'English', 'Spanish', 'French', 'Mandarin', 'Cantonese',
  'Korean', 'Vietnamese', 'Portuguese', 'Italian', 'German',
  'Polish', 'Russian', 'Arabic', 'Tagalog'
]

export default function CandidateSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    serviceTypes: (searchParams.get('serviceTypes')?.split(',') || []).filter(Boolean),
    denomination: searchParams.get('denomination') || 'all',
    minExperience: searchParams.get('minExperience') || '0',
    languages: (searchParams.get('languages')?.split(',') || []).filter(Boolean),
    page: parseInt(searchParams.get('page') || '1')
  })

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    performSearch()
  }, [])

  const performSearch = async (pageNum = 1) => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      params.append('page', pageNum.toString())
      
      if (filters.search) params.append('search', filters.search)
      if (filters.denomination !== 'all') params.append('denomination', filters.denomination)
      if (filters.minExperience !== '0') params.append('minExperience', filters.minExperience)
      
      filters.serviceTypes.forEach(st => params.append('serviceTypes[]', st))
      filters.languages.forEach(lang => params.append('languages[]', lang))

      const res = await fetch(`/api/candidates/search?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      } else {
        setError('Failed to search candidates')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(1)
  }

  const toggleServiceType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }))
  }

  const toggleLanguage = (lang: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      serviceTypes: [],
      denomination: 'all',
      minExperience: '0',
      languages: [],
      page: 1
    })
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Candidates</h1>
        <p className="text-gray-600">Search and discover qualified ministry professionals</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6 space-y-6">
            <div className="flex items-center justify-between md:flex-col md:items-start gap-3">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              {(filters.search || filters.serviceTypes.length > 0 || filters.denomination !== 'all' || filters.languages.length > 0 || filters.minExperience !== '0') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-lime-600 hover:text-lime-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Service Types */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Service Types</h3>
              <div className="space-y-2">
                {serviceTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.serviceTypes.includes(type)}
                      onChange={() => toggleServiceType(type)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Denomination */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Denomination</h3>
              <select
                value={filters.denomination}
                onChange={(e) => setFilters({ ...filters, denomination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
              >
                <option value="all">All Denominations</option>
                {denominationOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Minimum Experience</h3>
              <select
                value={filters.minExperience}
                onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
              >
                <option value="0">Any Experience</option>
                <option value="1">1+ Year</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            {/* Languages */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Languages</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {languageOptions.map(lang => (
                  <label key={lang} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
            >
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name, skills, or bio..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Results */}
          {results && (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Found <span className="font-semibold">{results.pagination.total}</span> candidate{results.pagination.total !== 1 ? 's' : ''}
              </div>

              {results.preachers.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-3">No candidates found matching your criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="text-lime-600 hover:text-lime-700 font-medium"
                  >
                    Clear filters and try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-8">
                    {results.preachers.map((preacher) => (
                      <div key={preacher.id} className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
                        <div className="p-6">
                          <div className="flex gap-4">
                            {/* Photo */}
                            {preacher.profilePhotoUrl ? (
                              <img
                                src={preacher.profilePhotoUrl}
                                alt={preacher.user.name}
                                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-2xl">
                                👤
                              </div>
                            )}

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">{preacher.user.name}</h3>
                                  {preacher.denomination && (
                                    <p className="text-sm text-gray-600">{preacher.denomination}</p>
                                  )}
                                </div>
                                {preacher.verified && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    ✓ Verified
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {preacher.bio}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {preacher.languages && preacher.languages.slice(0, 3).map((lang) => (
                                  <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {lang}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex gap-4 text-sm text-gray-600">
                                  <span>📊 {preacher.yearsOfExperience} years</span>
                                  {preacher.travelRadiusKm && (
                                    <span>🚗 {preacher.travelRadiusKm}km radius</span>
                                  )}
                                </div>
                                {preacher.rating > 0 && (
                                  <div className="text-sm font-medium">
                                    ⭐ {preacher.rating.toFixed(1)} ({preacher.totalRatings} reviews)
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                            <Link
                              href={`/browse/preachers/${preacher.user.id}`}
                              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center text-sm"
                            >
                              View Profile
                            </Link>
                            <button
                              className="flex-1 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg transition text-sm"
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {results.pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      {Array.from({ length: results.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setFilters({ ...filters, page })
                            performSearch(page)
                            window.scrollTo(0, 0)
                          }}
                          className={`px-3 py-1 rounded-lg font-medium transition ${
                            page === results.pagination.page
                              ? 'bg-lime-500 text-white'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {!results && !loading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600">Use the search and filters to find qualified candidates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
