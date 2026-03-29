import { sendEmail, EmailOptions } from './email'

/**
 * Send notification when a preacher's resume is viewed by a church
 */
export async function sendResumeViewNotification(
  preacherEmail: string,
  preacherName: string,
  churchName: string,
  dashboardUrl: string
) {
  const options: EmailOptions = {
    to: preacherEmail,
    subject: `Your resume was viewed by ${churchName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #16a34a; margin-top: 0;">📋 Resume Viewed</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${preacherName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Great news! Your resume was viewed by <strong>${churchName}</strong>.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            This is a great opportunity to connect with a potential employer. Check your dashboard to see if they send you an invitation to apply!
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${dashboardUrl}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Dashboard
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Preachers with Churches
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}

/**
 * Send subscription renewal notification
 */
export async function sendSubscriptionRenewalNotification(
  churchEmail: string,
  churchName: string,
  planName: string,
  renewalDate: Date,
  amount: number,
  dashboardUrl: string
) {
  const formattedDate = new Date(renewalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const options: EmailOptions = {
    to: churchEmail,
    subject: `Subscription Renewal Coming Up - ${planName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; margin-top: 0;">📅 Subscription Renewal Notice</h1>
          
          <p style="color: #333; font-size: 16px;">Hello ${churchName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Your <strong>${planName}</strong> plan will renew on <strong>${formattedDate}</strong>.
          </p>
          
          <div style="background: #f0f0f0; border-left: 4px solid #2563eb; padding: 12px; margin: 16px 0; border-radius: 4px;">
            <p style="color: #333; font-size: 14px; margin: 8px 0;">
              <strong>Plan:</strong> ${planName}
            </p>
            <p style="color: #333; font-size: 14px; margin: 8px 0;">
              <strong>Amount:</strong> $${(amount / 100).toFixed(2)} CAD
            </p>
            <p style="color: #333; font-size: 14px; margin: 8px 0;">
              <strong>Renewal Date:</strong> ${formattedDate}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            No action is needed from you. Your subscription will automatically renew on the specified date. If you'd like to make changes, please visit your subscription settings.
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Manage Subscription
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Churches with Preachers
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}

/**
 * Send application received notification to preacher
 */
export async function sendApplicationReceivedNotification(
  preacherEmail: string,
  preacherName: string,
  churchName: string,
  listingTitle: string,
  dashboardUrl: string
) {
  const options: EmailOptions = {
    to: preacherEmail,
    subject: `New Application: ${listingTitle} at ${churchName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #16a34a; margin-top: 0;">✅ Application Received</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${preacherName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Your application for <strong>${listingTitle}</strong> at <strong>${churchName}</strong> has been submitted successfully.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            The church will review your application and reach out to you if they'd like to move forward. In the meantime, feel free to browse other opportunities on Proclaim Canada.
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${dashboardUrl}" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Applications
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Preachers with Churches
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}

/**
 * Send application received notification to church
 */
export async function sendApplicationReceivedToChurchNotification(
  churchEmail: string,
  churchName: string,
  preacherName: string,
  listingTitle: string,
  applicationsUrl: string
) {
  const options: EmailOptions = {
    to: churchEmail,
    subject: `New Application: ${preacherName} Applied for ${listingTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; margin-top: 0;">📬 New Application</h1>
          
          <p style="color: #333; font-size: 16px;">Hello ${churchName},</p>
          
          <p style="color: #333; font-size: 16px;">
            <strong>${preacherName}</strong> has applied for your listing: <strong>${listingTitle}</strong>.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            Visit your applications dashboard to review their profile, qualifications, and respond to their application.
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${applicationsUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Review Application
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Churches with Preachers
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedNotification(
  churchEmail: string,
  churchName: string,
  planName: string,
  errorMessage: string,
  billingUrl: string
) {
  const options: EmailOptions = {
    to: churchEmail,
    subject: `Payment Failed - ${planName} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #dc2626; margin-top: 0;">⚠️ Payment Failed</h1>
          
          <p style="color: #333; font-size: 16px;">Hello ${churchName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Unfortunately, we were unable to process your payment for the <strong>${planName}</strong> plan.
          </p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 16px 0; border-radius: 4px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0;">
              <strong>Error:</strong> ${errorMessage}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            Please update your payment method and try again. If the problem persists, please contact our support team.
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${billingUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Update Payment Method
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Churches with Preachers
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}

/**
 * Send application accepted notification
 */
export async function sendApplicationAcceptedNotification(
  preacherEmail: string,
  preacherName: string,
  churchName: string,
  listingTitle: string,
  contactEmail: string
) {
  const options: EmailOptions = {
    to: preacherEmail,
    subject: `Congratulations! Your Application Was Accepted`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #16a34a; margin-top: 0;">🎉 Congratulations!</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${preacherName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Great news! <strong>${churchName}</strong> has accepted your application for <strong>${listingTitle}</strong>.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            You should expect to hear from them soon at <strong>${contactEmail}</strong>. Make sure to check your inbox and spam folder.
          </p>
          
          <p style="color: #666; font-size: 14px; margin: 16px 0;">
            We're thrilled to help you find your next opportunity. Best of luck with ${churchName}!
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting Preachers with Churches
          </p>
        </div>
      </div>
    `,
  }

  return sendEmail(options)
}
