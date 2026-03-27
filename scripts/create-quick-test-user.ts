import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Creating test preacher user...')

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create preacher user
    const preacherUser = await prisma.user.upsert({
      where: { email: 'test.preacher@example.com' },
      update: {},
      create: {
        email: 'test.preacher@example.com',
        password: hashedPassword,
        name: 'Test Preacher',
        role: 'PREACHER',
        emailVerified: new Date()
      }
    })

    console.log('Created preacher user:', preacherUser.email)

    // Create preacher profile
    const preacherProfile = await prisma.preacherProfile.upsert({
      where: { userId: preacherUser.id },
      update: {},
      create: {
        userId: preacherUser.id,
        bio: 'I am a passionate preacher with 10+ years of ministry experience.',
        denomination: 'Baptist',
        yearsOfExperience: 12,
        serviceTypes: ['SERMON', 'WORKSHOP'],
        languages: ['English'],
        verified: true,
        rating: 4.5 as any,
        totalRatings: 8,
        profilePhotoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=preacher',
        travelRadiusKm: 100
      }
    })

    console.log('Created preacher profile')

    // Create church user
    const churchUser = await prisma.user.upsert({
      where: { email: 'test.church@example.com' },
      update: {},
      create: {
        email: 'test.church@example.com',
        password: hashedPassword,
        name: 'Test Church',
        role: 'CHURCH',
        emailVerified: new Date()
      }
    })

    console.log('Created church user:', churchUser.email)

    // Create church profile
    const churchProfile = await prisma.churchProfile.upsert({
      where: { userId: churchUser.id },
      update: {},
      create: {
        userId: churchUser.id,
        churchName: 'Test Community Church',
        denomination: 'Baptist',
        address: '123 Main Street',
        city: 'Toronto',
        province: 'ON',
        country: 'Canada',
        phone: '(416) 555-0123',
        website: 'https://testchurch.com',
        bio: 'A vibrant community of faith in downtown Toronto.',
        verified: true,
        founded: 1995
      }
    })

    console.log('Created church profile')

    // Create a test listing
    const listing = await prisma.churchListing.create({
      data: {
        churchId: churchProfile.id,
        createdBy: churchUser.id,
        title: 'Need Passionate Sermon Speaker for Sunday Service',
        description: 'We are looking for an experienced preacher to deliver a sermon on discipleship. Service at 10 AM.',
        location: 'Toronto, ON',
        serviceType: 'SERMON',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        minCompensation: 100,
        maxCompensation: 200,
        status: 'OPEN'
      }
    })

    console.log('Created test listing')

    console.log('\n✅ Test data created successfully!\n')
    console.log('Login credentials:')
    console.log('  Preacher:')
    console.log('    Email: test.preacher@example.com')
    console.log('    Password: password123')
    console.log('')
    console.log('  Church:')
    console.log('    Email: test.church@example.com')
    console.log('    Password: password123')
  } catch (error) {
    console.error('Error creating test data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
