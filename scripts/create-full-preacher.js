require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('preacher123', 10);
    
    // Delete old full preacher if exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'full.preacher@example.com' }
    });
    
    if (existingUser) {
      await prisma.preacherProfile.deleteMany({
        where: { userId: existingUser.id }
      });
      await prisma.user.delete({
        where: { email: 'full.preacher@example.com' }
      });
      console.log('✓ Deleted old full preacher profile');
    }
    
    // Create full preacher user
    const preacher = await prisma.user.create({
      data: {
        email: 'full.preacher@example.com',
        password: hashedPassword,
        name: 'Rev. John Smith',
        role: 'PREACHER',
        phone: '(555) 123-4567',
        emailVerified: new Date()
      }
    });
    console.log('✓ Created preacher user:', preacher.email);
    
    // Create comprehensive preacher profile
    const profile = await prisma.preacherProfile.create({
      data: {
        userId: preacher.id,
        bio: 'Dynamic preacher with 15+ years of ministry experience. Passionate about evangelism, discipleship, and biblical teaching.',
        denomination: 'Evangelical Free Church',
        ordinationStatus: 'ORDAINED',
        yearsOfExperience: 15,
        languages: ['English', 'Spanish'],
        travelWillingDistance: 500,
        website: 'https://johnsmith-ministry.com',
        theologyStatement: 'I believe in the authority of Scripture, the centrality of the Gospel, and the power of the Holy Spirit.',
        verified: true,
        verifiedAt: new Date(),
        rating: 4.8,
        ratingCount: 12,
        completionPercentage: 100,
        specialization: 'Revival & Evangelism',
        serviceTypes: ['SERMON', 'REVIVAL', 'WORKSHOP']
      }
    });
    console.log('✓ Created comprehensive preacher profile');
    
    // Create availability slots
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    await prisma.availabilitySlot.createMany({
      data: [
        {
          userId: preacher.id,
          date: tomorrow,
          startTime: '09:00',
          endTime: '12:00',
          serviceType: 'SERMON',
          notes: 'Sunday morning service'
        },
        {
          userId: preacher.id,
          date: nextWeek,
          startTime: '14:00',
          endTime: '17:00',
          serviceType: 'REVIVAL',
          notes: 'Evening revival meeting'
        }
      ]
    });
    console.log('✓ Created availability slots');
    
    console.log('\n✅ Full Preacher Profile Created!');
    console.log('\n📧 Login Credentials:');
    console.log('   Email: full.preacher@example.com');
    console.log('   Password: preacher123');
    console.log('\n👤 Profile Details:');
    console.log('   Name: Rev. John Smith');
    console.log('   Experience: 15 years');
    console.log('   Denomination: Evangelical Free Church');
    console.log('   Status: Ordained & Verified');
    console.log('   Rating: 4.8/5 (12 ratings)');
    console.log('   Completion: 100%');
    console.log('   Languages: English, Spanish');
    console.log('   Travel Distance: 500 miles');
    
  } catch (error) {
    console.error('Error creating full preacher profile:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
