'use client'

import Link from 'next/link'
import { useState } from 'react'

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

export default function Home() {
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')

  const regions = country ? Object.keys(REGIONS[country as keyof typeof REGIONS] || {}) : []
  const cities = country && region ? REGIONS[country as keyof typeof REGIONS]?.[region as keyof typeof REGIONS[keyof typeof REGIONS]] || [] : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Build search query
    const params = new URLSearchParams()
    if (country) params.append('country', country)
    if (region) params.append('region', region)
    if (city) params.append('city', city)
    window.location.href = `/browse/preachers?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{filter: 'drop-shadow(0 0 6px rgba(132,204,22,0.7)) drop-shadow(0 0 12px rgba(132,204,22,0.4))'}}>
                  {/* Megaphone body */}
                  <path d="M25 35 L55 20 L55 70 L25 55 Z" fill="#84CC16"/>
                  {/* Megaphone bell */}
                  <path d="M55 15 Q80 10 85 5 L85 85 Q80 80 55 75 Z" fill="#84CC16"/>
                  {/* Megaphone handle */}
                  <rect x="15" y="38" width="12" height="14" rx="3" fill="#65A30D"/>
                  {/* Cross on megaphone */}
                  <rect x="66" y="28" width="5" height="34" rx="1" fill="#FFFFFF"/>
                  <rect x="56" y="40" width="25" height="5" rx="1" fill="#FFFFFF"/>
                  {/* Sound waves */}
                  <path d="M88 30 Q95 45 88 60" stroke="#84CC16" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M93 22 Q102 45 93 68" stroke="#84CC16" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                </svg>
                <span className="text-white">Proclaim </span>
                <span className="text-lime-500">Canada</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/browse/preachers" className="text-white text-sm hover:text-lime-400 transition">Find Evangelists</Link>
              <Link href="/listings" className="text-white text-sm hover:text-lime-400 transition">Browse Opportunities</Link>
              <a href="#how-it-works" className="text-white text-sm hover:text-lime-400 transition">How It Works</a>
            </div>

            {/* Right Side - Buttons & Icons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/profiles" 
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3 py-1.5 rounded font-semibold transition text-xs"
              >
                Admin
              </Link>
              <Link 
                href="/dashboard" 
                className="bg-lime-500 hover:bg-lime-600 text-slate-900 px-3 py-1.5 rounded font-semibold transition text-sm"
              >
                Church Home
              </Link>
              <Link 
                href="/listings/pricing" 
                className="text-white hover:text-lime-400 transition text-sm"
              >
                Post Opportunity
              </Link>
              <Link href="/auth/login" className="text-white hover:text-lime-400 transition" title="Sign In">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/cart" className="text-white hover:text-lime-400 transition relative" title="Cart">
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
        className="relative py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(51,65,85);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(30,41,59);stop-opacity:1" /></linearGradient></defs><rect width="1200" height="600" fill="url(%23grad)"/><path d="M 200 400 L 200 100 L 250 150 L 300 100 L 300 400 Z" fill="rgba(255,255,255,0.1)" opacity="0.5"/></svg>\')',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-12">
            Where Is God Calling You?
          </h1>

          {/* Search Section */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-6 mb-8">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                Search Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-lime-500 to-lime-600 text-white py-20">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Share Your Calling?</h2>
          <p className="text-lg md:text-xl mb-8 text-lime-100">Whether you're an evangelist, preacher, or worship leader, let us help you reach the churches that need you.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup?type=preacher" className="bg-white hover:bg-gray-100 text-lime-600 px-8 py-4 rounded-lg font-bold transition text-lg">
              Join as Evangelist
            </Link>
            <Link href="/auth/signup?type=church" className="border-2 border-white text-white hover:bg-white hover:text-lime-600 px-8 py-4 rounded-lg font-bold transition text-lg">
              Join as Church
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Build Your Calendar</h3>
              <p className="text-gray-600">Evangelists share availability and service preferences</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Find & Connect</h3>
              <p className="text-gray-600">Churches search and connect with available speakers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Confirm & Serve</h3>
              <p className="text-gray-600">Complete details and prepare for the service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">Proclaim Canada</h3>
              <p className="text-sm">Connecting evangelists with churches nationwide</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/browse/preachers" className="hover:text-lime-400">Browse</Link></li>
                <li><Link href="/listings/new" className="hover:text-lime-400">Post Job</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-lime-400">About</a></li>
                <li><a href="#" className="hover:text-lime-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-lime-400">Privacy</a></li>
                <li><a href="#" className="hover:text-lime-400">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 Proclaim Canada. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
