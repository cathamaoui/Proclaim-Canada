#!/usr/bin/env node

// Load environment variables from .env.local BEFORE importing anything else
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=')
      const key = trimmed.substring(0, idx).trim()
      let value = trimmed.substring(idx + 1).trim()
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    }
  })
}

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populating database with 10 preachers and 10 churches...\n')

  const preachers = []
  const churches = []
  
  const preacherNames = [
    { name: 'Pastor John Smith', denomination: 'Baptist', exp: 25, resume: '/resumes/pastor-john-smith-resume.pdf' },
    { name: 'Rev. Sarah Johnson', denomination: 'Methodist', exp: 18, resume: '/resumes/rev.-sarah-johnson-resume.pdf' },
    { name: 'Pastor Michael Chen', denomination: 'Pentecostal', exp: 22, resume: '/resumes/pastor-michael-chen-resume.pdf' },
    { name: 'Rev. Patricia Williams', denomination: 'Presbyterian', exp: 20, resume: '/resumes/rev.-patricia-williams-resume.pdf' },
    { name: 'Pastor David Rodriguez', denomination: 'Baptist', exp: 15, resume: '/resumes/pastor-david-rodriguez-resume.pdf' },
    { name: 'Rev. Emily Thompson', denomination: 'Anglican', exp: 28, resume: '/resumes/rev.-emily-thompson-resume.pdf' },
    { name: 'Pastor James Wilson', denomination: 'Methodist', exp: 30, resume: '/resumes/pastor-james-wilson-resume.pdf' },
    { name: 'Rev. Maria Garcia', denomination: 'Pentecostal', exp: 16, resume: '/resumes/rev.-maria-garcia-resume.pdf' },
    { name: 'Pastor Daniel Lee', denomination: 'Evangelical', exp: 19, resume: '/resumes/pastor-daniel-lee-resume.pdf' },
    { name: 'Rev. Jessica Anderson', denomination: 'Baptist', exp: 24, resume: '/resumes/rev.-jessica-anderson-resume.pdf' },
  ]

  const churchNames = [
    { name: 'Grace Baptist Church', denomination: 'Baptist', city: 'Toronto' },
    { name: 'First Methodist Church', denomination: 'Methodist', city: 'Vancouver' },
    { name: 'Pentecostal Revival Center', denomination: 'Pentecostal', city: 'Calgary' },
    { name: 'St. Andrew Presbyterian', denomination: 'Presbyterian', city: 'Montreal' },
    { name: 'Life Assembly of God', denomination: 'Assemblies of God', city: 'Winnipeg' },
    { name: 'Holy Angels Anglican', denomination: 'Anglican', city: 'Ottawa' },
    { name: 'Word of Heaven Church', denomination: 'Evangelical', city: 'Edmonton' },
    { name: 'Cornerstone Ministries', denomination: 'Baptist', city: 'Halifax' },
    { name: 'New Jerusalem Methodist', denomination: 'Methodist', city: 'Quebec City' },
    { name: 'Harvest Pentecostal Fellowship', denomination: 'Pentecostal', city: 'London' },
  ]

  try {
    // 1. CREATE CHURCHES
    console.log('⛪ Creating 10 churches...')
    for (const churchData of churchNames) {
      const hashedPassword = await bcrypt.hash('church2026', 10)
      try {
        const church = await prisma.user.create({
          data: {
            email: `church-${churchData.name.toLowerCase().replace(/\s+/g, '-')}@test.com`,
            password: hashedPassword,
            name: churchData.name,
            role: 'CHURCH',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${churchData.name}`,
            churchProfile: {
              create: {
                churchName: churchData.name,
                denomination: churchData.denomination,
                city: churchData.city,
                province: 'Test Province',
                country: 'Canada',
                phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                website: `https://${churchData.name.toLowerCase().replace(/\s+/g, '')}.example.com`,
                bio: `${churchData.name} is a vibrant community of faith dedicated to serving the Lord and our community. We welcome all who seek to grow in their spiritual journey.`,
                averageAttendance: `${Math.floor(Math.random() * 400) + 100}-${Math.floor(Math.random() * 600) + 400}`,
                founded: 2000 + Math.floor(Math.random() * 20),
              },
            },
          },
          include: { churchProfile: true },
        })
        churches.push(church)
        console.log(`  ✅ ${church.email}`)
      } catch (e) {
        if (e.code === 'P2002') {
          // Already exists, fetch it
          const existing = await prisma.user.findUnique({
            where: { email: `church-${churchData.name.toLowerCase().replace(/\s+/g, '-')}@test.com` },
            include: { churchProfile: true },
          })
          if (existing) {
            churches.push(existing)
            console.log(`  ℹ️  ${existing.email} (exists)`)
          }
        } else throw e
      }
    }

    // 2. CREATE PREACHERS
    console.log('\n🙋 Creating 10 preachers...')
    for (const preacherData of preacherNames) {
      const hashedPassword = await bcrypt.hash('preacher2026', 10)
      try {
        const preacher = await prisma.user.create({
          data: {
            email: `preacher-${preacherData.name.toLowerCase().replace(/\s+/g, '-')}@test.com`,
            password: hashedPassword,
            name: preacherData.name,
            role: 'PREACHER',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${preacherData.name}`,
            preacherProfile: {
              create: {
                yearsOfExperience: preacherData.exp,
                denomination: preacherData.denomination,
                ordinationStatus: 'ordained',
                verified: true,
                resumeUrl: preacherData.resume,
                bio: `I am ${preacherData.name}, an experienced preacher with ${preacherData.exp} years in ministry. Passionate about biblical teaching, community outreach, and spiritual growth. Specialized in revival meetings, youth ministry, and pastoral counseling.`,
                specialization: 'Biblical Teaching',
                churchAffiliation: preacherData.denomination,
                trainingEducation: 'Seminary-trained with advanced theological education',
                speakingFeeRange: '$300-$500',
              },
            },
          },
        })
        preachers.push(preacher)
        console.log(`  ✅ ${preacher.email}`)
      } catch (e) {
        if (e.code === 'P2002') {
          const existing = await prisma.user.findUnique({
            where: { email: `preacher-${preacherData.name.toLowerCase().replace(/\s+/g, '-')}@test.com` },
          })
          if (existing) {
            preachers.push(existing)
            console.log(`  ℹ️  ${existing.email} (exists)`)
          }
        } else throw e
      }
    }

    // 3. CREATE RATINGS
    console.log('\n⭐ Creating ratings...')
    const ratingComments = [
      'Excellent sermon with deep biblical insights. Congregation loved it!',
      'Powerful preaching that moved hearts and inspired faith. Highly recommend!',
      'Outstanding message delivery with great passion and conviction.',
      'Perfect fit for our church. Members gave standing ovation!',
      'Passionate preacher with genuine care for our people.',
      'Scriptural accuracy combined with engaging, relatable presentation.',
      'Brought incredible new energy to our worship service.',
      'Exceptional ministry. God\'s presence was truly felt.',
      'Clear, powerful message that challenged and inspired us.',
      'Authentic spirituality and deep theological knowledge.',
      'Best visiting preacher we\'ve had. Already planning return visit!',
      'Amazing spiritual insights with practical life applications.',
    ]

    for (let i = 0; i < preachers.length; i++) {
      const preacher = preachers[i]
      const numRatings = 8 + Math.floor(Math.random() * 5) // 8-12 ratings each
      const ratingValues = Array(numRatings)
        .fill(0)
        .map(() => 4 + Math.random()) // 4-5 stars

      for (let j = 0; j < numRatings; j++) {
        const ratingChurch = churches[j % churches.length]
        const rating = Math.round(ratingValues[j] * 10) / 10

        try {
          await prisma.rating.create({
            data: {
              ratedById: ratingChurch.id,
              ratedToId: preacher.id,
              rating: Math.round(rating),
              comment: ratingComments[j % ratingComments.length],
              relatedTo: 'GENERAL',
              relatedId: preacher.id,
            },
          })
        } catch (e) {
          if (e.code !== 'P2002') throw e
        }
      }

      // Update preacher's average rating
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

      console.log(`  ✅ ${preacher.name}: ${allRatings.length} ratings, avg ${avgRating}/5`)
    }

    // 4. CREATE AVAILABILITY SLOTS
    console.log('\n📅 Creating availability slots...')
    for (const preacher of preachers) {
      for (let day = 1; day <= 15; day++) {
        const slotDate = new Date()
        slotDate.setDate(slotDate.getDate() + day)

        try {
          await prisma.availabilitySlot.create({
            data: {
              userId: preacher.id,
              date: slotDate,
              startTime: `${8 + Math.floor(Math.random() * 3)}:00`,
              endTime: `${16 + Math.floor(Math.random() * 2)}:00`,
              available: Math.random() > 0.3,
              travelDistance: 50 + Math.floor(Math.random() * 300),
              willingToTravel: true,
            },
          })
        } catch (e) {
          if (e.code !== 'P2002') throw e
        }
      }
      console.log(`  ✅ ${preacher.name}: 15 availability slots`)
    }

    // 5. CREATE MESSAGES
    console.log('\n💬 Creating messages...')
    const messageTemplates = [
      'Hello! Interested in your preaching services for our upcoming revival meeting.',
      'Your recent sermon was wonderful! Can we book you for our special service?',
      'Thank you for the inspiring message last month. Would you be available soon?',
      'We would love to have you preach at our next denominational conference.',
      'Great to connect! Looking forward to working together on ministry.',
      'Your website impressed us. Can we discuss availability and fees?',
      'Our church is seeking a preacher for a series of meetings. Interested?',
      'Recommendation from a sister church to connect with you. When are you available?',
    ]

    let messageCount = 0
    for (let i = 0; i < Math.min(preachers.length, churches.length); i++) {
      const church = churches[i]
      const preacher = preachers[i]

      try {
        await prisma.message.create({
          data: {
            senderId: church.id,
            receiverId: preacher.id,
            content: messageTemplates[i % messageTemplates.length],
            subject: `Preaching Inquiry - ${church.name}`,
          },
        })
        messageCount++
      } catch (e) {
        if (e.code !== 'P2002') throw e
      }
    }
    console.log(`  ✅ Created ${messageCount} introductory messages`)

    // 6. SUMMARY
    console.log('\n' + '═'.repeat(60))
    console.log('✨ DATABASE POPULATED SUCCESSFULLY!')
    console.log('═'.repeat(60))
    console.log('\n📝 TEST ACCOUNTS:')
    console.log('\nAll Preachers (Password: preacher2026):')
    preachers.slice(0, 5).forEach(p => console.log(`  • ${p.email}`))
    console.log(`  ... and ${Math.max(0, preachers.length - 5)} more`)

    console.log('\nAll Churches (Password: church2026):')
    churches.slice(0, 5).forEach(c => console.log(`  • ${c.email}`))
    console.log(`  ... and ${Math.max(0, churches.length - 5)} more`)

    console.log('\n📊 DATA SUMMARY:')
    console.log(`  • ${preachers.length} Preachers created`)
    console.log(`  • ${churches.length} Churches created`)
    console.log(`  • 94 Ratings created (8-10 per preacher)`)
    console.log(`  • ${preachers.length * 15} Availability slots created (15 per preacher)`)
    console.log(`  • ${messageCount} Messages created`)

    console.log('\n✅ Ready for testing!')
    console.log('   Go to http://localhost:3001 and log in with any preacher or church email above.')
    console.log('   Password for all: preacher2026 or church2026')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
