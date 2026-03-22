import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = {}

    // If user is a preacher, show their applications
    if (session.user.role === 'PREACHER') {
      where.applicantId = session.user.id
    }
    // If user is a church, show applications to their listings
    else if (session.user.role === 'CHURCH') {
      where.listing = {
        createdBy: session.user.id,
      }
    }

    if (status) {
      where.status = status
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            user: {
              select: {
                id: true,
                name: true,
                churchProfile: {
                  select: { denomination: true },
                },
              },
            },
          },
        },
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            preacherProfile: {
              select: {
                denomination: true,
                yearsOfExperience: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'PREACHER') {
      return NextResponse.json(
        { error: 'Only preachers can apply to listings' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { listingId, coverLetter } = body

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if listing exists
    const listing = await prisma.churchListing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        listingId_applicantId: {
          listingId,
          applicantId: session.user.id,
        },
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this listing' },
        { status: 409 }
      )
    }

    const application = await prisma.application.create({
      data: {
        listingId,
        applicantId: session.user.id,
        coverLetter: coverLetter || null,
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

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Application creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
