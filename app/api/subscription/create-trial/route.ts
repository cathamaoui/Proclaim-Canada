import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createTrialSubscription, getActiveSubscription } from '@/lib/subscription'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Not authenticated as church' },
        { status: 401 }
      )
    }

    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { error: 'Church profile not found' },
        { status: 404 }
      )
    }

    // Check if they already have an active subscription
    const existingSubscription = await getActiveSubscription(churchProfile.id)
    if (existingSubscription) {
      return NextResponse.json(
        { 
          message: 'Church already has an active subscription',
          subscription: existingSubscription
        },
        { status: 200 }
      )
    }

    // Create trial subscription
    const subscription = await createTrialSubscription(churchProfile.id)

    return NextResponse.json(
      {
        message: 'Trial subscription created successfully',
        subscription: {
          planType: subscription.planType,
          postingsRemaining: subscription.postingsRemaining,
          expiresAt: subscription.currentPeriodEnd,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create trial subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to create trial subscription' },
      { status: 500 }
    )
  }
}
