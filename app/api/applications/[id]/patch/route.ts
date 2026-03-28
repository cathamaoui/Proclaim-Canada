import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const applicationId = id
    const body = await request.json()
    const { pipelineStatus } = body

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { listing: true }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (application.listing.churchId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update pipeline status
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        pipelineStatus: pipelineStatus || application.pipelineStatus
      },
      include: {
        applicant: { select: { name: true, email: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
