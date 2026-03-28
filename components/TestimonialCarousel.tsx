'use client'

import { useState, useEffect } from 'react'
import ChurchVerificationBadge from './ChurchVerificationBadge'

interface Testimonial {
  id: string
  quote: string
  author: string
  churchName: string
  denomination: string
  rating: number
  image?: string
  isVerifiedService?: boolean
  serviceDate?: Date | string | null
}

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'Dr. Richardson brought a depth of biblical exposition that blessed our congregation deeply. His preparation and pastoral sensitivity were evident in every sermon.',
    author: 'Pastor James Mitchell',
    churchName: 'Grace Reformed Church',
    denomination: 'PCA',
    rating: 5,
    image: '🧑‍💼',
  },
  {
    id: '2',
    quote:
      'We appreciated how the sermon connected theology to practical Christian living. Our people were encouraged and challenged in their faith.',
    author: 'Rev. Sarah Chen',
    churchName: 'Redemption Community Chapel',
    denomination: 'Evangelical Free',
    rating: 5,
    image: '👩‍💼',
  },
  {
    id: '3',
    quote:
      'A faithful expositor of Scripture who honors both the text and the congregation. We would gladly invite him back anytime.',
    author: 'Pastor William Turner',
    churchName: 'Faith Bible Church',
    denomination: 'SBC',
    rating: 5,
    image: '🧑‍💼',
  },
  {
    id: '4',
    quote:
      'His pulpit ministry exemplifies the kind of earnest, God-centered preaching that strengthens the church. Highly recommended.',
    author: 'Dr. Elizabeth Harper',
    churchName: 'St. Andrew Presbyterian',
    denomination: 'PCUSA',
    rating: 5,
    image: '👩‍💼',
  },
]

interface TestimonialCarouselProps {
  testimonials?: Testimonial[]
}

export default function TestimonialCarousel({
  testimonials = SAMPLE_TESTIMONIALS,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, testimonials.length])

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    setAutoPlay(false)
  }

  const testimonial = testimonials[current]

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="text-amber-300 text-2xl">★</span>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl md:text-2xl font-serif italic">
            "{testimonial.quote}"
          </blockquote>

          {/* Author */}
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-lg">
                {testimonial.image && <span className="mr-2">{testimonial.image}</span>}
                {testimonial.author}
              </p>
              <p className="text-primary-100 text-sm">
                {testimonial.churchName} • {testimonial.denomination}
              </p>
            </div>
            {/* Church Verification Badge */}
            {testimonial.isVerifiedService && (
              <ChurchVerificationBadge
                isVerified={testimonial.isVerifiedService}
                serviceDate={testimonial.serviceDate}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrent(i)
                    setAutoPlay(false)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? 'bg-white w-8' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all font-bold text-xl"
              >
                ←
              </button>
              <button
                onClick={goToNext}
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all font-bold text-xl"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Count */}
      <p className="text-center text-sm text-gray-600 mt-4">
        {current + 1} of {testimonials.length}
      </p>
    </div>
  )
}
