import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const preacherId = params.id

    const preacher = await prisma.user.findUnique({
      where: { id: preacherId },
      include: {
        preacherProfile: true,
        ratingsReceived: {
          include: {
            ratedBy: {
              include: {
                churchProfile: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!preacher || preacher.role !== 'PREACHER') {
      return NextResponse.json({ error: 'Preacher not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: preacher,
    })
  } catch (error) {
    console.error('Error fetching preacher:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
