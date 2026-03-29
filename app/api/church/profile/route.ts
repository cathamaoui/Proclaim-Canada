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
    
    // Extract all fields from body
    const {
      churchName,
      contactPerson,
      contactEmail,
      contactPhone,
      denomination,
      country,
      state,
      province,
      city,
      address,
      street,
      postalCode,
      phone,
      website,
      averageAttendance,
      bio,
      mission,
      worshipStyle,
      theologicalPerspective,
      strengthsChallenges,
      ageDistribution,
      communityContext,
      facilities,
      searchProcess,
      logoUrl,
      introVideoUrl,
      photos,
      staffProfiles,
    } = body

    // First, try to find existing profile
    let churchProfile = await prisma.churchProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!churchProfile) {
      // Create new profile
      churchProfile = await prisma.churchProfile.create({
        data: {
          userId: session.user.id,
          churchName: churchName || null,
          contactPerson: contactPerson || null,
          contactEmail: contactEmail || null,
          contactPhone: contactPhone || null,
          denomination: denomination || null,
          country: country || null,
          state: state || null,
          province: province || null,
          city: city || null,
          address: address || null,
          street: street || null,
          postalCode: postalCode || null,
          phone: phone || null,
          website: website || null,
          averageAttendance: averageAttendance || null,
          bio: bio || null,
          mission: mission || null,
          worshipStyle: worshipStyle || null,
          theologicalPerspective: theologicalPerspective || null,
          strengthsChallenges: strengthsChallenges || null,
          ageDistribution: ageDistribution || null,
          communityContext: communityContext || null,
          facilities: facilities || null,
          searchProcess: searchProcess || null,
          logoUrl: logoUrl || null,
          introVideoUrl: introVideoUrl || null,
          photos: photos || [],
          staffProfiles: staffProfiles || null,
        },
      })
    } else {
      // Update existing profile
      churchProfile = await prisma.churchProfile.update({
        where: { userId: session.user.id },
        data: {
          churchName: churchName !== undefined ? churchName : churchProfile.churchName,
          contactPerson: contactPerson !== undefined ? contactPerson : churchProfile.contactPerson,
          contactEmail: contactEmail !== undefined ? contactEmail : churchProfile.contactEmail,
          contactPhone: contactPhone !== undefined ? contactPhone : churchProfile.contactPhone,
          denomination: denomination !== undefined ? denomination : churchProfile.denomination,
          country: country !== undefined ? country : churchProfile.country,
          state: state !== undefined ? state : churchProfile.state,
          province: province !== undefined ? province : churchProfile.province,
          city: city !== undefined ? city : churchProfile.city,
          address: address !== undefined ? address : churchProfile.address,
          street: street !== undefined ? street : churchProfile.street,
          postalCode: postalCode !== undefined ? postalCode : churchProfile.postalCode,
          phone: phone !== undefined ? phone : churchProfile.phone,
          website: website !== undefined ? website : churchProfile.website,
          averageAttendance: averageAttendance !== undefined ? averageAttendance : churchProfile.averageAttendance,
          bio: bio !== undefined ? bio : churchProfile.bio,
          mission: mission !== undefined ? mission : churchProfile.mission,
          worshipStyle: worshipStyle !== undefined ? worshipStyle : churchProfile.worshipStyle,
          theologicalPerspective: theologicalPerspective !== undefined ? theologicalPerspective : churchProfile.theologicalPerspective,
          strengthsChallenges: strengthsChallenges !== undefined ? strengthsChallenges : churchProfile.strengthsChallenges,
          ageDistribution: ageDistribution !== undefined ? ageDistribution : churchProfile.ageDistribution,
          communityContext: communityContext !== undefined ? communityContext : churchProfile.communityContext,
          facilities: facilities !== undefined ? facilities : churchProfile.facilities,
          searchProcess: searchProcess !== undefined ? searchProcess : churchProfile.searchProcess,
          logoUrl: logoUrl !== undefined ? logoUrl : churchProfile.logoUrl,
          introVideoUrl: introVideoUrl !== undefined ? introVideoUrl : churchProfile.introVideoUrl,
          photos: photos !== undefined ? photos : churchProfile.photos,
          staffProfiles: staffProfiles !== undefined ? staffProfiles : churchProfile.staffProfiles,
        },
      })
    }

    return NextResponse.json(
      { message: 'Profile saved successfully', profile: churchProfile },
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const updatedProfile = await prisma.churchProfile.update({
      where: { userId: session.user.id },
      data: {
        ...body,
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
