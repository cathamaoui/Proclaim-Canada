'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [cartItems] = useState<any[]>([]); // In a real app, this would come from context/state
  const [donationAmount, setDonationAmount] = useState<string>('');

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
            <Link href="/browse/preachers" className="hover:text-lime-500 transition">
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
              className="px-3 py-2 rounded-lg bg-lime-500 text-white font-semibold hover:bg-lime-600 transition"
            >
              🛒 Cart
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Cart</h1>
        <p className="text-lg text-slate-600 mb-12">Review and proceed with your preacher selections</p>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-slate-600 mb-8">
              Browse our available preachers and add them to your cart to get started.
            </p>
            <Link
              href="/browse/preachers"
              className="inline-block bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Browse Preachers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Items in Cart</h2>
                {/* Cart items will be rendered here */}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 h-fit">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-lime-500">$0.00</span>
                </div>
              </div>

              {/* Donation Box */}
              <div className="mb-6 p-4 bg-lime-50 rounded-lg border border-lime-200">
                <div className="flex items-center mb-3">
                  <input 
                    type="checkbox"
                    id="donate-checkbox"
                    className="w-4 h-4 text-lime-600"
                  />
                  <label htmlFor="donate-checkbox" className="ml-2 text-sm text-gray-700 font-medium">
                    I'd like to support Proclaim Canada's mission
                  </label>
                </div>
                <input
                  type="number"
                  placeholder="Enter donation amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
                  min="1"
                  step="0.01"
                />
                <p className="text-xs text-gray-600 mt-2">Every gift helps us keep this service free for all churches.</p>
              </div>

              <button className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-4 rounded-lg transition mb-3">
                Proceed to Checkout
              </button>
              <Link
                href="/browse/preachers"
                className="block text-center px-4 py-3 rounded-lg border-2 border-slate-200 text-slate-900 font-semibold hover:border-slate-300 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
