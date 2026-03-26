'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Proclaim Canada</h3>
            <p className="text-sm">Connecting inspired leadership with congregations nationwide.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse/preachers" className="text-white hover:text-lime-400 transition">Browse</Link></li>
              <li><Link href="/listings/pricing" className="text-white hover:text-lime-400 transition">Pricing</Link></li>
              <li><Link href="/listings/new" className="text-white hover:text-lime-400 transition">Post Job</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white hover:text-lime-400 transition">About</a></li>
              <li><a href="#" className="text-white hover:text-lime-400 transition">Contact</a></li>
              <li><a href="#" className="text-white hover:text-lime-400 transition">Help</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white hover:text-lime-400 transition">Privacy</a></li>
              <li><a href="#" className="text-white hover:text-lime-400 transition">Terms</a></li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open('https://donate.example.com', '_blank')
                  }}
                  className="text-white hover:text-lime-400 transition"
                  title="Support our mission"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 Proclaim Canada. All rights reserved. | <a href="#" onClick={(e) => {
            e.preventDefault()
            window.open('https://donate.example.com', '_blank')
          }} className="text-lime-500 hover:text-lime-400 transition">Support Our Mission</a></p>
        </div>
      </div>
    </footer>
  )
}
