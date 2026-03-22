// tests/integration/authentication.test.ts
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { cleanupDatabase, TEST_USERS } from '../helpers'

describe('Authentication Integration Tests', () => {
  beforeEach(async () => {
    await cleanupDatabase()
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('User Registration', () => {
    it('should create a preacher account successfully', async () => {
      const preacherData = TEST_USERS.preacher1

      // Simulate registration
      const hashedPassword = await bcrypt.hash(preacherData.password, 10)
      const user = await db.user.create({
        data: {
          email: preacherData.email,
          password: hashedPassword,
          name: preacherData.name,
          phone: preacherData.phone,
          role: 'PREACHER',
        },
      })

      await db.preacherProfile.create({
        data: { userId: user.id },
      })

      // Verify user was created
      const createdUser = await db.user.findUnique({
        where: { email: preacherData.email },
        include: { preacherProfile: true },
      })

      expect(createdUser).toBeDefined()
      expect(createdUser?.email).toBe(preacherData.email)
      expect(createdUser?.role).toBe('PREACHER')
      expect(createdUser?.preacherProfile).toBeDefined()
    })

    it('should create a church account successfully', async () => {
      const churchData = TEST_USERS.church1

      const hashedPassword = await bcrypt.hash(churchData.password, 10)
      const user = await db.user.create({
        data: {
          email: churchData.email,
          password: hashedPassword,
          name: churchData.name,
          phone: churchData.phone,
          role: 'CHURCH',
        },
      })

      await db.churchProfile.create({
        data: { userId: user.id },
      })

      const createdUser = await db.user.findUnique({
        where: { email: churchData.email },
        include: { churchProfile: true },
      })

      expect(createdUser).toBeDefined()
      expect(createdUser?.email).toBe(churchData.email)
      expect(createdUser?.role).toBe('CHURCH')
      expect(createdUser?.churchProfile).toBeDefined()
    })

    it('should prevent duplicate email registration', async () => {
      const preacherData = TEST_USERS.preacher1
      const hashedPassword = await bcrypt.hash(preacherData.password, 10)

      // Create first user
      await db.user.create({
        data: {
          email: preacherData.email,
          password: hashedPassword,
          name: preacherData.name,
          phone: preacherData.phone,
          role: 'PREACHER',
        },
      })

      // Try to create duplicate
      await expect(
        db.user.create({
          data: {
            email: preacherData.email,
            password: hashedPassword,
            name: 'Different Name',
            phone: preacherData.phone,
            role: 'CHURCH',
          },
        })
      ).rejects.toThrow()
    })

    it('should hash passwords securely', async () => {
      const preacherData = TEST_USERS.preacher1
      const plainPassword = preacherData.password

      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      // Password should be different from plain text
      expect(hashedPassword).not.toBe(plainPassword)

      // Password should be verifiable
      const isValid = await bcrypt.compare(plainPassword, hashedPassword)
      expect(isValid).toBe(true)

      // Wrong password should not verify
      const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword)
      expect(isInvalid).toBe(false)
    })
  })

  describe('User Roles', () => {
    it('should correctly assign preacher role', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await db.user.create({
        data: {
          email: 'role-test-preacher@test.com',
          password: hashedPassword,
          name: 'Test Preacher',
          role: 'PREACHER',
        },
      })

      expect(user.role).toBe('PREACHER')
      expect(user.isAdmin).toBe(false)
    })

    it('should correctly assign church role', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await db.user.create({
        data: {
          email: 'role-test-church@test.com',
          password: hashedPassword,
          name: 'Test Church',
          role: 'CHURCH',
        },
      })

      expect(user.role).toBe('CHURCH')
      expect(user.isAdmin).toBe(false)
    })

    it('should support admin role', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await db.user.create({
        data: {
          email: 'role-test-admin@test.com',
          password: hashedPassword,
          name: 'Test Admin',
          role: 'PREACHER',
          isAdmin: true,
        },
      })

      expect(user.isAdmin).toBe(true)
    })
  })

  describe('Account Status', () => {
    it('should allow account banning', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await db.user.create({
        data: {
          email: 'ban-test@test.com',
          password: hashedPassword,
          name: 'Ban Test User',
          role: 'PREACHER',
        },
      })

      expect(user.isBanned).toBe(false)

      // Ban the user
      const bannedUser = await db.user.update({
        where: { id: user.id },
        data: {
          isBanned: true,
          bannedReason: 'Violates terms of service',
          bannedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      })

      expect(bannedUser.isBanned).toBe(true)
      expect(bannedUser.bannedReason).toBe('Violates terms of service')
      expect(bannedUser.bannedUntil).toBeDefined()
    })

    it('should allow account unbanning', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await db.user.create({
        data: {
          email: 'unban-test@test.com',
          password: hashedPassword,
          name: 'Unban Test User',
          role: 'PREACHER',
          isBanned: true,
          bannedReason: 'Test ban',
          bannedUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
      })

      // Unban the user
      const unbannedUser = await db.user.update({
        where: { id: user.id },
        data: {
          isBanned: false,
          bannedReason: null,
          bannedUntil: null,
        },
      })

      expect(unbannedUser.isBanned).toBe(false)
      expect(unbannedUser.bannedReason).toBeNull()
      expect(unbannedUser.bannedUntil).toBeNull()
    })
  })
})
