'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  createdAt: string
  readAt?: string
}

interface ConversationDetails {
  messages: Message[]
  partner: {
    id: string
    email: string
    name: string
  }
}

export default function ConversationPage({ params }: { params: { userId: string } }) {
  const { data: session } = useSession()
  const [conversation, setConversation] = useState<ConversationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userId = params.userId

  useEffect(() => {
    if (session?.user) {
      fetchConversation()
    }
  }, [session?.user])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  async function fetchConversation() {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages?conversationWith=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch conversation')
      const data = await response.json()
      setConversation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversation')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!messageText.trim()) return

    try {
      setSending(true)
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: userId,
          content: messageText,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      // Clear input and refresh conversation
      setMessageText('')
      await fetchConversation()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Conversation not found</p>
        <Link href="/dashboard/messages" className="text-primary-600 hover:underline">
          Back to Messages
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {conversation.partner.name || conversation.partner.email}
            </h1>
            <p className="text-gray-600">{conversation.partner.email}</p>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-primary-600 hover:underline"
          >
            Back to Messages
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId === session?.user?.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === session?.user?.id
                      ? 'text-primary-100'
                      : 'text-gray-600'
                  }`}
                >
                  {format(new Date(message.createdAt), 'h:mm a')}
                  {message.readAt && ' ✓'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={sending || !messageText.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
