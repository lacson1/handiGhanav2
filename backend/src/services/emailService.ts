import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@handyghana.com'
const APP_URL = process.env.FRONTEND_URL || 'https://handyghana.com'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent:', options.subject)
      return false
    }

    const msg = {
      to: options.to,
      from: FROM_EMAIL,
      subject: options.subject,
      text: options.text || '',
      html: options.html,
    }

    await sgMail.send(msg)
    console.log(`✅ Email sent to ${options.to}: ${options.subject}`)
    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error sending email:', errorMessage)
    return false
  }
}

// Booking notification emails
export const sendBookingConfirmation = async (
  customerEmail: string,
  customerName: string,
  providerName: string,
  bookingDetails: {
    id: string
    serviceType: string
    date: string
    time: string
    location: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <p>Hello ${customerName},</p>
          <p>Your booking with <strong>${providerName}</strong> has been confirmed!</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Service:</strong> ${bookingDetails.serviceType}</li>
            <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${bookingDetails.time}</li>
            <li><strong>Location:</strong> ${bookingDetails.location}</li>
            <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
          </ul>
          
          <p style="margin-top: 20px;">
            <a href="${APP_URL}/bookings/${bookingDetails.id}" class="button">View Booking Details</a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from HandyGhana</p>
          <p>For support, contact us at support@handyghana.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: customerEmail,
    subject: `Booking Confirmed with ${providerName}`,
    html,
    text: `Your booking with ${providerName} has been confirmed for ${bookingDetails.date} at ${bookingDetails.time}`,
  })
}

export const sendBookingNotificationToProvider = async (
  providerEmail: string,
  providerName: string,
  customerName: string,
  bookingDetails: {
    id: string
    serviceType: string
    date: string
    time: string
    location: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { background: #10B981; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Booking Request! 🔔</h1>
        </div>
        <div class="content">
          <p>Hello ${providerName},</p>
          <p>You have a new booking request from <strong>${customerName}</strong>!</p>
          
          <h3>Booking Details:</h3>
          <ul>
            <li><strong>Service:</strong> ${bookingDetails.serviceType}</li>
            <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${bookingDetails.time}</li>
            <li><strong>Location:</strong> ${bookingDetails.location}</li>
            <li><strong>Booking ID:</strong> ${bookingDetails.id}</li>
          </ul>
          
          <p style="margin-top: 20px;">
            <a href="${APP_URL}/provider/bookings/${bookingDetails.id}" class="button">Accept Booking</a>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated email from HandyGhana</p>
          <p>Please respond to this booking within 24 hours</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: providerEmail,
    subject: `New Booking Request from ${customerName}`,
    html,
    text: `You have a new booking request from ${customerName} for ${bookingDetails.date} at ${bookingDetails.time}`,
  })
}

// Verification emails
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  const verificationUrl = `${APP_URL}/verify-email?token=${verificationToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to HandyGhana! 🎉</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for registering with HandyGhana. Please verify your email address to activate your account.</p>
          
          <p style="margin-top: 20px;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Or copy and paste this link into your browser:<br>
            ${verificationUrl}
          </p>
        </div>
        <div class="footer">
          <p>If you didn't create an account, please ignore this email</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Verify Your HandyGhana Account',
    html,
    text: `Welcome to HandyGhana! Please verify your email: ${verificationUrl}`,
  })
}

export const sendProviderApprovalEmail = async (
  email: string,
  name: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { background: #10B981; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Provider Account Approved! ✅</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Congratulations! Your provider account has been approved and verified.</p>
          <p>You can now start accepting bookings from customers.</p>
          
          <p style="margin-top: 20px;">
            <a href="${APP_URL}/provider/dashboard" class="button">Go to Dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>Welcome to the HandyGhana provider community!</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Your Provider Account is Approved!',
    html,
    text: `Congratulations! Your HandyGhana provider account has been approved.`,
  })
}

// Password reset email
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
) => {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .button { background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; border-radius: 5px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          
          <p style="margin-top: 20px;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This link will expire in 1 hour.<br>
            If you didn't request this, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p>HandyGhana Security</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Reset Your HandyGhana Password',
    html,
    text: `Reset your password: ${resetUrl}`,
  })
}

export default {
  sendEmail,
  sendBookingConfirmation,
  sendBookingNotificationToProvider,
  sendVerificationEmail,
  sendProviderApprovalEmail,
  sendPasswordResetEmail,
}

