/**
 * Seed script for 10 fully loaded church profiles with opportunities
 * Run with: node scripts/seed-churches.js
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// 10 Canadian and US churches with full profiles
const CHURCHES = [
  {
    name: 'Grace Community Church',
    email: 'church-grace-community@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Grace Community Church',
      organizationName: 'Grace Community Church of Toronto',
      denomination: 'Non-Denominational',
      specifyAffiliation: 'Evangelical',
      country: 'Canada',
      street: '1234 Bloor Street West',
      address: '1234 Bloor Street West',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M6H 1N1',
      phone: '(416) 555-0101',
      website: 'https://gracecommunity.ca',
      averageAttendance: '500-1000',
      founded: 1985,
      bio: 'Grace Community Church is a vibrant, multi-generational congregation in the heart of Toronto. We are committed to biblical teaching, authentic worship, and serving our community with the love of Christ. Our diverse congregation reflects the multicultural fabric of Toronto.',
      verified: true,
    },
    listings: [
      {
        title: 'Guest Preacher for Sunday Morning Service',
        description: 'We are seeking a dynamic guest preacher for our Sunday morning service. Looking for someone who can deliver a powerful, biblically-grounded message that connects with all age groups. Our congregation is diverse and appreciates both traditional and contemporary preaching styles.',
        type: 'SERMON',
        date: new Date('2026-04-15'),
        location: 'Toronto, Ontario',
        compensation: '$500 honorarium + travel',
        status: 'OPEN',
        churchName: 'Grace Community Church',
        contactName: 'Pastor Michael Chen',
        avgAttendance: 750,
        neighborhood: 'West End Toronto',
        sermonLength: 35,
        dresscode: 'Business casual',
        honorarium: '$500',
        mileageReimbursement: '$0.65/km',
      },
      {
        title: 'Revival Speaker - 3-Night Series',
        description: 'Grace Community Church is hosting a 3-night revival series and we need a passionate speaker who can ignite our congregation. Theme: "Awakening - Renewal in the Spirit". Must be comfortable with extended altar calls and prayer ministry.',
        type: 'REVIVAL',
        date: new Date('2026-05-10'),
        location: 'Toronto, Ontario',
        compensation: '$1,500 + accommodation',
        status: 'OPEN',
        churchName: 'Grace Community Church',
        contactName: 'Pastor Michael Chen',
        avgAttendance: 750,
        sermonLength: 45,
        honorarium: '$1,500',
        travelLodging: 'Hotel accommodations provided for 4 nights',
        meals: 'All meals provided',
      },
    ],
  },
  {
    name: 'First Baptist Church Calgary',
    email: 'church-first-baptist-calgary@test.com',
    password: 'church2026',
    profile: {
      churchName: 'First Baptist Church Calgary',
      organizationName: 'First Baptist Church of Calgary',
      denomination: 'Baptist',
      specifyAffiliation: 'Southern Baptist Convention',
      country: 'Canada',
      street: '456 Centre Street NW',
      address: '456 Centre Street NW',
      city: 'Calgary',
      province: 'Alberta',
      postalCode: 'T2E 2P5',
      phone: '(403) 555-0202',
      website: 'https://firstbaptistcalgary.ca',
      averageAttendance: '300-500',
      founded: 1912,
      bio: 'First Baptist Church Calgary has been serving the Calgary community for over 110 years. We hold firmly to Baptist distinctives while embracing contemporary worship. Our church family is known for our strong missions program and commitment to expository preaching.',
      verified: true,
    },
    listings: [
      {
        title: 'Summer Vacation Coverage - Lead Pastor',
        description: 'We need an experienced pastor to cover our lead pastor\'s summer vacation for 3 consecutive Sundays. Must be comfortable with Baptist theology and traditions. Full sermon preparation and hospital visitation duties included.',
        type: 'SERMON',
        date: new Date('2026-07-05'),
        location: 'Calgary, Alberta',
        compensation: '$1,200 (3 weeks)',
        status: 'OPEN',
        churchName: 'First Baptist Church Calgary',
        contactName: 'Deacon Robert Williams',
        avgAttendance: 400,
        sermonLength: 40,
        dresscode: 'Suit and tie',
        honorarium: '$400 per Sunday',
        additionalDuties: 'Hospital visitation on Wednesdays, available for emergency pastoral calls',
      },
    ],
  },
  {
    name: 'Living Hope Church',
    email: 'church-living-hope@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Living Hope Church',
      organizationName: 'Living Hope Church Vancouver',
      denomination: 'Pentecostal',
      specifyAffiliation: 'Pentecostal Assemblies of Canada',
      country: 'Canada',
      street: '789 Granville Street',
      address: '789 Granville Street',
      city: 'Vancouver',
      province: 'British Columbia',
      postalCode: 'V6Z 1K3',
      phone: '(604) 555-0303',
      website: 'https://livinghopechurch.ca',
      averageAttendance: '1000+',
      founded: 1995,
      bio: 'Living Hope Church is a Spirit-filled congregation passionate about worship, the gifts of the Spirit, and reaching the lost. Our services feature powerful praise and worship, and we believe in the present-day ministry of the Holy Spirit.',
      verified: true,
    },
    listings: [
      {
        title: 'Worship Night Speaker',
        description: 'Looking for a Spirit-filled speaker for our monthly worship night. This is an evening service focused on extended worship and prophetic ministry. Speaker should be comfortable with flowing in the gifts of the Spirit.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-04-25'),
        location: 'Vancouver, British Columbia',
        compensation: '$400 + travel',
        status: 'OPEN',
        churchName: 'Living Hope Church',
        contactName: 'Pastor Sarah Johnson',
        avgAttendance: 1200,
        sermonLength: 30,
        honorarium: '$400',
        mileageReimbursement: 'Full travel reimbursement',
      },
      {
        title: 'Youth Conference Speaker',
        description: 'We need an energetic, relevant speaker for our annual youth conference. Theme: "Unshakeable Faith". 3 main sessions plus 2 breakout workshops. Must connect with teens and young adults (ages 13-25).',
        type: 'WORKSHOP',
        date: new Date('2026-06-20'),
        location: 'Vancouver, British Columbia',
        compensation: '$2,000 + accommodation',
        status: 'OPEN',
        churchName: 'Living Hope Church',
        contactName: 'Youth Pastor David Kim',
        avgAttendance: 400,
        sermonLength: 45,
        honorarium: '$2,000',
        travelLodging: 'Hotel for 3 nights provided',
        meals: 'All meals included',
      },
    ],
  },
  {
    name: 'Cornerstone Baptist Church',
    email: 'church-cornerstone-baptist@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Cornerstone Baptist Church',
      organizationName: 'Cornerstone Baptist Church of Atlanta',
      denomination: 'Baptist',
      specifyAffiliation: 'Southern Baptist Convention',
      country: 'United States',
      street: '500 Peachtree Street NE',
      address: '500 Peachtree Street NE',
      city: 'Atlanta',
      province: 'Georgia',
      postalCode: '30308',
      phone: '(404) 555-0404',
      website: 'https://cornerstonebaptist.org',
      averageAttendance: '2000+',
      founded: 1960,
      bio: 'Cornerstone Baptist Church is one of Atlanta\'s largest and most vibrant congregations. We are committed to verse-by-verse expository preaching, robust theological education, and global missions. Our church operates a K-12 Christian school and seminary.',
      verified: true,
    },
    listings: [
      {
        title: 'Men\'s Conference Keynote Speaker',
        description: 'Annual Men\'s Conference seeking a powerful keynote speaker. Theme: "Men of Valor - Leading with Courage". Saturday event with 2 main sessions. 800+ men expected. Looking for someone who can challenge and equip men to be godly leaders.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-09-12'),
        location: 'Atlanta, Georgia',
        compensation: '$3,000 + travel & accommodation',
        status: 'OPEN',
        churchName: 'Cornerstone Baptist Church',
        contactName: 'Men\'s Ministry Director Tom Anderson',
        avgAttendance: 800,
        sermonLength: 50,
        honorarium: '$3,000',
        travelLodging: 'First class travel and 5-star hotel',
        meals: 'All meals provided',
      },
    ],
  },
  {
    name: 'Redeemer Presbyterian Church',
    email: 'church-redeemer-presbyterian@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Redeemer Presbyterian Church',
      organizationName: 'Redeemer Presbyterian Church of Montreal',
      denomination: 'Presbyterian',
      specifyAffiliation: 'Presbyterian Church in Canada',
      country: 'Canada',
      street: '321 Rue Sherbrooke Ouest',
      address: '321 Rue Sherbrooke Ouest',
      city: 'Montreal',
      province: 'Quebec',
      postalCode: 'H2X 1E3',
      phone: '(514) 555-0505',
      website: 'https://redeemerchurch.ca',
      averageAttendance: '200-300',
      founded: 1875,
      bio: 'Redeemer Presbyterian Church is a historic congregation in downtown Montreal. We hold to Reformed theology and the Westminster Standards. Our services feature traditional hymns, liturgical elements, and thoughtful, scholarly preaching.',
      verified: true,
    },
    listings: [
      {
        title: 'Bilingual Preacher Needed (English/French)',
        description: 'We serve a bilingual congregation and need a preacher comfortable delivering a sermon in both English and French. Service includes liturgical elements. Reformed theology required.',
        type: 'SERMON',
        date: new Date('2026-05-03'),
        location: 'Montreal, Quebec',
        compensation: '$600 honorarium',
        status: 'OPEN',
        churchName: 'Redeemer Presbyterian Church',
        contactName: 'Session Clerk Dr. Jean-Pierre Tremblay',
        avgAttendance: 250,
        sermonLength: 30,
        dresscode: 'Geneva gown preferred',
        honorarium: '$600',
        preferredBibleTranslation: 'ESV or LSG (French)',
      },
    ],
  },
  {
    name: 'New Life Community Church',
    email: 'church-new-life-community@test.com',
    password: 'church2026',
    profile: {
      churchName: 'New Life Community Church',
      organizationName: 'New Life Community Church Dallas',
      denomination: 'Non-Denominational',
      specifyAffiliation: 'Evangelical',
      country: 'United States',
      street: '1500 Commerce Street',
      address: '1500 Commerce Street',
      city: 'Dallas',
      province: 'Texas',
      postalCode: '75201',
      phone: '(214) 555-0606',
      website: 'https://newlifedallas.org',
      averageAttendance: '3000+',
      founded: 2005,
      bio: 'New Life Community Church is a fast-growing, multicultural megachurch in downtown Dallas. We feature contemporary worship, practical biblical teaching, and extensive community outreach programs. Multiple services and campuses.',
      verified: true,
    },
    listings: [
      {
        title: 'Campus Pastor - Guest Speaker',
        description: 'Our North Campus needs a guest speaker while our campus pastor is on sabbatical. 4 consecutive Sundays. Contemporary service with full band. Practical, application-focused preaching preferred.',
        type: 'SERMON',
        date: new Date('2026-08-02'),
        location: 'Dallas, Texas',
        compensation: '$2,000 (4 weeks)',
        status: 'OPEN',
        churchName: 'New Life Community Church - North Campus',
        contactName: 'Executive Pastor Maria Rodriguez',
        avgAttendance: 1500,
        sermonLength: 35,
        dresscode: 'Casual (jeans acceptable)',
        honorarium: '$500 per Sunday',
        technologyAvailable: 'Full production team, confidence monitors, in-ear monitors available',
      },
      {
        title: 'Christmas Eve Service Speaker',
        description: 'Special Christmas Eve candlelight service. Looking for a speaker who can deliver a powerful yet accessible gospel message to a mixed audience including many unchurched visitors. Family-friendly.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-12-24'),
        location: 'Dallas, Texas',
        compensation: '$800',
        status: 'OPEN',
        churchName: 'New Life Community Church',
        contactName: 'Executive Pastor Maria Rodriguez',
        avgAttendance: 5000,
        sermonLength: 25,
        honorarium: '$800',
      },
    ],
  },
  {
    name: 'Emmanuel Anglican Church',
    email: 'church-emmanuel-anglican@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Emmanuel Anglican Church',
      organizationName: 'Emmanuel Anglican Church Ottawa',
      denomination: 'Anglican',
      specifyAffiliation: 'Anglican Church of Canada',
      country: 'Canada',
      street: '150 Somerset Street West',
      address: '150 Somerset Street West',
      city: 'Ottawa',
      province: 'Ontario',
      postalCode: 'K2P 0J2',
      phone: '(613) 555-0707',
      website: 'https://emmanuelottawa.ca',
      averageAttendance: '150-200',
      founded: 1867,
      bio: 'Emmanuel Anglican Church is a historic parish in Canada\'s capital. We follow the Book of Common Prayer and cherish our Anglican heritage while seeking to be a warm, welcoming community. Our beautiful stone church features stunning stained glass windows.',
      verified: true,
    },
    listings: [
      {
        title: 'Lenten Series Preacher',
        description: 'We seek a preacher for our Wednesday evening Lenten series (5 weeks). Services include Evening Prayer with homily. Must be comfortable with Anglican liturgy and traditions.',
        type: 'SERMON',
        date: new Date('2026-02-25'),
        location: 'Ottawa, Ontario',
        compensation: '$250 per service',
        status: 'OPEN',
        churchName: 'Emmanuel Anglican Church',
        contactName: 'Rev. Canon Elizabeth Wright',
        avgAttendance: 75,
        sermonLength: 15,
        dresscode: 'Cassock and surplice provided',
        honorarium: '$1,250 total (5 services)',
        preferredBibleTranslation: 'NRSV or KJV',
      },
    ],
  },
  {
    name: 'Harvest Church International',
    email: 'church-harvest-international@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Harvest Church International',
      organizationName: 'Harvest Church International Ministries',
      denomination: 'Charismatic',
      specifyAffiliation: 'Independent Charismatic',
      country: 'United States',
      street: '2000 Sunrise Boulevard',
      address: '2000 Sunrise Boulevard',
      city: 'Orlando',
      province: 'Florida',
      postalCode: '32801',
      phone: '(407) 555-0808',
      website: 'https://harvestchurch.org',
      averageAttendance: '5000+',
      founded: 1998,
      bio: 'Harvest Church International is a dynamic, Spirit-led megachurch with a global reach. We believe in the full gospel including divine healing, prophecy, and miracles. Our television ministry reaches millions weekly.',
      verified: true,
    },
    listings: [
      {
        title: 'Healing & Miracles Conference Speaker',
        description: 'Annual healing conference needs speakers with demonstrated healing ministry. 3-day event with multiple services. Must have active healing ministry and biblical theology on divine healing.',
        type: 'REVIVAL',
        date: new Date('2026-10-15'),
        location: 'Orlando, Florida',
        compensation: '$5,000 + first class travel',
        status: 'OPEN',
        churchName: 'Harvest Church International',
        contactName: 'Bishop James Thompson',
        avgAttendance: 8000,
        sermonLength: 60,
        honorarium: '$5,000',
        travelLodging: 'First class airfare, 5-star resort accommodations',
        meals: 'All meals and hospitality provided',
      },
    ],
  },
  {
    name: 'Trinity United Methodist',
    email: 'church-trinity-methodist@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Trinity United Methodist Church',
      organizationName: 'Trinity United Methodist Church Chicago',
      denomination: 'Methodist',
      specifyAffiliation: 'United Methodist Church',
      country: 'United States',
      street: '1875 Michigan Avenue',
      address: '1875 Michigan Avenue',
      city: 'Chicago',
      province: 'Illinois',
      postalCode: '60616',
      phone: '(312) 555-0909',
      website: 'https://trinityumc.org',
      averageAttendance: '400-600',
      founded: 1901,
      bio: 'Trinity United Methodist Church is an urban congregation committed to social justice and community transformation. We blend traditional Methodist worship with contemporary elements and are known for our community service programs.',
      verified: true,
    },
    listings: [
      {
        title: 'Martin Luther King Jr. Sunday Speaker',
        description: 'Annual MLK Sunday service seeking a prophetic voice on justice, reconciliation, and the beloved community. Should be comfortable addressing social issues from a biblical perspective.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2027-01-17'),
        location: 'Chicago, Illinois',
        compensation: '$750 + travel',
        status: 'OPEN',
        churchName: 'Trinity United Methodist Church',
        contactName: 'Rev. Dr. Marcus Johnson',
        avgAttendance: 800,
        sermonLength: 35,
        honorarium: '$750',
        mileageReimbursement: 'Full travel reimbursement',
      },
    ],
  },
  {
    name: 'Shalom Messianic Congregation',
    email: 'church-shalom-messianic@test.com',
    password: 'church2026',
    profile: {
      churchName: 'Shalom Messianic Congregation',
      organizationName: 'Shalom Messianic Congregation of Winnipeg',
      denomination: 'Messianic Jewish',
      specifyAffiliation: 'Union of Messianic Jewish Congregations',
      country: 'Canada',
      street: '500 Portage Avenue',
      address: '500 Portage Avenue',
      city: 'Winnipeg',
      province: 'Manitoba',
      postalCode: 'R3C 0G2',
      phone: '(204) 555-1010',
      website: 'https://shalomwinnipeg.ca',
      averageAttendance: '100-150',
      founded: 1990,
      bio: 'Shalom Messianic Congregation is a community of Jewish and Gentile believers in Yeshua (Jesus). We celebrate the Jewish roots of our faith while embracing New Covenant realities. Shabbat services include Hebrew liturgy and Davidic dance.',
      verified: true,
    },
    listings: [
      {
        title: 'Passover Seder Leader',
        description: 'We need a knowledgeable leader for our community Passover Seder. Must understand both traditional Jewish elements and their Messianic fulfillment in Yeshua. Seder dinner included.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-04-02'),
        location: 'Winnipeg, Manitoba',
        compensation: '$400',
        status: 'OPEN',
        churchName: 'Shalom Messianic Congregation',
        contactName: 'Rabbi David Goldstein',
        avgAttendance: 150,
        sermonLength: 45,
        honorarium: '$400',
        meals: 'Full Seder dinner included',
      },
      {
        title: 'High Holy Days Speaker',
        description: 'Looking for a speaker familiar with the High Holy Days (Rosh Hashanah and Yom Kippur) and their prophetic significance. Two services over 10-day period.',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-09-25'),
        location: 'Winnipeg, Manitoba',
        compensation: '$600 (2 services)',
        status: 'OPEN',
        churchName: 'Shalom Messianic Congregation',
        contactName: 'Rabbi David Goldstein',
        avgAttendance: 120,
        sermonLength: 35,
        honorarium: '$300 per service',
      },
    ],
  },
]

async function main() {
  console.log('🏛️  Starting church seeding process...\n')

  // Clear existing test churches
  console.log('Cleaning up existing test church data...')
  const existingUsers = await prisma.user.findMany({
    where: { email: { contains: '@test.com' }, role: 'CHURCH' },
  })

  for (const user of existingUsers) {
    try {
      await prisma.user.delete({ where: { id: user.id } })
    } catch (e) {
      // Ignore deletion errors
    }
  }

  let churchCount = 0
  let listingCount = 0

  for (const church of CHURCHES) {
    console.log(`Creating: ${church.name}...`)

    const hashedPassword = await bcrypt.hash(church.password, 10)

    const user = await prisma.user.create({
      data: {
        email: church.email,
        password: hashedPassword,
        name: church.name,
        role: 'CHURCH',
        phone: church.profile.phone,
        bio: church.profile.bio,
        churchProfile: {
          create: church.profile,
        },
      },
      include: { churchProfile: true },
    })

    churchCount++

    // Create subscription (trial for now)
    if (user.churchProfile) {
      await prisma.subscription.create({
        data: {
          churchProfileId: user.churchProfile.id,
          planType: 'TRIAL',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          postingsRemaining: 3,
        },
      })
    }

    // Create listings for this church
    for (const listing of church.listings) {
      await prisma.churchListing.create({
        data: {
          ...listing,
          createdBy: user.id,
        },
      })
      listingCount++
    }

    console.log(`  ✅ Created ${church.name} with ${church.listings.length} listing(s)`)
  }

  console.log(`\n✅ Successfully seeded:`)
  console.log(`   - ${churchCount} churches`)
  console.log(`   - ${listingCount} service opportunities`)

  console.log('\n🎉 Church seeding complete!')
  console.log('\nTest credentials for churches:')
  CHURCHES.forEach((c) => {
    console.log(`  ${c.name}: ${c.email} / ${c.password}`)
  })
}

main()
  .catch((e) => {
    console.error('Error seeding churches:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
