'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Logo from '@/components/Logo'
import PreacherTicker from '@/components/PreacherTicker'
import Footer from '@/components/Footer'

const REGIONS = {
  'Canada': {
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Airdrie', 'Okotoks', 'Fort McMurray', 'Grande Prairie', 'Lacombe', 'Camrose', 'Banff', 'Canmore', 'Brooks', 'Medicine Hat', 'Drumheller', 'Strathmore'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Kelowna', 'Abbotsford', 'Coquitlam', 'Nanaimo', 'Prince George', 'Vernon', 'Kamloops', 'Chilliwack', 'Penticton', 'New Westminster', 'Langley', 'Duncan'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Missoula', 'Winkler', 'Steinbach', 'Selkirk', 'Dauphin', 'Thompson', 'Flin Flon', 'Portage la Prairie', 'Swan River', 'Virden'],
    'New Brunswick': ['Saint John', 'Fredericton', 'Moncton', 'Saint-Léonard', 'Bathurst', 'Campbellton', 'Edmundston', 'Miramichi', 'Sussex', 'Sackville', 'Newcastle', 'Caraquet'],
    'Newfoundland and Labrador': ['St. Johns', 'Corner Brook', 'Gander', 'Grand Falls-Windsor', 'Labrador City', 'Happy Valley-Goose Bay', 'Stephenville', 'Bay Roberts', 'Conception Bay', 'Twillingate', 'Carbonear', 'Placentia'],
    'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Dettah', 'Tuktoyaktuk', 'Norman Wells'],
    'Nova Scotia': ['Halifax', 'Cape Breton', 'Glace Bay', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Amherst', 'Wolfville', 'Yarmouth', 'Lunenburg', 'Antigonish'],
    'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Cambridge Bay', 'Yellowknife'],
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Brampton', 'Windsor', 'Kitchener', 'Thunder Bay', 'Sudbury', 'Barrie', 'Guelph', 'Kingston', 'Oshawa', 'Belleville', 'Peterborough', 'Sarnia', 'St. Catharines', 'Niagara Falls', 'Stratford', 'Owen Sound', 'Sault Ste. Marie', 'Timmins', 'North Bay', 'Pembroke', 'Kenora'],
    'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague', 'Souris', 'Alberton', 'Georgetown'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Saint-Hyacinthe', 'Sherbrooke', 'Trois-Rivières', 'Terrebonne', 'Saint-Laurent', 'Repentigny', 'Saguenay', 'Rimouski', 'Baie-Comeau', 'Val-d\'Or', 'Rouyn-Noranda', 'Magog', 'Sainte-Thérèse', 'Blainville'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Yorkton', 'Swift Current', 'North Battleford', 'Estevan', 'Meadow Lake', 'Athabasca', 'La Ronge'],
    'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake', 'Whitehorse', 'Haines Junction'],
  },
  'United States': {
    'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Auburn', 'Dothan', 'Bessemer', 'Florence', 'Gadsden', 'Anniston', 'Decatur', 'Cullman', 'Opelika', 'Enterprise'],
    'Alaska': ['Anchorage', 'Juneau', 'Fairbanks', 'Sitka', 'Ketchikan', 'Palmer', 'Wasilla', 'Kenai', 'Soldotna', 'Barrow'],
    'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise'],
    'Arkansas': ['Little Rock', 'Fayetteville', 'Fort Smith', 'Springdale', 'Jonesboro', 'North Little Rock', 'Pine Bluff'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland'],
    'Colorado': ['Denver', 'Colorado Springs', 'Fort Collins', 'Aurora', 'Lakewood', 'Boulder', 'Greeley'],
    'Connecticut': ['Hartford', 'Bridgeport', 'New Haven', 'Waterbury', 'Stamford', 'Norwalk'],
    'Delaware': ['Wilmington', 'Dover', 'Newark'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale'],
    'Georgia': ['Atlanta', 'Augusta', 'Savannah', 'Athens', 'Columbus', 'Macon','Marietta'],
    'Hawaii': ['Honolulu', 'Hilo', 'Kailua'],
    'Idaho': ['Boise', 'Pocatello', 'Nampa', 'Meridian', 'Idaho Falls'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Springfield', 'Joliet'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
    'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City'],
    'Kansas': ['Kansas City', 'Wichita', 'Topeka', 'Overland Park'],
    'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro'],
    'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
    'Maine': ['Portland', 'Lewiston', 'Bangor', 'Augusta'],
    'Maryland': ['Baltimore', 'Annapolis', 'Silver Spring'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Ann Arbor'],
    'Minnesota': ['Minneapolis', 'St. Paul', 'Duluth', 'Rochester'],
    'Mississippi': ['Jackson', 'Gulfport', 'Biloxi'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Independence'],
    'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman'],
    'Nebraska': ['Omaha', 'Lincoln', 'Grand Island'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno'],
    'New Hampshire': ['Manchester', 'Nashua', 'Concord'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson'],
    'New Mexico': ['Albuquerque', 'Las Cruces', 'Santa Fe'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'],
    'North Dakota': ['Bismarck', 'Fargo', 'Grand Forks'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'],
    'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman'],
    'Oregon': ['Portland', 'Eugene', 'Salem'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown'],
    'Rhode Island': ['Providence', 'Warwick', 'Cranston'],
    'South Carolina': ['Charleston', 'Columbia', 'Greenville'],
    'South Dakota': ['Pierre', 'Sioux Falls', 'Rapid City'],
    'Tennessee': ['Memphis', 'Nashville', 'Knoxville'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Utah': ['Salt Lake City', 'Provo', 'West Jordan'],
    'Vermont': ['Burlington', 'Rutland', 'Montpelier'],
    'Virginia': ['Richmond', 'Virginia Beach', 'Arlington'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver'],
    'West Virginia': ['Charleston', 'Huntington'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay'],
    'Wyoming': ['Cheyenne', 'Laramie', 'Casper'],
  },
}

export default function ChurchHomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showPromo, setShowPromo] = useState(true)
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')

  const regions = country ? Object.keys(REGIONS[country as keyof typeof REGIONS] || {}) : []
  const cities = country && region ? REGIONS[country as keyof typeof REGIONS]?.[region as keyof typeof REGIONS[keyof typeof REGIONS]] || [] : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (country) params.append('country', country)
    if (region) params.append('region', region)
    if (city) params.append('city', city)
    window.location.href = `/browse/preachers?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Spring Deal Popup */}
      {showPromo && (
        <div className="fixed bottom-5 right-5 z-40 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl p-5 w-72 text-white">
          <button
            onClick={() => setShowPromo(false)}
            className="absolute top-3 right-3 text-white hover:text-gray-200 text-xl font-bold"
          >
            ✕
          </button>
          <div className="text-center pt-2">
            <div className="text-xs font-bold text-white mb-1 tracking-wide">SPRING DEAL</div>
            <div className="text-4xl font-black mb-2">$50 OFF</div>
            <div className="text-sm font-semibold mb-3">ANY LISTING POST</div>
            <div className="text-xs bg-white bg-opacity-20 rounded px-2 py-1 inline-block">
              Use code: SPRING50
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <Logo />
              <span><span className="text-white">Proclaim </span><span className="text-lime-300">Canada</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-100 hover:text-white transition font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-100 hover:text-white transition font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-slate-100 hover:text-white transition font-medium">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-slate-100 hover:text-white transition font-medium">
                Log In
              </Link>
              <Link
                href="/auth/signup?type=church"
                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg font-bold transition"
              >
                Find Preachers
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.7) 100%), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%234b5563%22 width=%221200%22 height=%22600%22/%3E%3Ccircle cx=%22200%22 cy=%22100%22 r=%2280%22 fill=%22%236b7485%22 opacity=%220.5%22/%3E%3Ccircle cx=%221000%22 cy=%22500%22 r=%22150%22 fill=%22%236b7485%22 opacity=%220.3%22/%3E%3Crect x=%22400%22 y=%22250%22 width=%22400%22 height=%22200%22 fill=%22%236b7485%22 opacity=%220.2%22 rx=%2220%22/%3E%3C/svg%3E")'
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
        
        <div className="relative text-center text-white px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Secure Faithful Leadership<br />
            <span className="text-white text-xl md:text-2xl font-semibold block">Connecting congregations with called ministers in the U.S. and Canada.</span>
          </h1>
          <Link
            href="/auth/signup?type=church"
            className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 shadow-lg"
          >
            Register for free
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-6 mt-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4 items-end">
              {/* Country Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value)
                    setRegion('')
                    setCity('')
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Country</option>
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                </select>
              </div>

              {/* State/Province Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {country === 'Canada' ? 'Province' : country === 'United States' ? 'State' : 'Region'}
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value)
                    setCity('')
                  }}
                  disabled={!country}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a {country === 'Canada' ? 'Province' : country === 'United States' ? 'State' : 'Region'}</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!region}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded font-bold transition h-12"
              >
                Find Preachers
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-12 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's grow your team together.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              With the help of hiring tools from Proclaim Canada, you'll reach hundreds of job seekers who are not only talented and qualified, but also aligned with your mission.
            </p>
            <Link
              href="/listings/pricing"
              className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              POST YOUR LISTING NOW!
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Included with your Listing Post
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📢',
                title: 'Listing Syndication',
                description: 'Reach job seekers through our strategic site partnerships and reach thousands of qualified candidates.'
              },
              {
                icon: '📋',
                title: 'Candidate Database Access',
                description: 'Get exclusive access to 500+ qualified preachers and evangelists with advanced filtering options.'
              },
              {
                icon: '📊',
                title: 'Unlimited Applicants',
                description: 'Receive application information from interested job seekers for as long as your listing is active.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mx-auto mb-4">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <p className="text-center text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
            Connecting your congregation with inspired leadership is simple. Follow these four steps to start building your church's guest speaker roster.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Register your Church for Free',
                description: 'Create a profile for your church in minutes. It costs nothing to join our community and list your church in our North American directory.'
              },
              {
                step: 2,
                title: 'Browse the Directory',
                description: 'Search our growing database of ordained pastors and guest speakers across Canada and the U.S. Filter by location, denomination, or preaching style.'
              },
              {
                step: 3,
                title: 'Unlock Full Access',
                description: 'Choose a Premium Subscription to post new opportunities, access full resumes to contact pastors directly through the portal.'
              },
              {
                step: 4,
                title: 'Post Specific Pulpit Vacancies',
                description: 'Use our secure platform to message preachers and schedule your next guest speaker!'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border-t-4 border-blue-600">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white font-bold mb-4 text-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg mb-6">
              Post specific pulpit vacancies now! Use our secure platform to message preachers and schedule your next guest speaker.
            </p>
            <Link
              href="/auth/signup?type=church"
              className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-bold"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            View A Few Simple Plans
          </h2>
          <p className="text-center text-gray-600 text-lg mb-8">
            Whether you need an urgent posting or year-round staffing, we have a plan for you.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                badge: 'URGENT',
                name: 'Immediate Call',
                duration: '3 days',
                price: '$50',
                features: ['Quick turnaround', 'Job post distribution', 'Application management']
              },
              {
                name: '1 Month',
                duration: '30 days',
                price: '$99',
                features: ['30-day listing', 'Job post distribution', 'Application management', '1 Month Browse Access'],
                highlight: true
              },
              {
                badge: 'BEST VALUE',
                name: 'Unlimited Yearly',
                duration: '365 days',
                price: '$1,700',
                features: ['Unlimited postings', 'Full year access', 'Job post distribution', '12 Months Browse Access']
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl transition transform hover:scale-105 relative ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl ring-4 ring-blue-300 scale-105'
                    : 'bg-white shadow-lg text-gray-900'
                }`}
                style={plan.highlight ? { boxShadow: '0 20px 50px rgba(37, 99, 235, 0.3)' } : {}}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 right-6 px-4 py-1 rounded-full text-sm font-bold text-white ${
                    plan.badge === 'BEST VALUE' ? 'bg-slate-800' : 'bg-red-600'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : ''}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? 'text-blue-50' : 'text-gray-500'}`}>
                    {plan.duration}
                  </p>
                  <div className={`text-4xl font-black mb-6 ${plan.highlight ? 'text-white' : 'text-slate-800'}`}>
                    {plan.price}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className={`flex items-center gap-3 ${plan.highlight ? 'text-blue-50' : 'text-gray-700'}`}>
                        <span className="text-xl">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/listings/pricing"
                    className={`block w-full text-center py-3 rounded-lg font-bold transition ${
                      plan.highlight
                        ? 'bg-white text-slate-800 hover:bg-gray-100'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    Choose Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-8 border-2 border-slate-300 shadow-lg">
              <Link
                href="/listings/pricing"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-md"
              >
                View all pricing options & multi-job packs
                <span className="text-2xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your Team?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join hundreds of churches already using Proclaim Canada to find qualified preachers and evangelists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=church"
              className="bg-white hover:bg-slate-100 text-slate-800 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Sign Up Free
            </Link>
            <a
              href="mailto:support@proclaimcanada.com"
              className="border-2 border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Contact Support
            </a>
          </div>
          <p className="text-sm text-white mt-8">
            Free signup • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <div className="bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Keep the Pulpit Filled</h2>
          <div className="text-gray-700 space-y-4 mb-8">
            <p>
              We believe every congregation deserves access to inspired leadership, which is why we've made church registration 100% free.
            </p>
            <p>
              If our platform has helped you find a voice for your pulpit or build your roster, would you consider partnering with us? Your gift ensures that even the smallest churches can continue using these tools to connect with pastors across North America.
            </p>
          </div>
          <a
            href="https://donate.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 font-bold text-lg transition mb-6"
          >
            Support the Mission
            <span className="text-lime-500">→</span>
          </a>
          <p className="text-gray-700 text-lg font-medium">
            Thank you for being a vital part of this community.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

