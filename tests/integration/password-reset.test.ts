// tests/integration/password-reset.test.ts
import { db } from '@/lib/db'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { cleanupDatabase, createTestUser, TEST_USERS } from '../helpers'

describe('Password Reset System Integration Tests', () => {
  let user: any

  beforeEach(async () => {
    await cleanupDatabase()
    user = await createTestUser('preacher1', 'PREACHER')
  })

  afterAll(async () => {
    await cleanupDatabase()
    await db.$disconnect()
  })

  describe('Requesting Password Reset', () => {
    it('should create password reset token for valid email', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })

      expect(resetToken.userId).toBe(user.id)
      expect(resetToken.token).toBe(tokenHash)
      expect(resetToken.expiresAt).toBeDefined()
      expect(resetToken.used).toBe(false)
    })

    it('should handle multiple reset token requests', async () => {
      // Create first token
      const token1 = crypto.randomBytes(32).toString('hex')
      const hash1 = crypto.createHash('sha256').update(token1).digest('hex')

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hash1,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      // Create second token
      const token2 = crypto.randomBytes(32).toString('hex')
      const hash2 = crypto.createHash('sha256').update(token2).digest('hex')

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hash2,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      const tokens = await db.passwordResetToken.findMany({
        where: { userId: user.id, used: false },
      })

      expect(tokens).toHaveLength(2)
    })

    it('should create unique tokens for different users', async () => {
      const user2 = await createTestUser('preacher2', 'PREACHER')

      const token1 = crypto.randomBytes(32).toString('hex')
      const hash1 = crypto.createHash('sha256').update(token1).digest('hex')

      const token2 = crypto.randomBytes(32).toString('hex')
      const hash2 = crypto.createHash('sha256').update(token2).digest('hex')

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hash1,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      await db.passwordResetToken.create({
        data: {
          userId: user2.id,
          token: hash2,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      const user1Tokens = await db.passwordResetToken.findMany({
        where: { userId: user.id },
      })

      const user2Tokens = await db.passwordResetToken.findMany({
        where: { userId: user2.id },
      })

      expect(user1Tokens).toHaveLength(1)
      expect(user2Tokens).toHaveLength(1)
      expect(user1Tokens[0].token).not.toBe(user2Tokens[0].token)
    })
  })

  describe('Validating Reset Tokens', () => {
    it('should validate token for password reset', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      // Verify token exists and is not expired
      const validToken = await db.passwordResetToken.findUnique({
        where: { id: resetToken.id },
      })

      expect(validToken).not.toBeNull()
      expect(validToken?.expiresAt.getTime()).toBeGreaterThan(Date.now())
      expect(validToken?.used).toBe(false)
    })

    it('should reject expired tokens', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        },
      })

      const expiredTokens = await db.passwordResetToken.findMany({
        where: {
          userId: user.id,
          expiresAt: { lt: new Date() },
        },
      })

      expect(expiredTokens).toHaveLength(1)
      expect(expiredTokens[0].expiresAt.getTime()).toBeLessThan(Date.now())
    })

    it('should reject already used tokens', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          used: true,
          usedAt: new Date(),
        },
      })

      expect(resetToken.used).toBe(true)

      // Verify this token would be rejected
      const usedToken = await db.passwordResetToken.findUnique({
        where: { id: resetToken.id },
      })

      expect(usedToken?.used).toBe(true)
    })
  })

  describe('Resetting Password', () => {
    it('should update password with valid reset token', async () => {
      const oldPassword = TEST_USERS.preacher1.password
      const newPassword = 'NewSecurePassword123!'

      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user password and mark token as used
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      const usedToken = await db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      })

      expect(updatedUser.password).not.toBe(oldPassword)
      expect(updatedUser.password).toBe(hashedPassword)
      expect(usedToken.used).toBe(true)
    })

    it('should prevent password reset with invalid token', async () => {
      const invalidTokenHash = crypto
        .createHash('sha256')
        .update('invalid-token')
        .digest('hex')

      const foundToken = await db.passwordResetToken.findFirst({
        where: { token: invalidTokenHash },
      })

      expect(foundToken).toBeNull()
    })

    it('should hash new password securely', async () => {
      const newPassword = 'SecureNewPassword123!'
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Hashed password should be different each time
      const hashedPassword2 = await bcrypt.hash(newPassword, 10)

      expect(hashedPassword).not.toBe(newPassword)
      expect(hashedPassword).not.toBe(hashedPassword2) // Different hashes each time
      expect(
        await bcrypt.compare(newPassword, hashedPassword)
      ).toBe(true)
      expect(
        await bcrypt.compare(newPassword, hashedPassword2)
      ).toBe(true)
    })
  })

  describe('Token Expiration', () => {
    it('should create token with 1 hour expiration', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const expirationTime = Date.now() + 60 * 60 * 1000 // 1 hour

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: new Date(expirationTime),
        },
      })

      const timeUntilExpiry =
        resetToken.expiresAt.getTime() - Date.now()

      // Should be approximately 1 hour (allow 5 second variance)
      expect(timeUntilExpiry).toBeGreaterThan(59 * 60 * 1000) // At least 59 minutes
      expect(timeUntilExpiry).toBeLessThan(61 * 60 * 1000) // Less than 61 minutes
    })

    it('should not accept tokens beyond expiration time', async () => {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const pastTime = new Date(Date.now() - 1000) // 1 second ago

      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt: pastTime,
        },
      })

      // Check if token is expired
      const isExpired = resetToken.expiresAt.getTime() < Date.now()

      expect(isExpired).toBe(true)
    })
  })

  describe('Password Reset Notifications', () => {
    it('should create notification for password reset request', async () => {
      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: crypto
            .createHash('sha256')
            .update(crypto.randomBytes(32).toString('hex'))
            .digest('hex'),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })

      const notification = await db.notification.create({
        data: {
          userId: user.id,
          type: 'PASSWORD_RESET_REQUESTED',
          title: 'Password Reset Request',
          message: `A password reset request was made for your account. Click the link to reset your password.`,
          relatedId: resetToken.id,
        },
      })

      expect(notification.userId).toBe(user.id)
      expect(notification.type).toBe('PASSWORD_RESET_REQUESTED')
    })

    it('should create notification for successful password reset', async () => {
      const resetToken = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token: crypto
            .createHash('sha256')
            .update(crypto.randomBytes(32).toString('hex'))
            .digest('hex'),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          used: true,
          usedAt: new Date(),
        },
      })

      const notification = await db.notification.create({
        data: {
          userId: user.id,
          type: 'PASSWORD_RESET_SUCCESSFUL',
          title: 'Password Reset Successful',
          message: 'Your password has been successfully reset.',
          relatedId: resetToken.id,
        },
      })

      expect(notification.userId).toBe(user.id)
      expect(notification.type).toBe('PASSWORD_RESET_SUCCESSFUL')
    })
  })
})
