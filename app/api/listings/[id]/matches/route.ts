import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface MatchScore {
  preacherId: string
  preacherName: string
  preacherEmail: string
  profilePhotoUrl?: string
  rating: number
  yearsOfExperience: number
  matchScore: number
  matchDetails: {
    serviceTypeMatch: number
    denominationMatch: number
    experienceScore: number
    languageMatch: number
    answersQuality: number
    ratingBonus: number
    travelDistance: number
    overallFit: number
  }
  reasonsForMatch: string[]
  reasonsAgainstMatch: string[]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const listingId = params.id
    const listing = await prisma.churchListing.findUnique({
      where: { id: listingId },
      include: { customQuestions: true }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (listing.churchId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all preachers
    const preachers = await prisma.preacherProfile.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    })

    // Score each preacher
    const matches: MatchScore[] = []

    for (const preacher of preachers) {
      const match = await scoreCandidate(
        preacher,
        listing,
        prisma
      )
      matches.push(match)
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Return top 50 matches
    const topMatches = matches.slice(0, 50)

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        serviceType: listing.serviceType,
        denomination: listing.denomination
      },
      matches: topMatches,
      totalMatches: matches.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Matching error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function scoreCandidate(
  preacher: any,
  listing: any,
  prisma: PrismaClient
): Promise<MatchScore> {
  const reasons = { for: [] as string[], against: [] as string[] }
  const scores = {
    serviceType: 0,
    denomination: 0,
    experience: 0,
    language: 0,
    answers: 0,
    rating: 0,
    travel: 0
  }

  // 1. Service Type Match (0-25 points)
  if (preacher.serviceTypes?.includes(listing.serviceType)) {
    scores.serviceType = 25
    reasons.for.push('Experienced with this service type')
  } else if (preacher.serviceTypes?.includes('OTHER')) {
    scores.serviceType = 12
    reasons.for.push('Open to various service types')
  } else {
    reasons.against.push('No experience with this service type')
  }

  // 2. Denomination Match (0-20 points)
  if (preacher.preferredDenominations?.includes(listing.denomination)) {
    scores.denomination = 20
    reasons.for.push(`Specializes in ${listing.denomination}`)
  } else if (preacher.preferredDenominations?.includes('Interdenominational')) {
    scores.denomination = 15
    reasons.for.push('Comfortable working across denominations')
  } else {
    scores.denomination = 0
    reasons.against.push(`Different denomination background`)
  }

  // 3. Experience Level (0-15 points)
  const yearsExp = preacher.yearsOfExperience || 0
  if (yearsExp >= 10) {
    scores.experience = 15
    reasons.for.push(`${yearsExp} years of experience`)
  } else if (yearsExp >= 5) {
    scores.experience = 12
    reasons.for.push(`${yearsExp} years of solid experience`)
  } else if (yearsExp >= 2) {
    scores.experience = 8
    reasons.for.push(`${yearsExp} years of experience`)
  } else {
    scores.experience = 4
    reasons.against.push('Limited experience')
  }

  // 4. Languages (0-10 points)
  const languageRequirement = listing.requiredLanguages || []
  if (languageRequirement.length === 0) {
    scores.language = 10
  } else {
    const matchedLanguages = languageRequirement.filter((lang: string) =>
      preacher.languages?.includes(lang)
    )
    scores.language = Math.min(
      10,
      (matchedLanguages.length / languageRequirement.length) * 10
    )
    if (matchedLanguages.length > 0) {
      reasons.for.push(`Speaks required languages: ${matchedLanguages.join(', ')}`)
    } else {
      reasons.against.push(`Missing language requirement: ${languageRequirement.join(', ')}`)
    }
  }

  // 5. Application Answers Quality (0-15 points)
  const applications = await prisma.application.findMany({
    where: {
      listingId: listing.id,
      preacherId: preacher.userId
    },
    include: { answers: true }
  })

  if (applications.length > 0) {
    const app = applications[0]
    const answeredQuestions = app.answers?.length || 0
    const totalQuestions = listing.customQuestions?.length || 0
    
    if (totalQuestions > 0) {
      const answerRate = answeredQuestions / totalQuestions
      const qualityScore = answerRate > 0.8 ? 15 : answerRate > 0.5 ? 10 : 5
      scores.answers = qualityScore
      reasons.for.push(`Completed ${answeredQuestions}/${totalQuestions} screening questions`)
    }
  }

  // 6. Rating Bonus (0-10 points)
  const rating = preacher.rating || 0
  scores.rating = (rating / 5) * 10
  if (rating >= 4.5) {
    reasons.for.push(`High rating: ${rating.toFixed(1)}/5 stars`)
  } else if (rating >= 3.5) {
    reasons.for.push(`Good rating: ${rating.toFixed(1)}/5 stars`)
  }

  // 7. Travel Distance (0-5 points)
  const travelRadius = preacher.travelRadiusKm || 50
  if (travelRadius >= 100) {
    scores.travel = 5
    reasons.for.push(`Willing to travel ${travelRadius}km`)
  } else if (travelRadius >= 50) {
    scores.travel = 3
  } else {
    scores.travel = 1
  }

  // Calculate overall match score (weighted)
  const weights = {
    serviceType: 0.25,
    denomination: 0.20,
    experience: 0.15,
    language: 0.10,
    answers: 0.15,
    rating: 0.10,
    travel: 0.05
  }

  const totalPossible = 100
  const matchScore = Math.round(
    (scores.serviceType * weights.serviceType / 25) * 100 +
    (scores.denomination * weights.denomination / 20) * 100 +
    (scores.experience * weights.experience / 15) * 100 +
    (scores.language * weights.language / 10) * 100 +
    (scores.answers * weights.answers / 15) * 100 +
    (scores.rating * weights.rating / 10) * 100 +
    (scores.travel * weights.travel / 5) * 100
  ) / 100

  return {
    preacherId: preacher.userId,
    preacherName: preacher.user.name,
    preacherEmail: preacher.user.email,
    profilePhotoUrl: preacher.profilePhotoUrl,
    rating,
    yearsOfExperience: preacher.yearsOfExperience || 0,
    matchScore,
    matchDetails: {
      serviceTypeMatch: scores.serviceType,
      denominationMatch: scores.denomination,
      experienceScore: scores.experience,
      languageMatch: scores.language,
      answersQuality: scores.answers,
      ratingBonus: scores.rating,
      travelDistance: scores.travel,
      overallFit: matchScore
    },
    reasonsForMatch: reasons.for,
    reasonsAgainstMatch: reasons.against
  }
}
