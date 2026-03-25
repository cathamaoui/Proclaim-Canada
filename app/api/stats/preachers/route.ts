import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const totalPreachers = await prisma.user.count({
      where: { role: 'PREACHER' }
    })

    return NextResponse.json({
      success: true,
      count: totalPreachers
    })
  } catch (error) {
    console.error('Failed to fetch preacher count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preacher count' },
      { status: 500 }
    )
  }
}
