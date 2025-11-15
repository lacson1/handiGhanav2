import express from 'express'
import { sendEmail, sendBookingConfirmation } from '../services/emailService'
import Sentry from '@sentry/node'

const router = express.Router()

// Test email service
router.post('/email', async (req, res) => {
  try {
    const { to } = req.body

    if (!to) {
      return res.status(400).json({ message: 'Email address required' })
    }

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(503).json({
        message: 'SendGrid not configured',
        instructions: 'Set SENDGRID_API_KEY environment variable',
        configured: false
      })
    }

    // Send test email
    const success = await sendEmail({
      to,
      subject: 'HandyGhana - Test Email',
      html: `
        <h1>🎉 Email Service Working!</h1>
        <p>Your HandyGhana email service is configured correctly.</p>
        <p>This is a test email sent at ${new Date().toLocaleString()}</p>
      `,
      text: 'HandyGhana email service test successful!'
    })

    if (success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        to,
        configured: true
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Check SendGrid configuration.',
        configured: true
      })
    }
  } catch (error: unknown) {
    console.error('Test email error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      message: errorMessage,
      configured: !!process.env.SENDGRID_API_KEY
    })
  }
})

// Test booking confirmation email
router.post('/booking-email', async (req, res) => {
  try {
    const { to } = req.body

    if (!to) {
      return res.status(400).json({ message: 'Email address required' })
    }

    if (!process.env.SENDGRID_API_KEY) {
      return res.status(503).json({
        message: 'SendGrid not configured',
        configured: false
      })
    }

    const success = await sendBookingConfirmation(
      to,
      'Test Customer',
      'Bis FagQ',
      {
        id: 'TEST-123',
        serviceType: 'Electrical Installation',
        date: new Date().toISOString(),
        time: '10:00 AM',
        location: 'Accra, Ghana'
      }
    )

    if (success) {
      res.json({
        success: true,
        message: 'Test booking confirmation sent',
        to,
        configured: true
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send booking confirmation',
        configured: true
      })
    }
  } catch (error: unknown) {
    console.error('Test booking email error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      message: errorMessage,
      configured: !!process.env.SENDGRID_API_KEY
    })
  }
})

// Test Sentry error tracking
router.get('/sentry', (req, res) => {
  try {
    if (!process.env.SENTRY_DSN) {
      return res.json({
        message: 'Sentry not configured',
        instructions: 'Set SENTRY_DSN environment variable',
        configured: false
      })
    }

    // Trigger a test error
    const testError = new Error('Test error from HandyGhana - Sentry is working!')
    Sentry.captureException(testError)

    res.json({
      success: true,
      message: 'Test error sent to Sentry. Check your Sentry dashboard.',
      configured: true,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({
      success: false,
      message: errorMessage,
      configured: !!process.env.SENTRY_DSN
    })
  }
})

// Check all service configurations
router.get('/config', (req, res) => {
  const config = {
    sendgrid: {
      configured: !!process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'not set',
      frontendUrl: process.env.FRONTEND_URL || 'not set'
    },
    sentry: {
      configured: !!process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development'
    },
    cloudinary: {
      configured: !!(process.env.CLOUDINARY_CLOUD_NAME && 
                     process.env.CLOUDINARY_API_KEY && 
                     process.env.CLOUDINARY_API_SECRET)
    },
    twilio: {
      configured: !!(process.env.TWILIO_ACCOUNT_SID && 
                     process.env.TWILIO_AUTH_TOKEN)
    },
    database: {
      configured: !!process.env.DATABASE_URL
    }
  }

  const allConfigured = Object.values(config).every(service => service.configured === true)

  res.json({
    status: allConfigured ? 'All services configured' : 'Some services need configuration',
    services: config,
    readyForProduction: allConfigured
  })
})

export default router

