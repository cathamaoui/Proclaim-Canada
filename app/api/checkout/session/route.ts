import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPaidSubscription, PLAN_CONFIGS } from '@/lib/subscription'
import { PlanType } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Not authenticated as church' },
        { status: 401 }
      )
    }

    const { planType } = await req.json()

    if (!planType || !PLAN_CONFIGS[planType as PlanType]) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Get church profile
    const churchProfile = await db.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { error: 'Church profile not found' },
        { status: 404 }
      )
    }

    // PHASE 2 IMPLEMENTATION (For now, just create subscription directly)
    // In Phase 3, this will create a Stripe checkout session instead
    
    // For development, we'll create a mock Stripe customer and subscription
    const mockStripeCustomerId = `cus_${Date.now()}`
    const mockStripeSubscriptionId = `sub_${Date.now()}`

    await createPaidSubscription(
      churchProfile.id,
      planType as PlanType,
      mockStripeCustomerId,
      mockStripeSubscriptionId
    )

    // Return redirect URL for listing page
    // In Phase 3, this will be the Stripe checkout URL
    return NextResponse.json(
      {
        url: `${process.env.NEXTAUTH_URL}/listings/new?plan=${planType}&success=true`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
