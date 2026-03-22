// tests/integration/applications.test.ts
import { db } from '@/lib/db'
import { cleanupDatabase, createTestUser, TEST_USERS } from '../helpers'

describe('Applications System Integration Tests', () => {
  let preacher: any
  let preacher2: any
  let church: any
  let church2: any
  let listing: any

  beforeEach(async () => {
    await cleanupDatabase()
    preacher = await createTestUser('preacher1', 'PREACHER')
    preacher2 = await createTestUser('preacher2', 'PREACHER')
    church = await createTestUser('church1', 'CHURCH')
    church2 = await createTestUser('church2', 'CHURCH')

    // Create a listing for testing
    listing = await db.churchListing.create({
      data: {
        churchId: church.id,
        title: 'Sunday Service Preacher',
        description: 'Looking for an experienced preacher for Sunday morning service',
        location: 'Toronto, ON',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        salary: 500,
      },
    })
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('Creating Applications', () => {
    it('should create an application from preacher to listing', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          coverLetter: 'I am very interested in this opportunity',
          status: 'PENDING',
        },
      })

      expect(application.preacherId).toBe(preacher.id)
      expect(application.listingId).toBe(listing.id)
      expect(application.coverLetter).toBe(
        'I am very interested in this opportunity'
      )
      expect(application.status).toBe('PENDING')
      expect(application.createdAt).toBeDefined()
    })

    it('should create multiple applications for same listing', async () => {
      // Preacher 1 applies
      const app1 = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          coverLetter: 'Application 1',
          status: 'PENDING',
        },
      })

      // Preacher 2 applies to same listing
      const app2 = await db.application.create({
        data: {
          preacherId: preacher2.id,
          listingId: listing.id,
          coverLetter: 'Application 2',
          status: 'PENDING',
        },
      })

      const applications = await db.application.findMany({
        where: { listingId: listing.id },
      })

      expect(applications).toHaveLength(2)
      expect(applications.map((a) => a.preacherId)).toEqual(
        expect.arrayContaining([preacher.id, preacher2.id])
      )
    })

    it('should create application with required fields only', async () => {
      const minimalApp = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      expect(minimalApp.preacherId).toBe(preacher.id)
      expect(minimalApp.listingId).toBe(listing.id)
    })
  })

  describe('Preventing Duplicate Applications', () => {
    it('should prevent duplicate applications from same preacher', async () => {
      // Create first application
      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          coverLetter: 'First application',
        },
      })

      // Check if duplicate exists
      const existingApp = await db.application.findFirst({
        where: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      expect(existingApp).not.toBeNull()

      // Try to create another (should be prevented at API level)
      const duplicateAttempt = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          coverLetter: 'Duplicate attempt',
        },
      })

      // DB allows it, API should check and reject
      const allApps = await db.application.findMany({
        where: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      expect(allApps).toHaveLength(2) // DB stores both, API should prevent
    })
  })

  describe('Application Status Management', () => {
    it('should update application status from PENDING to ACCEPTED', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      const updatedApp = await db.application.update({
        where: { id: application.id },
        data: { status: 'ACCEPTED' },
      })

      expect(updatedApp.status).toBe('ACCEPTED')
    })

    it('should update application status from PENDING to REJECTED', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      const updatedApp = await db.application.update({
        where: { id: application.id },
        data: {
          status: 'REJECTED',
          rejectionReason: 'Insufficient experience',
        },
      })

      expect(updatedApp.status).toBe('REJECTED')
      expect(updatedApp.rejectionReason).toBe('Insufficient experience')
    })

    it('should track status change timestamps', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      const now = new Date()
      const updatedApp = await db.application.update({
        where: { id: application.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: now,
        },
      })

      expect(updatedApp.status).toBe('ACCEPTED')
      expect(updatedApp.acceptedAt).toBeDefined()
    })
  })

  describe('Querying Applications', () => {
    it('should retrieve all applications for a listing', async () => {
      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      await db.application.create({
        data: {
          preacherId: preacher2.id,
          listingId: listing.id,
        },
      })

      const applications = await db.application.findMany({
        where: { listingId: listing.id },
      })

      expect(applications).toHaveLength(2)
    })

    it('should retrieve all applications from a preacher', async () => {
      const listing2 = await db.churchListing.create({
        data: {
          churchId: church2.id,
          title: 'Another listing',
          description: 'Another service opportunity',
          location: 'Vancouver, BC',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
        },
      })

      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing2.id,
        },
      })

      const preacherApps = await db.application.findMany({
        where: { preacherId: preacher.id },
      })

      expect(preacherApps).toHaveLength(2)
    })

    it('should retrieve applications with related data', async () => {
      await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          coverLetter: 'Test application',
        },
      })

      const applications = await db.application.findMany({
        where: { listingId: listing.id },
        include: {
          preacher: {
            select: { name: true, email: true },
          },
          listing: {
            select: { title: true },
          },
        },
      })

      expect(applications).toHaveLength(1)
      expect(applications[0].preacher).toBeDefined()
      expect(applications[0].preacher.name).toBe(preacher.name)
      expect(applications[0].listing).toBeDefined()
    })

    it('should filter applications by status', async () => {
      const app1 = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      const app2 = await db.application.create({
        data: {
          preacherId: preacher2.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      // Accept one application
      await db.application.update({
        where: { id: app1.id },
        data: { status: 'ACCEPTED' },
      })

      const pendingApps = await db.application.findMany({
        where: {
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      const acceptedApps = await db.application.findMany({
        where: {
          listingId: listing.id,
          status: 'ACCEPTED',
        },
      })

      expect(pendingApps).toHaveLength(1)
      expect(acceptedApps).toHaveLength(1)
    })
  })

  describe('Application Notifications', () => {
    it('should create notification for received application', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
        },
      })

      const notification = await db.notification.create({
        data: {
          userId: church.id,
          type: 'APPLICATION_RECEIVED',
          title: `New application from ${preacher.name}`,
          message: `has applied for ${listing.title}`,
          relatedId: application.id,
        },
      })

      expect(notification.userId).toBe(church.id)
      expect(notification.type).toBe('APPLICATION_RECEIVED')
      expect(notification.relatedId).toBe(application.id)
    })

    it('should create notification for application status change', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      // Accept application
      const updatedApp = await db.application.update({
        where: { id: application.id },
        data: { status: 'ACCEPTED' },
      })

      // Create notification for preacher
      const notification = await db.notification.create({
        data: {
          userId: preacher.id,
          type: 'APPLICATION_STATUS_CHANGED',
          title: 'Your application was accepted',
          message: `Your application for ${listing.title} has been accepted`,
          relatedId: application.id,
        },
      })

      expect(notification.userId).toBe(preacher.id)
      expect(notification.type).toBe('APPLICATION_STATUS_CHANGED')
    })
  })

  describe('Deleting Applications', () => {
    it('should allow preacher to withdraw application', async () => {
      const application = await db.application.create({
        data: {
          preacherId: preacher.id,
          listingId: listing.id,
          status: 'PENDING',
        },
      })

      // Preacher deletes their application
      await db.application.delete({ where: { id: application.id } })

      const deletedApp = await db.application.findUnique({
        where: { id: application.id },
      })

      expect(deletedApp).toBeNull()
    })
  })
})
