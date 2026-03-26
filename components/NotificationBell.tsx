'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Notification {
  id: string
  type: string
  data: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [session?.user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications?unreadOnly=false')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.notifications?.filter((n: any) => !n.read).length || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION_RECEIVED':
        return '📋'
      case 'APPLICATION_ACCEPTED':
        return '✅'
      case 'MESSAGE_RECEIVED':
        return '💬'
      case 'MATCH_FOUND':
        return '🎯'
      case 'REVIEW_RECEIVED':
        return '⭐'
      default:
        return '🔔'
    }
  }

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'APPLICATION_RECEIVED':
        return 'New Application'
      case 'APPLICATION_ACCEPTED':
        return 'Application Accepted'
      case 'MESSAGE_RECEIVED':
        return 'New Message'
      case 'MATCH_FOUND':
        return 'Match Found'
      case 'REVIEW_RECEIVED':
        return 'Review Received'
      default:
        return 'Notification'
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

  if (!session?.user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 10).map((notification) => {
                const data = JSON.parse(notification.data)
                return (
                  <button
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id)
                      }
                      setShowDropdown(false)
                    }}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {getNotificationTitle(notification.type)}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {data.preacherName || data.churchName || data.senderName || 'New update'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <div className="p-3 border-t border-gray-200">
            <a
              href="/dashboard/notifications"
              className="block text-center text-sm text-lime-600 hover:text-lime-700 font-medium py-2"
            >
              View All Notifications
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
