'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Conversation {
  [key: string]: unknown
  userId: string
  userEmail: string
  userName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
    }
  }, [status])

  async function fetchConversations() {
    try {
      setLoading(true)
      const response = await fetch('/api/messages')
      if (!response.ok) throw new Error('Failed to fetch conversations')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversations')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Manage your conversations with churches and preachers</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600">
            {session?.user?.role === 'PREACHER'
              ? 'Churches will message you after reviewing your applications'
              : 'Send a message to a preacher to start a conversation'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Link
              key={conversation.userId}
              href={`/dashboard/messages/${conversation.userId}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-400 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {conversation.userName || conversation.userEmail}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">
                    {format(new Date(conversation.lastMessageTime), 'MMM d, h:mm a')}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="inline-block mt-2 bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
