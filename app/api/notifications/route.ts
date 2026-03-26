import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EmailNotification {
  type: 'APPLICATION_RECEIVED' | 'APPLICATION_ACCEPTED' | 'MESSAGE_RECEIVED' | 'MATCH_FOUND' | 'REVIEW_RECEIVED'
  userId: string
  data: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, recipientId, data } = body

    if (!type || !recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get recipient user
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      include: {
        preacherProfile: true,
        churchProfile: true
      }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Check notification preferences
    const preferences = recipient.notificationPreferences as any || {}
    if (preferences[type] === false) {
      return NextResponse.json({
        success: true,
        message: 'Notification disabled for this type'
      })
    }

    // Build email based on type
    let emailConfig: any = {
      to: recipient.email,
      subject: '',
      html: ''
    }

    switch (type) {
      case 'APPLICATION_RECEIVED':
        emailConfig.subject = `New Application Received: ${data.listingTitle}`
        emailConfig.html = `
          <h2>New Application Received</h2>
          <p>A preacher has applied for your listing: <strong>${data.listingTitle}</strong></p>
          <p><strong>Applicant:</strong> ${data.preacherName}</p>
          <p>${data.preacherBio || ''}</p>
          <p>Years of Experience: ${data.yearsOfExperience}</p>
          <p>Rating: ⭐ ${data.rating}/5.0</p>
          ${data.coverLetter ? `<p><strong>Cover Letter:</strong> ${data.coverLetter}</p>` : ''}
          <a href="${process.env.NEXTAUTH_URL}/church-dashboard/candidates" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Review Application</a>
        `
        break

      case 'APPLICATION_ACCEPTED':
        emailConfig.subject = `Your Application Was Accepted: ${data.listingTitle}`
        emailConfig.html = `
          <h2>Application Accepted! 🎉</h2>
          <p>Congratulations! Your application for <strong>${data.listingTitle}</strong> at <strong>${data.churchName}</strong> has been accepted.</p>
          <p><strong>Date & Time:</strong> ${data.serviceDate || 'TBD'}</p>
          <p><strong>Location:</strong> ${data.location || 'TBD'}</p>
          <p>Contact the church to confirm details.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/messages" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Message Church</a>
        `
        break

      case 'MESSAGE_RECEIVED':
        emailConfig.subject = `New Message from ${data.senderName}`
        emailConfig.html = `
          <h2>New Message</h2>
          <p>You have a new message from <strong>${data.senderName}</strong></p>
          <p><em>"${data.messagePreview}"</em></p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/messages" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Read Message</a>
        `
        break

      case 'MATCH_FOUND':
        emailConfig.subject = `New Candidate Match Found`
        emailConfig.html = `
          <h2>New Candidate Match</h2>
          <p>We found a qualified candidate for your listing: <strong>${data.listingTitle}</strong></p>
          <p><strong>Candidate:</strong> ${data.candidateName}</p>
          <p><strong>Match Score:</strong> ${data.matchScore}%</p>
          <p><strong>Experience:</strong> ${data.yearsOfExperience} years</p>
          <p><strong>Rating:</strong> ⭐ ${data.rating}/5.0</p>
          <a href="${process.env.NEXTAUTH_URL}/church-dashboard/candidates" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">View Match</a>
        `
        break

      case 'REVIEW_RECEIVED':
        emailConfig.subject = `You Received a New Review`
        emailConfig.html = `
          <h2>New Review</h2>
          <p>You received a new review from <strong>${data.reviewerName}</strong></p>
          <p><strong>Rating:</strong> ${'⭐'.repeat(data.rating)} (${data.rating}/5)</p>
          ${data.review ? `<p><strong>Review:</strong> ${data.review}</p>` : ''}
          <a href="${process.env.NEXTAUTH_URL}/dashboard/profile" style="display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">View Your Reviews</a>
        `
        break

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        )
    }

    // Send email
    try {
      await sendEmail(
        emailConfig.to,
        emailConfig.subject,
        emailConfig.html
      )
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the request if email fails
    }

    // Store notification record (optional, for later viewing)
    const notification = await prisma.notification.create({
      data: {
        userId: recipientId,
        type,
        data: JSON.stringify(data),
        read: false
      }
    }).catch(() => null)

    return NextResponse.json({
      success: true,
      message: 'Email notification sent',
      notification
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
