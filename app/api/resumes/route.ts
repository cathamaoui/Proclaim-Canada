import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const denomination = url.searchParams.get('denomination')
    const location = url.searchParams.get('location')
    const experience = url.searchParams.get('experience') // min years

    const skip = (page - 1) * limit

    // Build filter
    let where: any = {}

    if (denomination && denomination !== 'Any') {
      where.denomination = denomination
    }

    if (location) {
      where.OR = [
        { churchAffiliation: { contains: location, mode: 'insensitive' } },
      ]
    }

    if (experience) {
      where.yearsOfExperience = { gte: parseInt(experience) }
    }

    // Get total count
    const total = await prisma.preacherProfile.count({ where })

    // Get preachers with verified profiles (resumes available)
    const preachers = await prisma.preacherProfile.findMany({
      where: {
        ...where,
        resumeUrl: { not: null }, // Only include those with resumes
      },
      select: {
        id: true,
        userId: true,
        denomination: true,
        yearsOfExperience: true,
        specialization: true,
        bio: true,
        profilePhotoUrl: true,
        rating: true,
        verified: true,
        churchAffiliation: true,
      },
      orderBy: { rating: 'desc' },
      skip,
      take: limit,
    })

    // Enrich with user data
    const enrichedPreachers = await Promise.all(
      preachers.map(async (p) => {
        const user = await prisma.user.findUnique({
          where: { id: p.userId },
          select: { id: true, name: true, email: true },
        })
        return { ...p, user }
      })
    )

    return NextResponse.json(
      {
        preachers: enrichedPreachers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get resumes error:', error)
    return NextResponse.json(
      { error: 'Failed to load resumes' },
      { status: 500 }
    )
  }
}
