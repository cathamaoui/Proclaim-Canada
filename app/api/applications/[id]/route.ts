import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'
import { sendApplicationAcceptedNotification } from '@/lib/email-notifications'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        listing: true,
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            preacherProfile: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const application = await prisma.application.findUnique({
      where: { id },
      include: { listing: true },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Only church that created the listing or preacher who applied can update
    const listing = application.listing
    const isChurchOwner = listing.createdBy === session.user.id
    const isApplicant = application.applicantId === session.user.id

    if (!isChurchOwner && !isApplicant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status,
        respondedAt: new Date(),
      },
      include: {
        listing: true,
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            preacherProfile: true,
          },
        },
      },
    })

    // Send email notification to applicant if status changed
    if (updatedApplication.applicant?.email && (status === 'ACCEPTED' || status === 'REJECTED')) {
      const church = await prisma.user.findUnique({
        where: { id: updatedApplication.listing.createdBy },
        select: { name: true },
      })

      const churchName = church?.name || 'A church'

      try {
        if (status === 'ACCEPTED') {
          await sendApplicationAcceptedNotification(
            updatedApplication.applicant.email,
            updatedApplication.applicant.name || 'Preacher',
            churchName,
            updatedApplication.listing.title,
            `${process.env.NEXTAUTH_URL}/dashboard?tab=applications`
          )
        } else {
          // For rejection, keep using the old email template for now
          const statusMessage = `Unfortunately, ${churchName} did not move forward with your application for ${updatedApplication.listing.title}. Keep applying to other opportunities!`
          const emailContent = emailTemplates.applicationStatus(
            updatedApplication.applicant.name || 'Preacher',
            'REJECTED',
            churchName,
            statusMessage
          )

          await sendEmail({
            to: updatedApplication.applicant.email,
            subject: emailContent.subject,
            html: emailContent.html,
          })
        }
      } catch (emailError) {
        console.error('Failed to send application status email:', emailError)
      }
    }

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error('Application update error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.applicantId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.application.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    console.error('Application deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
