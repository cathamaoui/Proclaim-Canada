import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProfileScore {
  completionPercentage: number
  score: number
  missing: string[]
  recommendations: string[]
}

async function calculatePreacherScore(preacherId: string): Promise<ProfileScore> {
  const profile = await prisma.preacherProfile.findUnique({
    where: { userId: preacherId }
  })

  if (!profile) {
    return {
      completionPercentage: 0,
      score: 0,
      missing: ['Profile not found'],
      recommendations: ['Create your preacher profile']
    }
  }

  const missing: string[] = []
  let points = 0
  const maxPoints = 100

  // Bio (15 points)
  if (profile.bio && profile.bio.length > 50) {
    points += 15
  } else {
    missing.push('Bio (minimum 50 characters)')
  }

  // Years of experience (10 points)
  if (profile.yearsOfExperience && profile.yearsOfExperience > 0) {
    points += 10
  } else {
    missing.push('Years of experience')
  }

  // Denomination (10 points)
  if (profile.denomination) {
    points += 10
  } else {
    missing.push('Primary denomination')
  }

  // Service types (10 points)
  if (profile.serviceTypes && profile.serviceTypes.length > 0) {
    points += 10
  } else {
    missing.push('Service types you offer')
  }

  // Languages (10 points)
  if (profile.languages && profile.languages.length > 0) {
    points += 10
  } else {
    missing.push('Languages spoken')
  }

  // Sermon video (10 points) - using getProperty to safely access
  const sermonUrl = (profile as any).sermonVideoUrl
  if (sermonUrl) {
    points += 10
  } else {
    missing.push('Sample sermon video')
  }

  // Worship video (10 points)
  const worshipUrl = (profile as any).worshipVideoUrl
  if (worshipUrl) {
    points += 10
  } else {
    missing.push('Worship/music sample video')
  }

  // Profile photo (5 points)
  if (profile.profilePhotoUrl) {
    points += 5
  } else {
    missing.push('Profile photo')
  }

  // Travel radius (5 points)
  if (profile.travelRadiusKm && profile.travelRadiusKm > 0) {
    points += 5
  } else {
    missing.push('Travel radius')
  }

  const completionPercentage = Math.round((points / maxPoints) * 100)

  const recommendations = [
    !profile.bio || profile.bio.length < 50
      ? 'Write a detailed bio to help churches learn about you'
      : null,
    !sermonUrl
      ? 'Add a sermon video to showcase your speaking style'
      : null,
    !profile.denomination
      ? 'Select your primary denomination'
      : null,
    (profile.serviceTypes?.length || 0) < 2
      ? 'Add more service types you can lead'
      : null,
    !worshipUrl
      ? 'Add a worship sample to demonstrate your musical abilities'
      : null
  ].filter(Boolean) as string[]

  return {
    completionPercentage,
    score: points,
    missing,
    recommendations
  }
}

async function calculateChurchScore(churchId: string): Promise<ProfileScore> {
  const profile = await prisma.churchProfile.findUnique({
    where: { userId: churchId }
  })

  if (!profile) {
    return {
      completionPercentage: 0,
      score: 0,
      missing: ['Profile not found'],
      recommendations: ['Create your church profile']
    }
  }

  const missing: string[] = []
  let points = 0
  const maxPoints = 100

  // Church name (10 points)
  if (profile.churchName && profile.churchName.length > 0) {
    points += 10
  } else {
    missing.push('Church name')
  }

  // Denomination (10 points)
  if (profile.denomination) {
    points += 10
  } else {
    missing.push('Denomination')
  }

  // Bio/about (15 points)
  if (profile.bio && profile.bio.length > 50) {
    points += 15
  } else {
    missing.push('Church description (minimum 50 characters)')
  }

  // Address (10 points)
  if (profile.address && profile.address.length > 0) {
    points += 10
  } else {
    missing.push('Church address')
  }

  // City (5 points)
  if (profile.city && profile.city.length > 0) {
    points += 5
  } else {
    missing.push('City')
  }

  // Phone (5 points)
  if (profile.phone && profile.phone.length > 0) {
    points += 5
  } else {
    missing.push('Contact phone number')
  }

  // Website (5 points)
  if (profile.website && profile.website.length > 0) {
    points += 5
  } else {
    missing.push('Church website')
  }

  // Province (5 points)
  if (profile.province && profile.province.length > 0) {
    points += 5
  } else {
    missing.push('State/Province')
  }

  // Average attendance (5 points)
  if (profile.averageAttendance && profile.averageAttendance.length > 0) {
    points += 5
  } else {
    missing.push('Average attendance')
  }

  // Founded year (5 points)
  if (profile.founded && profile.founded > 0) {
    points += 5
  } else {
    missing.push('Year founded')
  }

  const completionPercentage = Math.round((points / maxPoints) * 100)

  const recommendations = [
    !profile.bio || profile.bio.length < 50
      ? 'Write a detailed description about your church'
      : null,
    !profile.address
      ? 'Add your church address to help preachers find you'
      : null,
    !profile.website
      ? 'Add your church website URL'
      : null,
    !profile.phone
      ? 'Add a contact phone number'
      : null,
    !profile.denomination
      ? 'Specify your church denomination'
      : null
  ].filter(Boolean) as string[]

  return {
    completionPercentage,
    score: points,
    missing,
    recommendations
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    let score: ProfileScore

    if (session.user.role === 'PREACHER') {
      score = await calculatePreacherScore(userId)
    } else if (session.user.role === 'CHURCH') {
      score = await calculateChurchScore(userId)
    } else {
      return NextResponse.json(
        { error: 'Unknown user role' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      score
    })
  } catch (error) {
    console.error('Error calculating profile score:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
