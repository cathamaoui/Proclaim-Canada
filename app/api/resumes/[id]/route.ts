import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendResumeViewNotification } from '@/lib/email-notifications'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'CHURCH') {
      return NextResponse.json({ error: 'Only churches can view resumes' }, { status: 403 })
    }

    const preacherId = params.id

    // Get church/user subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
    }

    // Check if they have unlimited access
    const hasUnlimited =
      subscription.hasUnlimitedResumes &&
      subscription.unlimitedResumesAddOnEnd &&
      new Date() < new Date(subscription.unlimitedResumesAddOnEnd)

    // If not unlimited, check monthly quota
    if (!hasUnlimited) {
      // Check if we need to reset monthly counter
      const now = new Date()
      const resetDate = new Date(subscription.resumeViewsResetDate)
      if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
        // Reset counter
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            resumeViewsUsed: 0,
            resumeViewsResetDate: now,
          },
        })
        subscription.resumeViewsUsed = 0
        subscription.resumeViewsResetDate = now
      }

      // Check if they've exceeded their limit
      if (subscription.resumeViewsUsed >= subscription.resumeViewsLimit) {
        return NextResponse.json(
          {
            error: 'Resume view limit exceeded',
            remaining: 0,
            limit: subscription.resumeViewsLimit,
            upgrade: {
              message: 'Upgrade to Resume Unlimited to view more resumes',
              price: '$99/month',
              url: '/settings/subscription',
            },
          },
          { status: 403 }
        )
      }
    }

    // Get preacher profile with resume
    const preacherProfile = await prisma.preacherProfile.findUnique({
      where: { userId: preacherId },
      select: {
        id: true,
        userId: true,
        denomination: true,
        yearsOfExperience: true,
        specialization: true,
        bio: true,
        profilePhotoUrl: true,
        resumeUrl: true,
        rating: true,
        verified: true,
        churchAffiliation: true,
        website: true,
        languages: true,
        ordinationStatus: true,
      },
    })

    if (!preacherProfile || !preacherProfile.resumeUrl) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: preacherId },
      select: { id: true, name: true, email: true, image: true },
    })

    // Log the view
    await prisma.resumeView.create({
      data: {
        subscriptionId: subscription.id,
        preacherId: preacherId,
      },
    })

    // Send resume view notification to preacher
    try {
      const preacherUser = await prisma.user.findUnique({
        where: { id: preacherId },
        select: { email: true, name: true },
      })

      if (preacherUser?.email) {
        const churchProfile = await prisma.churchProfile.findUnique({
          where: { userId: session.user.id },
          select: { churchName: true },
        })
        const churchName = churchProfile?.churchName || 'A Church'

        await sendResumeViewNotification(
          preacherUser.email,
          preacherUser.name || 'Preacher',
          churchName,
          `${process.env.NEXTAUTH_URL}/dashboard`
        )
      }
    } catch (emailError) {
      console.error('Failed to send resume view notification:', emailError)
      // Don't fail the request, just log the error
    }

    // Update usage count if not unlimited
    if (!hasUnlimited) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          resumeViewsUsed: subscription.resumeViewsUsed + 1,
        },
      })
    }

    const remaining = hasUnlimited
      ? null
      : subscription.resumeViewsLimit - (subscription.resumeViewsUsed + 1)

    return NextResponse.json(
      {
        resume: {
          ...preacherProfile,
          user,
        },
        usage: {
          remaining,
          total: hasUnlimited ? null : subscription.resumeViewsLimit,
          unlimited: hasUnlimited,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get resume error:', error)
    return NextResponse.json(
      { error: 'Failed to load resume' },
      { status: 500 }
    )
  }
}
