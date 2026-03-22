import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.churchListing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            churchProfile: true,
          },
        },
        applications: {
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
                preacherProfile: true,
              },
            },
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Listing fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listing = await prisma.churchListing.findUnique({
      where: { id: params.id },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, type, date, location, compensation, status } =
      body

    const updatedListing = await prisma.churchListing.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(compensation !== undefined && { compensation }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            churchProfile: true,
          },
        },
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Listing update error:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listing = await prisma.churchListing.findUnique({
      where: { id: params.id },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.churchListing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.error('Listing deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
