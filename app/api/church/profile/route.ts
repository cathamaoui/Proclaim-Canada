import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      return NextResponse.json(
        { profile: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { profile: churchProfile },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get church profile error:', error)
    return NextResponse.json(
      { error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      churchName,
      contactName,
      country,
      province,
      city,
      neighborhood,
      address,
      averageAttendance,
      bio,
      denomination,
      serviceTypes,
      otherServiceType,
      preferredPreacherQualifications,
      churchLogoUrl,
      acceptsPreacherTravelReimbursement,
    } = body

    const updatedProfile = await prisma.churchProfile.update({
      where: { userId: session.user.id },
      data: {
        churchName: churchName || null,
        contactName: contactName || null,
        country: country || null,
        province: province || null,
        city: city || null,
        neighborhood: neighborhood || null,
        address: address || null,
        averageAttendance: averageAttendance || null,
        bio: bio || null,
        denomination: denomination || null,
        serviceTypes: serviceTypes || [],
        otherServiceType: otherServiceType || null,
        preferredPreacherQualifications: preferredPreacherQualifications || null,
        churchLogoUrl: churchLogoUrl || null,
        acceptsPreacherTravelReimbursement: acceptsPreacherTravelReimbursement || false,
      },
    })

    return NextResponse.json(
      { message: 'Profile updated successfully', profile: updatedProfile },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update church profile error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
