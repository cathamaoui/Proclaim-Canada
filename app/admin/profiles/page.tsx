'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PreacherUser {
  id: string
  name: string | null
  email: string | null
  createdAt: string
  preacherProfile: {
    denomination: string | null
    specialization: string | null
    yearsOfExperience: number
    hourlyRate: string | null
    bio: string | null
    verified: boolean
    rating: string
    totalRatings: number
    serviceTypes: string[]
    customService: string | null
    profilePhotoUrl: string | null
    availability: string[]
    travelRadiusKm: number | null
    churchAffiliation: string | null
    ordinationStatus: string | null
    languages: string[]
    certificates: string[]
  } | null
}

interface ChurchUser {
  id: string
  name: string | null
  email: string | null
  createdAt: string
  churchProfile: {
    churchName: string | null
    organizationName: string | null
    denomination: string | null
    city: string | null
    province: string | null
    phone: string | null
    website: string | null
    averageAttendance: string | null
    bio: string | null
    verified: boolean
    rating: string
    totalRatings: number
  } | null
}

export default function AdminProfilesPage() {
  const [preachers, setPreachers] = useState<PreacherUser[]>([])
  const [churches, setChurches] = useState<ChurchUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'preachers' | 'churches'>('preachers')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  function loadProfiles() {
    setLoading(true)
    fetch('/api/admin/profiles')
      .then((res) => res.json())
      .then((data) => {
        setPreachers(data.preachers || [])
        setChurches(data.churches || [])
      })
      .catch(() => setError('Failed to load profiles'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProfiles() }, [])

  async function handleSeed() {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setSeedMsg(data.message || data.error || `Error (${res.status})`)
        return
      }
      setSeedMsg(data.message || 'Seeded successfully!')
      loadProfiles()
    } catch (err: any) {
      setSeedMsg(`Failed: ${err?.message || 'Network error'}`)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-white">Proclaim </span>
            <span className="text-lime-500">Canada</span>
            <span className="text-yellow-400 text-sm ml-2">Admin View</span>
          </Link>
          <Link href="/" className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-4 py-2 rounded font-semibold transition">
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">All Profiles</h1>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-2 rounded font-semibold transition text-sm disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Test Data (10 Preachers + 5 Churches)'}
          </button>
        </div>
        {seedMsg && (
          <p className={`border rounded px-3 py-2 mb-4 text-sm ${seedMsg.startsWith('Error') || seedMsg.startsWith('Failed') ? 'text-red-700 bg-red-50 border-red-200' : 'text-green-700 bg-green-50 border-green-200'}`}>
            {seedMsg}
          </p>
        )}
        <p className="text-gray-500 mb-6">
          Showing {preachers.length} evangelist(s) and {churches.length} church(es) in the database. Click any profile to expand details.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab('preachers'); setExpandedId(null) }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'preachers'
                ? 'bg-lime-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Evangelists ({preachers.length})
          </button>
          <button
            onClick={() => { setTab('churches'); setExpandedId(null) }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              tab === 'churches'
                ? 'bg-lime-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Churches ({churches.length})
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading profiles...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Preachers Tab */}
        {!loading && tab === 'preachers' && (
          <div className="space-y-3">
            {preachers.length === 0 && (
              <p className="text-gray-500">No evangelist profiles found. Click "Seed Test Data" above to create sample profiles.</p>
            )}
            {preachers.map((p) => {
              const isOpen = expandedId === p.id
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-lg shadow border cursor-pointer transition-all ${isOpen ? 'border-lime-400 ring-2 ring-lime-200' : 'border-gray-200 hover:border-lime-300'}`}
                >
                  {/* Summary row — always visible */}
                  <div
                    className="flex items-center gap-4 p-4"
                    onClick={() => setExpandedId(isOpen ? null : p.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                      {p.preacherProfile?.profilePhotoUrl ? (
                        <img src={p.preacherProfile.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        '🙏'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{p.name || 'Unnamed'}</h3>
                        {p.preacherProfile?.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Verified</span>
                        )}
                        {p.preacherProfile?.denomination && (
                          <span className="text-xs text-gray-500">• {p.preacherProfile.denomination}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{p.email}</p>
                    </div>
                    <div className="text-gray-400 shrink-0 text-lg">{isOpen ? '▲' : '▼'}</div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && p.preacherProfile && (
                    <div className="border-t border-gray-100 px-4 pb-5 pt-3">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                        <div><span className="font-semibold text-gray-700">Email:</span> {p.email}</div>
                        {p.preacherProfile.denomination && (
                          <div><span className="font-semibold text-gray-700">Denomination:</span> {p.preacherProfile.denomination}</div>
                        )}
                        {p.preacherProfile.yearsOfExperience > 0 && (
                          <div><span className="font-semibold text-gray-700">Experience:</span> {p.preacherProfile.yearsOfExperience} years</div>
                        )}
                        {p.preacherProfile.hourlyRate && (
                          <div><span className="font-semibold text-gray-700">Rate:</span> ${p.preacherProfile.hourlyRate}/hr</div>
                        )}
                        {p.preacherProfile.churchAffiliation && (
                          <div><span className="font-semibold text-gray-700">Affiliation:</span> {p.preacherProfile.churchAffiliation}</div>
                        )}
                        {p.preacherProfile.travelRadiusKm && (
                          <div><span className="font-semibold text-gray-700">Travel Radius:</span> {p.preacherProfile.travelRadiusKm} km</div>
                        )}
                        {p.preacherProfile.ordinationStatus && (
                          <div><span className="font-semibold text-gray-700">Ordination:</span> <span className="capitalize">{p.preacherProfile.ordinationStatus}</span></div>
                        )}
                        {Number(p.preacherProfile.rating) > 0 && (
                          <div><span className="font-semibold text-gray-700">Rating:</span> {p.preacherProfile.rating} ({p.preacherProfile.totalRatings} reviews)</div>
                        )}
                        <div><span className="font-semibold text-gray-700">Joined:</span> {new Date(p.createdAt).toLocaleDateString()}</div>
                      </div>

                      {p.preacherProfile.languages?.length > 0 && (
                        <div className="mt-3">
                          <span className="font-semibold text-gray-700 text-sm">Languages:</span>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {p.preacherProfile.languages.map((l) => (
                              <span key={l} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{l}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.preacherProfile.serviceTypes?.length > 0 && (
                        <div className="mt-3">
                          <span className="font-semibold text-gray-700 text-sm">Service Types:</span>
                          <div className="flex gap-1.5 flex-wrap mt-1">
                            {p.preacherProfile.serviceTypes.map((s) => (
                              <span key={s} className="bg-lime-50 text-lime-800 text-xs px-2 py-1 rounded border border-lime-200">{s}</span>
                            ))}
                            {p.preacherProfile.customService && (
                              <span className="bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200">{p.preacherProfile.customService}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {p.preacherProfile.certificates?.length > 0 && (
                        <div className="mt-3">
                          <span className="font-semibold text-gray-700 text-sm">Credentials:</span>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                            {p.preacherProfile.certificates.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {p.preacherProfile.bio && (
                        <div className="mt-3">
                          <span className="font-semibold text-gray-700 text-sm">Bio:</span>
                          <p className="text-sm text-gray-600 mt-1">{p.preacherProfile.bio}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {isOpen && !p.preacherProfile && (
                    <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                      <p className="text-sm text-gray-400 italic">No profile details created yet.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Churches Tab */}
        {!loading && tab === 'churches' && (
          <div className="space-y-3">
            {churches.length === 0 && (
              <p className="text-gray-500">No church profiles found. Click "Seed Test Data" above to create sample profiles.</p>
            )}
            {churches.map((c) => {
              const isOpen = expandedId === c.id
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-lg shadow border cursor-pointer transition-all ${isOpen ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  {/* Summary row */}
                  <div
                    className="flex items-center gap-4 p-4"
                    onClick={() => setExpandedId(isOpen ? null : c.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">
                      ⛪
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">
                          {c.churchProfile?.churchName || c.churchProfile?.organizationName || c.name || 'Unnamed'}
                        </h3>
                        {c.churchProfile?.verified && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Verified</span>
                        )}
                        {c.churchProfile?.city && (
                          <span className="text-xs text-gray-500">• {c.churchProfile.city}{c.churchProfile.province ? `, ${c.churchProfile.province}` : ''}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{c.email}</p>
                    </div>
                    <div className="text-gray-400 shrink-0 text-lg">{isOpen ? '▲' : '▼'}</div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && c.churchProfile && (
                    <div className="border-t border-gray-100 px-4 pb-5 pt-3">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                        <div><span className="font-semibold text-gray-700">Contact:</span> {c.name}</div>
                        <div><span className="font-semibold text-gray-700">Email:</span> {c.email}</div>
                        {c.churchProfile.denomination && (
                          <div><span className="font-semibold text-gray-700">Denomination:</span> {c.churchProfile.denomination}</div>
                        )}
                        {c.churchProfile.city && (
                          <div><span className="font-semibold text-gray-700">Location:</span> {c.churchProfile.city}{c.churchProfile.province ? `, ${c.churchProfile.province}` : ''}</div>
                        )}
                        {c.churchProfile.phone && (
                          <div><span className="font-semibold text-gray-700">Phone:</span> {c.churchProfile.phone}</div>
                        )}
                        {c.churchProfile.averageAttendance && (
                          <div><span className="font-semibold text-gray-700">Attendance:</span> {c.churchProfile.averageAttendance}</div>
                        )}
                        {c.churchProfile.website && (
                          <div><span className="font-semibold text-gray-700">Website:</span> {c.churchProfile.website}</div>
                        )}
                        {Number(c.churchProfile.rating) > 0 && (
                          <div><span className="font-semibold text-gray-700">Rating:</span> {c.churchProfile.rating} ({c.churchProfile.totalRatings} reviews)</div>
                        )}
                        <div><span className="font-semibold text-gray-700">Joined:</span> {new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>

                      {c.churchProfile.bio && (
                        <div className="mt-3">
                          <span className="font-semibold text-gray-700 text-sm">About:</span>
                          <p className="text-sm text-gray-600 mt-1">{c.churchProfile.bio}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {isOpen && !c.churchProfile && (
                    <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                      <p className="text-sm text-gray-400 italic">No profile details created yet.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
