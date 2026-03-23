import { db } from './db'
import { PlanType, SubscriptionStatus } from '@prisma/client'

export interface PlanConfig {
  type: PlanType
  name: string
  price: number
  duration: number // in days
  postingsLimit: number | null // null = unlimited
  features: string[]
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  TRIAL: {
    type: 'TRIAL',
    name: 'Free Trial',
    price: 0,
    duration: 7,
    postingsLimit: 1,
    features: ['1 free posting', '7 day trial', 'Basic support'],
  },
  IMMEDIATE_CALL: {
    type: 'IMMEDIATE_CALL',
    name: 'Immediate Call Posting',
    price: 50,
    duration: 3,
    postingsLimit: 1,
    features: ['1 posting', '3 days active', 'Urgent badge'],
  },
  ONE_MONTH: {
    type: 'ONE_MONTH',
    name: '1 Month',
    price: 99,
    duration: 30,
    postingsLimit: null,
    features: ['Unlimited postings', '30 days', 'Standard support'],
  },
  TWO_MONTHS: {
    type: 'TWO_MONTHS',
    name: '2 Months',
    price: 119,
    duration: 60,
    postingsLimit: null,
    features: ['Unlimited postings', '60 days', 'Extended visibility'],
  },
  THREE_MONTHS: {
    type: 'THREE_MONTHS',
    name: '3 Months',
    price: 193,
    duration: 90,
    postingsLimit: null,
    features: ['Unlimited postings', '90 days', 'Better reach'],
  },
  SIX_MONTHS: {
    type: 'SIX_MONTHS',
    name: '6 Months',
    price: 339,
    duration: 180,
    postingsLimit: null,
    features: ['Unlimited postings', '180 days', 'Maximum exposure'],
  },
  UNLIMITED_YEARLY: {
    type: 'UNLIMITED_YEARLY',
    name: 'Unlimited Yearly',
    price: 1700,
    duration: 365,
    postingsLimit: null,
    features: ['Unlimited postings', '365 days', 'Priority support'],
  },
}

/**
 * Create a trial subscription for a new church
 */
export async function createTrialSubscription(churchProfileId: string) {
  const planConfig = PLAN_CONFIGS.TRIAL
  const now = new Date()
  const endDate = new Date(now.getTime() + planConfig.duration * 24 * 60 * 60 * 1000)

  return db.subscription.create({
    data: {
      churchProfileId,
      planType: 'TRIAL',
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      postingsRemaining: planConfig.postingsLimit,
    },
  })
}

/**
 * Create a paid subscription after successful payment
 */
export async function createPaidSubscription(
  churchProfileId: string,
  planType: PlanType,
  stripeCustomerId: string,
  stripeSubscriptionId: string
) {
  if (planType === 'TRIAL') {
    throw new Error('Cannot create paid subscription with TRIAL plan')
  }

  const planConfig = PLAN_CONFIGS[planType]
  const now = new Date()
  const endDate = new Date(now.getTime() + planConfig.duration * 24 * 60 * 60 * 1000)

  return db.subscription.upsert({
    where: { churchProfileId },
    update: {
      planType,
      status: 'ACTIVE',
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      postingsRemaining: planConfig.postingsLimit,
      cancelledAt: null,
    },
    create: {
      churchProfileId,
      planType,
      status: 'ACTIVE',
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodStart: now,
      currentPeriodEnd: endDate,
      postingsRemaining: planConfig.postingsLimit,
    },
  })
}

/**
 * Get active subscription for a church
 */
export async function getActiveSubscription(churchProfileId: string) {
  const subscription = await db.subscription.findUnique({
    where: { churchProfileId },
  })

  if (!subscription) return null

  // Check if expired
  const now = new Date()
  if (subscription.currentPeriodEnd < now) {
    // Update status to expired
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'EXPIRED' },
    })
    return null
  }

  return subscription
}

/**
 * Check if a church can post (has active subscription with postings remaining)
 */
export async function canPostListing(churchProfileId: string): Promise<boolean> {
  const subscription = await getActiveSubscription(churchProfileId)
  if (!subscription) return false

  // If postingsRemaining is null, it means unlimited
  if (subscription.postingsRemaining === null) return true

  return subscription.postingsRemaining > 0
}

/**
 * Decrement postings remaining when a new listing is posted
 */
export async function decrementPostingsRemaining(churchProfileId: string) {
  const subscription = await db.subscription.findUnique({
    where: { churchProfileId },
  })

  if (!subscription) {
    throw new Error('No active subscription found')
  }

  // Only decrement if limited
  if (subscription.postingsRemaining !== null) {
    return db.subscription.update({
      where: { id: subscription.id },
      data: {
        postingsRemaining: Math.max(0, subscription.postingsRemaining - 1),
      },
    })
  }

  return subscription
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(churchProfileId: string) {
  return db.subscription.update({
    where: { churchProfileId },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  })
}

/**
 * Get plan details with pricing
 */
export function getPlanConfig(planType: PlanType): PlanConfig {
  return PLAN_CONFIGS[planType]
}

/**
 * Get all available plans for display on pricing page
 */
export function getAllPlans(): PlanConfig[] {
  return Object.values(PLAN_CONFIGS)
}
