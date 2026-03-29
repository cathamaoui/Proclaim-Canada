import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CHURCH') {
      return NextResponse.json({ error: 'Only churches can purchase add-ons' }, { status: 403 })
    }

    const body = await req.json()
    const { action } = body // 'add' or 'cancel'

    // Get church profile and subscription
    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
      include: { subscription: true },
    })

    if (!churchProfile || !churchProfile.subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
    }

    if (action === 'add') {
      // Add 1 month of unlimited resume access
      // In production, this would integrate with Stripe/payment processor
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)

      const updated = await prisma.subscription.update({
        where: { id: churchProfile.subscription.id },
        data: {
          hasUnlimitedResumes: true,
          unlimitedResumesAddOnEnd: endDate,
        },
      })

      return NextResponse.json(
        {
          message: 'Resume Unlimited add-on activated successfully',
          subscription: updated,
          details: {
            price: '$99',
            period: '1 month',
            expiresAt: endDate.toISOString(),
            renewalNotice: 'This add-on will auto-renew monthly unless cancelled',
          },
        },
        { status: 200 }
      )
    } else if (action === 'cancel') {
      // Cancel unlimited resume access (takes effect after current period ends)
      const updated = await prisma.subscription.update({
        where: { id: churchProfile.subscription.id },
        data: {
          hasUnlimitedResumes: false,
        },
      })

      return NextResponse.json(
        {
          message: 'Resume Unlimited will expire at the end of your current period',
          subscription: updated,
          expiresAt: churchProfile.subscription.unlimitedResumesAddOnEnd,
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Resume add-on error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process add-on'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscription details
    const subscription = await prisma.subscription.findFirst({
      where: {
        churchProfile: {
          userId: session.user.id,
        },
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    // Get recent resume views
    const recentViews = await prisma.resumeView.findMany({
      where: { subscriptionId: subscription.id },
      include: {
        preacher: {
          select: { name: true, email: true },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    })

    // Check if monthly counter needs reset
    const now = new Date()
    const resetDate = new Date(subscription.resumeViewsResetDate)
    let resumeViewsUsed = subscription.resumeViewsUsed

    if (
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear()
    ) {
      resumeViewsUsed = 0
    }

    return NextResponse.json(
      {
        subscription: {
          id: subscription.id,
          planType: subscription.planType,
          resumeViewsLimit: subscription.resumeViewsLimit,
          resumeViewsUsed: resumeViewsUsed,
          resumeViewsRemaining: subscription.resumeViewsLimit - resumeViewsUsed,
          hasUnlimitedResumes: subscription.hasUnlimitedResumes,
          unlimitedResumesAddOnEnd: subscription.unlimitedResumesAddOnEnd,
          unlimitedActive:
            subscription.hasUnlimitedResumes &&
            subscription.unlimitedResumesAddOnEnd &&
            new Date() < new Date(subscription.unlimitedResumesAddOnEnd),
        },
        recentViews,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get resume quota error:', error)
    return NextResponse.json({ error: 'Failed to load quota' }, { status: 500 })
  }
}
