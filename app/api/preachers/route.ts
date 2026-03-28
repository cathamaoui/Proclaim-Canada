import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const preachers = await prisma.user.findMany({
      where: { role: 'PREACHER' },
      include: {
        preacherProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: preachers,
    })
  } catch (error) {
    console.error('Error fetching preachers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
