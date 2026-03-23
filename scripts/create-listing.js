const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createYouthEvangelistListing() {
  try {
    console.log('🔍 Looking for High Life Church...')

    // Find or create High Life Church account
    let highLifeChurch = await prisma.user.findFirst({
      where: {
        churchProfile: {
          churchName: {
            contains: 'High Life',
            mode: 'insensitive',
          },
        },
      },
    })

    // If High Life Church doesn't exist, create it
    if (!highLifeChurch) {
      console.log('📝 Creating High Life Church account...')
      highLifeChurch = await prisma.user.create({
        data: {
          email: 'contact@highlifechurch.com',
          password: 'temp-password-change-me',
          name: 'High Life Church',
          phone: null,
          role: 'CHURCH',
          churchProfile: {
            create: {
              churchName: 'High Life Church',
              denomination: 'Non-denominational',
              city: 'Sussex',
              province: 'New Brunswick',
            },
          },
        },
      })
      console.log('✅ High Life Church account created')
    } else {
      console.log('✅ Found existing High Life Church account')
    }

    console.log('📋 Creating Youth Evangelist listing...')

    // Create the Youth Evangelist listing
    const listing = await prisma.churchListing.create({
      data: {
        createdBy: highLifeChurch.id,
        title: 'Guest Speaker Opportunity: Youth Evangelist',
        type: 'SPECIAL_SERVICE',
        date: new Date('2026-05-03T12:00:00'),
        location: 'Sussex, New Brunswick',
        compensation:
          'Competitive honorarium provided. All travel expenses (fuel, meals, etc.) fully covered for speakers within a 300 km radius (Saint John, Moncton, Fredericton area). Local accommodations can be arranged if needed.',
        description: `We are seeking a dynamic, authentic evangelist with a heart for the next generation to join us for a special youth-focused gathering. Our goal is to see local teens engaged and challenged to live out their faith through a clear, cross-centered message.

EVENT DETAILS:
Time: 12:00 PM – 3:00 PM
Location: Sussex, New Brunswick

WHAT TO EXPECT:
Target Audience: Youth (ages 12–18) from the Sussex region.
The Session: A blend of gospel proclamation and interactive discussion.
Theme: "Living with Purpose" (or optional theme of your choice)

REQUIREMENTS & IDEAL TRAITS:
• Clear Call: Evidence of a passion for evangelism and a track record of connecting with students where they are.
• Communication: Ability to deliver a concise, compelling message followed by a short Q&A or ministry time.
• References: Contact info for two recent ministry references.

COMPENSATION & TRAVEL:
• Honorarium: Competitive honorarium provided.
• Travel: All travel expenses (fuel, meals, etc.) fully covered for speakers within a 300 km radius (e.g., from Saint John, Moncton, or Fredericton).
• Lodging: If needed for speakers within the mileage limit, local accommodations can be arranged.

HOW TO APPLY:
Please send a brief introductory video or a link to a previous sermon, along with your ministry bio to contact@highlifechurch.com. We encourage you to ask any logistical questions early to ensure a great fit.

DEADLINE FOR INTEREST: April 5, 2026`,
        status: 'OPEN',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            churchProfile: true,
          },
        },
      },
    })

    console.log('\n✨ Youth Evangelist Listing Created Successfully!')
    console.log('━'.repeat(50))
    console.log('📋 Listing ID:', listing.id)
    console.log('🏪 Church:', listing.user.name)
    console.log('👤 Position:', listing.title)
    console.log('📅 Date:', listing.date.toDateString())
    console.log('📍 Location:', listing.location)
    console.log('💰 Compensation:', listing.compensation)
    console.log('━'.repeat(50))
    console.log('\n🎉 Listing is now live and visible to preachers!')

    return listing
  } catch (error) {
    console.error('❌ Error creating listing:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createYouthEvangelistListing()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
