require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Delete old test users if they exist
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test.preacher@example.com', 'test.church@example.com']
        }
      }
    });
    console.log('✓ Deleted old test users');
    
    // Create preacher user
    const preacher = await prisma.user.create({
      data: {
        email: 'test.preacher@example.com',
        password: hashedPassword,
        name: 'Test Preacher',
        role: 'PREACHER',
        emailVerified: new Date()
      }
    });
    console.log('✓ Created preacher user:', preacher.email);
    
    // Create church user
    const church = await prisma.user.create({
      data: {
        email: 'test.church@example.com',
        password: hashedPassword,
        name: 'Test Church',
        role: 'CHURCH',
        emailVerified: new Date()
      }
    });
    console.log('✓ Created church user:', church.email);
    
    console.log('\n✅ Test users created successfully!');
    console.log('\nTest Credentials:');
    console.log('  Preacher: test.preacher@example.com / password123');
    console.log('  Church: test.church@example.com / password123');
    
  } catch (error) {
    console.error('Error creating test users:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
