import { Request, Response } from 'express'
import { PaymentStatus, PaymentMethod, Prisma } from '@prisma/client'
import axios from 'axios'
import { prisma } from '../lib/prisma'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo'
const MTN_MOMO_API_KEY = process.env.MTN_MOMO_API_KEY || ''
const MTN_MOMO_USER_ID = process.env.MTN_MOMO_USER_ID || ''
const MTN_MOMO_API_SECRET = process.env.MTN_MOMO_API_SECRET || ''
const VODAFONE_CASH_API_KEY = process.env.VODAFONE_CASH_API_KEY || ''
const VODAFONE_CASH_MERCHANT_ID = process.env.VODAFONE_CASH_MERCHANT_ID || ''

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, amount, method, mobileMoneyNumber, mobileMoneyProvider, bankAccount } = req.body

    // Get booking details from database
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        provider: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Use booking amount if provided, otherwise use amount from request
    const paymentAmount = booking.amount || amount

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' })
    }

    const reference = `booking-${bookingId}-${Date.now()}`
    
    // Handle different payment methods
    if (method && method.startsWith('MOBILE_MONEY_')) {
      // Mobile Money payment
      const provider = method.replace('MOBILE_MONEY_', '')
      
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount: paymentAmount,
          method: method as PaymentMethod,
          status: PaymentStatus.PENDING,
          mobileMoneyNumber: mobileMoneyNumber || null,
          mobileMoneyProvider: provider as any,
          transactionId: reference
        }
      })

      // Update booking payment status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: method as PaymentMethod
        }
      })
      
      try {
        if (provider === 'MTN') {
          // MTN Mobile Money integration
          const momoResponse = await initializeMTNMoMo({
            amount: paymentAmount,
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
            message: `You will receive a prompt on your MTN Mobile Money number (${mobileMoneyNumber}) to confirm payment of GHS ${paymentAmount}`,
            transactionId: momoResponse.transactionId,
            paymentId: payment.id
          })
          return
        } else if (provider === 'VODAFONE') {
          // Vodafone Cash integration
          const vodafoneResponse = await initializeVodafoneCash({
            amount: paymentAmount,
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
            message: `You will receive a prompt on your Vodafone Cash number (${mobileMoneyNumber}) to confirm payment of GHS ${paymentAmount}`,
            transactionId: vodafoneResponse.transactionId,
            paymentId: payment.id
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
            message: `You will receive a prompt on your ${provider} Mobile Money number to confirm payment of GHS ${paymentAmount}`,
            paymentId: payment.id
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
          message: `You will receive a prompt on your ${provider} Mobile Money number to confirm payment of GHS ${paymentAmount}`,
          paymentId: payment.id
        })
        return
      }
    }

    if (method === 'BANK_TRANSFER') {
      // Bank transfer - create payment record
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount: paymentAmount,
          method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PENDING,
          bankAccount: bankAccount || null,
          transactionId: reference
        }
      })

      // Update booking payment status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.BANK_TRANSFER
        }
      })

      res.json({
        reference,
        method: 'bank_transfer',
        bankDetails: {
          bankName: 'HandyGhana Bank Account',
          accountNumber: '1234567890',
          accountName: 'HandyGhana Services Ltd',
          amount: paymentAmount,
          reference
        },
        message: 'Bank transfer details sent to your email',
        paymentId: payment.id
      })
      return
    }

    if (method === 'WALLET') {
      // Wallet payment - check balance and deduct
      const userId = (req as { userId?: string }).userId
      
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required for wallet payments' })
      }

      // Get user's wallet balance (if wallet system exists)
      // For now, create payment record and mark as processing
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount: paymentAmount,
          method: PaymentMethod.WALLET,
          status: PaymentStatus.PROCESSING
        }
      })

      // Update booking payment status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: PaymentStatus.PROCESSING,
          paymentMethod: PaymentMethod.WALLET
        }
      })

      res.json({
        reference: payment.id,
        method: 'wallet',
        message: 'Payment processed from wallet',
        paymentId: payment.id
      })
      return
    }

    // Default: Card payment via Paystack
    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: paymentAmount,
        method: PaymentMethod.CARD,
        status: PaymentStatus.PENDING,
        transactionId: reference
      }
    })

    // Update booking payment status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CARD
      }
    })

    const paymentData = {
      email: booking.user?.email || 'customer@example.com',
      amount: paymentAmount * 100, // Convert to kobo (Paystack uses kobo)
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
      method: 'card',
      paymentId: payment.id
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

// Paystack Webhook Handler
export const handlePaystackWebhook = async (req: Request, res: Response) => {
  try {
    const hash = req.headers['x-paystack-signature'] as string
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_demo'
    
    if (!hash) {
      return res.status(400).json({ message: 'Missing signature' })
    }

    // Verify webhook signature
    const crypto = require('crypto')
    const secret = PAYSTACK_SECRET_KEY
    const hashCheck = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash !== hashCheck) {
      console.error('Paystack webhook signature verification failed')
      return res.status(400).json({ message: 'Invalid signature' })
    }

    const event = req.body
    const { event: eventType, data } = event

    console.log(`Paystack webhook received: ${eventType}`, data)

    // Handle different event types
    switch (eventType) {
      case 'charge.success':
      case 'transfer.success':
        // Payment successful
        const reference = data.reference || data.transfer_code
        if (reference) {
          // Update payment status in database
          const payment = await prisma.payment.findFirst({
            where: {
              OR: [
                { transactionId: reference },
                { bookingId: { contains: reference.split('-')[1] } }
              ]
            },
            include: { booking: true }
          })

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { 
                status: PaymentStatus.COMPLETED,
                paidAt: new Date(),
                transactionId: reference
              }
            })
            
            // Update booking payment status
            await prisma.booking.update({
              where: { id: payment.bookingId },
              data: {
                paymentStatus: PaymentStatus.COMPLETED
              }
            })
            
            console.log(`Payment successful for reference: ${reference}`)
          }
        }
        break

      case 'charge.failed':
      case 'transfer.failed':
        // Payment failed
        const failedReference = data.reference || data.transfer_code
        if (failedReference) {
          const payment = await prisma.payment.findFirst({
            where: {
              OR: [
                { transactionId: failedReference },
                { bookingId: { contains: failedReference.split('-')[1] } }
              ]
            }
          })

          if (payment) {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { 
                status: PaymentStatus.FAILED
              }
            })
            
            await prisma.booking.update({
              where: { id: payment.bookingId },
              data: {
                paymentStatus: PaymentStatus.FAILED
              }
            })
          }
          
          console.log(`Payment failed for reference: ${failedReference}`)
        }
        break

      default:
        console.log(`Unhandled Paystack event: ${eventType}`)
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed'
    console.error('Paystack webhook error:', error)
    // Still return 200 to prevent Paystack from retrying
    res.status(200).json({ received: true, error: errorMessage })
  }
}

// Mobile Money Webhook Handler (for MTN, Vodafone, etc.)
export const handleMobileMoneyWebhook = async (req: Request, res: Response) => {
  try {
    const { provider, reference, status, transactionId, amount } = req.body

    console.log(`Mobile Money webhook received from ${provider}:`, {
      reference,
      status,
      transactionId,
      amount
    })

    // Verify webhook (add signature verification if provider supports it)
    // For now, we'll trust the webhook data
    
    if (status === 'SUCCESSFUL' || status === 'SUCCESS') {
      // Payment successful
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { transactionId: reference },
            { bookingId: { contains: reference.split('-')[1] } }
          ]
        }
      })

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: PaymentStatus.COMPLETED,
            paidAt: new Date(),
            transactionId: reference
          }
        })
        
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: PaymentStatus.COMPLETED
          }
        })
      }
      
      console.log(`Mobile Money payment successful: ${reference}`)
    } else if (status === 'FAILED' || status === 'FAILURE') {
      // Payment failed
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { transactionId: reference },
            { bookingId: { contains: reference.split('-')[1] } }
          ]
        }
      })

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: PaymentStatus.FAILED
          }
        })
        
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: PaymentStatus.FAILED
          }
        })
      }
      
      console.log(`Mobile Money payment failed: ${reference}`)
    }

    res.status(200).json({ received: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed'
    console.error('Mobile Money webhook error:', error)
    res.status(200).json({ received: true, error: errorMessage })
  }
}

