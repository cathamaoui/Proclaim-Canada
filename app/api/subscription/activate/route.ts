import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendSubscriptionRenewalNotification } from '@/lib/email-notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planType } = body

    if (!planType) {
      return NextResponse.json({ error: 'Plan type required' }, { status: 400 })
    }

    // Get church profile
    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json({ error: 'Church profile not found' }, { status: 404 })
    }

    // Calculate postings remaining based on plan
    const postingsMap: Record<string, number | null> = {
      TRIAL: 1,
      IMMEDIATE_CALL: 1,
      ONE_MONTH: 3,
      TWO_MONTHS: 5,
      THREE_MONTHS: 10,
      SIX_MONTHS: 20,
      UNLIMITED_YEARLY: null, // unlimited
    }

    // Resume views limit per plan
    const resumeViewsMap: Record<string, number> = {
      TRIAL: 0,
      IMMEDIATE_CALL: 10,
      ONE_MONTH: 25,
      TWO_MONTHS: 50,
      THREE_MONTHS: 75,
      SIX_MONTHS: 150,
      UNLIMITED_YEARLY: 100,
    }

    // Calculate subscription dates
    const now = new Date()
    const durations: Record<string, number> = {
      TRIAL: 7,
      IMMEDIATE_CALL: 30,
      ONE_MONTH: 30,
      TWO_MONTHS: 60,
      THREE_MONTHS: 90,
      SIX_MONTHS: 180,
      UNLIMITED_YEARLY: 365,
    }

    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + (durations[planType] || 30))

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        planType: planType as any,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
        postingsRemaining: postingsMap[planType] ?? null,
        resumeViewsLimit: resumeViewsMap[planType] ?? 0,
        resumeViewsUsed: 0,
        resumeViewsResetDate: now,
      },
      update: {
        planType: planType as any,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: endDate,
        postingsRemaining: postingsMap[planType] ?? null,
        resumeViewsLimit: resumeViewsMap[planType] ?? 0,
        resumeViewsUsed: 0,
        resumeViewsResetDate: now,
        cancelledAt: null,
      },
    })

    // Send welcome/activation email
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, name: true },
      })

      if (user?.email) {
        const churchProfile = await prisma.churchProfile.findUnique({
          where: { userId: session.user.id },
          select: { churchName: true },
        })

        // Send a welcome/activation email (you could create a separate template for this)
        await sendSubscriptionRenewalNotification(
          user.email,
          churchProfile?.churchName || 'Your Church',
          planType,
          endDate,
          `${process.env.NEXTAUTH_URL}/church-dashboard`
        )
      }
    } catch (emailError) {
      console.error('Failed to send subscription activation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Subscription activated successfully',
        subscription,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscription activation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to activate subscription'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
