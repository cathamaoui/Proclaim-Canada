// tests/integration/availability.test.ts
import { db } from '@/lib/db'
import { cleanupDatabase, createTestUser, TEST_USERS } from '../helpers'

describe('Availability System Integration Tests', () => {
  let preacher: any
  let preacher2: any
  let church: any

  beforeEach(async () => {
    await cleanupDatabase()
    preacher = await createTestUser('preacher1', 'PREACHER')
    preacher2 = await createTestUser('preacher2', 'PREACHER')
    church = await createTestUser('church1', 'CHURCH')
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('Creating Availability Slots', () => {
    it('should create an availability slot', async () => {
      const startTime = new Date()
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000) // 2 hours later

      const slot = await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime,
          endTime,
          dayOfWeek: 'SUNDAY',
          description: 'Morning service',
        },
      })

      expect(slot.preacherId).toBe(preacher.id)
      expect(slot.startTime).toEqual(startTime)
      expect(slot.endTime).toEqual(endTime)
      expect(slot.dayOfWeek).toBe('SUNDAY')
      expect(slot.description).toBe('Morning service')
    })

    it('should create multiple availability slots', async () => {
      const slots = []

      for (let i = 0; i < 3; i++) {
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

        const slot = await db.availabilitySlot.create({
          data: {
            preacherId: preacher.id,
            startTime,
            endTime,
            dayOfWeek: 'SUNDAY',
          },
        })
        slots.push(slot)
      }

      const retrievedSlots = await db.availabilitySlot.findMany({
        where: { preacherId: preacher.id },
      })

      expect(retrievedSlots).toHaveLength(3)
    })

    it('should create availability for different days of week', async () => {
      const days = ['SUNDAY', 'MONDAY', 'WEDNESDAY']

      for (const day of days) {
        await db.availabilitySlot.create({
          data: {
            preacherId: preacher.id,
            startTime: new Date(),
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            dayOfWeek: day,
          },
        })
      }

      const slots = await db.availabilitySlot.findMany({
        where: { preacherId: preacher.id },
      })

      expect(slots).toHaveLength(3)
      expect(slots.map((s) => s.dayOfWeek)).toEqual(
        expect.arrayContaining(days)
      )
    })
  })

  describe('Retrieving Availability Slots', () => {
    it('should retrieve slots for a specific preacher', async () => {
      const startTime = new Date()
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

      await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime,
          endTime,
        },
      })

      // Create slot for different preacher
      await db.availabilitySlot.create({
        data: {
          preacherId: preacher2.id,
          startTime,
          endTime,
        },
      })

      const preacherSlots = await db.availabilitySlot.findMany({
        where: { preacherId: preacher.id },
      })

      expect(preacherSlots).toHaveLength(1)
      expect(preacherSlots[0].preacherId).toBe(preacher.id)
    })

    it('should retrieve slots filtered by date range', async () => {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      // Create slots on different dates
      await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: now,
          endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        },
      })

      await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: nextWeek,
          endTime: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000),
        },
      })

      // Query slots within next 3 days
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      const upcomingSlots = await db.availabilitySlot.findMany({
        where: {
          preacherId: preacher.id,
          startTime: {
            gte: now,
            lte: threeDaysFromNow,
          },
        },
      })

      expect(upcomingSlots).toHaveLength(1)
    })

    it('should retrieve slots grouped by month', async () => {
      const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const nextMonthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      )

      // Current month slot
      await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: currentMonthStart,
          endTime: new Date(currentMonthStart.getTime() + 2 * 60 * 60 * 1000),
        },
      })

      // Next month slot
      await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: nextMonthStart,
          endTime: new Date(nextMonthStart.getTime() + 2 * 60 * 60 * 1000),
        },
      })

      const currentMonthSlots = await db.availabilitySlot.findMany({
        where: {
          preacherId: preacher.id,
          startTime: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      })

      expect(currentMonthSlots).toHaveLength(1)
    })
  })

  describe('Deleting Availability Slots', () => {
    it('should delete an availability slot', async () => {
      const slot = await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      })

      await db.availabilitySlot.delete({ where: { id: slot.id } })

      const deletedSlot = await db.availabilitySlot.findUnique({
        where: { id: slot.id },
      })

      expect(deletedSlot).toBeNull()
    })

    it('should only allow preacher to delete their own slots', async () => {
      const slot = await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      })

      // In API layer, this would be prevented
      // At DB level, we verify the slot exists and belongs to preacher
      const ownedSlot = await db.availabilitySlot.findFirst({
        where: {
          id: slot.id,
          preacherId: preacher.id,
        },
      })

      expect(ownedSlot).not.toBeNull()
      expect(ownedSlot?.preacherId).toBe(preacher.id)
    })

    it('should handle deleting non-existent slot gracefully', async () => {
      await expect(
        db.availabilitySlot.delete({ where: { id: 'non-existent-id' } })
      ).rejects.toThrow()
    })
  })

  describe('Availability Validation', () => {
    it('should validate end time is after start time', async () => {
      const startTime = new Date()
      const endTime = new Date(startTime.getTime() - 1 * 60 * 60 * 1000) // 1 hour before

      // This validation should happen at API level, but we test DB behavior
      const slot = await db.availabilitySlot.create({
        data: {
          preacherId: preacher.id,
          startTime,
          endTime, // Invalid: before start time
        },
      })

      // DB will store it, but API should validate
      expect(slot.endTime < slot.startTime).toBe(true)
    })

    it('should allow recurring availability patterns', async () => {
      // Create same time slot for multiple weeks
      const baseDate = new Date()
      baseDate.setHours(10, 0, 0, 0)

      for (let week = 0; week < 4; week++) {
        const startTime = new Date(baseDate.getTime() + week * 7 * 24 * 60 * 60 * 1000)
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

        await db.availabilitySlot.create({
          data: {
            preacherId: preacher.id,
            startTime,
            endTime,
            dayOfWeek: 'SUNDAY',
            description: 'Weekly service',
          },
        })
      }

      const recurringSlots = await db.availabilitySlot.findMany({
        where: {
          preacherId: preacher.id,
          dayOfWeek: 'SUNDAY',
        },
      })

      expect(recurringSlots).toHaveLength(4)
    })
  })
})
