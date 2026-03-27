require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany({
      where: { email: 'pastor.complete@example.com' },
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log('\n=== PASTOR PROFILE ACCOUNTS ===\n');
    if (users.length === 0) {
      console.log('❌ No accounts found with email: pastor.complete@example.com');
    } else {
      console.log(`Found ${users.length} account(s):\n`);
      users.forEach((user, i) => {
        console.log(`Account ${i + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Name: ${user.name}`);
        console.log('');
      });
    }
    
    // Also check all users to see if there's a pattern
    console.log('\n=== ALL USER ACCOUNTS ===\n');
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    allUsers.forEach(user => {
      console.log(`${user.email} | Role: ${user.role}`);
    });
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
