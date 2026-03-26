'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [error, setError] = useState('')
  const [draftSaved, setDraftSaved] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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
    serviceTypes: [] as string[],
    customService: '',
    certificates: '',
    elevatorPitch: null as File | null,
    elevatorPitchPreview: '' as string,
    resume: null as File | null,
    sermonVideo: null as File | null,
    sermonVideoPreview: '' as string,
    worshipVideo: null as File | null,
    worshipVideoPreview: '' as string,
    theologyStatement: '',
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
            setFormData(prev => ({
              ...prev,
              bio: p.bio || '',
              yearsOfExperience: p.yearsOfExperience || 0,
              hourlyRate: p.hourlyRate ? String(p.hourlyRate) : '',
              denomination: p.denomination || '',
              languages: p.languages || [],
              serviceTypes: p.serviceTypes || [],
              customService: p.customService || '',
              certificates: Array.isArray(p.certificates) ? p.certificates.join(', ') : p.certificates || '',
            }))
            if (p.profilePhotoUrl) {
              setPhotoPreview(p.profilePhotoUrl)
            }
          }
        }
      } catch {
        // New user without a profile yet
      }
    }
    loadProfile()
  }, [])

  const serviceTypeCategories: Record<string, string[]> = {
    'Standard Services': [
      'Sunday Morning Service',
      'Sunday Evening Service',
      'Midweek Service / Bible Study',
    ],
    'Specialized Outreach': [
      'Evangelistic Crusade / Rally',
      'Revival Meetings (Multi-day)',
      'Seeker-Sensitive / Guest Sunday',
    ],
    'Targeted Ministry': [
      'Youth Rally / Youth Retreat',
      'Young Adults Gathering',
      "Men's / Women's Conference",
      'Campus / University Outreach',
    ],
    'Training & Equipping': [
      'Evangelism Workshop / Seminar',
      'Leadership Development',
      'VBS / Family Night Keynote',
    ],
    'General': [
      'Community Event / Festival',
      'Holiday Special Service',
    ],
  }

  const languages = [
    'English', 'Spanish', 'French', 'Mandarin', 'Cantonese', 
    'Korean', 'Vietnamese', 'Portuguese', 'Italian', 'German', 
    'Polish', 'Russian', 'Arabic', 'Tagalog', 'Other'
  ]

  const denominations = [
    'Assemblies of God', 'Baptist', 'Pentecostal', 'Foursquare',
    'Church of God in Christ', 'Christian and Missionary Alliance',
    'Evangelical Free Church', 'Wesleyan', 'Evangelical Covenant',
    'Christian Brethren', 'Missionary Church', 'Other', 'Interdenominational'
  ]

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, bio: e.target.value }))
  }

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))
  }

  const handleDenominationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, denomination: e.target.value }))
  }

  const handleLanguageToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }))
  }

  const handleServiceTypeToggle = (serviceType: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(s => s !== serviceType)
        : [...prev.serviceTypes, serviceType]
    }))
  }

  const handleCustomServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, customService: e.target.value }))
  }

  const handleCertificatesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, certificates: e.target.value }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'elevator-pitch.webm', { type: 'audio/webm' })
        const audioURL = URL.createObjectURL(audioBlob)
        
        setFormData(prev => ({
          ...prev,
          elevatorPitch: audioFile,
          elevatorPitchPreview: audioURL
        }))

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
      setError('Unable to access microphone. Please check your browser permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document (.pdf, .doc, .docx)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume file must be less than 5MB')
        return
      }

      setFormData(prev => ({ ...prev, resume: file }))
      setError('')
    }
  }

  const clearElevatorPitch = () => {
    if (formData.elevatorPitchPreview) {
      URL.revokeObjectURL(formData.elevatorPitchPreview)
    }
    setFormData(prev => ({
      ...prev,
      elevatorPitch: null,
      elevatorPitchPreview: ''
    }))
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, videoType: 'sermon' | 'worship') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate video type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      setError('Please upload an MP4, WebM, or MOV video file')
      return
    }

    // Validate file size (max 500MB for videos)
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be less than 500MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const preview = ev.target?.result as string
      if (videoType === 'sermon') {
        setFormData(prev => ({
          ...prev,
          sermonVideo: file,
          sermonVideoPreview: preview
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          worshipVideo: file,
          worshipVideoPreview: preview
        }))
      }
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const clearVideo = (videoType: 'sermon' | 'worship') => {
    if (videoType === 'sermon') {
      setFormData(prev => ({
        ...prev,
        sermonVideo: null,
        sermonVideoPreview: ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        worshipVideo: null,
        worshipVideoPreview: ''
      }))
    }
  }

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
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setError('')
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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

    try {
      const formDataToSubmit = new FormData()
      
      formDataToSubmit.append('bio', formData.bio)
      formDataToSubmit.append('yearsOfExperience', formData.yearsOfExperience.toString())
      formDataToSubmit.append('hourlyRate', formData.hourlyRate)
      formDataToSubmit.append('denomination', formData.denomination)
      formDataToSubmit.append('languages', JSON.stringify(formData.languages))
      formDataToSubmit.append('serviceTypes', JSON.stringify(formData.serviceTypes))
      formDataToSubmit.append('customService', formData.customService)
      formDataToSubmit.append('certificates', formData.certificates)
      formDataToSubmit.append('theologyStatement', formData.theologyStatement)
      if (isDraft) formDataToSubmit.append('isDraft', 'true')

      if (photoFile) {
        formDataToSubmit.append('profilePhoto', photoFile)
      }
      if (formData.elevatorPitch) {
        formDataToSubmit.append('elevatorPitch', formData.elevatorPitch)
      }
      if (formData.resume) {
        formDataToSubmit.append('resume', formData.resume)
      }
      if (formData.sermonVideo) {
        formDataToSubmit.append('sermonVideo', formData.sermonVideo)
      }
      if (formData.worshipVideo) {
        formDataToSubmit.append('worshipVideo', formData.worshipVideo)
      }

      const response = await fetch('/api/preacher/profile', {
        method: 'PUT',
        body: formDataToSubmit,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      if (isDraft) {
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 3000)
        setSavingDraft(false)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Profile save error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
      setSavingDraft(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Complete Your Profile</h1>
      <p className="text-gray-600 mb-6">Help churches find you by sharing your background and calling</p>

      {draftSaved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
          ✅ Progress saved! You can come back anytime to finish.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="p-5 space-y-6">
          {/* Profile Photo */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📸 Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    <button type="button" onClick={removePhoto} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                  </>
                ) : (
                  <span className="text-3xl text-gray-400">👤</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-medium bg-lime-50 text-lime-700 border border-lime-300 rounded-lg hover:bg-lime-100 transition">
                  📁 Upload Photo
                </button>
                <button type="button" onClick={startCamera} className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100 transition">
                  📷 Take Photo
                </button>
              </div>
            </div>
            {showCamera && (
              <div className="mt-4 bg-black rounded-lg overflow-hidden relative" style={{ maxWidth: 360 }}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                  <button type="button" onClick={capturePhoto} className="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg text-sm">📸 Capture</button>
                  <button type="button" onClick={stopCamera} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Bio Section */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📖 Your Story & Calling</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bio & Testimonial *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={handleBioChange}
                  placeholder="Share your faith journey, calling, and what drives your ministry..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
                />
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
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
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
                  >
                    <option value="">Select a denomination</option>
                    {denominations.map((denom) => (
                      <option key={denom} value={denom}>
                        {denom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Languages & Credentials */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🌍 Languages & Credentials</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Languages You Speak
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                        formData.languages.includes(lang)
                          ? 'border-lime-500 bg-lime-50 text-lime-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Certificates & Credentials (Optional)
                </label>
                <textarea
                  value={formData.certificates}
                  onChange={handleCertificatesChange}
                  placeholder="e.g., Bible College Degree, Ordination, Training Certificates..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⛪ Services You Can Lead</h2>
            <p className="text-xs text-gray-500 mb-4">Select all the types of services you&apos;re available to preach or lead.</p>

            <div className="space-y-4">
              {Object.entries(serviceTypeCategories).map(([category, types]) => (
                <div key={category}>
                  <p className="text-sm font-semibold text-gray-600 mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {types.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleServiceTypeToggle(type)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                          formData.serviceTypes.includes(type)
                            ? 'border-lime-500 bg-lime-50 text-lime-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Custom service */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Other (specify)</label>
                <input
                  type="text"
                  value={formData.customService}
                  onChange={handleCustomServiceChange}
                  placeholder="e.g., Prison Ministry, Hospital Chaplaincy..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
                />
              </div>
            </div>

            {formData.serviceTypes.length > 0 && (
              <div className="mt-3 text-xs text-gray-500">
                {formData.serviceTypes.length} service{formData.serviceTypes.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          {/* Audio & Resume Section */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎤 Audio Pitch & Resume</h2>

            <div className="space-y-4">
              {/* Elevator Pitch */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Elevator Pitch (30-60 seconds) *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Record a brief introduction about yourself and your ministry calling.
                </p>

                {formData.elevatorPitchPreview ? (
                  <div className="space-y-4">
                    <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                      <p className="text-sm text-lime-700 font-medium mb-3">✓ Recording saved</p>
                      <audio
                        src={formData.elevatorPitchPreview}
                        controls
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={clearElevatorPitch}
                        className="mt-3 text-sm text-lime-600 hover:text-lime-700 font-medium"
                      >
                        Re-record
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isRecording ? (
                      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-red-700 font-semibold mb-4">Recording in progress...</p>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                        >
                          Stop Recording
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition"
                      >
                        <span className="text-2xl">🎤</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-700">Click to Record Elevator Pitch</p>
                          <p className="text-sm text-gray-500">30-60 seconds recommended</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume or CV (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload your resume in PDF or Word format (max 5MB).
                </p>

                <div>
                  <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition cursor-pointer">
                    <span className="text-2xl">📄</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-700">
                        {formData.resume ? `Resume: ${formData.resume.name}` : 'Click to Upload Resume'}
                      </p>
                      <p className="text-sm text-gray-500">PDF or Word (.pdf, .doc, .docx)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Video Samples Section */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎥 Video Samples (Optional)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload sample videos to let churches see your preaching and ministry style.
            </p>

            <div className="space-y-4">
              {/* Sermon Video */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sample Sermon Video
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a sample sermon (MP4, WebM, or MOV - max 500MB). 3-5 minutes recommended.
                </p>

                {formData.sermonVideoPreview ? (
                  <div className="space-y-2">
                    <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                      <p className="text-sm text-lime-700 font-medium mb-2">✓ Video uploaded</p>
                      <video
                        src={formData.sermonVideoPreview}
                        controls
                        className="w-full rounded-lg max-h-64"
                      />
                      <button
                        type="button"
                        onClick={() => clearVideo('sermon')}
                        className="mt-2 text-sm text-lime-600 hover:text-lime-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition cursor-pointer">
                    <span className="text-2xl">🎬</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-700">Click to Upload Sermon Video</p>
                      <p className="text-sm text-gray-500">MP4, WebM, or MOV (max 500MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      onChange={(e) => handleVideoUpload(e, 'sermon')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Worship Video */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Worship/Music Sample Video
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a sample of you leading worship or music ministry (MP4, WebM, or MOV - max 500MB).
                </p>

                {formData.worshipVideoPreview ? (
                  <div className="space-y-2">
                    <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                      <p className="text-sm text-lime-700 font-medium mb-2">✓ Video uploaded</p>
                      <video
                        src={formData.worshipVideoPreview}
                        controls
                        className="w-full rounded-lg max-h-64"
                      />
                      <button
                        type="button"
                        onClick={() => clearVideo('worship')}
                        className="mt-2 text-sm text-lime-600 hover:text-lime-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-lime-500 hover:bg-lime-50 transition cursor-pointer">
                    <span className="text-2xl">🎵</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-700">Click to Upload Worship Video</p>
                      <p className="text-sm text-gray-500">MP4, WebM, or MOV (max 500MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                      onChange={(e) => handleVideoUpload(e, 'worship')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Theology & Beliefs Section */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⛪ Theology & Beliefs (Optional)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Share your theological beliefs and ministry philosophy. This helps churches find a good fit.
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Statement of Faith / Ministry Philosophy
              </label>
              <textarea
                value={formData.theologyStatement}
                onChange={(e) => setFormData(prev => ({ ...prev, theologyStatement: e.target.value }))}
                placeholder="Share your core beliefs, theological perspectives, and how they shape your ministry approach..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">
                {formData.theologyStatement.length}/500 characters
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={savingDraft}
              onClick={(e) => handleSubmit(e, true)}
              className="flex-1 px-5 py-3 border-2 border-lime-300 text-lime-700 font-semibold rounded-lg hover:bg-lime-50 transition disabled:opacity-50"
            >
              {savingDraft ? 'Saving...' : '💾 Save Progress'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <p className="text-xs text-blue-700">
            💡 You can update any of this information later. The more details you provide, the easier it is for churches to find you!
          </p>
        </div>
      </form>
    </div>
  )
}
