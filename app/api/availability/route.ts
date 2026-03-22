import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || session.user.id
    const monthStart = searchParams.get('monthStart')
    const monthEnd = searchParams.get('monthEnd')

    const where: any = {
      userId,
    }

    if (monthStart && monthEnd) {
      // Parse dates as local dates, not UTC
      const startParts = monthStart.split('-')
      const endParts = monthEnd.split('-')
      
      const localStart = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
      const localEnd = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]))
      // Set end date to end of day
      localEnd.setHours(23, 59, 59, 999)
      
      where.date = {
        gte: localStart,
        lte: localEnd,
      }
    }

    const availability = await prisma.availabilitySlot.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('Availability fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'PREACHER') {
      return NextResponse.json(
        { error: 'Only preachers can set availability' },
        { status: 403 }
      )
    }

    const { date, startTime, endTime, notes } = await req.json()

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse date string (YYYY-MM-DD) as local date, not UTC
    const [year, month, day] = date.split('-')
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    const slot = await prisma.availabilitySlot.create({
      data: {
        userId: session.user.id,
        date: localDate,
        startTime,
        endTime,
        notes: notes || null,
      },
    })

    return NextResponse.json(slot, { status: 201 })
  } catch (error) {
    console.error('Availability creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create availability slot' },
      { status: 500 }
    )
  }
}
