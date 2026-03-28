import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/messages/[id] - Get messages in a conversation with a specific user
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: conversationWith } = await params
    const { searchParams } = new URL(req.url)
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '50')

    // Get messages for this conversation
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: conversationWith },
          { senderId: conversationWith, receiverId: session.user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take,
    })

    // Get conversation partner info
    const partner = await prisma.user.findUnique({
      where: { id: conversationWith },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        preacherProfile: {
          select: {
            rating: true,
            denomination: true,
          },
        },
        churchProfile: {
          select: {
            churchName: true,
            denomination: true,
          },
        },
      },
    })

    if (!partner) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: conversationWith,
        receiverId: session.user.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })

    // Format messages for the frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderRole: msg.sender.role,
      senderName: msg.sender.name || 'Unknown',
      senderEmail: '', // Don't expose email
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt.toISOString(),
      read: msg.read,
    }))

    return NextResponse.json({
      messages: formattedMessages,
      partner: {
        id: partner.id,
        name: partner.role === 'CHURCH' 
          ? partner.churchProfile?.churchName || partner.name 
          : partner.name,
        image: partner.image,
        role: partner.role,
        denomination: partner.role === 'CHURCH' 
          ? partner.churchProfile?.denomination 
          : partner.preacherProfile?.denomination,
      },
    })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/messages/[id] - Send a message to a specific user
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: receiverId } = await params
    const { content, subject } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot message yourself' },
        { status: 400 }
      )
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, email: true, name: true },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content: content.trim(),
        subject: subject || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: `New message from ${session.user.name || 'Someone'}`,
        message: content.substring(0, 100),
        relatedId: message.id,
      },
    })

    // Send email notification
    if (receiver.email) {
      try {
        const inboxUrl = `${process.env.NEXTAUTH_URL}/dashboard/messages`
        const emailContent = emailTemplates.newMessage(
          receiver.name || receiver.email,
          session.user.name || session.user.email || 'Someone',
          content,
          inboxUrl
        )

        await sendEmail({
          to: receiver.email,
          subject: emailContent.subject,
          html: emailContent.html,
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        senderName: message.sender.name,
        senderRole: message.sender.role,
        senderId: message.senderId,
        receiverId: message.receiverId,
        createdAt: message.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
