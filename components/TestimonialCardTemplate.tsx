'use client'

import { useState } from 'react'

interface TestimonialCardTemplateProps {
  preacherName?: string
  isDark?: boolean
  isPreloaded?: boolean
  onExport?: () => void
}

export default function TestimonialCardTemplate({
  preacherName = 'Preacher Name',
  isDark = false,
  isPreloaded = true,
  onExport,
}: TestimonialCardTemplateProps) {
  const [formData, setFormData] = useState({
    reviewerName: isPreloaded ? 'Church Leader Name' : '',
    churchName: isPreloaded ? 'Church Name' : '',
    denomination: isPreloaded ? 'Denomination' : '',
    rating: isPreloaded ? 5 : 0,
    comment: isPreloaded
      ? 'We were blessed by the faithful preaching and pastoral heart this preacher brought to our pulpit. Highly recommended!'
      : '',
  })

  const [selectedStyle, setSelectedStyle] = useState<'light' | 'dark' | 'blue'>('light')

  const getCardStyles = () => {
    switch (selectedStyle) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-white',
          accent: 'text-amber-400',
          border: 'border-gray-700',
        }
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-gray-900',
          accent: 'text-blue-600',
          border: 'border-blue-200',
        }
      default:
        return {
          bg: 'bg-white',
          text: 'text-gray-900',
          accent: 'text-amber-500',
          border: 'border-gray-200',
        }
    }
  }

  const styles = getCardStyles()

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Style
          </label>
          <div className="flex gap-2">
            {(['light', 'dark', 'blue'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                  selectedStyle === style
                    ? 'ring-2 ring-primary-600 bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name
            </label>
            <input
              type="text"
              value={formData.reviewerName}
              onChange={(e) =>
                setFormData({ ...formData, reviewerName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600"
              placeholder="Church leader name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church Name
            </label>
            <input
              type="text"
              value={formData.churchName}
              onChange={(e) =>
                setFormData({ ...formData, churchName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600"
              placeholder="Church name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Denomination
          </label>
          <input
            type="text"
            value={formData.denomination}
            onChange={(e) =>
              setFormData({ ...formData, denomination: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600"
            placeholder="e.g., PCA, Evangelical Free, SBC"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110 text-2xl"
              >
                <span className={star <= formData.rating ? 'text-amber-400' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Testimonial (500 char max)
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) =>
              setFormData({
                ...formData,
                comment: e.target.value.slice(0, 500),
              })
            }
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600"
            placeholder="Write your testimonial here..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/500 characters
          </p>
        </div>

        <button
          onClick={onExport}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm"
        >
          Download Card as Image
        </button>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center p-8">
        <div
          className={`${styles.bg} ${styles.text} rounded-2xl border ${styles.border} p-8 max-w-sm shadow-xl relative overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 opacity-10 text-4xl">✦</div>

          <div className="relative z-10 space-y-4">
            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < formData.rating
                      ? `${styles.accent} text-2xl`
                      : 'text-gray-400 text-2xl'
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* Testimonial */}
            <p className={`text-lg italic font-serif`}>
              "{formData.comment || 'Your testimonial will appear here...'}"
            </p>

            {/* Attribution */}
            <div className="space-y-1 text-sm">
              <p className="font-semibold">
                – {formData.reviewerName || 'Church Leader Name'}
              </p>
              <p className={`text-xs opacity-75`}>
                {formData.churchName || 'Church Name'} • {formData.denomination || 'Denomination'}
              </p>
            </div>

            {/* Preacher name footer */}
            <div className={`text-xs opacity-50 pt-4 border-t ${styles.border}`}>
              Preacher: {preacherName}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
