import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DENOMINATIONS = [
  'Baptist',
  'Pentecostal',
  'Methodist',
  'Presbyterian',
  'Evangelical',
  'Nazarene',
  'Assemblies of God',
  'Catholic',
  'Anglican',
  'Interdenominational'
]

const SERVICE_TYPES = ['SERMON', 'SPECIAL_SERVICE', 'REVIVAL', 'WORKSHOP', 'OTHER']

const LOCATIONS = [
  { city: 'Toronto', province: 'ON', country: 'Canada' },
  { city: 'Vancouver', province: 'BC', country: 'Canada' },
  { city: 'Calgary', province: 'AB', country: 'Canada' },
  { city: 'Montreal', province: 'QC', country: 'Canada' },
  { city: 'Winnipeg', province: 'MB', country: 'Canada' },
  { city: 'Halifax', province: 'NS', country: 'Canada' },
  { city: 'New York', province: 'NY', country: 'United States' },
  { city: 'Los Angeles', province: 'CA', country: 'United States' },
  { city: 'Chicago', province: 'IL', country: 'United States' },
  { city: 'Houston', province: 'TX', country: 'United States' }
]

const PREACHER_NAMES = [
  'Pastor John Smith',
  'Rev. Sarah Johnson',
  'Pastor Michael Chen',
  'Rev. Patricia Williams',
  'Pastor David Rodriguez',
  'Rev. Emily Thompson',
  'Pastor James Wilson',
  'Rev. Maria Garcia',
  'Pastor Daniel Lee',
  'Rev. Jessica Anderson',
  'Pastor Robert Brown',
  'Rev. Lisa Martinez',
  'Pastor Christopher Taylor',
  'Rev. Jennifer Anderson',
  'Pastor Timothy Harris',
  'Rev. Amanda Clark',
  'Pastor Steven Lewis',
  'Rev. Nicole Walker',
  'Pastor Brandon Hall',
  'Rev. Stephanie Young',
  'Pastor Kevin White',
  'Rev. Michelle Robinson',
  'Pastor Eric Jackson',
  'Rev. Lauren Martin',
  'Pastor Wayne Davis',
  'Rev. Heather Thomas',
  'Pastor Brian Moore',
  'Rev. Rachel Jackson',
  'Pastor Gabriel Lee',
  'Rev. Victoria Hernandez'
]

const CHURCH_NAMES = [
  'Grace Community Church',
  'Living Water Fellowship',
  'Calvary Chapel',
  'First Assembly of God',
  'Mountain View Baptist Church',
  'Riverside Church',
  'Cornerstone Community Church',
  'Victory Christian Center',
  'Faith Community Church',
  'New Hope Church'
]

async function createPreachers() {
  console.log('Creating preachers...')
  const preachers = []

  for (let i = 0; i < 25; i++) {
    const name = PREACHER_NAMES[i]
    const email = `preacher${i + 1}@test.com`

    const user = await prisma.user.create({
      data: {
        email,
        password: 'password123', // Test password - not hashed for simplicity
        name,
        role: 'PREACHER',
        emailVerified: new Date()
      }
    })

    const location = LOCATIONS[i % LOCATIONS.length]
    const denomination = DENOMINATIONS[i % DENOMINATIONS.length]
    const serviceTypes = SERVICE_TYPES.slice(0, Math.floor(Math.random() * 3) + 1)
    const yearsOfExp = Math.floor(Math.random() * 30) + 1
    const rating = Math.random() * 1 + 4

    const profile = await prisma.preacherProfile.create({
      data: {
        userId: user.id,
        bio: `I'm an experienced ${denomination} preacher with ${yearsOfExp} years of ministry experience. Passionate about biblical teaching and engaging worship.`,
        denomination,
        yearsOfExperience: yearsOfExp,
        serviceTypes,
        languages: ['English', i % 3 === 0 ? 'Spanish' : i % 3 === 1 ? 'French' : 'English'],
        profilePhotoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        verified: Math.random() > 0.3,
        rating: parseFloat(rating.toFixed(2)) as any,
        totalRatings: Math.floor(Math.random() * 50),
        travelRadiusKm: [50, 100, 150, 250][Math.floor(Math.random() * 4)],
        specializations: ['Preaching', i % 2 === 0 ? 'Youth Ministry' : 'Worship Leadership'],
        ordinationStatus: ['ordained', 'licensed', 'commissioned'][Math.floor(Math.random() * 3)]
      }
    })

    preachers.push({ user, profile })
  }

  console.log(`✓ Created ${preachers.length} preachers`)
  return preachers
}

async function createChurches() {
  console.log('Creating churches...')
  const churches = []

  for (let i = 0; i < 8; i++) {
    const name = CHURCH_NAMES[i]
    const email = `church${i + 1}@test.com`

    const user = await prisma.user.create({
      data: {
        email,
        password: 'password123', // Test password - not hashed for simplicity
        name,
        role: 'CHURCH',
        emailVerified: new Date()
      }
    })

    const location = LOCATIONS[i % LOCATIONS.length]
    const denomination = DENOMINATIONS[i % DENOMINATIONS.length]

    const profile = await prisma.churchProfile.create({
      data: {
        userId: user.id,
        churchName: name,
        denomination,
        address: `${Math.floor(Math.random() * 9000) + 1000} Main Street`,
        city: location.city,
        province: location.province,
        country: location.country,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
        bio: `${name} is a vibrant faith community dedicated to serving our congregation and local community with excellence in worship and biblical teaching.`,
        verified: Math.random() > 0.2,
        founded: 2000 + Math.floor(Math.random() * 24)
      }
    })

    churches.push({ user, profile })
  }

  console.log(`✓ Created ${churches.length} churches`)
  return churches
}

async function createListings(churches: any[]) {
  console.log('Creating listings...')
  const listings = []

  for (const church of churches) {
    const numListings = Math.floor(Math.random() * 4) + 2

    for (let i = 0; i < numListings; i++) {
      const serviceType = SERVICE_TYPES[Math.floor(Math.random() * SERVICE_TYPES.length)]
      const future = new Date()
      future.setDate(future.getDate() + Math.floor(Math.random() * 60) + 7)

      const listing = await prisma.churchListing.create({
        data: {
          churchId: church.profile.id,
          createdBy: church.user.id,
          title: `Need ${serviceType.replace(/_/g, ' ')} Speaker - ${church.profile.city}`,
          description: `We're looking for an experienced ${serviceType.toLowerCase()} leader to share with our congregation. Looking for someone passionate and engaging.`,
          location: `${church.profile.city}, ${church.profile.province}`,
          serviceType,
          date: future,
          minCompensation: 50,
          maxCompensation: 300,
          status: ['OPEN', 'OPEN', 'IN_PROGRESS'][Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      })

      listings.push(listing)
    }
  }

  console.log(`✓ Created ${listings.length} listings`)
  return listings
}

async function createApplications(preachers: any[], listings: any[]) {
  console.log('Creating applications...')
  let applicationsCreated = 0

  for (const preacher of preachers) {
    const numApplications = Math.floor(Math.random() * 5) + 2

    for (let i = 0; i < numApplications; i++) {
      const listing = listings[Math.floor(Math.random() * listings.length)]

      // Skip if already applied
      const existing = await prisma.application.findFirst({
        where: {
          listingId: listing.id,
          applicantId: preacher.user.id
        }
      })

      if (existing) continue

      const statuses = ['PENDING', 'PENDING', 'ACCEPTED', 'REJECTED']
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const pipelineStatuses = ['APPLIED', 'REVIEWED', 'INTERVIEWED', 'OFFERED', 'HIRED']
      const pipelineStatus = pipelineStatuses[Math.floor(Math.random() * pipelineStatuses.length)]

      const application = await prisma.application.create({
        data: {
          listingId: listing.id,
          applicantId: preacher.user.id,
          status: status as any,
          pipelineStatus: pipelineStatus as any,
          coverLetter: `I'm very interested in this opportunity. I believe my experience and passion align well with your church's needs.`,
          appliedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
          respondedAt: status !== 'PENDING' ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null
        }
      })

      applicationsCreated++
    }
  }

  console.log(`✓ Created ${applicationsCreated} applications`)
}

async function createRatings(preachers: any[], churches: any[]) {
  console.log('Creating ratings...')
  let ratingsCreated = 0

  for (let i = 0; i < 15; i++) {
    const preacher = preachers[Math.floor(Math.random() * preachers.length)]
    const church = churches[Math.floor(Math.random() * churches.length)]

    const existing = await prisma.rating.findFirst({
      where: {
        ratedById: church.user.id,
        preacherId: preacher.profile.id
      }
    })

    if (existing) continue

    await prisma.rating.create({
      data: {
        ratedById: church.user.id,
        preacherId: preacher.profile.id,
        rating: Math.floor(Math.random() * 2) + 4,
        review: [
          'Excellent speaker with great energy!',
          'Very professional and prepared. Highly recommend!',
          'Engaging message and wonderful ministry.'
        ][Math.floor(Math.random() * 3)]
      }
    })

    ratingsCreated++
  }

  console.log(`✓ Created ${ratingsCreated} ratings`)
}

async function createMessages(preachers: any[], churches: any[]) {
  console.log('Creating messages...')
  let messagesCreated = 0

  for (let i = 0; i < 10; i++) {
    const preacher = preachers[Math.floor(Math.random() * preachers.length)]
    const church = churches[Math.floor(Math.random() * churches.length)]

    const messages = [
      "Hi, I'm interested in your upcoming service.",
      "When would be available to discuss details?",
      "Thank you for considering my application.",
      "Looking forward to hearing from you!",
      "Can we schedule a call to discuss further?"
    ]

    // Create message from church to preacher
    await prisma.message.create({
      data: {
        conversationId: `${church.user.id}-${preacher.user.id}`,
        sentById: church.user.id,
        receivedById: preacher.user.id,
        content: messages[Math.floor(Math.random() * messages.length)],
        type: 'TEXT'
      }
    })

    messagesCreated++
  }

  console.log(`✓ Created ${messagesCreated} messages`)
}

async function main() {
  try {
    console.log('🌱 Starting test data seed...\n')

    // Clear existing test data
    console.log('Clearing existing test data...')
    await prisma.application.deleteMany({
      where: {
        applicant: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })

    await prisma.rating.deleteMany({
      where: {
        ratedBy: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })

    await prisma.message.deleteMany({
      where: {
        sentBy: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })

    await prisma.churchListing.deleteMany({
      where: {
        createdBy: {
          contains: 'church'
        }
      }
    })

    await prisma.preacherProfile.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })

    await prisma.churchProfile.deleteMany({
      where: {
        user: {
          email: {
            contains: '@test.com'
          }
        }
      }
    })

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    })

    console.log('✓ Cleared existing test data\n')

    // Create new test data
    const preachers = await createPreachers()
    const churches = await createChurches()
    const listings = await createListings(churches)

    await createApplications(preachers, listings)
    await createRatings(preachers, churches)
    await createMessages(preachers, churches)

    console.log('\n✅ Test data seed completed successfully!')
    console.log(`
Test Accounts Created:
  Preachers: ${preachers.length}
  Churches: ${churches.length}
  Listings: ${listings.length}

Example Login:
  Email: preacher1@test.com
  Password: password123

  Email: church1@test.com
  Password: password123
    `)
  } catch (error) {
    console.error('❌ Error seeding test data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
