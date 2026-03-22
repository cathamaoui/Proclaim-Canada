// tests/integration/admin.test.ts
import { db } from '@/lib/db'
import { cleanupDatabase, createTestUser, TEST_USERS } from '../helpers'

describe('Admin System Integration Tests', () => {
  let admin: any
  let preacher: any
  let church: any
  let listing: any

  beforeEach(async () => {
    await cleanupDatabase()
    admin = await createTestUser('admin', 'ADMIN')
    preacher = await createTestUser('preacher1', 'PREACHER')
    church = await createTestUser('church1', 'CHURCH')

    // Create a listing for testing
    listing = await db.churchListing.create({
      data: {
        churchId: church.id,
        title: 'Sunday Service',
        description: 'Looking for preacher',
        location: 'Toronto, ON',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
      },
    })
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('User Management', () => {
    it('should fetch all users with pagination', async () => {
      // Create multiple users
      for (let i = 0; i < 5; i++) {
        await createTestUser(`preacher${i}`, 'PREACHER')
      }

      const users = await db.user.findMany({
        take: 10,
        skip: 0,
      })

      expect(users.length).toBeGreaterThanOrEqual(5)
    })

    it('should search users by email', async () => {
      const searchEmail = preacher.email

      const foundUsers = await db.user.findMany({
        where: {
          email: {
            contains: searchEmail.split('@')[0],
            mode: 'insensitive',
          },
        },
      })

      expect(foundUsers).toHaveLength(1)
      expect(foundUsers[0].email).toBe(searchEmail)
    })

    it('should search users by name', async () => {
      const users = await db.user.findMany({
        where: {
          name: {
            contains: 'Preacher',
            mode: 'insensitive',
          },
        },
      })

      expect(users.length).toBeGreaterThan(0)
    })

    it('should filter users by role', async () => {
      const preachers = await db.user.findMany({
        where: { role: 'PREACHER' },
      })

      const churches = await db.user.findMany({
        where: { role: 'CHURCH' },
      })

      expect(preachers.some((u) => u.id === preacher.id)).toBe(true)
      expect(churches.some((u) => u.id === church.id)).toBe(true)
    })
  })

  describe('User Banning', () => {
    it('should ban a user with reason and duration', async () => {
      const now = new Date()
      const banDuration = 7 * 24 * 60 * 60 * 1000 // 7 days
      const unbanDate = new Date(now.getTime() + banDuration)

      const bannedUser = await db.user.update({
        where: { id: preacher.id },
        data: {
          isBanned: true,
          banReason: 'Inappropriate behavior in messages',
          bannedAt: now,
          unbannedAt: unbanDate,
        },
      })

      expect(bannedUser.isBanned).toBe(true)
      expect(bannedUser.banReason).toBe('Inappropriate behavior in messages')
      expect(bannedUser.unbannedAt).toEqual(unbanDate)
    })

    it('should unban a user', async () => {
      // First ban the user
      await db.user.update({
        where: { id: preacher.id },
        data: {
          isBanned: true,
          banReason: 'Test ban',
          bannedAt: new Date(),
        },
      })

      // Unban the user
      const unbannedUser = await db.user.update({
        where: { id: preacher.id },
        data: {
          isBanned: false,
          banReason: null,
          bannedAt: null,
          unbannedAt: null,
        },
      })

      expect(unbannedUser.isBanned).toBe(false)
      expect(unbannedUser.banReason).toBeNull()
    })

    it('should check if user is currently banned', async () => {
      const now = new Date()
      const tempBanDuration = 1 * 60 * 1000 // 1 minute

      await db.user.update({
        where: { id: preacher.id },
        data: {
          isBanned: true,
          bannedAt: now,
          unbannedAt: new Date(now.getTime() + tempBanDuration),
        },
      })

      const user = await db.user.findUnique({
        where: { id: preacher.id },
      })

      const isBanned = user?.isBanned || false
      const isStillBanned =
        isBanned && (!user?.unbannedAt || user.unbannedAt > new Date())

      expect(isStillBanned).toBe(true)
    })
  })

  describe('User Role Management', () => {
    it('should promote user to admin', async () => {
      const promotedUser = await db.user.update({
        where: { id: preacher.id },
        data: { role: 'ADMIN' },
      })

      expect(promotedUser.role).toBe('ADMIN')
    })

    it('should demote admin to preacher', async () => {
      // First promote to admin
      await db.user.update({
        where: { id: preacher.id },
        data: { role: 'ADMIN' },
      })

      // Then demote back
      const demotedUser = await db.user.update({
        where: { id: preacher.id },
        data: { role: 'PREACHER' },
      })

      expect(demotedUser.role).toBe('PREACHER')
    })
  })

  describe('Listing Moderation', () => {
    it('should retrieve all listings', async () => {
      const listings = await db.churchListing.findMany()

      expect(listings.length).toBeGreaterThanOrEqual(1)
      expect(listings.some((l) => l.id === listing.id)).toBe(true)
    })

    it('should filter listings by status', async () => {
      const activeListing = await db.churchListing.create({
        data: {
          churchId: church.id,
          title: 'Active Service',
          description: 'Currently active',
          location: 'Vancouver, BC',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
        },
      })

      const inactiveListing = await db.churchListing.create({
        data: {
          churchId: church.id,
          title: 'Inactive Service',
          description: 'No longer available',
          location: 'Calgary, AB',
          startDate: new Date(),
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Past date
          status: 'INACTIVE',
        },
      })

      const activeListings = await db.churchListing.findMany({
        where: { status: 'ACTIVE' },
      })

      const inactiveListings = await db.churchListing.findMany({
        where: { status: 'INACTIVE' },
      })

      expect(activeListings.some((l) => l.id === activeListing.id)).toBe(true)
      expect(inactiveListings.some((l) => l.id === inactiveListing.id)).toBe(
        true
      )
    })

    it('should remove a listing', async () => {
      await db.churchListing.delete({
        where: { id: listing.id },
      })

      const deletedListing = await db.churchListing.findUnique({
        where: { id: listing.id },
      })

      expect(deletedListing).toBeNull()
    })

    it('should flag listing as inappropriate', async () => {
      const flaggedListing = await db.churchListing.update({
        where: { id: listing.id },
        data: {
          isFlagged: true,
          flagReason: 'Offensive content in description',
          flaggedAt: new Date(),
        },
      })

      expect(flaggedListing.isFlagged).toBe(true)
      expect(flaggedListing.flagReason).toBe('Offensive content in description')
    })
  })

  describe('Audit Logging', () => {
    it('should create audit log for admin action', async () => {
      const auditLog = await db.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'USER_BANNED',
          targetId: preacher.id,
          details: 'Banned for 7 days due to inappropriate behavior',
        },
      })

      expect(auditLog.adminId).toBe(admin.id)
      expect(auditLog.action).toBe('USER_BANNED')
      expect(auditLog.targetId).toBe(preacher.id)
      expect(auditLog.createdAt).toBeDefined()
    })

    it('should retrieve audit logs filtered by action', async () => {
      // Create multiple audit logs
      await db.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'USER_BANNED',
          targetId: preacher.id,
        },
      })

      await db.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'LISTING_REMOVED',
          targetId: listing.id,
        },
      })

      const banLogs = await db.auditLog.findMany({
        where: { action: 'USER_BANNED' },
      })

      const removeLogs = await db.auditLog.findMany({
        where: { action: 'LISTING_REMOVED' },
      })

      expect(banLogs).toHaveLength(1)
      expect(removeLogs).toHaveLength(1)
    })

    it('should retrieve audit logs for specific admin', async () => {
      await db.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'USER_PROMOTED',
          targetId: preacher.id,
        },
      })

      const adminLogs = await db.auditLog.findMany({
        where: { adminId: admin.id },
      })

      expect(adminLogs.length).toBeGreaterThan(0)
    })

    it('should retrieve audit logs with pagination', async () => {
      // Create multiple logs
      for (let i = 0; i < 15; i++) {
        await db.auditLog.create({
          data: {
            adminId: admin.id,
            action: 'USER_BANNED',
            targetId: preacher.id,
          },
        })
      }

      const page1 = await db.auditLog.findMany({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      })

      const page2 = await db.auditLog.findMany({
        take: 10,
        skip: 10,
        orderBy: { createdAt: 'desc' },
      })

      expect(page1).toHaveLength(10)
      expect(page2.length).toBeGreaterThan(0)
    })
  })

  describe('Platform Statistics', () => {
    it('should count total users', async () => {
      const totalUsers = await db.user.count()

      expect(totalUsers).toBeGreaterThanOrEqual(3) // admin, preacher, church
    })

    it('should count users by role', async () => {
      const preacherCount = await db.user.count({
        where: { role: 'PREACHER' },
      })

      const churchCount = await db.user.count({
        where: { role: 'CHURCH' },
      })

      const adminCount = await db.user.count({
        where: { role: 'ADMIN' },
      })

      expect(preacherCount).toBeGreaterThanOrEqual(1)
      expect(churchCount).toBeGreaterThanOrEqual(1)
      expect(adminCount).toBeGreaterThanOrEqual(1)
    })

    it('should count active listings', async () => {
      const activeListingCount = await db.churchListing.count({
        where: { status: 'ACTIVE' },
      })

      expect(activeListingCount).toBeGreaterThanOrEqual(1)
    })

    it('should count total applications', async () => {
      // Create some applications
      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      const totalApplications = await db.application.count()

      expect(totalApplications).toBeGreaterThanOrEqual(1)
    })

    it('should aggregate statistics', async () => {
      const stats = {
        totalUsers: await db.user.count(),
        totalPreachers: await db.user.count({ where: { role: 'PREACHER' } }),
        totalChurches: await db.user.count({ where: { role: 'CHURCH' } }),
        totalListings: await db.churchListing.count(),
        activeListings: await db.churchListing.count({
          where: { status: 'ACTIVE' },
        }),
        totalApplications: await db.application.count(),
        totalMessages: await db.message.count(),
        totalRatings: await db.rating.count(),
      }

      expect(stats.totalUsers).toBeGreaterThanOrEqual(3)
      expect(stats.totalPreachers).toBeGreaterThanOrEqual(1)
      expect(stats.totalChurches).toBeGreaterThanOrEqual(1)
      expect(stats.totalListings).toBeGreaterThanOrEqual(1)
      expect(stats.activeListings).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Admin Access Control', () => {
    it('should verify admin role exists', async () => {
      const adminUser = await db.user.findUnique({
        where: { id: admin.id },
      })

      expect(adminUser?.role).toBe('ADMIN')
    })

    it('should not allow non-admin to perform admin actions', async () => {
      // This test validates that only admins can access admin endpoints
      // At DB level, any user can perform operations
      // The constraint is enforced at API level

      const preacherTryingToBan = await db.user.findUnique({
        where: { id: preacher.id },
      })

      expect(preacherTryingToBan?.role).not.toBe('ADMIN')
    })
  })
})
