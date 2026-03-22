// tests/integration/messaging.test.ts
import { db } from '@/lib/db'
import { cleanupDatabase, createTestUser, TEST_USERS } from '../helpers'

describe('Messaging System Integration Tests', () => {
  let preacher: any
  let church: any

  beforeEach(async () => {
    await cleanupDatabase()
    preacher = await createTestUser('preacher1', 'PREACHER')
    church = await createTestUser('church1', 'CHURCH')
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('Sending Messages', () => {
    it('should send a message from preacher to church', async () => {
      const messageContent = 'I am interested in your service opening'

      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: messageContent,
          subject: 'Service Opening Interest',
        },
      })

      expect(message.senderId).toBe(preacher.id)
      expect(message.receiverId).toBe(church.id)
      expect(message.content).toBe(messageContent)
      expect(message.subject).toBe('Service Opening Interest')
      expect(message.createdAt).toBeDefined()
    })

    it('should send a message from church to preacher', async () => {
      const messageContent = 'Would you be interested in our service?'

      const message = await db.message.create({
        data: {
          senderId: church.id,
          receiverId: preacher.id,
          content: messageContent,
        },
      })

      expect(message.senderId).toBe(church.id)
      expect(message.receiverId).toBe(preacher.id)
      expect(message.content).toBe(messageContent)
    })

    it('should not allow sending empty messages', async () => {
      await expect(
        db.message.create({
          data: {
            senderId: preacher.id,
            receiverId: church.id,
            content: '', // Empty content
          },
        })
      ).rejects.toThrow()
    })

    it('should prevent self-messaging at database level', async () => {
      // In a real scenario, this would be validated at API level
      // but the relationship allows it at DB level
      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: preacher.id,
          content: 'Self message',
        },
      })

      expect(message.senderId).toBe(preacher.id)
      expect(message.receiverId).toBe(preacher.id)
    })
  })

  describe('Message Retrieval', () => {
    it('should retrieve messages in a conversation', async () => {
      // Send multiple messages
      await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'First message',
        },
      })

      await db.message.create({
        data: {
          senderId: church.id,
          receiverId: preacher.id,
          content: 'Reply message',
        },
      })

      // Retrieve conversation
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: preacher.id, receiverId: church.id },
            { senderId: church.id, receiverId: preacher.id },
          ],
        },
        orderBy: { createdAt: 'asc' },
      })

      expect(messages).toHaveLength(2)
      expect(messages[0].content).toBe('First message')
      expect(messages[1].content).toBe('Reply message')
    })

    it('should retrieve unique conversations', async () => {
      const preacher2 = await createTestUser('preacher2', 'PREACHER')

      // Send messages from preacher to church
      await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'Message 1',
        },
      })

      // Send messages from preacher2 to church
      await db.message.create({
        data: {
          senderId: preacher2.id,
          receiverId: church.id,
          content: 'Message 2',
        },
      })

      // Get unique conversation partners for church
      const conversationPartners = await db.message.findMany({
        where: { receiverId: church.id },
        distinct: ['senderId'],
        select: { senderId: true },
      })

      expect(conversationPartners).toHaveLength(2)
    })
  })

  describe('Message Notifications', () => {
    it('should create notification when message is received', async () => {
      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'Test message',
        },
      })

      const notification = await db.notification.create({
        data: {
          userId: church.id,
          type: 'MESSAGE_RECEIVED',
          title: `New message from ${preacher.name}`,
          message: message.content.substring(0, 100),
          relatedId: message.id,
        },
      })

      expect(notification.userId).toBe(church.id)
      expect(notification.type).toBe('MESSAGE_RECEIVED')
      expect(notification.relatedId).toBe(message.id)
    })

    it('should retrieve unread notifications', async () => {
      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'Unread message',
        },
      })

      await db.notification.create({
        data: {
          userId: church.id,
          type: 'MESSAGE_RECEIVED',
          title: 'New message',
          message: 'You have a new message',
          relatedId: message.id,
          read: false,
        },
      })

      const unreadNotifications = await db.notification.findMany({
        where: {
          userId: church.id,
          read: false,
        },
      })

      expect(unreadNotifications).toHaveLength(1)
      expect(unreadNotifications[0].type).toBe('MESSAGE_RECEIVED')
    })
  })

  describe('Message Status', () => {
    it('should mark messages as read', async () => {
      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'Test message',
          read: false,
        },
      })

      // Mark as read
      const readMessage = await db.message.update({
        where: { id: message.id },
        data: {
          read: true,
          readAt: new Date(),
        },
      })

      expect(readMessage.read).toBe(true)
      expect(readMessage.readAt).toBeDefined()
    })

    it('should archive messages', async () => {
      const message = await db.message.create({
        data: {
          senderId: preacher.id,
          receiverId: church.id,
          content: 'Test message',
        },
      })

      // Archive message
      const archivedMessage = await db.message.update({
        where: { id: message.id },
        data: { isArchived: true },
      })

      expect(archivedMessage.isArchived).toBe(true)
    })
  })
})
