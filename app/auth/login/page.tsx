'use client'

import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isChurch = searchParams.get('type') === 'church'
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok) {
        setError(result?.error || 'Failed to sign in. Please check your credentials.')
        return
      }

      // Get updated session to check user role
      const newSession = await fetch('/api/auth/session').then(res => res.json())
      
      // Redirect based on user role
      if (newSession?.user?.role === 'CHURCH') {
        router.push('/church-dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isChurch ? 'bg-gradient-to-br from-gray-50 to-white' : 'bg-gradient-to-br from-primary-50 to-primary-100'}`}>
      {/* Navigation Bar */}
      {isChurch && (
        <nav className="bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/church-home" className="flex items-center gap-2 text-2xl font-bold">
                <Logo color="navy" />
                <span><span className="text-white">Proclaim </span><span className="text-slate-900">Canada</span></span>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/auth/signup?type=church" className="text-slate-100 hover:text-white transition font-medium">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <div className={`flex items-center justify-center px-4 ${isChurch ? 'py-12' : ''}`} style={{minHeight: isChurch ? 'calc(100vh - 80px)' : '100vh'}}>
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600 mb-8">Welcome back to Proclaim Canada</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-gray-100"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-gray-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.95 0-9.305 3.36-10.633 8 .235.987.407 2.006.542 3.03l2.01-2.01A4 4 0 0110 5.5c2.21 0 4.105 1.688 4.472 3.834l2.01-2.01C14.658 3.792 12.456 3 10 3zm3.068 5.932A4 4 0 0010 14.5H8.414l2.01 2.01c.94.195 1.91.305 2.916.305 4.95 0 9.305-3.36 10.633-8-.167-.557-.39-1.09-.656-1.595l-2.01 2.01a4 4 0 00-.068-.392z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
