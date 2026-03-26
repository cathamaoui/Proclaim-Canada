/**
 * Notification helper utilities for sending email and in-app notifications
 */

type NotificationType = 
  | 'APPLICATION_RECEIVED' 
  | 'APPLICATION_ACCEPTED' 
  | 'MESSAGE_RECEIVED' 
  | 'MATCH_FOUND' 
  | 'REVIEW_RECEIVED'

interface NotificationPayload {
  type: NotificationType
  recipientId: string
  data: Record<string, any>
}

/**
 * Send a notification (email + in-app)
 */
export async function sendNotification(payload: NotificationPayload) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error('Failed to send notification:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending notification:', error)
    return null
  }
}

/**
 * Send application received notification to church
 */
export async function notifyApplicationReceived(
  churchId: string,
  preacherName: string,
  preacherBio: string,
  yearsOfExperience: number,
  rating: number,
  listingTitle: string,
  coverLetter?: string
) {
  return sendNotification({
    type: 'APPLICATION_RECEIVED',
    recipientId: churchId,
    data: {
      preacherName,
      preacherBio,
      yearsOfExperience,
      rating,
      listingTitle,
      coverLetter
    }
  })
}

/**
 * Send application accepted notification to preacher
 */
export async function notifyApplicationAccepted(
  preacherId: string,
  listingTitle: string,
  churchName: string,
  serviceDate?: string,
  location?: string
) {
  return sendNotification({
    type: 'APPLICATION_ACCEPTED',
    recipientId: preacherId,
    data: {
      listingTitle,
      churchName,
      serviceDate,
      location
    }
  })
}

/**
 * Send message received notification
 */
export async function notifyMessageReceived(
  recipientId: string,
  senderName: string,
  messagePreview: string
) {
  return sendNotification({
    type: 'MESSAGE_RECEIVED',
    recipientId,
    data: {
      senderName,
      messagePreview: messagePreview.substring(0, 100)
    }
  })
}

/**
 * Send match found notification to church
 */
export async function notifyMatchFound(
  churchId: string,
  candidateName: string,
  listingTitle: string,
  matchScore: number,
  yearsOfExperience: number,
  rating: number
) {
  return sendNotification({
    type: 'MATCH_FOUND',
    recipientId: churchId,
    data: {
      candidateName,
      listingTitle,
      matchScore,
      yearsOfExperience,
      rating
    }
  })
}

/**
 * Send review received notification
 */
export async function notifyReviewReceived(
  userId: string,
  reviewerName: string,
  rating: number,
  review?: string
) {
  return sendNotification({
    type: 'REVIEW_RECEIVED',
    recipientId: userId,
    data: {
      reviewerName,
      rating,
      review
    }
  })
}
