'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import TestimonialCarousel from '@/components/TestimonialCarousel';

const AVAILABLE_PREACHERS = [
  {
    id: 1,
    name: 'Rev. James Mitchell',
    title: 'Senior Preacher',
    denomination: 'Baptist',
    experience: '15 years',
    specialties: ['Sermons', 'Revival Meetings', 'Youth Ministry'],
    bio: 'Passionate about delivering powerful sermons with biblical depth and contemporary relevance.',
    image: '👨‍💼',
    rating: 4.8,
    reviews: 23,
  },
  {
    id: 2,
    name: 'Rev. Sarah Johnson',
    title: 'Worship & Teaching Pastor',
    denomination: 'Pentecostal',
    experience: '12 years',
    specialties: ['Worship Meetings', 'Teaching', 'Women\'s Conferences'],
    bio: 'Known for engaging the congregation through dynamic worship experiences and inspirational teaching.',
    image: '👩‍💼',
    rating: 4.9,
    reviews: 31,
  },
  {
    id: 3,
    name: 'Rev. David Chen',
    title: 'Evangelist',
    denomination: 'Non-denominational',
    experience: '20 years',
    specialties: ['Evangelistic Crusades', 'Camp Meetings', 'Special Events'],
    bio: 'Experienced evangelist with a calling to reach new souls and strengthen existing faith communities.',
    image: '👨‍💼',
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 4,
    name: 'Rev. Margaret Williams',
    title: 'Teaching Pastor',
    denomination: 'Presbyterian',
    experience: '18 years',
    specialties: ['Biblical Teaching', 'Discipleship Programs', 'Conferences'],
    bio: 'Committed to deep biblical study and helping congregations grow spiritually through sound doctrine.',
    image: '👩‍💼',
    rating: 4.8,
    reviews: 28,
  },
  {
    id: 5,
    name: 'Rev. Thomas Anderson',
    title: 'Revivalist',
    denomination: 'Methodist',
    experience: '25 years',
    specialties: ['Revival Meetings', 'Special Services', 'Retreats'],
    bio: 'Dedicated to bringing spiritual renewal and revival to churches seeking renewed passion.',
    image: '👨‍💼',
    rating: 4.9,
    reviews: 52,
  },
  {
    id: 6,
    name: 'Rev. Patricia Lewis',
    title: 'Worship Leader & Speaker',
    denomination: 'Charismatic',
    experience: '14 years',
    specialties: ['Worship Leadership', 'Women\'s Ministry', 'Seminars'],
    bio: 'Bringing hearts closer to God through authentic worship and empowering ministry to women.',
    image: '👩‍💼',
    rating: 4.8,
    reviews: 35,
  },
];

export default function BrowsePreachersPage() {
  const router = useRouter();
  const [cart, setCart] = useState<typeof AVAILABLE_PREACHERS>([]);
  const [agreed, setAgreed] = useState(false);
  const [preachers, setPreachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreachers = async () => {
      try {
        const response = await fetch('/api/preachers');
        const data = await response.json();
        if (data.success) {
          setPreachers(data.data);
        }
      } catch (error) {
        console.error('Error fetching preachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreachers();
  }, []);

  const displayPreachers = preachers.length > 0 ? preachers : AVAILABLE_PREACHERS;

  const addToCart = (preacher: any) => {
    setCart([...cart, preacher]);
  };

  const handleCheckout = () => {
    if (agreed && cart.length > 0) {
      router.push('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            <Logo />
            <span className="text-lime-500"> Proclaim</span> Canada
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/church-home" className="hover:text-lime-500 transition">
              Church Home
            </Link>
            <Link href="/listings/pricing" className="hover:text-lime-500 transition">
              Post a Job
            </Link>
            <Link href="/browse/preachers" className="text-lime-500 font-semibold">
              Browse Preachers
            </Link>
            <Link href="/" className="hover:text-lime-500 transition">
              How It Works
            </Link>
            <Link href="/" className="hover:text-lime-500 transition">
              Help
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              🛒 Cart {cart.length > 0 && <span className="ml-2 text-lime-500">({cart.length})</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Testimonial Carousel - Featured Section */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">What Churches Are Saying</h2>
            <p className="text-slate-600">Hear from pastors and leaders who've found quality preachers through our platform</p>
          </div>
          <TestimonialCarousel />
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Available Preachers</h1>
          <p className="text-xl text-slate-600">
            Find and connect with experienced preachers and evangelists for your church events
          </p>
        </div>

        {/* Access Tier Selector */}
        <div className="mb-12 bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose Your Access Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {/* Free Tier */}
            <div className="border-2 border-slate-300 rounded-lg p-6 hover:border-slate-400 transition cursor-pointer flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Free Preview</h3>
                <p className="text-3xl font-bold text-slate-900 mb-4">$0<span className="text-sm text-slate-600">/month</span></p>
                <ul className="space-y-2 mb-6 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    View basic profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    See name, title, denomination
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    View specialties & ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">✗</span>
                    Contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">✗</span>
                    View resumes
                  </li>
                </ul>
              </div>
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition">
                Current Plan
              </button>
            </div>

            {/* Standard Tier */}
            <div className="border-2 border-lime-500 rounded-lg p-6 shadow-md relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-lime-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Access</h3>
                <p className="text-3xl font-bold text-lime-600 mb-4">$59<span className="text-sm text-slate-600">/month</span></p>
                <p className="text-xs text-slate-600 mb-4">
                  Included free with $99+ job posting plans
                </p>
                <ul className="space-y-2 mb-6 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    Full profile access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    Contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    Direct messaging
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lime-500">✓</span>
                    Ratings & reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">✗</span>
                    View resumes
                  </li>
                </ul>
              </div>
              <button onClick={() => router.push('/listings/pricing')} className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Upgrade Now
              </button>
            </div>

            {/* Premium Tier */}
            <div className="border-2 border-blue-600 rounded-lg p-6 shadow-md relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                MOST COMPLETE
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resume Database</h3>
                <p className="text-3xl font-bold text-blue-600 mb-4">$99<span className="text-sm text-slate-600">/month</span></p>
                <p className="text-xs text-slate-600 mb-4">
                  Get full access to complete profiles
                </p>
                <ul className="space-y-2 mb-6 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    Everything above, plus:
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    Full resumes & CVs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    Availability calendars
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    Audio/video samples
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    Priority messaging
                  </li>
                </ul>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                Unlock Now - $99/mo
              </button>
            </div>
          </div>
        </div>

        {/* Preachers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
            <p className="mt-4 text-slate-600">Loading preachers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayPreachers.map((preacher) => (
              <div
                key={preacher.id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition"
              >
                {/* Preacher Image/Avatar */}
                <div className="bg-gradient-to-br from-lime-50 to-emerald-50 h-40 flex items-center justify-center text-6xl">
                  {preacher.image || '👨‍💼'}
                </div>

                {/* Content */}
                <div className="p-6">
                  <Link href={`/browse/preachers/${preacher.id}`}>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1 hover:text-lime-600 transition cursor-pointer">
                      {preacher.name}
                    </h3>
                  </Link>
                  <p className="text-lime-600 font-semibold mb-2">
                    {preacher.preacherProfile?.yearsOfExperience || 0} years experience
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                    <span className="font-semibold">
                      {preacher.preacherProfile?.rating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-yellow-500">★</span>
                    <span>
                      ({preacher.preacherProfile?.totalRatings || 0} reviews)
                    </span>
                  </div>

                  <div className="space-y-3 mb-4 text-sm">
                    <div>
                      <span className="font-semibold text-slate-900">Denomination:</span>
                      <p className="text-slate-600">{preacher.preacherProfile?.denomination || 'N/A'}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {preacher.preacherProfile?.bio || preacher.bio}
                  </p>

                  {/* Resume Link */}
                  {preacher.preacherProfile?.resumeUrl && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <a
                        href={preacher.preacherProfile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-2"
                      >
                        📄 View Resume
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/browse/preachers/${preacher.id}`}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2 px-4 rounded-lg transition text-center"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => addToCart(preacher)}
                      className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Summary & Checkout */}
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Cart ({cart.length} preachers)</h2>

            {/* Cart Items Summary */}
            <div className="mb-6 max-h-48 overflow-y-auto">
              {cart.map((preacher, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{preacher.name}</p>
                    <p className="text-sm text-slate-600">{preacher.title}</p>
                  </div>
                  <button
                    onClick={() => setCart(cart.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Agreement Checkbox */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-lime-500 rounded mt-1 cursor-pointer"
                />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link href="#" className="text-lime-500 hover:underline font-semibold">
                    terms and conditions
                  </Link>{' '}
                  for contacting these preachers
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCheckout}
                disabled={!agreed}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition ${
                  agreed
                    ? 'bg-lime-500 hover:bg-lime-600 cursor-pointer'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Proceed to Cart
              </button>
              <Link
                href="/listings/pricing"
                className="px-6 py-3 rounded-lg font-bold text-slate-900 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Empty Cart State */}
        {cart.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600 mb-6">Select preachers above to add to your cart</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
