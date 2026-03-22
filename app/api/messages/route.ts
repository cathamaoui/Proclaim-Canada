import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'
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
    const conversationWith = searchParams.get('conversationWith')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '50')

    if (!conversationWith) {
      // Get list of all conversations (most recent first)
      const conversations = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
              preacherProfile: { select: { rating: true } },
              churchProfile: { select: { denomination: true } },
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
        orderBy: { createdAt: 'desc' },
        take: 100,
      })

      // Group by conversation partner
      const uniqueConversations = new Map()
      conversations.forEach((msg) => {
        const partnerId = msg.senderId === session.user.id ? msg.receiverId : msg.senderId
        if (!uniqueConversations.has(partnerId)) {
          uniqueConversations.set(partnerId, {
            partnerId,
            lastMessage: msg,
            partner: msg.senderId === session.user.id ? msg.receiver : msg.sender,
            unreadCount: 0,
          })
        }
        if (msg.receiverId === session.user.id && !msg.read) {
          uniqueConversations.get(partnerId).unreadCount++
        }
      })

      return NextResponse.json({
        conversations: Array.from(uniqueConversations.values()),
      })
    }

    // Get specific conversation
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
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take,
    })

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

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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

    const { receiverId, content, subject } = await req.json()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot message yourself' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
        subject: subject || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: `New message from ${session.user.name}`,
        message: content.substring(0, 100),
        relatedId: message.id,
      },
    })

    // Send email notification
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, name: true, id: true },
    })

    if (receiver?.email) {
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
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
