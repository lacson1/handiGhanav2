import twilio from 'twilio'

// Initialize Twilio client
let twilioClient: ReturnType<typeof twilio> | null = null

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )
}

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || ''

export interface SMSOptions {
  to: string
  message: string
}

export const sendSMS = async (options: SMSOptions): Promise<boolean> => {
  try {
    if (!twilioClient) {
      console.warn('Twilio not configured. SMS not sent:', options.message.substring(0, 50))
      return false
    }

    if (!FROM_PHONE) {
      console.error('TWILIO_PHONE_NUMBER not set')
      return false
    }

    // Format phone number (ensure it starts with +)
    let toPhone = options.to.trim()
    if (!toPhone.startsWith('+')) {
      // Assume Ghana country code if not specified
      toPhone = toPhone.startsWith('0') ? `+233${toPhone.slice(1)}` : `+233${toPhone}`
    }

    const result = await twilioClient.messages.create({
      body: options.message,
      from: FROM_PHONE,
      to: toPhone,
    })

    console.log(`✅ SMS sent to ${toPhone}: ${result.sid}`)
    return true
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error sending SMS:', errorMessage)
    return false
  }
}

// Booking notification SMS
export const sendBookingSMS = async (
  phone: string,
  customerName: string,
  providerName: string,
  bookingDetails: {
    serviceType: string
    date: string
    time: string
  }
) => {
  const message = `HandyGhana Booking Confirmed!\n\nProvider: ${providerName}\nService: ${bookingDetails.serviceType}\nDate: ${new Date(bookingDetails.date).toLocaleDateString()}\nTime: ${bookingDetails.time}\n\nThank you for using HandyGhana!`

  return sendSMS({ to: phone, message })
}

// Provider notification SMS
export const sendProviderBookingSMS = async (
  phone: string,
  providerName: string,
  customerName: string,
  bookingDetails: {
    serviceType: string
    date: string
    time: string
  }
) => {
  const message = `New Booking Request!\n\nCustomer: ${customerName}\nService: ${bookingDetails.serviceType}\nDate: ${new Date(bookingDetails.date).toLocaleDateString()}\nTime: ${bookingDetails.time}\n\nLogin to HandyGhana to accept.`

  return sendSMS({ to: phone, message })
}

// Verification code SMS
export const sendVerificationCodeSMS = async (
  phone: string,
  code: string
) => {
  const message = `Your HandyGhana verification code is: ${code}\n\nValid for 10 minutes.\nDo not share this code with anyone.`

  return sendSMS({ to: phone, message })
}

// Booking status update SMS
export const sendBookingStatusSMS = async (
  phone: string,
  status: string,
  bookingId: string
) => {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your booking has been confirmed! The provider will arrive at the scheduled time.',
    started: 'Your service provider has started working on your booking.',
    completed: 'Your booking has been completed. Please leave a review!',
    cancelled: 'Your booking has been cancelled. Contact support if you need help.',
  }

  const message = `HandyGhana Update\n\n${statusMessages[status] || `Booking ${status}`}\n\nBooking ID: ${bookingId}`

  return sendSMS({ to: phone, message })
}

// Payment confirmation SMS
export const sendPaymentConfirmationSMS = async (
  phone: string,
  amount: number,
  bookingId: string
) => {
  const message = `Payment Successful!\n\nAmount: GHS ${amount.toFixed(2)}\nBooking: ${bookingId}\n\nThank you for using HandyGhana!`

  return sendSMS({ to: phone, message })
}

export default {
  sendSMS,
  sendBookingSMS,
  sendProviderBookingSMS,
  sendVerificationCodeSMS,
  sendBookingStatusSMS,
  sendPaymentConfirmationSMS,
}

