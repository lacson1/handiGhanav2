import nodemailer from 'nodemailer'

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    // In development, log email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        html: options.html,
      })
      return { success: true, message: 'Email logged (development mode)' }
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'HandyGhana <noreply@handyghana.com>',
      ...options,
    })

    return { success: true, messageId: info.messageId }
  } catch (error: unknown) {
    console.error('Email error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: errorMessage }
  }
}

export const sendBookingConfirmation = async (
  customerEmail: string,
  providerName: string,
  bookingDetails: {
    date: string
    time: string
    serviceType: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FACC15; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background: #FACC15; color: #000; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HandyGhana</h1>
          </div>
          <div class="content">
            <h2>Booking Confirmed!</h2>
            <p>Your booking with <strong>${providerName}</strong> has been confirmed.</p>
            <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
            <p><strong>Date:</strong> ${bookingDetails.date}</p>
            <p><strong>Time:</strong> ${bookingDetails.time}</p>
            <p>Thank you for using HandyGhana!</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: customerEmail,
    subject: `Booking Confirmed with ${providerName}`,
    html,
  })
}

export const sendBookingNotification = async (
  providerEmail: string,
  customerName: string,
  bookingDetails: {
    date: string
    time: string
    serviceType: string
  }
) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FACC15; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HandyGhana</h1>
          </div>
          <div class="content">
            <h2>New Booking Received</h2>
            <p>You have a new booking from <strong>${customerName}</strong>.</p>
            <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
            <p><strong>Date:</strong> ${bookingDetails.date}</p>
            <p><strong>Time:</strong> ${bookingDetails.time}</p>
            <p>Please log in to your dashboard to confirm this booking.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: providerEmail,
    subject: `New Booking from ${customerName}`,
    html,
  })
}

