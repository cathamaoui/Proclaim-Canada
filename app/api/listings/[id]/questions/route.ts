import { getSession } from 'next-auth/react'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await db.applicationQuestion.findMany({
      where: { listingId: params.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { questionText, questionType, options, required } = body

    // Verify listing exists and user is owner
    const listing = await db.churchListing.findUnique({
      where: { id: params.id }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Verify user is church owner (would need session check in production)
    const lastQuestion = await db.applicationQuestion.findFirst({
      where: { listingId: params.id },
      orderBy: { order: 'desc' }
    })

    const question = await db.applicationQuestion.create({
      data: {
        listingId: params.id,
        questionText,
        questionType,
        options: options || [],
        required: required !== false,
        order: (lastQuestion?.order || 0) + 1
      }
    })

    return NextResponse.json({ success: true, question }, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { questionId, questionText, questionType, options, required, order } = body

    const question = await db.applicationQuestion.update({
      where: { id: questionId },
      data: {
        questionText,
        questionType,
        options: options || [],
        required: required !== false,
        order
      }
    })

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { questionId } = await req.json()

    await db.applicationQuestion.delete({
      where: { id: questionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}
