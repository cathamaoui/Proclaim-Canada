import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find subscription for this user
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      include: {
        plan: true,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        renewalDate: subscription.renewalDate,
        postingsRemaining: subscription.postingsRemaining,
        postingsLimit: subscription.postingsLimit,
        resumeViewsLimit: subscription.resumeViewsLimit,
        resumeViewsUsed: subscription.resumeViewsUsed,
        hasUnlimitedResumes: subscription.hasUnlimitedResumes,
        unlimitedResumesAddOnEnd: subscription.unlimitedResumesAddOnEnd,
      },
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
