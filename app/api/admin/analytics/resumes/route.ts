import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const daysParam = req.nextUrl.searchParams.get('days') || '30'
    const days = parseInt(daysParam)

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total views in date range
    const totalViews = await prisma.resumeView.count({
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
    })

    // Unique viewers
    const uniqueViewers = await prisma.resumeView.findMany({
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
      distinct: ['subscriptionId'],
      select: { subscriptionId: true },
    })

    // Top preachers by view count
    const topPreachers = await prisma.resumeView.groupBy({
      by: ['preacherId'],
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Fetch preacher details
    const preacherIds = topPreachers.map(p => p.preacherId)
    const preachers = await prisma.user.findMany({
      where: { id: { in: preacherIds } },
      include: {
        preacherProfile: true,
      },
    })

    const topPreachersWithDetails = topPreachers.map(tp => {
      const preacher = preachers.find(p => p.id === tp.preacherId)
      return {
        id: preacher?.id || '',
        name: preacher?.name || 'Unknown',
        denomination: preacher?.preacherProfile?.denomination || 'N/A',
        viewCount: tp._count.id,
        rating: parseFloat(preacher?.preacherProfile?.rating?.toString() || '0'),
      }
    })

    // Views trend (daily)
    const viewsTrend = await prisma.$queryRaw`
      SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views
      FROM "ResumeView"
      WHERE viewed_at >= ${startDate}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    ` as Array<{ date: Date; views: number }>

    // Conversion metrics (views to applications)
    const applicationsInRange = await prisma.application.count({
      where: {
        appliedAt: {
          gte: startDate,
        },
      },
    })

    const conversionRate = totalViews > 0 ? applicationsInRange / totalViews : 0
    const averageViewsPerApplication = applicationsInRange > 0 ? totalViews / applicationsInRange : 0

    return NextResponse.json({
      success: true,
      analytics: {
        totalViews,
        uniqueViewers: uniqueViewers.length,
        topPreachers: topPreachersWithDetails,
        viewsTrend: viewsTrend.map(v => ({
          date: v.date.toISOString().split('T')[0],
          views: Number(v.views),
        })),
        conversionMetrics: {
          applicationsFromViews: applicationsInRange,
          conversionRate,
          averageViewsPerApplication,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching resume analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
