import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { applicationId, answers } = body // answers = [{ questionId, answer, answerFile }]

    // Create or update answer records
    const savedAnswers = await Promise.all(
      answers.map((answer: any) =>
        db.applicationAnswer.upsert({
          where: {
            applicationId_questionId: {
              applicationId,
              questionId: answer.questionId
            }
          },
          create: {
            applicationId,
            questionId: answer.questionId,
            answerText: answer.answerText,
            answerFile: answer.answerFile,
            answerOptions: answer.answerOptions
          },
          update: {
            answerText: answer.answerText,
            answerFile: answer.answerFile,
            answerOptions: answer.answerOptions
          }
        })
      )
    )

    return NextResponse.json({ success: true, answers: savedAnswers }, { status: 201 })
  } catch (error) {
    console.error('Error saving answers:', error)
    return NextResponse.json(
      { error: 'Failed to save answers' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const answers = await db.applicationAnswer.findMany({
      where: { applicationId: id },
      include: { question: true }
    })

    return NextResponse.json({ success: true, answers })
  } catch (error) {
    console.error('Error fetching answers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    )
  }
}
