import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getActiveSubscription } from '@/lib/subscription'

/**
 * Check if church user has active subscription
 * Returns subscription or null if not active/expired
 */
export async function getChurchSubscription() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'CHURCH') {
    return null
  }

  // Get church profile to get churchProfileId
  const churchProfile = await db.churchProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!churchProfile) {
    return null
  }

  return getActiveSubscription(churchProfile.id)
}

/**
 * Check if church can post listing
 */
export async function canPostListing(): Promise<{ canPost: boolean; reason?: string }> {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'CHURCH') {
    return { canPost: false, reason: 'Not authenticated as church' }
  }

  const churchProfile = await db.churchProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!churchProfile) {
    return { canPost: false, reason: 'Church profile not found' }
  }

  const subscription = await getActiveSubscription(churchProfile.id)

  if (!subscription) {
    return {
      canPost: false,
      reason: 'No active subscription. Please purchase a plan to post opportunities.',
    }
  }

  // Check postings remaining
  if (subscription.postingsRemaining !== null && subscription.postingsRemaining <= 0) {
    return {
      canPost: false,
      reason: 'No postings remaining on current plan. Please upgrade or renew your subscription.',
    }
  }

  return { canPost: true }
}
