'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  senderRole: 'PREACHER' | 'CHURCH'
  senderName: string
  senderEmail: string
  createdAt: string
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    email: string
  }
  otherRole: 'PREACHER' | 'CHURCH'
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

export default function ChurchMessagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const messageContent = newMessage

    try {
      setSending(true)
      const res = await fetch(`/api/messages/${selectedConversation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent })
      })

      if (res.ok) {
        setNewMessage('')
        await fetchMessages(selectedConversation)
      } else {
        setError('Failed to send message')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError('An error occurred while sending')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Conversations</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center py-8 flex-1">
              <p className="text-gray-500 text-center text-sm">
                No conversations yet.<br />
                <span className="text-xs">Messages will appear here.</span>
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedConversation === conv.id ? 'bg-lime-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{conv.otherUser.name}</p>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-lime-500 text-white text-xs rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{conv.otherUser.email}</p>
                  {conv.lastMessage && (
                    <>
                      <p className="text-gray-600 text-xs mt-1 truncate">{conv.lastMessage}</p>
                      <p className="text-gray-400 text-xs">{conv.lastMessageTime && formatTime(conv.lastMessageTime)}</p>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message View */}
        <div className="md:col-span-2 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">{selectedConv.otherUser.name}</h3>
                <p className="text-xs text-gray-500">{selectedConv.otherUser.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        session?.user?.email === msg.senderEmail ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          session?.user?.email === msg.senderEmail
                            ? 'bg-lime-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            session?.user?.email === msg.senderEmail
                              ? 'text-lime-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                {error && (
                  <p className="text-red-600 text-xs mb-2">{error}</p>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 text-sm"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-sm"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
