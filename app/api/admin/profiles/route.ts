import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const preachers = await prisma.user.findMany({
      where: { role: 'PREACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        preacherProfile: {
          select: {
            denomination: true,
            specialization: true,
            yearsOfExperience: true,
            hourlyRate: true,
            bio: true,
            verified: true,
            rating: true,
            totalRatings: true,
            serviceTypes: true,
            customService: true,
            profilePhotoUrl: true,
            availability: true,
            travelRadiusKm: true,
            churchAffiliation: true,
            ordinationStatus: true,
            languages: true,
            certificates: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const churches = await prisma.user.findMany({
      where: { role: 'CHURCH' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        churchProfile: {
          select: {
            churchName: true,
            organizationName: true,
            denomination: true,
            city: true,
            province: true,
            phone: true,
            website: true,
            averageAttendance: true,
            bio: true,
            verified: true,
            rating: true,
            totalRatings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ preachers, churches })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }
}
