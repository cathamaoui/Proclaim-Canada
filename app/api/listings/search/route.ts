import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const status = searchParams.get('status') || 'OPEN'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '20')

    const where: any = {
      status,
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        where.date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo)
      }
    }

    const [listings, total] = await Promise.all([
      prisma.churchListing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              churchProfile: {
                select: {
                  denomination: true,
                  city: true,
                  province: true,
                },
              },
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { date: 'asc' },
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
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search listings' },
      { status: 500 }
    )
  }
}
