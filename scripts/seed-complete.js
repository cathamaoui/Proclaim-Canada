#!/usr/bin/env node

// Set DATABASE_URL before any Prisma imports
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_lac0eXP6Ibhq@ep-holy-truth-anah51da-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Creating test accounts with all features...')
  
  const churches = []
  const preachers = []

  try {
    // Create 5 test churches
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash('church2026', 10)
      const church = await prisma.user.create({
        data: {
          email: `church${i}@test.com`,
          password: hashedPassword,
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
      }).catch(e => {
        if (e.code === 'P2002') {
          console.log(`  ℹ️  Church ${i} already exists`)
          return null
        }
        throw e
      })

      if (church) {
        churches.push(church)
        console.log(`✅ Created church: ${church.email}`)
      }
    }

    // Create 3 test preachers with ratings
    for (let i = 1; i <= 3; i++) {
      const hashedPassword = await bcrypt.hash('preacher2026', 10)
      const preacher = await prisma.user.create({
        data: {
          email: `preacher${i}@test.com`,
          password: hashedPassword,
          name: `Test Preacher ${i}`,
          role: 'PREACHER',
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=preacher${i}`,
          preacherProfile: {
            create: {
              yearsOfExperience: 15 + i * 5,
              bio: `Experienced preacher with ${15 + i * 5} years in ministry.`,
              denomination: ['Baptist', 'Methodist', 'Pentecostal'][i - 1],
              ordinationStatus: 'ordained',
              verified: true,
            },
          },
        },
      }).catch(e => {
        if (e.code === 'P2002') {
          console.log(`  ℹ️  Preacher ${i} already exists`)
          return null
        }
        throw e
      })

      if (preacher) {
        preachers.push(preacher)
        console.log(`✅ Created preacher: ${preacher.email}`)

        // Add ratings from churches
        const ratingsToAdd = i === 1 ? 12 : i === 2 ? 10 : 8
        const ratingValues = [5, 5, 5, 5, 5, 4, 4, 5, 5, 4, 5, 4]
        const comments = [
          'Excellent sermon. Very inspiring and biblically grounded.',
          'Great preacher! Our congregation was deeply moved.',
          'Outstanding delivery and theological depth!',
          'Perfect fit for our church services.',
          'Passionate preacher with genuine care.',
          'Scriptural accuracy combined with engaging presentation.',
          'Brought new energy to our worship!',
          'Exceptional ministry and blessing.',
          'Powerful clear message delivery.',
          'Authenticity and conviction truly resonated.',
          'Best visiting preacher we have had.',
          'Amazing spiritual depth and wisdom.',
        ]

        if (churches.length > 0) {
          for (let j = 0; j < ratingsToAdd; j++) {
            const ratingChurch = churches[j % churches.length]
            await prisma.rating.create({
              data: {
                ratedById: ratingChurch.id,
                ratedToId: preacher.id,
                rating: ratingValues[j],
                comment: comments[j],
                relatedTo: 'GENERAL',
                relatedId: preacher.id,
              },
            }).catch(e => {
              if (e.code !== 'P2002') throw e
            })
          }
          console.log(`  ✅ Added ${ratingsToAdd} ratings`)

          // Update preacher rating average
          const allRatings = await prisma.rating.findMany({
            where: { ratedToId: preacher.id },
          })
          const avg = allRatings.length > 0 
            ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
            : 0

          await prisma.preacherProfile.update({
            where: { userId: preacher.id },
            data: {
              rating: avg,
              totalRatings: allRatings.length,
            },
          })
          console.log(`  📊 Rating: ${avg}/5 (${allRatings.length} reviews)`)
        }

        // Add availability
        for (let day = 1; day <= 10; day++) {
          const date = new Date()
          date.setDate(date.getDate() + day)
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
          }).catch(e => {
            if (e.code !== 'P2002') throw e
          })
        }
        console.log(`  ✅ Added 10 availability slots\n`)
      }
    }

    console.log('✨ Test data ready!\n')
    console.log('📝 TEST ACCOUNT CREDENTIALS:')
    console.log('═'.repeat(50))
    console.log('\nPREACHERS (All use password: preacher2026):')
    console.log(`  • preacher1@test.com (20 years, 4.9★/5)`)
    console.log(`  • preacher2@test.com (25 years, 4.5★/5)`)  
    console.log(`  • preacher3@test.com (30 years, 4.6★/5)`)
    console.log('\nCHURCHES (All use password: church2026):')
    console.log(`  • church1@test.com (Baptist)`)
    console.log(`  • church2@test.com (Methodist)`)
    console.log(`  • church3@test.com (Pentecostal)`)
    console.log(`  • church4@test.com (Presbyterian)`)
    console.log(`  • church5@test.com (Anglican)`)
    console.log('═'.repeat(50))
    console.log('\n✅ Ready! Generate login with one of the accounts above.')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
