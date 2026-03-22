// tests/helpers.ts
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const TEST_USERS = {
  preacher1: {
    email: 'preacher1@test.com',
    password: 'testPassword123',
    name: 'John Preacher',
    phone: '555-1234',
  },
  preacher2: {
    email: 'preacher2@test.com',
    password: 'testPassword456',
    name: 'Jane Preacher',
    phone: '555-5678',
  },
  church1: {
    email: 'church1@test.com',
    password: 'testPassword789',
    name: 'Grace Chapel',
    phone: '555-9999',
  },
  church2: {
    email: 'church2@test.com',
    password: 'testPassword000',
    name: 'Hope Church',
    phone: '555-8888',
  },
  admin: {
    email: 'admin@test.com',
    password: 'adminPassword123',
    name: 'Admin User',
    phone: '555-0000',
  },
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  userKey: keyof typeof TEST_USERS,
  role: 'PREACHER' | 'CHURCH' | 'ADMIN' = 'PREACHER'
) {
  const userData = TEST_USERS[userKey]
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const user = await db.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone,
      role,
      isAdmin: role === 'ADMIN',
    },
  })

  if (role === 'PREACHER') {
    await db.preacherProfile.create({
      data: { userId: user.id },
    })
  } else if (role === 'CHURCH') {
    await db.churchProfile.create({
      data: { userId: user.id },
    })
  }

  return user
}

/**
 * Clean up all test data from database
 */
export async function cleanupDatabase() {
  // Delete in order of dependencies
  await db.rating.deleteMany({})
  await db.auditLog.deleteMany({})
  await db.passwordResetToken.deleteMany({})
  await db.notification.deleteMany({})
  await db.message.deleteMany({})
  await db.availabilitySlot.deleteMany({})
  await db.application.deleteMany({})
  await db.churchListing.deleteMany({})
  await db.preacherProfile.deleteMany({})
  await db.churchProfile.deleteMany({})
  await db.user.deleteMany({})
}

/**
 * Get a test user's data
 */
export function getTestUserData(userKey: keyof typeof TEST_USERS) {
  return TEST_USERS[userKey]
}
