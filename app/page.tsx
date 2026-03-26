'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  const canadianProvinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
  ]

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ]

  const citiesByRegion = {
    // Canadian Provinces
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Grande Prairie', 'Airdrie', 'Cochrane', 'Canmore', 'Fort McMurray'],
    'British Columbia': ['Vancouver', 'Victoria', 'Burnaby', 'Coquitlam', 'Surrey', 'Kelowna', 'Kamloops', 'Nanaimo', 'Prince George', 'Vernon'],
    'Manitoba': ['Winnipeg', 'Brandon', 'Missoula', 'Steinbach', 'Selkirk', 'Dauphin', 'Thompson', 'Winkler', 'Morden', 'Portage la Prairie'],
    'New Brunswick': ['Saint John', 'Fredericton', 'Moncton', 'Bathurst', 'Miramichi', 'Edmundston', 'Saint-Basile', 'Shediac', 'Dieppe', 'Campbellton'],
    'Newfoundland and Labrador': ['St. John\'s', 'Corner Brook', 'Grand Falls-Windsor', 'Gander', 'Happy Valley-Goose Bay', 'Labrador City', 'Conception Bay South', 'Carbonear', 'Stephenville', 'Bonavista'],
    'Northwest Territories': ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Dettah', 'Behchoko', 'Rae Lakes', 'Tuktoyaktuk', 'Norman Wells', 'Aklavik'],
    'Nova Scotia': ['Halifax', 'Cape Breton', 'Sydney', 'Glace Bay', 'New Glasgow', 'Truro', 'Dartmouth', 'Amherst', 'Antigonish', 'Bridgewater'],
    'Nunavut': ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Baker Lake', 'Whale Cove', 'Chesterfield Inlet', 'Cambridge Bay', 'Kugluktuk', 'Yellowknife', 'Grise Fiord'],
    'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Brampton', 'Kingston', 'Thunder Bay', 'Kitchener', 'Windsor'],
    'Prince Edward Island': ['Charlottetown', 'Summerside', 'Stratford', 'Montague', 'Souris', 'Alberton', 'Kensington', 'Georgetown', 'Tignish', 'Brackley'],
    'Quebec': ['Montreal', 'Quebec City', 'Gatineau', 'Laval', 'Longueuil', 'Sherbrooke', 'Trois-Rivières', 'Terrebonne', 'Saint-Jérôme', 'Rimouski'],
    'Saskatchewan': ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Yorkton', 'Swift Current', 'North Battleford', 'Estevan', 'Melfort', 'Kindersley'],
    'Yukon': ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Carmacks', 'Mayo', 'Faro', 'Carcross', 'Teslin', 'Old Crow'],
    
    // US States
    'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Auburn', 'Dothan', 'Gadsden', 'Anniston', 'Florence'],
    'Alaska': ['Anchorage', 'Juneau', 'Fairbanks', 'Kodiak', 'Palmer', 'Sitka', 'Ketchikan', 'Wasilla', 'Valdez', 'Homer'],
    'Arizona': ['Phoenix', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Tucson'],
    'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville', 'Texarkana'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Long Beach', 'Fresno', 'San Jose', 'Anaheim', 'Riverside'],
    'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Pueblo', 'Boulder', 'Greeley', 'Broomfield', 'Trinidad'],
    'Connecticut': ['Bridgeport', 'New Haven', 'Waterbury', 'Stamford', 'Norwalk', 'Hartford', 'New Britain', 'West Hartford', 'Danbury', 'Torrington'],
    'Delaware': ['Wilmington', 'Dover', 'Newark', 'Smyrna', 'Middletown', 'Milford', 'DuPont', 'Elsmere', 'New Castle', 'Laurel'],
    'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Fort Lauderdale', 'Palm Bay', 'Tallahassee', 'Fort Myers'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Macon', 'Marietta', 'Johns Creek', 'Alpharetta', 'Sandy Springs'],
    'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Kaneohe', 'Wailuku', 'Lahaina', 'Kaunakakai', 'Kapaa', 'Lihue', 'Mililani'],
    'Idaho': ['Boise', 'Nampa', 'Meridian', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Lewiston', 'Moscow'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Cicero', 'Champaign'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Bloomington', 'Gary', 'Muncie', 'Carmel', 'Fishers', 'Marion'],
    'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City', 'Dubuque', 'Waterloo', 'Council Bluffs', 'Ames', 'Sioux City', 'Cedar Falls'],
    'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe', 'Lawrence', 'Shawnee', 'Manhattan', 'Salina', 'Hutchinson'],
    'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Hopkinsville', 'Richmond', 'Paducah', 'Florence', 'Georgetown'],
    'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Monroe', 'Alexandria', 'Houma', 'Kenner', 'Metairie'],
    'Maine': ['Portland', 'Lewiston', 'Bangor', 'Augusta', 'South Portland', 'Auburn', 'Biddeford', 'Sanford', 'Westbrook', 'Waterville'],
    'Maryland': ['Baltimore', 'Columbia', 'Towson', 'Gaithersburg', 'Bowie', 'Frederick', 'Rockville', 'Annapolis', 'Silver Spring', 'Salisbury'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford', 'Brockton', 'Quincy', 'Lynn', 'Fall River'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Kalamazoo'],
    'Minnesota': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Plymouth', 'St. Cloud', 'Moorhead', 'Minnetonka', 'Burnsville'],
    'Mississippi': ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg', 'Meridian', 'Madison', 'Greenville', 'Vicksburg', 'Laurel', 'Tupelo'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Independence', 'Columbia', 'Jefferson City', 'Joplin', 'Lee\'s Summit', 'O\'Fallon', 'Saint Joseph'],
    'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Miles City', 'Anaconda'],
    'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'North Platte', 'Columbus', 'Papillion'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'Paradise', 'North Las Vegas', 'Sparks', 'Carson City', 'Elko', 'Winnemucca', 'Mesquite'],
    'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Portsmouth', 'Derry', 'Rochester', 'Dover', 'Hudson', 'Salem', 'Laconia'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Clifton', 'Camden', 'Atlantic City', 'Irvington', 'Toms River'],
    'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Gallup', 'Clovis', 'Hobbs', 'Farmington', 'Carlsbad'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Utica', 'Mount Vernon', 'Schenectady'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Greenville'],
    'North Dakota': ['Bismarck', 'Fargo', 'Grand Forks', 'Minot', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Watford City', 'Valley City'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'],
    'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton', 'Edmond', 'Moore', 'Midwest City', 'Enid', 'Stillwater'],
    'Oregon': ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Grants Pass'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'],
    'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'Newport', 'Woonsocket', 'North Providence', 'West Warwick', 'Coventry', 'Middletown'],
    'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Spartanburg', 'Sumter', 'Florence', 'Goose Creek', 'Rock Hill', 'Hilton Head Island', 'Beaufort'],
    'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Pierre', 'Yankton', 'Huron', 'Spearfish'],
    'Tennessee': ['Memphis', 'Nashville', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Jackson', 'Johnson City', 'Franklin', 'Bartlett'],
    'Texas': ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo'],
    'Utah': ['Salt Lake City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'Draper', 'Lehi'],
    'Vermont': ['Burlington', 'Rutland', 'Montpelier', 'Barre', 'Bennington', 'St. Albans', 'Brattleboro', 'Winooski', 'Middlebury', 'South Burlington'],
    'Virginia': ['Virginia Beach', 'Richmond', 'Arlington', 'Alexandria', 'Roanoke', 'Blacksburg', 'Charlottesville', 'Leesburg', 'Harrisonburg', 'Christiansburg'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Bellingham', 'Federal Way'],
    'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Martinsburg', 'Morgantown', 'Beckley', 'Princeton'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville'],
    'Wyoming': ['Cheyenne', 'Laramie', 'Casper', 'Gillette', 'Rock Springs', 'Sheridan', 'Jackson', 'Powell', 'Cody', 'Riverton']
  }

  const getRegions = () => {
    if (selectedCountry === 'canada') return canadianProvinces
    if (selectedCountry === 'usa') return usStates
    return []
  }

  const getCities = () => {
    return citiesByRegion[selectedRegion] || []
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition">
                <Logo />
                <span className="text-white">Proclaim </span>
                <span className="text-lime-500">Canada</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/browse/preachers" className="text-white text-sm font-medium hover:text-lime-400 transition duration-200">Find Evangelists</Link>
              <Link href="/listings" className="text-white text-sm font-medium hover:text-lime-400 transition duration-200">Browse Opportunities</Link>
              <a href="#how-it-works" className="text-white text-sm font-medium hover:text-lime-400 transition duration-200">How It Works</a>
            </div>

            {/* Right Side - Buttons & Icons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/profiles" 
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3 py-1.5 rounded-lg font-semibold transition duration-200 text-xs"
              >
                Admin
              </Link>
              <Link 
                href="/church-home" 
                className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-3 py-1.5 rounded-lg font-semibold transition duration-200 text-sm"
              >
                Church Home
              </Link>
              <Link 
                href="/listings/pricing" 
                className="text-white hover:text-lime-300 transition duration-200 text-sm font-medium hidden sm:block"
              >
                Post Opportunity
              </Link>
              <Link href="/auth/login" className="text-white hover:text-lime-400 transition duration-200" title="Sign In">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/cart" className="text-white hover:text-lime-400 transition duration-200 relative" title="Cart">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1h7.586a1 1 0 00.99-1.243l-1.376-5.502A1 1 0 0012.25 3H2.75a1 1 0 00-.75.75zM16 16a2 2 0 11-4 0 2 2 0 014 0zM4 16a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Banner with Background */}
      <div 
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(51,65,85);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(30,41,59);stop-opacity:1" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad)"/><path d="M 200 400 L 200 100 L 250 150 L 300 100 L 300 400 Z" fill="rgba(255,255,255,0.1)" opacity="0.5"/></svg>\')',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-6 leading-tight drop-shadow-lg">
            Proclaim. Evangelize. Serve.
          </h1>
          <p className="text-xl md:text-2xl text-lime-100 text-center mb-6 font-semibold drop-shadow-md">Your Next Ministry Assignment Starts Here.</p>
          <p className="text-base md:text-lg text-lime-200 text-center mb-16 drop-shadow-sm">Discover church jobs across Canada and the United States.</p>

          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select 
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value)
                    setSelectedRegion('')
                  }}
                  className="px-4 py-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white border border-gray-300 min-w-[160px] font-medium hover:border-gray-400 transition"
                >
                  <option value="">Select Country</option>
                  <option value="canada">Canada</option>
                  <option value="usa">United States</option>
                </select>
              </div>
              <div className="flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Province/State</label>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={!selectedCountry}
                  className="px-4 py-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white border border-gray-300 min-w-[160px] font-medium hover:border-gray-400 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Select {selectedCountry === 'canada' ? 'Province' : selectedCountry === 'usa' ? 'State' : 'Province/State'}</option>
                  {getRegions().map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div className="flex-shrink-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City/Town</label>
                <select 
                  disabled={!selectedRegion}
                  className="px-4 py-3 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white border border-gray-300 min-w-[160px] font-medium hover:border-gray-400 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Select City, Town</option>
                  {getCities().map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input 
                  type="text" 
                  placeholder="Job title or keywords" 
                  className="w-full px-4 py-3 text-gray-700 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-gray-300 hover:border-gray-400 transition font-medium"
                />
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition duration-200 whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-105">
                Search
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/answer-the-call"
              className="bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white px-10 py-4 rounded-xl font-bold transition duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
            >
              Register as a Visiting Minister
            </Link>
            <p className="text-sm text-lime-100 text-center">Looking to post a job? <Link href="/listings/pricing" className="text-white font-semibold underline hover:text-lime-200 transition">Click here</Link></p>
          </div>
        </div>
      </div>

      {/* No Cost Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">Completely Free</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">No Strings Attached. Start Your Ministry Journey Today.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-lime-50 to-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition duration-300 transform hover:-translate-y-1 border border-lime-100">
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 20v60c0 3.3 2.7 6 6 6h28c3.3 0 6-2.7 6-6v-60M36 35h28M36 50h28M36 65h28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M50 10L40 25h20z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No Cost to Join</h3>
              <p className="text-gray-600 leading-relaxed">Start connecting with churches and evangelists at no charge. It's free to create your profile and begin your ministry journey.</p>
            </div>
            <div className="bg-gradient-to-br from-lime-50 to-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition duration-300 transform hover:-translate-y-1 border border-lime-100">
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="30" r="12" stroke="currentColor" strokeWidth="2.5"/>
                  <path d="M50 45v35M35 55c0-8.3 6.7-15 15-15s15 6.7 15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M65 75L85 95M35 75L15 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No Cost to View</h3>
              <p className="text-gray-600 leading-relaxed">Browse all available opportunities and church profiles. Search, filter, and explore without any fees or hidden costs.</p>
            </div>
            <div className="bg-gradient-to-br from-lime-50 to-white rounded-xl shadow-md hover:shadow-xl p-8 text-center transition duration-300 transform hover:-translate-y-1 border border-lime-100">
              <div className="bg-lime-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 15h20v70H40z" fill="currentColor" opacity="0.3"/>
                  <path d="M50 20L40 35h20z" fill="currentColor"/>
                  <path d="M45 50h10M40 60h20M40 72h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No Cost to Post</h3>
              <p className="text-gray-600 leading-relaxed">Share your resume, availability, and ministry information for free.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Link href="/auth/signup?type=preacher" className="group">
              <div className="text-center hover:scale-105 transition-transform duration-300 border-2 border-lime-500 rounded-xl p-8 glow-border bg-white hover:bg-lime-50">
                <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 15L35 50v35h30V50z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M50 20v30M40 35h20M45 55h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="50" cy="30" r="6" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Join</h3>
                <p className="text-gray-600 leading-relaxed">Sign up as an evangelist and create your profile</p>
              </div>
            </Link>
            <div className="group">
              <div className="text-center bg-white rounded-xl p-8 transition-all hover:shadow-lg">
                <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="30" y="20" width="40" height="50" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M40 30h20M40 42h20M40 54h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M50 65L45 75l10-5 5 10" fill="currentColor" opacity="0.5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Build Your Calendar</h3>
                <p className="text-gray-600 leading-relaxed">Evangelists share availability and service preferences</p>
              </div>
            </div>
            <div className="group">
              <div className="text-center bg-white rounded-xl p-8 transition-all hover:shadow-lg">
                <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="35" cy="40" r="12" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="65" cy="40" r="12" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M47 40h6M35 55v15M65 55v15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Find & Connect</h3>
                <p className="text-gray-600 leading-relaxed">Search and apply for opportunities</p>
              </div>
            </div>
            <div className="group">
              <div className="text-center bg-white rounded-xl p-8 transition-all hover:shadow-lg">
                <div className="bg-lime-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-600" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20L40 35h8v35c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V35h8z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M35 50s5-8 15-8 15 8 15 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M30 75L70 75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Confirm & Serve</h3>
                <p className="text-gray-600 leading-relaxed">Receive messages from churches with opportunities, review offers, accept, and prepare for the service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
