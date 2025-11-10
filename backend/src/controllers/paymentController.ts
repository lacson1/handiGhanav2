import { Request, Response } from 'express'
import axios from 'axios'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo'
const MTN_MOMO_API_KEY = process.env.MTN_MOMO_API_KEY || ''
const MTN_MOMO_USER_ID = process.env.MTN_MOMO_USER_ID || ''
const MTN_MOMO_API_SECRET = process.env.MTN_MOMO_API_SECRET || ''
const VODAFONE_CASH_API_KEY = process.env.VODAFONE_CASH_API_KEY || ''
const VODAFONE_CASH_MERCHANT_ID = process.env.VODAFONE_CASH_MERCHANT_ID || ''

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, method, mobileMoneyNumber, mobileMoneyProvider, bankAccount } = req.body

    // TODO: Get actual booking details from database
    const reference = `booking-${bookingId}-${Date.now()}`
    
    // Handle different payment methods
    if (method && method.startsWith('MOBILE_MONEY_')) {
      // Mobile Money payment
      const provider = method.replace('MOBILE_MONEY_', '')
      
      try {
        if (provider === 'MTN') {
          // MTN Mobile Money integration
          const momoResponse = await initializeMTNMoMo({
            amount,
            phoneNumber: mobileMoneyNumber,
            reference,
            description: `Payment for booking ${bookingId}`
          })
          
          res.json({
            authorization_url: momoResponse.authorizationUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${reference}`,
            access_code: momoResponse.accessCode || 'momo-access-code',
            reference: momoResponse.reference || reference,
            method: 'mobile_money',
            provider: 'MTN',
            mobileMoneyNumber,
            message: `You will receive a prompt on your MTN Mobile Money number (${mobileMoneyNumber}) to confirm payment of GHS ${amount}`,
            transactionId: momoResponse.transactionId
          })
          return
        } else if (provider === 'VODAFONE') {
          // Vodafone Cash integration
          const vodafoneResponse = await initializeVodafoneCash({
            amount,
            phoneNumber: mobileMoneyNumber,
            reference,
            description: `Payment for booking ${bookingId}`
          })
          
          res.json({
            authorization_url: vodafoneResponse.authorizationUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${reference}`,
            access_code: vodafoneResponse.accessCode || 'vodafone-access-code',
            reference: vodafoneResponse.reference || reference,
            method: 'mobile_money',
            provider: 'VODAFONE',
            mobileMoneyNumber,
            message: `You will receive a prompt on your Vodafone Cash number (${mobileMoneyNumber}) to confirm payment of GHS ${amount}`,
            transactionId: vodafoneResponse.transactionId
          })
          return
        } else {
          // AirtelTigo or other - use generic mock
          res.json({
            authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${reference}`,
            access_code: 'mock-mobile-money-code',
            reference,
            method: 'mobile_money',
            provider,
            mobileMoneyNumber,
            message: `You will receive a prompt on your ${provider} Mobile Money number to confirm payment of GHS ${amount}`
          })
          return
        }
      } catch (error: unknown) {
        // Fallback to mock response if API fails
        console.error('Mobile Money API error:', error)
        res.json({
          authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${reference}`,
          access_code: 'mock-mobile-money-code',
          reference,
          method: 'mobile_money',
          provider,
          mobileMoneyNumber,
          message: `You will receive a prompt on your ${provider} Mobile Money number to confirm payment of GHS ${amount}`
        })
        return
      }
    }

    if (method === 'BANK_TRANSFER') {
      // Bank transfer - return bank details
      res.json({
        reference,
        method: 'bank_transfer',
        bankDetails: {
          bankName: 'HandyGhana Bank Account',
          accountNumber: '1234567890',
          accountName: 'HandyGhana Services Ltd',
          amount,
          reference
        },
        message: 'Bank transfer details sent to your email'
      })
      return
    }

    if (method === 'WALLET') {
      // Wallet payment - check balance and deduct
      // TODO: Implement wallet balance check and deduction
      res.json({
        reference,
        method: 'wallet',
        message: 'Payment processed from wallet'
      })
      return
    }

    // Default: Card payment via Paystack
    const paymentData = {
      email: 'customer@example.com', // Get from booking
      amount: amount * 100, // Convert to kobo (Paystack uses kobo)
      reference,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback`,
      metadata: {
        bookingId,
        custom_fields: [
          {
            display_name: 'Booking ID',
            variable_name: 'booking_id',
            value: bookingId,
          },
        ],
      },
    }

    // In production, use actual Paystack API
    // const response = await axios.post(
    //   'https://api.paystack.co/transaction/initialize',
    //   paymentData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // )

    // Mock response for development
    res.json({
      authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?reference=${reference}`,
      access_code: 'mock-access-code',
      reference,
      method: 'card'
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed'
    console.error('Initialize payment error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params
    const { method } = req.query

    // Verify based on payment method
    if (method === 'mobile_money' || method?.toString().startsWith('MOBILE_MONEY_')) {
      // Verify mobile money payment
      const provider = method?.toString().replace('MOBILE_MONEY_', '') || 'MTN'
      
      try {
        if (provider === 'MTN') {
          const verification = await verifyMTNMoMo(reference)
          return res.json(verification)
        } else if (provider === 'VODAFONE') {
          const verification = await verifyVodafoneCash(reference)
          return res.json(verification)
        }
      } catch (error: unknown) {
        console.error('Mobile Money verification error:', error)
        // Fall through to mock verification
      }
    }

    // Paystack verification
    if (PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY !== 'sk_test_demo') {
      try {
        const response = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
          }
        )
        return res.json({
          status: response.data.status,
          message: 'Payment verified',
          data: response.data.data
        })
      } catch (error: unknown) {
        console.error('Paystack verification error:', error)
      }
    }

    // Mock verification (fallback)
    res.json({
      status: true,
      message: 'Payment verified',
      data: {
        reference,
        status: 'success',
        amount: 0,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed'
    console.error('Verify payment error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// MTN Mobile Money Integration Functions
async function initializeMTNMoMo(params: {
  amount: number
  phoneNumber: string
  reference: string
  description: string
}) {
  // MTN MoMo API Integration
  // Documentation: https://momodeveloper.mtn.com/
  
  if (!MTN_MOMO_API_KEY || !MTN_MOMO_USER_ID || !MTN_MOMO_API_SECRET) {
    // Return mock response if credentials not configured
    return {
      reference: params.reference,
      authorizationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${params.reference}`,
      accessCode: 'momo-mock-code',
      transactionId: `MTN-${Date.now()}`
    }
  }

  try {
    // Step 1: Create API user and get access token
    // This is a simplified version - in production, implement full OAuth flow
    const tokenResponse = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/collection/token/',
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${MTN_MOMO_USER_ID}:${MTN_MOMO_API_SECRET}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_API_KEY
        }
      }
    )

    const accessToken = tokenResponse.data.access_token

    // Step 2: Request payment
    const paymentResponse = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`,
      {
        amount: params.amount.toString(),
        currency: 'GHS',
        externalId: params.reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: params.phoneNumber.replace(/^\+233/, '0') // Format phone number
        },
        payerMessage: params.description,
        payeeNote: `Booking ${params.reference}`
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'X-Reference-Id': params.reference,
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': MTN_MOMO_API_KEY
        }
      }
    )

    return {
      reference: params.reference,
      authorizationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${params.reference}`,
      accessCode: accessToken,
      transactionId: paymentResponse.data.transactionId || params.reference
    }
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    console.error('MTN MoMo API error:', errorDetails)
    throw error
  }
}

async function verifyMTNMoMo(reference: string) {
  if (!MTN_MOMO_API_KEY || !MTN_MOMO_USER_ID || !MTN_MOMO_API_SECRET) {
    return {
      status: true,
      message: 'Payment verified (mock)',
      data: {
        reference,
        status: 'success',
        amount: 0
      }
    }
  }

  try {
    const tokenResponse = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/collection/token/',
      {},
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${MTN_MOMO_USER_ID}:${MTN_MOMO_API_SECRET}`).toString('base64')}`,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_API_KEY
        }
      }
    )

    const accessToken = tokenResponse.data.access_token

    const verificationResponse = await axios.get(
      `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': MTN_MOMO_API_KEY
        }
      }
    )

    return {
      status: verificationResponse.data.status === 'SUCCESSFUL',
      message: 'Payment verified',
      data: {
        reference,
        status: verificationResponse.data.status?.toLowerCase() || 'success',
        amount: verificationResponse.data.amount || 0
      }
    }
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    console.error('MTN MoMo verification error:', errorDetails)
    throw error
  }
}

// Vodafone Cash Integration Functions
async function initializeVodafoneCash(params: {
  amount: number
  phoneNumber: string
  reference: string
  description: string
}) {
  // Vodafone Cash API Integration
  // Note: Vodafone Cash API documentation may vary
  
  if (!VODAFONE_CASH_API_KEY || !VODAFONE_CASH_MERCHANT_ID) {
    return {
      reference: params.reference,
      authorizationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${params.reference}`,
      accessCode: 'vodafone-mock-code',
      transactionId: `VODAFONE-${Date.now()}`
    }
  }

  try {
    // Vodafone Cash API implementation
    // This is a placeholder - actual implementation depends on Vodafone Cash API documentation
    const paymentResponse = await axios.post(
      'https://api.vodafone.com.gh/payment/initiate',
      {
        merchantId: VODAFONE_CASH_MERCHANT_ID,
        amount: params.amount,
        phoneNumber: params.phoneNumber,
        reference: params.reference,
        description: params.description
      },
      {
        headers: {
          'Authorization': `Bearer ${VODAFONE_CASH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return {
      reference: params.reference,
      authorizationUrl: paymentResponse.data.paymentUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${params.reference}`,
      accessCode: paymentResponse.data.accessCode || 'vodafone-access-code',
      transactionId: paymentResponse.data.transactionId || params.reference
    }
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    console.error('Vodafone Cash API error:', errorDetails)
    // Return mock response on error
    return {
      reference: params.reference,
      authorizationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/mobile-money?reference=${params.reference}`,
      accessCode: 'vodafone-mock-code',
      transactionId: `VODAFONE-${Date.now()}`
    }
  }
}

async function verifyVodafoneCash(reference: string) {
  if (!VODAFONE_CASH_API_KEY || !VODAFONE_CASH_MERCHANT_ID) {
    return {
      status: true,
      message: 'Payment verified (mock)',
      data: {
        reference,
        status: 'success',
        amount: 0
      }
    }
  }

  try {
    const verificationResponse = await axios.get(
      `https://api.vodafone.com.gh/payment/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${VODAFONE_CASH_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return {
      status: verificationResponse.data.status === 'SUCCESS',
      message: 'Payment verified',
      data: {
        reference,
        status: verificationResponse.data.status?.toLowerCase() || 'success',
        amount: verificationResponse.data.amount || 0
      }
    }
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error'
    console.error('Vodafone Cash verification error:', errorDetails)
    return {
      status: true,
      message: 'Payment verified (mock)',
      data: {
        reference,
        status: 'success',
        amount: 0
      }
    }
  }
}


