'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import ServiceTypeSelector from '@/components/ServiceTypeSelector'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

// Denomination categories - sorted alphabetically within each category
const DENOMINATIONS = {
  'Evangelical & Baptist': [
    'Canadian Baptists of Atlantic Canada (CBAC)',
    'Charismatic / Full Gospel',
    'Evangelical Free Church of Canada (EFCC)',
    'Fellowship of Evangelical Baptist Churches (Fellowship Atlantic)',
    'Pentecostal Assemblies of Canada (PAOC)',
    'The Alliance Canada (Christian and Missionary Alliance)',
  ],
  'Mainline Protestant': [
    'Evangelical Lutheran Church in Canada (ELCIC)',
    'The Anglican Church of Canada',
    'The Presbyterian Church in Canada',
    'The United Church of Canada',
  ],
  'Other Christian Traditions': [
    'Roman Catholic',
    'Seventh-day Adventist',
    'The Salvation Army',
    'Wesleyan Church',
  ],
  'General Options': [
    'Inter-denominational',
    'Non-denominational',
    'Other (Please specify)',
  ],
}

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
    'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Auburn', 'Dothan', 'Bessemer', 'Florence', 'Gadsden', 'Anniston', 'Decatur', 'Cullman', 'Opelika', 'Enterprise', 'Phenix City', 'Selma', 'Alexandria', 'Talladega', 'Union Springs'],
    'Alaska': ['Anchorage', 'Juneau', 'Fairbanks', 'Spokane', 'Sitka', 'Ketchikan', 'Palmer', 'Wasilla', 'Kenai', 'Soldotna', 'Barrow', 'Nome', 'Kodiak'],
    'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Flagstaff', 'Yuma', 'Prescott', 'Lake Havasu City', 'Kingman', 'Bullhead City', 'Willcox', 'Sierra Vista'],
    'Arkansas': ['Little Rock', 'Fayetteville', 'Fort Smith', 'Springdale', 'Jonesboro', 'North Little Rock', 'Pine Bluff', 'Texarkana', 'Hot Springs', 'Bentonville', 'Conway', 'Russellville', 'Searcy', 'Paragould', 'Mountain Home'],
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Santa Clarita', 'Ventura', 'Visalia', 'Vallejo', 'Modesto', 'Oxnard'],
    'Colorado': ['Denver', 'Colorado Springs', 'Fort Collins', 'Aurora', 'Lakewood', 'Pueblo', 'Greeley', 'Longmont', 'Westminster', 'Littleton', 'Boulder', 'Arvada', 'Broomfield', 'Estes Park', 'Aspen', 'Vail', 'Durango', 'Delta'],
    'Connecticut': ['Hartford', 'Bridgeport', 'New Haven', 'Waterbury', 'Stamford', 'Norwalk', 'Meriden', 'Danbury', 'New Britain', 'Torrington', 'Shelton', 'Bristol', 'Glastonbury', 'Enfield', 'Wallingford', 'Manchester'],
    'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'New Castle', 'Rehoboth Beach', 'Bethany Beach', 'Seaford', 'Georgetown'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale', 'Hialeah', 'Lakeland', 'Boca Raton', 'Cape Coral', 'Fort Myers', 'Clearwater', 'Daytona Beach', 'West Palm Beach', 'Naples', 'Pensacola'],
    'Georgia': ['Atlanta', 'Augusta', 'Savannah', 'Athens', 'Columbus', 'Macon', 'Dalton', 'Marietta', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Alpharetta', 'Rome', 'Decatur'],
    'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Kaneohe', 'Waipahu', 'Pearl City', 'Mililani', 'Kahului'],
    'Idaho': ['Boise', 'Pocatello', 'Nampa', 'Meridian', 'Idaho Falls', 'Lewiston', 'Moscow', 'Caldwell', 'Coeur d\'Alene'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Springfield', 'Joliet', 'Naperville', 'Peoria', 'Elgin', 'Waukegan', 'Evanston', 'Decatur', 'Champaign'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Bloomington', 'Gary', 'Hammond', 'Terre Haute'],
    'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City', 'Council Bluffs', 'Dubuque', 'Waterloo', 'Ames'],
    'Kansas': ['Kansas City', 'Wichita', 'Topeka', 'Overland Park', 'Olathe', 'Lawrence', 'Salina'],
    'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Paducah'],
    'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Monroe', 'Houma'],
    'Maine': ['Portland', 'Lewiston', 'Bangor', 'Augusta', 'Biddeford', 'Waterville'],
    'Maryland': ['Baltimore', 'Annapolis', 'Silver Spring', 'Frederick', 'Gaithersburg', 'Columbia'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'New Bedford', 'Brockton', 'Quincy'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Ann Arbor', 'Flint', 'Dearborn', 'Lansing', 'Kalamazoo', 'Saginaw'],
    'Minnesota': ['Minneapolis', 'St. Paul', 'Duluth', 'Rochester', 'Bloomington', 'St. Cloud', 'Mankato'],
    'Mississippi': ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg', 'Meridian', 'Tupelo', 'Greenville'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Independence', 'Columbia', 'St. Joseph', 'Joplin'],
    'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena'],
    'Nebraska': ['Omaha', 'Lincoln', 'Grand Island', 'North Platte', 'Kearney'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'Paradise', 'North Las Vegas', 'Sparks', 'Carson City'],
    'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Rochester', 'Dover', 'Derry', 'Keene'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Atlantic City'],
    'New Mexico': ['Albuquerque', 'Las Cruces', 'Santa Fe', 'Rio Rancho', 'Roswell'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Yonkers', 'Troy', 'Syracuse'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Wilmington'],
    'North Dakota': ['Bismarck', 'Fargo', 'Grand Forks', 'Minot', 'Williston'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown'],
    'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton'],
    'Oregon': ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg'],
    'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'Woonsocket'],
    'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach', 'Spartanburg', 'Rock Hill'],
    'South Dakota': ['Pierre', 'Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings'],
    'Tennessee': ['Memphis', 'Nashville', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Garland', 'Lubbock'],
    'Utah': ['Salt Lake City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'Layton', 'Lehi', 'Draper'],
    'Vermont': ['Burlington', 'Rutland', 'Montpelier', 'Barre', 'Brattleboro'],
    'Virginia': ['Richmond', 'Virginia Beach', 'Arlington', 'Alexandria', 'Roanoke', 'Hampton', 'Newport News'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Renton', 'Federal Way'],
    'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Wheeling', 'Morgantown'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Sheboygan'],
    'Wyoming': ['Cheyenne', 'Laramie', 'Casper', 'Gillette', 'Rock Springs'],
  },
}


export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'preacher'
  const message = searchParams.get('message')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    churchName: '',
    organizationName: '',
    denomination: '',
    specifyAffiliation: '',
    country: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    website: '',
    averageAttendance: '',
    serviceTypes: [] as string[],
    customService: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [choicesInstance, setChoicesInstance] = useState<any>(null)

  // Initialize Choices.js when component mounts
  useEffect(() => {
    if (type === 'church') {
      // Load Choices.js library dynamically
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js'
      script.async = true
      script.onload = () => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css'
        document.head.appendChild(link)

        // Initialize Choices.js on the denomination select
        const denominationSelect = document.getElementById('denomination') as HTMLSelectElement
        if (denominationSelect) {
          const choices = new (window as any).Choices(denominationSelect, {
            searchEnabled: true,
            searchChoices: true,
            shouldSort: false,
            placeholderValue: 'Search denominations...',
            noResultsText: 'No results found',
            noChoicesText: 'No choices available',
          })
          setChoicesInstance(choices)
        }
      }
      document.head.appendChild(script)
    }

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy()
      }
    }
  }, [type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value
    
    // Auto-prepend https:// to website URL if it doesn't have a protocol
    if (e.target.name === 'website' && value && !value.match(/^https?:\/\//i)) {
      value = `https://${value}`
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleServiceTypeChange = (services: string[]) => {
    setFormData({
      ...formData,
      serviceTypes: services,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    // Validate required church fields
    if (type === 'church') {
      if (!formData.churchName || !formData.country || !formData.city || !formData.province || !formData.postalCode || !formData.denomination || !formData.averageAttendance) {
        setError('Please fill in all required church fields')
        setLoading(false)
        return
      }
      if (formData.denomination === 'Other (Please specify)' && !formData.specifyAffiliation) {
        setError('Please specify your church affiliation')
        setLoading(false)
        return
      }
    }

    // Validate required preacher fields
    if (type === 'preacher') {
      if (!formData.serviceTypes || formData.serviceTypes.length === 0) {
        setError('Please select at least one service type you are willing to preach')
        setLoading(false)
        return
      }
      if (formData.serviceTypes.includes('Other (Please specify)') && !formData.customService) {
        setError('Please specify your custom service type')
        setLoading(false)
        return
      }
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: type.toUpperCase(),
          ...(type === 'church' && {
            churchName: formData.churchName,
            organizationName: formData.organizationName,
            denomination: formData.denomination,
            specifyAffiliation: formData.specifyAffiliation || null,
            country: formData.country,
            street: formData.street,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            website: formData.website,
            averageAttendance: formData.averageAttendance,
          }),
          ...(type === 'preacher' && {
            serviceTypes: formData.serviceTypes,
            customService: formData.customService || null,
          }),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create account')
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/dashboard/profile/complete')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Redirecting to login...
          </p>
          
          {/* Donation Message */}
          <div className="bg-lime-50 rounded-lg p-4 mb-6 border border-lime-200">
            <p className="text-sm text-gray-700 mb-3">
              We're glad to have you. If you'd like to help us keep this service free for all churches, you can give a one-time gift here.
            </p>
            <a 
              href="#donate"
              onClick={(e) => {
                e.preventDefault()
                window.open('https://donate.example.com', '_blank')
              }}
              className="inline-block bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded font-semibold text-sm transition"
            >
              Make a Gift
            </a>
          </div>
          
          <Link href="/auth/login" className="text-lime-600 hover:text-lime-700 font-semibold">
            Sign In Now
          </Link>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <Logo />
              <span><span className="text-white">Proclaim </span><span className="text-lime-300">Canada</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-green-50 hover:text-white transition font-medium">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Form Container */}
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 transition"
          >
            <span>←</span>
            <span>Go Back</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {type === 'church' ? 'Register My Church Now!' : 'Sign Up as Preacher'}
          </h1>
          <p className="text-gray-600 mb-8">Join Proclaim Canada today</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {message === 'free-month' && type === 'church' && (
          <div className="bg-lime-50 border border-lime-300 text-lime-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">🎉 Great news!</p>
            <p className="text-sm mt-1">Register now and get <strong>1 month of free posting and full access</strong> included with your account!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* CHURCH SPECIFIC FIELDS */}
          {type === 'church' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Church Information</h3>
              
              {/* Church Name */}
              <div className="mb-4">
                <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                  Church/Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="churchName"
                  type="text"
                  name="churchName"
                  value={formData.churchName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="e.g., Grace Community Church"
                />
              </div>

              {/* Organization Name */}
              <div className="mb-4">
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Organization Name
                </label>
                <input
                  id="organizationName"
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="e.g., Grace Community Church Inc."
                />
              </div>

              {/* Denomination - Searchable with Choices.js */}
              <div className="mb-4">
                <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                  Denomination/Affiliation <span className="text-red-500">*</span>
                </label>
                <select
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                >
                  <option value="">-- Select a denomination --</option>
                  {Object.entries(DENOMINATIONS).map(([category, options]) => (
                    <optgroup key={category} label={category}>
                      {options.sort().map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Conditional: Specify Affiliation (if "Other" selected) */}
              {formData.denomination === 'Other (Please specify)' && (
                <div className="mb-4 p-4 bg-lime-50 border border-lime-200 rounded-lg">
                  <label htmlFor="specifyAffiliation" className="block text-sm font-medium text-gray-700 mb-2">
                    Please Specify Your Church Affiliation <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="specifyAffiliation"
                    type="text"
                    name="specifyAffiliation"
                    value={formData.specifyAffiliation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your church affiliation"
                  />
                </div>
              )}

              {/* Average Sunday Attendance */}
              <div className="mb-4">
                <label htmlFor="averageAttendance" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Sunday Attendance <span className="text-red-500">*</span>
                </label>
                <select
                  id="averageAttendance"
                  name="averageAttendance"
                  value={formData.averageAttendance}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                >
                  <option value="">-- Select attendance range --</option>
                  <option value="<50">Less than 50</option>
                  <option value="50-100">50 - 100</option>
                  <option value="100-250">100 - 250</option>
                  <option value="250-500">250 - 500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              {/* Website */}
              <div className="mb-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="www.example.com or https://www.example.com"
                />
                <p className="text-xs text-gray-500 mt-1">https:// will be added automatically if not provided</p>
              </div>
            </div>
          )}

          {/* ADDRESS SECTION (Church Only) */}
          {type === 'church' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Address</h3>
              
              {/* Country */}
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={(e) => {
                    handleChange(e)
                    // Clear province and city when country changes
                    setFormData(prev => ({ ...prev, province: '', city: '' }))
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                >
                  <option value="">-- Select a country --</option>
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                </select>
              </div>

              {/* Province/State */}
              <div className="mb-4">
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  Province/State <span className="text-red-500">*</span>
                </label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={(e) => {
                    handleChange(e)
                    // Clear city when province changes
                    setFormData(prev => ({ ...prev, city: '' }))
                  }}
                  required
                  disabled={!formData.country}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select a province/state --</option>
                  {formData.country && REGIONS[formData.country as keyof typeof REGIONS] && 
                    Object.keys(REGIONS[formData.country as keyof typeof REGIONS]).sort().map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))
                  }
                </select>
              </div>

              {/* City */}
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!formData.province}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select a city --</option>
                  {formData.country && formData.province && REGIONS[formData.country as keyof typeof REGIONS]?.[formData.province as any] && 
                    REGIONS[formData.country as keyof typeof REGIONS][formData.province as any].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))
                  }
                </select>
              </div>

              {/* Street Address */}
              <div className="mb-4">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="street"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              {/* Postal/Zip Code */}
              <div className="mb-4">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal/Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="M5V 3A8"
                />
              </div>
            </div>
          )}

          {/* CONTACT INFORMATION SECTION */}
          <div className={type === 'church' ? 'border-b border-gray-200 pb-6' : ''}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {type === 'church' ? 'Primary Contact Information' : 'Personal Information'}
            </h3>

            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'church' ? 'Primary Contact Person' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* PREACHER SERVICE TYPES SECTION */}
          {type === 'preacher' && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ministry Service Types</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select the types of services you are willing to preach at <span className="text-red-500">*</span>
              </p>
              <ServiceTypeSelector
                selectedServices={formData.serviceTypes}
                onSelectionChange={handleServiceTypeChange}
                showCustomField={true}
              />
              
              {/* Custom Service Type Input */}
              {formData.serviceTypes.includes('Other (Please specify)') && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg\">
                  <label htmlFor="customService" className="block text-sm font-medium text-gray-700 mb-2">
                    Please Specify Your Service Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customService"
                    type="text"
                    name="customService"
                    value={formData.customService}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="e.g., Prison Ministry, Hospital Chaplaincy"
                  />
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT SECURITY SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Security</h3>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.95 0-9.305 3.36-10.633 8 .235.987.407 2.006.542 3.03l2.01-2.01A4 4 0 0110 5.5c2.21 0 4.105 1.688 4.472 3.834l2.01-2.01C14.658 3.792 12.456 3 10 3zm3.068 5.932A4 4 0 0110 14.5H8.414l2.01 2.01c.94.195 1.91.305 2.916.305 4.95 0 9.305-3.36 10.633-8-.167-.557-.39-1.09-.656-1.595l-2.01 2.01a4 4 0 00-.068-.392z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.95 0-9.305 3.36-10.633 8 .235.987.407 2.006.542 3.03l2.01-2.01A4 4 0 0110 5.5c2.21 0 4.105 1.688 4.472 3.834l2.01-2.01C14.658 3.792 12.456 3 10 3zm3.068 5.932A4 4 0 0110 14.5H8.414l2.01 2.01c.94.195 1.91.305 2.916.305 4.95 0 9.305-3.36 10.633-8-.167-.557-.39-1.09-.656-1.595l-2.01 2.01a4 4 0 00-.068-.392z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 text-white py-3 rounded-lg hover:bg-lime-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors duration-200"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-lime-600 hover:text-lime-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600 mb-2">Not a {type === 'church' ? 'Church' : 'Preacher'}?</p>
          <Link 
            href={`/auth/signup?type=${type === 'church' ? 'preacher' : 'church'}`}
            className="text-lime-600 hover:text-lime-700 font-semibold"
          >
            Sign up as {type === 'church' ? 'Preacher' : 'Church'} instead
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
