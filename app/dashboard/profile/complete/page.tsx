'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'Mandarin',
  'Cantonese',
  'Korean',
  'Vietnamese',
  'Portuguese',
  'Italian',
  'German',
  'Polish',
  'Russian',
  'Arabic',
  'Tagalog',
  'Other',
]

const DENOMINATIONS = [
  'Assemblies of God',
  'Baptist',
  'Pentecostal',
  'Foursquare',
  'Church of God in Christ',
  'Christian and Missionary Alliance',
  'Evangelical Free Church',
  'Wesleyan',
  'Evangelical Covenant',
  'Christian Brethren',
  'Missionary Church',
  'Other',
  'Interdenominational',
]

export default function CompleteProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    bio: '',
    yearsOfExperience: 0,
    hourlyRate: '',
    denomination: '',
    languages: [] as string[],
    certificates: '',
    photoUrl: '',
  })

  // Load existing profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/preacher/profile')
        if (res.ok) {
          const data = await res.json()
          if (data.profile) {
            const p = data.profile
            setFormData({
              bio: p.bio || '',
              yearsOfExperience: p.yearsOfExperience || 0,
              hourlyRate: p.hourlyRate ? String(p.hourlyRate) : '',
              denomination: p.denomination || '',
              languages: p.languages || [],
              certificates: Array.isArray(p.certificates) ? p.certificates.join(', ') : p.certificates || '',
              photoUrl: p.profilePhotoUrl || '',
            })
            if (p.profilePhotoUrl) {
              setPhotoPreview(p.profilePhotoUrl)
            }
          }
        }
      } catch {
        // Ignore — new user without a profile yet
      }
    }
    loadProfile()
  }, [])

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
    } catch {
      setError('Could not access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        setPhotoFile(file)
        setPhotoPreview(canvas.toDataURL('image/jpeg'))
      }
    }, 'image/jpeg', 0.9)

    stopCamera()
  }, [stopCamera])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
    setError('')
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setFormData(prev => ({ ...prev, photoUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      bio: e.target.value
    }))
  }

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      yearsOfExperience: parseInt(e.target.value) || 0
    }))
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      hourlyRate: e.target.value
    }))
  }

  const handleDenominationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      denomination: e.target.value
    }))
  }

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      certificates: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()

    if (!isDraft && !formData.bio.trim()) {
      setError('Please provide a bio or testimonial')
      return
    }

    if (isDraft) {
      setSavingDraft(true)
    } else {
      setLoading(true)
    }
    setError('')
    setSuccess(false)
    setDraftSaved(false)

    try {
      const body = new FormData()
      body.append('bio', formData.bio)
      body.append('yearsOfExperience', String(formData.yearsOfExperience))
      body.append('hourlyRate', formData.hourlyRate)
      body.append('denomination', formData.denomination)
      body.append('languages', JSON.stringify(formData.languages))
      body.append('certificates', formData.certificates)
      body.append('isDraft', String(isDraft))

      if (photoFile) {
        body.append('profilePhoto', photoFile)
      }

      const response = await fetch('/api/preacher/profile', {
        method: 'PUT',
        body,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      if (isDraft) {
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 3000)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }
    } catch (err) {
      console.error('Profile save error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setSavingDraft(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfect!</h1>
          <p className="text-gray-600 mb-6">
            Your profile has been saved successfully. Taking you to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">
            Help churches find you by sharing your background and calling
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          {/* Success Message */}
          {error && (
            <div className="p-6 sm:p-8 bg-red-50 border-b border-red-200">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* Section 1: Your Story & Calling */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📖 Your Story & Calling</h2>

              {/* Bio */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bio & Testimonial *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={handleBioChange}
                  placeholder="Share your faith journey, calling, and what drives your ministry..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length} characters (50+ recommended)
                </p>
              </div>

              {/* Experience, Rate & Denomination in one row */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleExperienceChange}
                    min="0"
                    max="70"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hourly Rate (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-semibold">$</span>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={handleRateChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Denomination
                  </label>
                  <select
                    value={formData.denomination}
                    onChange={handleDenominationChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">Select a denomination</option>
                    {DENOMINATIONS.map((denom) => (
                      <option key={denom} value={denom}>
                        {denom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Languages & Credentials */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Languages & Credentials</h2>

              {/* Languages */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Languages You Speak
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition border ${
                        formData.languages.includes(language)
                          ? 'border-lime-500 bg-lime-50 text-lime-700'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Certificates & Credentials (Optional)
                </label>
                <textarea
                  value={formData.certificates}
                  onChange={handleCertificatesChange}
                  placeholder="e.g., Bible College Degree, Ordination, Training Certificates, etc."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>
            </div>

            {/* Section 3: Photo */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">📸 Profile Photo</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center">
                {photoPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-lime-500"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : showCamera ? (
                  <div className="flex flex-col items-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-64 h-48 rounded-lg mb-4 bg-black"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-lg transition"
                      >
                        📸 Take Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl mb-4">📷</div>
                    <p className="text-gray-700 font-medium mb-4">
                      A professional photo helps churches connect with you
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2 bg-lime-500 hover:bg-lime-600 text-white font-bold rounded-lg transition"
                      >
                        Upload Photo
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-6 py-2 border-2 border-lime-500 text-lime-600 font-bold rounded-lg hover:bg-lime-50 transition"
                      >
                        Use Camera
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-3">JPEG, PNG, or WebP — max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Draft saved notification */}
            {draftSaved && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                ✅ Progress saved! You can come back and finish later.
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={savingDraft}
                className="flex-1 px-6 py-3 border-2 border-lime-500 text-lime-600 font-semibold rounded-lg hover:bg-lime-50 transition text-center disabled:opacity-50"
              >
                {savingDraft ? 'Saving...' : '💾 Save Progress'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Saving Profile...' : 'Complete Profile'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-t border-blue-200 p-6">
            <p className="text-sm text-blue-700">
              💡 You can update any of this information later in your dashboard. The more details you provide now, the easier it is for churches to find you!
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
