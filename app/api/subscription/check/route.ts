import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveSubscription } from '@/lib/subscription'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { hasSubscription: false, reason: 'Not authenticated as church' },
        { status: 401 }
      )
    }

    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { hasSubscription: false, reason: 'Church profile not found' },
        { status: 404 }
      )
    }

    const subscription = await getActiveSubscription(churchProfile.id)

    if (!subscription) {
      return NextResponse.json(
        { hasSubscription: false, reason: 'No active subscription' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        hasSubscription: true,
        subscription: {
          planType: subscription.planType,
          postingsRemaining: subscription.postingsRemaining,
          expiresAt: subscription.endDate,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription check error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { hasSubscription: false, error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
