import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'CHURCH') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const churchId = session.user.id

    // Get all listings for this church
    const listings = await prisma.churchListing.findMany({
      where: { churchId },
      include: {
        applications: {
          include: { applicant: true }
        }
      }
    })

    // Calculate metrics
    const totalListings = listings.length
    const openListings = listings.filter(l => l.status === 'OPEN').length
    const filledListings = listings.filter(l => l.status === 'FILLED').length

    const totalApplications = listings.reduce((sum, l) => sum + l.applications.length, 0)

    // Pipeline breakdown
    const pipelineBreakdown = {
      applied: 0,
      reviewed: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
      rejected: 0
    }

    for (const listing of listings) {
      for (const app of listing.applications) {
        const status = (app as any).pipelineStatus
        if (status === 'APPLIED') pipelineBreakdown.applied++
        else if (status === 'REVIEWED') pipelineBreakdown.reviewed++
        else if (status === 'INTERVIEWED') pipelineBreakdown.interviewed++
        else if (status === 'OFFERED') pipelineBreakdown.offered++
        else if (status === 'HIRED') pipelineBreakdown.hired++
        else if (status === 'REJECTED') pipelineBreakdown.rejected++
      }
    }

    // Calculate conversion rate
    const conversionRate = totalApplications > 0
      ? ((pipelineBreakdown.hired / totalApplications) * 100).toFixed(1)
      : '0'

    // Average time to hire (in days)
    const hiredApplications = listings
      .flatMap(l => l.applications)
      .filter(app => (app as any).pipelineStatus === 'HIRED')

    let avgTimeToHire = 0
    if (hiredApplications.length > 0) {
      const totalDays = hiredApplications.reduce((sum, app) => {
        const appliedDate = new Date(app.appliedAt)
        const respondedDate = new Date(app.respondedAt || new Date())
        const days = Math.floor((respondedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24))
        return sum + days
      }, 0)
      avgTimeToHire = Math.round(totalDays / hiredApplications.length)
    }

    // Get top performing listings
    const topListings = listings
      .sort((a, b) => b.applications.length - a.applications.length)
      .slice(0, 5)
      .map(l => ({
        id: l.id,
        title: l.title,
        applicationCount: l.applications.length,
        status: l.status,
        createdAt: l.createdAt
      }))

    // Recent activity
    const recentApplications = listings
      .flatMap(l => 
        l.applications.map(app => ({
          applicantName: app.applicant.name,
          applicantEmail: app.applicant.email,
          listingTitle: l.title,
          listingId: l.id,
          appliedAt: app.appliedAt,
          status: app.status,
          pipelineStatus: (app as any).pipelineStatus
        }))
      )
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 10)

    // Response time metrics
    const applicationsWithResponse = listings
      .flatMap(l => l.applications)
      .filter(app => app.respondedAt)

    let avgResponseTime = 0
    if (applicationsWithResponse.length > 0) {
      const totalTime = applicationsWithResponse.reduce((sum, app) => {
        const appliedDate = new Date(app.appliedAt)
        const respondedDate = new Date(app.respondedAt!)
        const hours = Math.floor((respondedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60))
        return sum + hours
      }, 0)
      avgResponseTime = Math.round(totalTime / applicationsWithResponse.length)
    }

    return NextResponse.json({
      success: true,
      overview: {
        totalListings,
        openListings,
        filledListings,
        totalApplications,
        conversionRate: parseFloat(conversionRate as string),
        avgTimeToHire,
        avgResponseTimeHours: avgResponseTime
      },
      pipelineBreakdown,
      topListings,
      recentActivity: recentApplications,
      stats: {
        respondedApplications: applicationsWithResponse.length,
        pendingApplications: listings
          .flatMap(l => l.applications)
          .filter(app => (app as any).pipelineStatus === 'APPLIED' || (app as any).pipelineStatus === 'REVIEWED').length
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
