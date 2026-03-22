import nodemailer from "nodemailer";

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  // Development: use Ethereal (fake SMTP)
  // Production: use real email service (SendGrid, AWS SES, etc.)
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Production SMTP (configure SMTP credentials in .env)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
      },
    });
  } else {
    // Development: log to console instead
    transporter = {
      send: async (mail: any) => {
        console.log("📧 Email Preview:");
        console.log(`To: ${mail.data.to}`);
        console.log(`Subject: ${mail.data.subject}`);
        console.log(`\n${mail.data.html}`);
        return { messageId: "dev-" + Date.now() };
      },
    } as any;
  }

  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = getTransporter();
    const from = process.env.EMAIL_FROM || "noreply@proclaim-canada.com";

    const result = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    console.log(`✅ Email sent to ${options.to}:`, result.messageId);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${options.to}:`, error);
    // For now, we don't throw - this allows the API to continue even if email fails
    // In production, you might want to queue failed emails for retry
    return null;
  }
}

// Email template utilities
export const emailTemplates = {
  newMessage: (recipientName: string, senderName: string, messagePreview: string, inboxUrl: string) => ({
    subject: `New message from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #7c3aed; margin-top: 0;">New Message</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${recipientName},</p>
          
          <p style="color: #333; font-size: 16px;">
            <strong>${senderName}</strong> sent you a new message:
          </p>
          
          <div style="background: #f0f0f0; border-left: 4px solid #7c3aed; padding: 12px; margin: 16px 0; border-radius: 4px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              "${messagePreview}${messagePreview.length > 100 ? '...' : ''}"
            </p>
          </div>
          
          <p style="margin: 20px 0;">
            <a href="${inboxUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Message
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting preachers with communities of faith
          </p>
        </div>
      </div>
    `,
  }),

  applicationReceived: (churchName: string, preacherName: string, positionTitle: string, applicationUrl: string) => ({
    subject: `New application from ${preacherName} for ${positionTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #7c3aed; margin-top: 0;">New Application</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${churchName},</p>
          
          <p style="color: #333; font-size: 16px;">
            <strong>${preacherName}</strong> has applied for your position:
          </p>
          
          <div style="background: #f0f0f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #7c3aed; margin: 0 0 8px 0;">${positionTitle}</h3>
            <p style="color: #666; margin: 0; font-size: 14px;">Applicant: ${preacherName}</p>
          </div>
          
          <p style="margin: 20px 0;">
            <a href="${applicationUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Review Application
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting preachers with communities of faith
          </p>
        </div>
      </div>
    `,
  }),

  applicationStatus: (preacherName: string, status: "ACCEPTED" | "REJECTED", churchName: string, statusMessage: string) => ({
    subject: `Your application has been ${status === "ACCEPTED" ? "accepted" : "rejected"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: ${status === "ACCEPTED" ? "#10b981" : "#ef4444"}; margin-top: 0;">
            Application ${status === "ACCEPTED" ? "Accepted" : "Rejected"}
          </h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${preacherName},</p>
          
          <p style="color: #333; font-size: 16px;">
            ${churchName} has ${status === "ACCEPTED" ? "accepted" : "rejected"} your application.
          </p>
          
          <div style="background: ${status === "ACCEPTED" ? "#ecfdf5" : "#fef2f2"}; border-left: 4px solid ${status === "ACCEPTED" ? "#10b981" : "#ef4444"}; padding: 12px; margin: 16px 0; border-radius: 4px;">
            <p style="color: #333; font-size: 14px; margin: 0;">
              ${statusMessage}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting preachers with communities of faith
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (userName: string, resetUrl: string) => ({
    subject: "Reset your Proclaim Canada password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #7c3aed; margin-top: 0;">Reset Your Password</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${userName},</p>
          
          <p style="color: #333; font-size: 16px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <p style="color: #ef4444; font-size: 14px; font-style: italic;">
            This link will expire in 1 hour.
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Or copy this link into your browser: <br/>
            <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; word-break: break-all;">
              ${resetUrl}
            </code>
          </p>
          
          <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
            If you didn't request this, you can ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting preachers with communities of faith
          </p>
        </div>
      </div>
    `,
  }),

  welcome: (userName: string, role: "PREACHER" | "CHURCH", dashboardUrl: string) => ({
    subject: "Welcome to Proclaim Canada!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #7c3aed; margin-top: 0;">Welcome to Proclaim Canada!</h1>
          
          <p style="color: #333; font-size: 16px;">Hi ${userName},</p>
          
          <p style="color: #333; font-size: 16px;">
            Your ${role === "PREACHER" ? "preacher" : "church"} account has been created successfully. 
            ${role === "PREACHER" 
              ? "You can now build your availability calendar and browse opportunities." 
              : "You can now post service openings and connect with preachers."}
          </p>
          
          <p style="margin: 20px 0;">
            <a href="${dashboardUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Go to Your Dashboard
            </a>
          </p>
          
          <div style="background: #f0f9ff; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <h3 style="color: #0369a1; margin: 0 0 8px 0;">Getting Started:</h3>
            <ul style="color: #333; margin: 8px 0; padding-left: 20px;">
              <li>${role === "PREACHER" ? "Add your availability slots for upcoming weeks" : "Create your first service opening"}</li>
              <li>Complete your profile with all relevant details</li>
              <li>Start connecting with ${role === "PREACHER" ? "churches" : "preachers"}</li>
              <li>Message and rate your ${role === "PREACHER" ? "new colleagues" : "partners"}</li>
            </ul>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            Proclaim Canada • Connecting preachers with communities of faith
          </p>
        </div>
      </div>
    `,
  }),
};
