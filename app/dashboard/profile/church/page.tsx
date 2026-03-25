'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Region/Province/City Data
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
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Fresno', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Santa Clarita', 'Ventura', 'Visalia', 'Vallejo', 'Modesto', 'Oxnard', 'Huntington Beach', 'Santa Rosa', 'Pasadena', 'Salinas', 'Hayward', 'Fontana', 'Santa Clarita', 'Reno', 'Lancaster', 'Moreno Valley', 'Rancho Cucamonga', 'Oceanside', 'Redding', 'Red Bluff', 'Chico'],
    'Colorado': ['Denver', 'Colorado Springs', 'Fort Collins', 'Aurora', 'Lakewood', 'Pueblo', 'Greeley', 'Longmont', 'Westminster', 'Littleton', 'Boulderado', 'Arvada', 'Broomfield', 'Estes Park', 'Aspen', 'Vail', 'Durango', 'Delta'],
    'Connecticut': ['Hartford', 'Bridgeport', 'New Haven', 'Waterbury', 'Stamford', 'Norwalk', 'Hartford', 'Meriden', 'Danbury', 'New Britain', 'Torrington', 'Shelton', 'Bristol', 'Glastonbury', 'Enfield', 'Wallingford', 'Manchester'],
    'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'New Castle', 'Rehoboth Beach', 'Bethany Beach', 'Seaford', 'Georgetown'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Phoenix', 'St. Petersburg', 'Tallahassee', 'Fort Lauderdale', 'Hialeah', 'Lakeland', 'Boca Raton', 'Doral', 'Boynton Beach', 'Coral Springs', 'Pembroke Pines', 'Cape Coral', 'Fort Myers', 'Clearwater', 'Daytona Beach', 'West Palm Beach', 'Port St. Lucie', 'Naples', 'Ocala', 'Pensacola', 'Destin', 'Panama City', 'Tallahassee', 'Kissimmee', 'Apopka'],
    'Georgia': ['Atlanta', 'Augusta', 'Savannah', 'Athens', 'Columbus', 'Macon', 'Dalton', 'Marietta', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Alpharetta', 'Peachburg', 'Rome', 'Canton', 'Cartersville', 'Kennesaw', 'Decatur', 'Gainesville', 'Valdosta', 'Waycross', 'Albany', 'Thomasville'],
    'Hawaii': ['Honolulu', 'Hilo', 'Kailua', 'Kaneohe', 'Waipahu', 'Pearl City', 'Mililani', 'Kauai', 'Maui', 'Lanai', 'Molokai', 'Kahului'],
    'Idaho': ['Boise', 'Pocatello', 'Nampa', 'Meridian', 'Idaho Falls', 'Lewiston', 'Moscow', 'Caldwell', 'Coeur d\'Alene', 'Sandpoint', 'Blackfoot', 'American Falls', 'Rigby', 'Rexburg', 'Garden City', 'Eagle'],
    'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Springfield', 'Joliet', 'Naperville', 'Peoria', 'Elgin', 'Waukegan', 'Cicero', 'Evanston', 'Decatur', 'DeKalb', 'Champaign', 'Urbana', 'Bloomington', 'Normal', 'Quincy', 'Galesburg', 'Moline', 'Belleville', 'East St. Louis'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Bloomington', 'Gary', 'Hammond', 'Terre Haute', 'Anderson', 'Kokomo', 'Muncie', 'Lafayette', 'West Lafayette', 'Vincennes', 'New Albany', 'Jeffersonville', 'Valparaiso', 'Mishawaka'],
    'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City', 'Council Bluffs', 'Dubuque', 'Waterloo', 'Cedar Falls', 'Ames', 'Sioux City', 'Iowa Falls', 'Mason City', 'Ottumwa', 'Fort Dodge', 'Marshalltown', 'Grinnell', 'Boone'],
    'Kansas': ['Kansas City', 'Wichita', 'Topeka', 'Overland Park', 'Kansas City', 'Olathe', 'Lawrence', 'Salina', 'Manhattan', 'Hutchinson', 'Garden City', 'Great Bend', 'Hays', 'Leawood', 'Shawnee'],
    'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Paducah', 'Florence', 'Newport', 'Frankfort', 'Hopkinsville', 'Madisonville', 'Elizabethtown', 'Somerset', 'Ashland', 'Pikeville', 'Morehead'],
    'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Monroe', 'Houma', 'Alexandria', 'Gretna', 'Marrero', 'Slidell', 'Kenner', 'Metairie', 'Biloxi', 'Morgan City', 'DeRidder', 'Thibodaux'],
    'Maine': ['Portland', 'Lewiston', 'Bangor', 'Augusta', 'Biddeford', 'Waterville', 'Rockland', 'Saco', 'Bath', 'Brunswick', 'Auburn', 'Farmington', 'Presque Isle'],
    'Maryland': ['Baltimore', 'Annapolis', 'Silver Spring', 'Arlington', 'Frederick', 'Gaithersburg', 'Columbia', 'Bethesda', 'Reston', 'Towson', 'Hagerstown', 'Salisbury', 'Waldorf', 'Ocean City', 'Bowie'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'New Bedford', 'Brockton', 'Quincy', 'Lynn', 'Taunton', 'Waltham', 'Fitchburg', 'Revere', 'Chicopee', 'Somerville', 'Watertown', 'Salem', 'Malden', 'Medford', 'Weymouth'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Ann Arbor', 'Flint', 'Dearborn', 'Livonia', 'Sterling Heights', 'Lansing', 'Kalamazoo', 'Westland', 'Lincoln Park', 'Inkster', 'Taylor', 'Pontiac', 'Saginaw', 'Jackson', 'Traverse City', 'Marquette', 'Iron Mountain'],
    'Minnesota': ['Minneapolis', 'St. Paul', 'Duluth', 'Rochester', 'Bloomington', 'Minnetonka', 'Edina', 'Plymouth', 'Saint Paul', 'Eagan', 'Burnsville', 'Coon Rapids', 'Mankato', 'Moorhead', 'Fargo', 'St. Cloud', 'Winona', 'Rochester', 'Albert Lea'],
    'Mississippi': ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg', 'Meridian', 'Tupelo', 'Greenville', 'Greenwood', 'Vicksburg', 'Oxford', 'Madison', 'Pass Christian', 'Long Beach', 'Laurel'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Independence', 'Columbia', 'St. Joseph', 'Joplin', 'Rolla', 'Maryville', 'Kirksville', 'Sedalia', 'Moberly', 'Cape Girardeau', 'Farmington', 'Branson', 'Ozark', 'Warrenton'],
    'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Miles City', 'Kalispell', 'Havre', 'Livingston', 'Whitefish'],
    'Nebraska': ['Omaha', 'Lincoln', 'Grand Island', 'North Platte', 'Kearney', 'Fremont', 'Hastings', 'Lexington', 'McCook', 'Beatrice', 'Scottsbluff', 'Sidney', 'Gering'],
    'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'Paradise', 'North Las Vegas', 'Spring Valley', 'Summerlin', 'Sparks', 'Carson City', 'Elko', 'Ely', 'Winnemucca', 'Battle Mountain'],
    'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Rochester', 'Dover', 'Derry', 'Keene', 'Claremont', 'Laconia', 'Lebanon', 'Portsmouth', 'Hanover', 'Wolfboro'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Atlantic City', 'Irvington', 'Clifton', 'Camden', 'Passaic', 'East Orange', 'Vineland', 'Kearny', 'Union', 'Linden', 'Bayonne'],
    'New Mexico': ['Albuquerque', 'Las Cruces', 'Santa Fe', 'Rio Rancho', 'Roswell', 'Carlsbad', 'Lovington', 'Hobbs', 'Raton', 'Las Vegas', 'Deming', 'Silver City', 'Alamogordo'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Yonkers', 'Troy', 'Utica', 'Binghamton', 'Syracuse', 'Glens Falls', 'Watertown', 'Plattsburgh', 'Ithaca', 'Oswego', 'Batavia', 'Fulton'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Wilmington', 'High Point', 'Asheville', 'Greenville', 'Cary', 'Chapel Hill', 'Rocky Mount', 'Goldsboro', 'Kinston', 'New Bern', 'Salisbury', 'Boone'],
    'North Dakota': ['Bismarck', 'Fargo', 'Grand Forks', 'Minot', 'Williston', 'Dickinson', 'Mandan', 'West Fargo', 'Hazen', 'Watford City'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain', 'Elyria', 'Mansfield', 'Wooster', 'Athens', 'Chillicothe', 'Newark', 'Marion', 'Zanesville', 'Warren', 'Lima'],
    'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Enid', 'Bartlesville', 'Tahlequah', 'Durant', 'Ardmore', 'Altus', 'Elk City', 'Sallisaw', 'Shawnee', 'Pontotoc'],
    'Oregon': ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Klamath Falls', 'Pendleton', 'LaGrande', 'Baker City', 'Burns'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'Johnstown', 'Chester', 'Norriton', 'Wilkes-Barre', 'Hazleton', 'Bloomsburg', 'Towanda', 'Sunbury'],
    'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'Woonsocket', 'Coventry', 'West Warwick', 'Smithfield', 'Johnston'],
    'South Carolina': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach', 'Spartanburg', 'Rock Hill', 'Summerville', 'Goose Creek', 'Hilton Head Island', 'Beaufort', 'Conway', 'Florence', 'Aiken'],
    'South Dakota': ['Pierre', 'Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Spearfish', 'Hot Springs', 'Martin', 'Eagle Butte'],
    'Tennessee': ['Memphis', 'Nashville', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Kingsport', 'Bristol', 'Oak Ridge', 'Morristown', 'Shelbyville', 'Lewisburg'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Garland', 'Lubbock', 'Irving', 'Chandler', 'Beaumont', 'Port Aransas', 'Amarillo', 'Abilene', 'Midland', 'Odessa', 'Waco', 'Tyler', 'Longview', 'Sherman', 'Paris', 'Texarkana'],
    'Utah': ['Salt Lake City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'Layton', 'Lehi', 'Draper', 'Roy', 'American Fork', 'Payson', 'Springville', 'Moab', 'St. George', 'Cedar City'],
    'Vermont': ['Burlington', 'Rutland', 'Montpelier', 'Barre', 'Brattleboro', 'Bennington', 'White River Junction', 'Newport', 'St. Albans'],
    'Virginia': ['Richmond', 'Virginia Beach', 'Arlington', 'Alexandria', 'Roanoke', 'Richmond', 'Hampton', 'Newport News', 'Charlottesville', 'Blacksburg', 'Wytheville', 'Lewisburg', 'Abingdon', 'Marion', 'Christiansburg', 'Danville', 'Lynchburg'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Renton', 'Federal Way', 'Sammamish', 'Redmond', 'Kirkland', 'Olympia', 'Bellingham', 'Everett', 'Marysville', 'Enumclaw', 'Longview', 'Walla Walla', 'Pullman', 'Wenatchee'],
    'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Wheeling', 'Morgantown', 'Clarksburg', 'Fairmont', 'Beckley', 'Lewisburg', 'Harpers Ferry', 'Martinsburg', 'Bluefield', 'Wellsburg'],
    'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Sheboygan', 'Waukesha', 'Eau Claire', 'La Crosse', 'Janesville', 'Oshkosh', 'West Allis', 'Superior', 'Marinette'],
    'Wyoming': ['Cheyenne', 'Laramie', 'Casper', 'Gillette', 'Rock Springs', 'Sheridan', 'Evanston', 'Green River', 'Riverton', 'Worland', 'Cody', 'Jackson', 'Pinedale'],
  },
}

const DENOMINATIONS = [
  'Assemblies of God',
  'Baptist',
  'Pentecostal',
  'Foursquare',
  'Church of God in Christ',
  'Christian and Missionary Alliance',
  'Evangelical Free Church',
  'Wesleyan',
  'Evangelical Covenant',
  'Christian Brethren',
  'Missionary Church',
  'Other',
  'Interdenominational',
]

const SERVICE_TYPES = [
  'Regular Sunday Service',
  'Special Service (Christmas, Easter, etc)',
  'Revival Service',
  'Wedding',
  'Funeral',
  'Conference/Workshop',
  'Outreach Event',
  'Other',
]

export default function ChurchProfileComplete() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    churchName: '',
    contactName: '',
    country: '',
    province: '',
    city: '',
    neighborhood: '',
    address: '',
    averageAttendance: '',
    bio: '',
    denomination: '',
    serviceTypes: [] as string[],
    otherServiceType: '',
    preferredPreacherQualifications: '',
    churchLogoUrl: '',
    acceptsPreacherTravelReimbursement: false,
  })

  // Load existing church profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/church/profile')
        if (res.ok) {
          const data = await res.json()
          if (data.profile) {
            const p = data.profile
            setFormData({
              churchName: p.churchName || '',
              contactName: p.contactName || '',
              country: p.country || '',
              province: p.province || '',
              city: p.city || '',
              neighborhood: p.neighborhood || '',
              address: p.address || '',
              averageAttendance: p.averageAttendance || '',
              bio: p.bio || '',
              denomination: p.denomination || '',
              serviceTypes: p.serviceTypes || [],
              otherServiceType: p.otherServiceType || '',
              preferredPreacherQualifications: p.preferredPreacherQualifications || '',
              churchLogoUrl: p.churchLogoUrl || '',
              acceptsPreacherTravelReimbursement: p.acceptsPreacherTravelReimbursement || false,
            })
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        // Not a critical error for new users
      }
    }
    loadProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleServiceTypeToggle = (serviceType: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(st => st !== serviceType)
        : [...prev.serviceTypes, serviceType],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/church/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/church-dashboard')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your church profile has been set up successfully. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Church Mode Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
          <p className="text-sm font-semibold text-blue-900">🏛️ CHURCH PROFILE SETUP</p>
          <p className="text-xs text-blue-700 mt-1">Complete your church profile to help preachers find and connect with you</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8">
            Help preachers understand your church's needs and culture
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Church Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                🏛️ Church Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                    Church Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="churchName"
                    name="churchName"
                    type="text"
                    value={formData.churchName}
                    onChange={handleChange}
                    placeholder="Your church name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Your name or pastor's name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        country: e.target.value,
                        province: '',
                        city: '',
                      }))
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.country === 'Canada' ? 'Province' : formData.country === 'United States' ? 'State' : 'Region'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        province: e.target.value,
                        city: '',
                      }))
                    }}
                    disabled={!formData.country}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select {formData.country === 'Canada' ? 'Province' : 'State'}</option>
                    {formData.country && Object.keys(REGIONS[formData.country as keyof typeof REGIONS] || {}).map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.province}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {formData.province && formData.country && 
                      (REGIONS[formData.country as keyof typeof REGIONS]?.[formData.province as keyof any] || []).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood / Area
                  </label>
                  <input
                    id="neighborhood"
                    name="neighborhood"
                    type="text"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="e.g., Downtown, East Side, North Shore"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="averageAttendance" className="block text-sm font-medium text-gray-700 mb-2">
                  Average Sunday Attendance
                </label>
                <input
                  id="averageAttendance"
                  name="averageAttendance"
                  type="text"
                  value={formData.averageAttendance}
                  onChange={handleChange}
                  placeholder="e.g., 50-100, 200-300, 500+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* About Your Church */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                📖 About Your Church
              </h3>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Church Description & Congregation Profile
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Share your church's mission, values, congregation demographics, worship style, and what makes it unique. Help preachers understand your congregation and culture..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length} characters (recommended: 50+ characters)
                </p>
              </div>
            </div>

            {/* Worship & Service Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                🙏 Worship & Service
              </h3>

              <div className="mb-4">
                <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                  Denomination / Affiliation
                </label>
                <select
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                >
                  <option value="">Select denomination...</option>
                  {DENOMINATIONS.map(denom => (
                    <option key={denom} value={denom}>
                      {denom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Types You Look For <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SERVICE_TYPES.map(serviceType => (
                    <label key={serviceType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(serviceType)}
                        onChange={() => handleServiceTypeToggle(serviceType)}
                        className="mr-2 w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-2 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-700">{serviceType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Preacher Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                👤 Preacher Preferences
              </h3>

              <div className="mb-4">
                <label htmlFor="preferredPreacherQualifications" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Preacher Qualifications
                </label>
                <textarea
                  id="preferredPreacherQualifications"
                  name="preferredPreacherQualifications"
                  value={formData.preferredPreacherQualifications}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Experienced with youth ministry, background in biblical counseling, multilingual, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptsPreacherTravelReimbursement"
                  checked={formData.acceptsPreacherTravelReimbursement}
                  onChange={handleChange}
                  className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-2 focus:ring-lime-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Your church is willing to reimburse travel expenses for visiting preachers
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || formData.serviceTypes.length === 0 || !formData.churchName || !formData.contactName || !formData.country || !formData.province || !formData.city}
                className="w-full bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                You can update this information anytime from your profile settings
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
