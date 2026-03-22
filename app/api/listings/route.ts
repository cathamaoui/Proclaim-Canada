import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const createdBy = searchParams.get('createdBy')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')

    const where: any = {}
    if (status) where.status = status
    if (createdBy) where.createdBy = createdBy

    const [listings, total] = await Promise.all([
      prisma.churchListing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              churchProfile: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.churchListing.count({ where }),
    ])

    return NextResponse.json({
      listings,
      total,
      pages: Math.ceil(total / take),
    })
  } catch (error) {
    console.error('Listings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Only churches can create listings' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      type,
      date,
      location,
      compensation,
    } = body

    if (!title || !description || !type || !date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const listing = await prisma.churchListing.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        location,
        compensation: compensation || null,
        createdBy: session.user.id,
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

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Listing creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}
