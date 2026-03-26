import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    
    // Extract filter parameters
    const serviceTypes = searchParams.getAll('serviceTypes[]')
    const denomination = searchParams.get('denomination')
    const minExperience = searchParams.get('minExperience')
    const languages = searchParams.getAll('languages[]')
    const city = searchParams.get('city')
    const province = searchParams.get('province')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 20

    // Build filter conditions
    const where: any = {
      user: {
        role: 'PREACHER',
        isBanned: false
      },
      verified: true
    }

    // Filter by service types
    if (serviceTypes.length > 0) {
      where.serviceTypes = {
        hasSome: serviceTypes
      }
    }

    // Filter by denomination
    if (denomination && denomination !== 'all') {
      where.denomination = denomination
    }

    // Filter by minimum experience
    if (minExperience) {
      where.yearsOfExperience = {
        gte: parseInt(minExperience)
      }
    }

    // Filter by languages
    if (languages.length > 0) {
      where.languages = {
        hasSome: languages
      }
    }

    // Filter by location (city or province)
    // This would require a more complex query if using full address lookup
    if (city) {
      // Would filter by availability in that city
    }

    if (province) {
      // Could filter by province preference
    }

    // Full-text search on bio
    if (search) {
      where.OR = [
        { bio: { contains: search, mode: 'insensitive' } },
        { theologyStatement: { contains: search, mode: 'insensitive' } },
        { specializations: { hasSome: [search] } }
      ]
    }

    // Get total count
    const total = await db.preacherProfile.count({ where })

    // Fetch paginated results
    const preachers = await db.preacherProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return NextResponse.json({
      success: true,
      preachers,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error('Error searching candidates:', error)
    return NextResponse.json(
      { error: 'Failed to search candidates' },
      { status: 500 }
    )
  }
}
