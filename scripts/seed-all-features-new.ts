import { PrismaClient } from '@prisma/client'

const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding comprehensive test data with all features...')

  try {
    const churches = []

    for (let i = 1; i <= 5; i++) {
      const church = await prisma.user.upsert({
        where: { email: `church${i}@test.com` },
        update: {},
        create: {
          email: `church${i}@test.com`,
          password: await bcryptjs.hash('church2026', 10),
          name: `Test Church ${i}`,
          role: 'CHURCH',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=church${i}`,
          churchProfile: {
            create: {
              churchName: `Test Church ${i}`,
              denomination: ['Baptist', 'Methodist', 'Pentecostal', 'Presbyterian', 'Anglican'][i - 1],
              city: `City ${i}`,
              province: 'Test Province',
            },
          },
        },
        include: { churchProfile: true },
      })
      churches.push(church)
      console.log(`✅ Created church: ${church.email}`)
    }

    const preachers = []

    for (let i = 1; i <= 3; i++) {
      const preacher = await prisma.user.upsert({
        where: { email: `preacher${i}@test.com` },
        update: {},
        create: {
          email: `preacher${i}@test.com`,
          password: await bcryptjs.hash('preacher2026', 10),
          name: `Test Preacher ${i}`,
          role: 'PREACHER',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=preacher${i}`,
          preacherProfile: {
            create: {
              yearsOfExperience: 15 + i * 5,
              bio: `I am a dedicated preacher with ${15 + i * 5} years of experience in ministry.`,
              denomination: ['Baptist', 'Methodist', 'Pentecostal'][i - 1],
              ordinationStatus: 'ordained',
              verified: true,
            },
          },
        },
      })
      preachers.push(preacher)
      console.log(`✅ Created preacher: ${preacher.email}`)

      const ratingsToCreate = i === 1 ? 12 : i === 2 ? 10 : 8
      const ratingValues = [5, 5, 5, 5, 5, 4, 4, 5, 5, 4, 5, 4]
      const ratingComments = [
        'Excellent sermon. Very inspiring and biblically grounded.',
        'Great preacher! Our congregation was deeply moved by the message.',
        'Outstanding delivery and theological depth. Highly recommend!',
        'Perfect fit for our church. Members gave very positive feedback.',
        'Passionate preacher with genuine care for the audience.',
        'Scriptural accuracy combined with engaging presentation.',
        'Brought new energy to our worship service. Thank you!',
        'Exceptional ministry. Your presence was a blessing to us.',
        'Powerful message delivered with great clarity.',
        'Your authenticity and conviction really resonated with our people.',
        'One of the best visiting preachers we have had.',
        'Amazing spiritual depth and practical wisdom.',
      ]

      for (let j = 0; j < ratingsToCreate; j++) {
        const ratingChurch = churches[j % churches.length]
        const ratingValue = ratingValues[j]

        try {
          await prisma.rating.create({
            data: {
              ratedById: ratingChurch.id,
              ratedToId: preacher.id,
              rating: ratingValue,
              comment: ratingComments[j],
              relatedTo: 'GENERAL',
              relatedId: preacher.id,
            },
          })
          console.log(`  ✅ Added rating: ${ratingValue}/5 from ${ratingChurch.email}`)
        } catch (error: any) {
          if (error.code !== 'P2002') throw error
        }
      }

      const allRatings = await prisma.rating.findMany({
        where: { ratedToId: preacher.id },
      })
      const avgRating =
        allRatings.length > 0
          ? Math.round((allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length) * 10) / 10
          : 0

      await prisma.preacherProfile.update({
        where: { userId: preacher.id },
        data: {
          rating: avgRating,
          totalRatings: allRatings.length,
        },
      })
      console.log(`  📊 Updated rating stats: ${avgRating}/5 (${allRatings.length} ratings)\n`)
    }

    for (const preacher of preachers) {
      for (let day = 1; day <= 10; day++) {
        const date = new Date()
        date.setDate(date.getDate() + day)

        try {
          await prisma.availabilitySlot.create({
            data: {
              userId: preacher.id,
              date,
              startTime: '09:00',
              endTime: day % 2 === 0 ? '17:00' : '14:00',
              available: Math.random() > 0.3,
              travelDistance: 50 + Math.floor(Math.random() * 200),
              willingToTravel: true,
            },
          })
        } catch (error: any) {
          if (error.code !== 'P2002') throw error
        }
      }
      console.log(`✅ Added 10 availability slots for ${preacher.email}`)
    }

    if (preachers.length > 0 && churches.length > 0) {
      const messages = [
        'Hello, interested in your preaching services for our upcoming revival.',
        'Your sermon was wonderful! Can we book you again?',
        'Thank you for the inspiring message last Sunday.',
        'Would you be available for our special service?',
        'Great to connect with you. Looking forward to working together.',
      ]

      for (let i = 0; i < Math.min(preachers.length, churches.length); i++) {
        try {
          await prisma.message.create({
            data: {
              senderId: churches[i].id,
              receiverId: preachers[i].id,
              content: messages[i],
            },
          })
        } catch (error) {
          // Ignore duplicates
        }
      }
      console.log(`✅ Added ${Math.min(preachers.length, churches.length)} test messages\n`)
    }

    const refreshedPreachers = await Promise.all(
      preachers.map((p) =>
        prisma.user.findUnique({
          where: { id: p.id },
          include: { preacherProfile: true },
        })
      )
    )

    console.log('✨ Seed complete! Test data with all features is ready.')
    console.log('\n📝 Test Account Credentials:')
    console.log('━'.repeat(50))
    refreshedPreachers.forEach((p, i) => {
      if (p?.preacherProfile) {
        console.log(`\nPreacher ${i + 1}:`)
        console.log(`  Email: ${p.email}`)
        console.log(`  Password: preacher2026`)
        console.log(`  Experience: ${p.preacherProfile.yearsOfExperience} years`)
        console.log(`  Rating: ${p.preacherProfile.rating}/5 (${p.preacherProfile.totalRatings} ratings)`)
      }
    })
    console.log('\n' + '━'.repeat(50))
    console.log('Church Credentials (for rating preachers):')
    churches.forEach((c, i) => {
      console.log(`\nChurch ${i + 1}:`)
      console.log(`  Email: ${c.email}`)
      console.log(`  Password: church2026`)
      console.log(`  Name: ${c.churchProfile?.churchName || 'Test Church'}`)
      console.log(`  Denomination: ${c.churchProfile?.denomination}`)
    })
    console.log('\n✨ All test data is now loaded and ready for testing!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
