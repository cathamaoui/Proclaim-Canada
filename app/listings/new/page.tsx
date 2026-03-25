'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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

// Service Type Categories - searchable options
const SERVICE_TYPE_OPTIONS = {
  'Regular/Weekly Services': [
    { label: 'Midweek Service / Bible Study', value: 'SERMON' },
    { label: 'Sunday Evening Service', value: 'SERMON' },
    { label: 'Sunday Morning Service', value: 'SERMON' },
  ],
  'Special Events': [
    { label: 'Special Service (Holiday, Anniversary, etc.)', value: 'SPECIAL_SERVICE' },
    { label: 'Community Event / Festival', value: 'SPECIAL_SERVICE' },
    { label: 'Holiday Special Service', value: 'SPECIAL_SERVICE' },
  ],
  'Evangelism & Revival': [
    { label: 'Evangelistic Crusade / Rally', value: 'REVIVAL' },
    { label: 'Revival Meetings (Multi-day)', value: 'REVIVAL' },
    { label: 'Seeker-Sensitive / Guest Sunday', value: 'REVIVAL' },
  ],
  'Training & Workshops': [
    { label: 'Evangelism Workshop / Seminar', value: 'WORKSHOP' },
    { label: 'Leadership Development', value: 'WORKSHOP' },
    { label: 'VBS / Family Night Keynote', value: 'WORKSHOP' },
  ],
  'Targeted Ministry': [
    { label: 'Campus / University Outreach', value: 'OTHER' },
    { label: 'Men\'s / Women\'s Conference', value: 'OTHER' },
    { label: 'Young Adults Gathering', value: 'OTHER' },
    { label: 'Youth Rally / Youth Retreat', value: 'OTHER' },
  ],
  'Other': [
    { label: 'Other (Please specify)', value: 'OTHER' },
  ],
}

export default function NewListingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [choicesInstance, setChoicesInstance] = useState<any>(null)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [formData, setFormData] = useState({
    // Church Identity
    churchName: '',
    contactName: '',
    contactEmailUsername: '',
    contactEmailExtension: '@gmail.com',
    contactPhone: '',
    denomination: '',
    congregationProfile: '',
    avgAttendance: '',
    address: '',
    city: '',
    province: '',
    country: 'Canada',
    customCountry: '',
    postalCode: '',
    neighborhood: '',

    // Service Position/Details
    title: '',
    description: '',

    // Theological & Liturgical
    statementOfFaithUrl: '',
    preferredBibleTranslation: '',
    preachingStyleSought: '',
    dresscode: '',

    // Service Logistics
    date: '',
    time: '',
    arrivalTime: '',
    sermonLength: '',
    additionalDuties: '',
    technologyAvailable: '',
    technologyRequired: '',

    // Compensation
    honorarium: '',
    mileageReimbursement: '',
    travelLodging: '',
    meals: '',

    // Requirements
    necessaryDocuments: '',
    backgroundCheckRequired: 'no',
    compensation: '',
  })

  // Initialize Choices.js for searchable dropdown
  useEffect(() => {
    // Check subscription status first
    const checkSubscription = async () => {
      setCheckingSubscription(true)
      try {
        const response = await fetch('/api/subscription/check')
        const data = await response.json()
        
        console.log('Subscription check response:', { status: response.status, data })

        // If no subscription found, try to create a trial one
        if (!data.hasSubscription) {
          console.log('No subscription found, creating trial...')
          try {
            const createTrialResponse = await fetch('/api/subscription/create-trial', { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            })
            const trialData = await createTrialResponse.json()
            
            console.log('Create trial response:', { status: createTrialResponse.status, data: trialData })
            
            if (!createTrialResponse.ok) {
              console.error('Failed to create trial subscription:', trialData)
              // Don't redirect immediately, let them continue - they might have an active subscription
              // that the check just didn't find due to a timing issue
              console.log('Continuing form anyway, user can attempt to submit')
            } else {
              console.log('Trial subscription created successfully')
            }
          } catch (err) {
            console.error('Failed to create trial subscription error:', err)
            // Continue anyway - billing can be checked on form submission
          }
        } else {
          console.log('Church has active subscription')
        }
      } catch (err) {
        console.error('Failed to check subscription:', err)
        // Continue anyway - subscription will be validated on form submission
      } finally {
        setCheckingSubscription(false)
      }
    }

    if (session?.user?.role === 'CHURCH') {
      checkSubscription()
    }
  }, [session, router])

  // Initialize Choices.js for searchable dropdown
  useEffect(() => {
    // Load Choices.js library dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js'
    script.async = true
    script.onload = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css'
      document.head.appendChild(link)

      // Initialize Choices.js on the service type select
      const typeSelect = document.getElementById('type') as HTMLSelectElement
      if (typeSelect) {
        const choices = new (window as any).Choices(typeSelect, {
          searchEnabled: true,
          searchChoices: true,
          shouldSort: false,
          placeholderValue: 'Search service types...',
          noResultsText: 'No service types found',
          noChoicesText: 'No choices available',
        })
        setChoicesInstance(choices)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (choicesInstance) {
        choicesInstance.destroy()
      }
    }
  }, [])

  if (session?.user.role !== 'CHURCH') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">Only churches can post opportunities</p>
            <button
              onClick={() => router.push('/browse')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Checking your subscription...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Build location string from address components
      const country = formData.country === 'Other' ? formData.customCountry : formData.country
      const locationParts = [
        formData.address,
        formData.city,
        formData.province,
        country,
        formData.postalCode,
      ].filter(Boolean)
      const location = locationParts.join(', ')

      const contactEmail = formData.contactEmailUsername + formData.contactEmailExtension

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: 'SERMON',
          date: formData.date ? `${formData.date}${formData.time ? 'T' + formData.time : ''}` : '',
          location: location,
          compensation: formData.honorarium,
          churchName: formData.churchName,
          contactName: formData.contactName,
          contactEmail: contactEmail,
          contactPhone: formData.contactPhone,
          denomination: formData.denomination,
          congregationProfile: formData.congregationProfile,
          avgAttendance: formData.avgAttendance,
          neighborhood: formData.neighborhood,
          statementOfFaithUrl: formData.statementOfFaithUrl,
          preferredBibleTranslation: formData.preferredBibleTranslation,
          preachingStyleSought: formData.preachingStyleSought,
          dresscode: formData.dresscode,
          arrivalTime: formData.arrivalTime,
          sermonLength: formData.sermonLength,
          additionalDuties: formData.additionalDuties,
          technologyAvailable: formData.technologyAvailable,
          technologyRequired: formData.technologyRequired,
          mileageReimbursement: formData.mileageReimbursement,
          travelLodging: formData.travelLodging,
          meals: formData.meals,
          necessaryDocuments: formData.necessaryDocuments,
          backgroundCheckRequired: formData.backgroundCheckRequired,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create listing')
      }

      const listing = await response.json()
      router.push(`/listings/${listing.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post an Opportunity (Church)</h1>
          <p className="text-gray-600 mb-8">Tell preachers about your upcoming service</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: CHURCH IDENTITY */}
            <div className="border-t-4 border-green-600 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                Church Identity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="churchName" className="block text-sm font-medium text-gray-700 mb-2">
                    Church/Organization Name *
                  </label>
                  <input
                    id="churchName"
                    type="text"
                    name="churchName"
                    value={formData.churchName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Grace Community Church"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name (Person Posting)
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="e.g., Pastor John Smith"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                <div className="flex gap-2">
                  <input
                    id="contactEmailUsername"
                    type="text"
                    name="contactEmailUsername"
                    value={formData.contactEmailUsername}
                    onChange={handleChange}
                    required
                    placeholder="e.g., pastor"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                  <select
                    id="contactEmailExtension"
                    name="contactEmailExtension"
                    value={formData.contactEmailExtension}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  >
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@yahoo.com">@yahoo.com</option>
                    <option value="@hotmail.com">@hotmail.com</option>
                    <option value="@outlook.com">@outlook.com</option>
                    <option value="@icloud.com">@icloud.com</option>
                    <option value="@protonmail.com">@protonmail.com</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="e.g., (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="denomination" className="block text-sm font-medium text-gray-700 mb-2">
                    Denomination
                  </label>
                  <select
                    id="denomination"
                    name="denomination"
                    value={formData.denomination}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                  >
                    <option value="">Select a denomination...</option>
                    <option value="Roman Catholic">Roman Catholic</option>
                    <option value="Baptist">Baptist</option>
                    <option value="Pentecostal">Pentecostal / Assemblies of God</option>
                    <option value="Methodist">Methodist / United Methodist</option>
                    <option value="Presbyterian">Presbyterian</option>
                    <option value="Anglican">Anglican / Episcopal</option>
                    <option value="Lutheran">Lutheran</option>
                    <option value="Evangelical">Evangelical</option>
                    <option value="Mennonite">Mennonite</option>
                    <option value="Christian and Missionary Alliance">Christian and Missionary Alliance</option>
                    <option value="Seventh-day Adventist">Seventh-day Adventist</option>
                    <option value="Nazarene">Church of the Nazarene</option>
                    <option value="Foursquare">Foursquare</option>
                    <option value="Wesleyan">Wesleyan</option>
                    <option value="Open Bible">Open Bible</option>
                    <option value="Orthodox">Orthodox</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="congregationProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  Congregation Profile
                </label>
                <textarea
                  id="congregationProfile"
                  name="congregationProfile"
                  value={formData.congregationProfile}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your congregation: demographics, spiritual maturity level, worship style, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="avgAttendance" className="block text-sm font-medium text-gray-700 mb-2">
                    Average Attendance
                  </label>
                  <input
                    id="avgAttendance"
                    type="number"
                    name="avgAttendance"
                    value={formData.avgAttendance}
                    onChange={handleChange}
                    placeholder="e.g., 250"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Neighborhood/Area
                  </label>
                  <input
                    id="neighborhood"
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    placeholder="e.g., Downtown, Suburban, Rural"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Main Street"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="Canada">Canada</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province/State *
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    disabled={!formData.country || formData.country === 'Other'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Province/State --</option>
                    {formData.country && formData.country !== 'Other' && REGIONS[formData.country as keyof typeof REGIONS] && 
                      Object.keys(REGIONS[formData.country as keyof typeof REGIONS]).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={!formData.province}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select City --</option>
                    {formData.country && formData.province && REGIONS[formData.country as keyof typeof REGIONS]?.[formData.province as keyof typeof REGIONS[keyof typeof REGIONS]] &&
                      REGIONS[formData.country as keyof typeof REGIONS][formData.province as keyof typeof REGIONS[keyof typeof REGIONS]].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code/Zip Code *
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder={formData.country === 'Canada' ? 'M5V 3A8' : formData.country === 'United States' ? '90210' : 'Postal Code'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {formData.country === 'Other' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                  <label htmlFor="customCountry" className="block text-sm font-medium text-gray-700 mb-2">
                    Please Specify Country/Region *
                  </label>
                  <input
                    id="customCountry"
                    type="text"
                    name="customCountry"
                    value={formData.customCountry}
                    onChange={handleChange}
                    required
                    placeholder="Enter country or region"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}
            </div>

            {/* SECTION 2: SERVICE POSITION & DESCRIPTION */}
            <div className="border-t-4 border-green-600 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                Position & Description
              </h3>

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Position / Service Title *
                </label>
                <select
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">-- Select a position/service type --</option>
                  {Object.entries(SERVICE_TYPE_OPTIONS).map(([category, options]) => (
                    <optgroup key={category} label={category}>
                      {options.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-1">Select the position or service type you need filled</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description / Details *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Describe the service, expectations, denomination, themes, audience, and any other details preachers should know..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* SECTION 3: THEOLOGICAL & LITURGICAL STANDARDS */}
            <div className="border-t-4 border-green-600 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                Theological & Liturgical Standards
              </h3>

              <div className="mb-4">
                <label htmlFor="statementOfFaithUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Statement of Faith (URL)
                </label>
                <input
                  id="statementOfFaithUrl"
                  type="url"
                  name="statementOfFaithUrl"
                  value={formData.statementOfFaithUrl}
                  onChange={handleChange}
                  placeholder="https://yourchurch.com/beliefs"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <p className="text-sm text-gray-600 mt-1">Link to your church's statement of faith or doctrinal position</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredBibleTranslation" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Bible Translation
                  </label>
                  <input
                    id="preferredBibleTranslation"
                    type="text"
                    name="preferredBibleTranslation"
                    value={formData.preferredBibleTranslation}
                    onChange={handleChange}
                    placeholder="e.g., KJV, NKJV, ESV, CSB, NIV"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="dresscode" className="block text-sm font-medium text-gray-700 mb-2">
                    Dress Code / Attire Expectations
                  </label>
                  <input
                    id="dresscode"
                    type="text"
                    name="dresscode"
                    value={formData.dresscode}
                    onChange={handleChange}
                    placeholder="e.g., Formal suit, Business casual, Casual"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="preachingStyleSought" className="block text-sm font-medium text-gray-700 mb-2">
                  Preaching Style Sought
                </label>
                <textarea
                  id="preachingStyleSought"
                  name="preachingStyleSought"
                  value={formData.preachingStyleSought}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Expository, Topical, Narrative, Highly interactive, Traditional, Contemporary"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>

            {/* SECTION 4: SERVICE LOGISTICS */}
            <div className="border-t-4 border-green-600 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                Service Logistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Date *
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Arrival Time
                  </label>
                  <input
                    id="arrivalTime"
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div className="col-span-1">
                  <label htmlFor="sermonLength" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Sermon Length (hours/minutes)
                  </label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hours</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white h-10">
                          <button
                            type="button"
                            onClick={() => {
                              const hours = Math.floor((parseInt(formData.sermonLength) || 0) / 60)
                              const minutes = (parseInt(formData.sermonLength) || 0) % 60
                              const newHours = Math.max(0, hours - 1)
                              setFormData({ ...formData, sermonLength: (newHours * 60 + minutes).toString() })
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl leading-none"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={Math.floor((parseInt(formData.sermonLength) || 0) / 60)}
                            onChange={(e) => {
                              const hours = Math.max(0, parseInt(e.target.value) || 0)
                              const minutes = (parseInt(formData.sermonLength) || 0) % 60
                              setFormData({ ...formData, sermonLength: (hours * 60 + minutes).toString() })
                            }}
                            className="flex-1 px-2 py-1 text-center border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 bg-white font-semibold text-gray-800 w-16"
                            min="0"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const hours = Math.floor((parseInt(formData.sermonLength) || 0) / 60)
                              const minutes = (parseInt(formData.sermonLength) || 0) % 60
                              const newHours = hours + 1
                              setFormData({ ...formData, sermonLength: (newHours * 60 + minutes).toString() })
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Minutes</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white h-10">
                          <button
                            type="button"
                            onClick={() => {
                              const totalMinutes = parseInt(formData.sermonLength) || 0
                              const minutes = totalMinutes % 60
                              const newMinutes = Math.max(0, minutes - 5)
                              const hours = Math.floor(totalMinutes / 60)
                              setFormData({ ...formData, sermonLength: (hours * 60 + newMinutes).toString() })
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl leading-none"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={(parseInt(formData.sermonLength) || 0) % 60}
                            onChange={(e) => {
                              const minutes = Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
                              const hours = Math.floor((parseInt(formData.sermonLength) || 0) / 60)
                              setFormData({ ...formData, sermonLength: (hours * 60 + minutes).toString() })
                            }}
                            className="flex-1 px-2 py-1 text-center border-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 bg-white font-semibold text-gray-800 w-16"
                            min="0"
                            max="59"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const totalMinutes = parseInt(formData.sermonLength) || 0
                              const minutes = totalMinutes % 60
                              const newMinutes = Math.min(59, minutes + 5)
                              const hours = Math.floor(totalMinutes / 60)
                              setFormData({ ...formData, sermonLength: (hours * 60 + newMinutes).toString() })
                            }}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl leading-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm font-semibold text-blue-800">
                      <span className="text-blue-600">Total:</span> {Math.floor((parseInt(formData.sermonLength) || 0) / 60)}h {(parseInt(formData.sermonLength) || 0) % 60}m
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="additionalDuties" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Duties or Responsibilities
                </label>
                <textarea
                  id="additionalDuties"
                  name="additionalDuties"
                  value={formData.additionalDuties}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Lead worship, Conduct baptism, Visit hospital patients, Teach Sunday school class"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="technologyAvailable" className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Available (for preacher use)
                  </label>
                  <textarea
                    id="technologyAvailable"
                    name="technologyAvailable"
                    value={formData.technologyAvailable}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Projection system, Wireless microphone, Zoom broadcast capabilities"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label htmlFor="technologyRequired" className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Required from Preacher
                  </label>
                  <textarea
                    id="technologyRequired"
                    name="technologyRequired"
                    value={formData.technologyRequired}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Must have own slides, Livestreaming capability required"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: COMPENSATION & HOSPITALITY */}
            <div className="border-t-4 border-green-600 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
                Compensation & Hospitality
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="honorarium" className="block text-sm font-medium text-gray-700 mb-2">
                    Honorarium / Payment
                  </label>
                  <select
                    id="honorarium-type"
                    value={
                      formData.honorarium === 'Opportunity for Kingdom Building (No Honorarium)' 
                        ? 'Opportunity for Kingdom Building (No Honorarium)' 
                        : (formData.honorarium && !isNaN(formData.honorarium)) 
                          ? 'set-amount' 
                          : ''
                    }
                    onChange={(e) => {
                      if (e.target.value === 'set-amount') {
                        setFormData({ ...formData, honorarium: '0' })
                      } else {
                        setFormData({ ...formData, honorarium: e.target.value })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">-- Select Option --</option>
                    <option value="set-amount">Set Amount ($)</option>
                    <option value="Opportunity for Kingdom Building (No Honorarium)">Opportunity for Kingdom Building (No Honorarium)</option>
                  </select>
                  
                  {(formData.honorarium === 'set-amount' || (formData.honorarium && !isNaN(formData.honorarium) && formData.honorarium !== 'Opportunity for Kingdom Building (No Honorarium)')) && (
                    <div className="relative flex items-center mt-3">
                      <span className="absolute left-4 text-gray-600 font-semibold text-lg">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="10"
                        value={formData.honorarium && !isNaN(formData.honorarium) ? formData.honorarium : ''}
                        onChange={(e) => {
                          setFormData({ ...formData, honorarium: e.target.value })
                        }}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="mileageReimbursement-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage Reimbursement
                  </label>
                  <select
                    id="mileageReimbursement-type"
                    value={
                      formData.mileageReimbursement === 'none' || formData.mileageReimbursement === ''
                        ? ''
                        : (formData.mileageReimbursement && !isNaN(parseFloat(formData.mileageReimbursement)) && !formData.mileageReimbursement.includes('/'))
                          ? 'set-amount'
                          : (formData.mileageReimbursement && formData.mileageReimbursement.includes('/'))
                            ? 'per-distance'
                            : ''
                    }
                    onChange={(e) => {
                      if (e.target.value === 'set-amount') {
                        setFormData({ ...formData, mileageReimbursement: '0.00' })
                      } else if (e.target.value === 'per-distance') {
                        setFormData({ ...formData, mileageReimbursement: '0.00/km' })
                      } else {
                        setFormData({ ...formData, mileageReimbursement: '' })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">-- Select Option --</option>
                    <option value="set-amount">Set Amount ($)</option>
                    <option value="per-distance">Cost per Distance</option>
                  </select>
                  
                  {formData.mileageReimbursement !== 'none' && (formData.mileageReimbursement === 'set-amount' || (formData.mileageReimbursement && !formData.mileageReimbursement.includes('/'))) && (
                    <div className="relative flex items-center mt-3">
                      <span className="absolute left-4 text-gray-600 font-semibold text-lg">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="10"
                        value={formData.mileageReimbursement && !formData.mileageReimbursement.includes('/') ? formData.mileageReimbursement : ''}
                        onChange={(e) => {
                          const value = e.target.value || '0.00'
                          setFormData({ ...formData, mileageReimbursement: parseFloat(value).toFixed(2) })
                        }}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  )}

                  {(formData.mileageReimbursement === 'per-distance' || (formData.mileageReimbursement && formData.mileageReimbursement.includes('/'))) && (
                    <div className="space-y-3 mt-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 relative flex items-center">
                          <span className="absolute left-4 text-gray-600 font-semibold">$</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            value={
                              formData.mileageReimbursement && formData.mileageReimbursement.includes('/')
                                ? formData.mileageReimbursement.split('/')[0]
                                : ''
                            }
                            onChange={(e) => {
                              const distance = formData.mileageReimbursement?.split('/')[1] || 'km'
                              const amount = e.target.value || '0.00'
                              setFormData({ ...formData, mileageReimbursement: `${parseFloat(amount).toFixed(2)}/${distance}` })
                            }}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          />
                        </div>
                        <select
                          value={
                            formData.mileageReimbursement && formData.mileageReimbursement.includes('/')
                              ? formData.mileageReimbursement.split('/')[1]
                              : 'km'
                          }
                          onChange={(e) => {
                            const amount = formData.mileageReimbursement?.split('/')[0] || '0.00'
                            setFormData({ ...formData, mileageReimbursement: `${amount}/${e.target.value}` })
                          }}
                          className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                        >
                          <option value="km">per km</option>
                          <option value="mi">per mi</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="travelLodging" className="block text-sm font-medium text-gray-700 mb-2">
                    Travel & Lodging Coverage
                  </label>
                  <textarea
                    id="travelLodging"
                    name="travelLodging"
                    value={formData.travelLodging}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Flight covered, Hotel provided, Preacher arranges own travel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label htmlFor="meals" className="block text-sm font-medium text-gray-700 mb-2">
                    Meals Provided
                  </label>
                  <textarea
                    id="meals"
                    name="meals"
                    value={formData.meals}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Breakfast and lunch, Dinner at pastor's home, None provided"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: APPLICANT REQUIREMENTS */}
            <div className="border-t-4 border-green-600 pt-6 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">6</span>
                Applicant Requirements
              </h3>

              <div className="mb-4">
                <label htmlFor="necessaryDocuments" className="block text-sm font-medium text-gray-700 mb-2">
                  Necessary Documents / Certifications
                </label>
                <textarea
                  id="necessaryDocuments"
                  name="necessaryDocuments"
                  value={formData.necessaryDocuments}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g., Ordination certificate, Theological education documentation, References from previous churches"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label htmlFor="backgroundCheckRequired" className="block text-sm font-medium text-gray-700 mb-2">
                  Background Check Required
                </label>
                <select
                  id="backgroundCheckRequired"
                  name="backgroundCheckRequired"
                  value={formData.backgroundCheckRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">-- Select --</option>
                  <option value="Yes">Yes - Criminal record check required</option>
                  <option value="No">No - Background check not required</option>
                  <option value="Preferred">Preferred - Not required but appreciated</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold text-lg"
              >
                {loading ? 'Creating...' : 'Post Opportunity'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
