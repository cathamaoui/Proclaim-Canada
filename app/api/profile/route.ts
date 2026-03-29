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

    // Get both church and preacher profiles
    const [churchProfile, preacherProfile] = await Promise.all([
      prisma.churchProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.preacherProfile.findUnique({ where: { userId: session.user.id } }),
    ])

    // Return the relevant profile based on user role
    const profile = session.user.role === 'CHURCH' ? churchProfile : preacherProfile

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if (session.user.role === 'CHURCH') {
      // Update church profile
      const updatedProfile = await prisma.churchProfile.update({
        where: { userId: session.user.id },
        data: body,
      })

      return NextResponse.json(
        { message: 'Church profile updated successfully', profile: updatedProfile },
        { status: 200 }
      )
    } else if (session.user.role === 'PREACHER') {
      // Update preacher profile
      const updatedProfile = await prisma.preacherProfile.update({
        where: { userId: session.user.id },
        data: body,
      })

      return NextResponse.json(
        { message: 'Preacher profile updated successfully', profile: updatedProfile },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 })
  } catch (error) {
    console.error('Update profile error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    if (session.user.role === 'CHURCH') {
      // Create or update church profile
      let churchProfile = await prisma.churchProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!churchProfile) {
        churchProfile = await prisma.churchProfile.create({
          data: {
            userId: session.user.id,
            ...body,
          },
        })
      } else {
        churchProfile = await prisma.churchProfile.update({
          where: { userId: session.user.id },
          data: body,
        })
      }

      return NextResponse.json(
        { message: 'Church profile created/updated', profile: churchProfile },
        { status: 201 }
      )
    } else if (session.user.role === 'PREACHER') {
      // Create or update preacher profile
      let preacherProfile = await prisma.preacherProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!preacherProfile) {
        preacherProfile = await prisma.preacherProfile.create({
          data: {
            userId: session.user.id,
            ...body,
          },
        })
      } else {
        preacherProfile = await prisma.preacherProfile.update({
          where: { userId: session.user.id },
          data: body,
        })
      }

      return NextResponse.json(
        { message: 'Preacher profile created/updated', profile: preacherProfile },
        { status: 201 }
      )
    }

    return NextResponse.json({ error: 'Invalid user role' }, { status: 400 })
  } catch (error) {
    console.error('Create profile error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create profile'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
