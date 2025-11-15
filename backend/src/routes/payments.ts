import express from 'express'
import { initializePayment, verifyPayment, handlePaystackWebhook, handleMobileMoneyWebhook } from '../controllers/paymentController'
import { paymentRateLimit } from '../middleware/rateLimit'

const router = express.Router()

// POST /api/payments/initialize - Initialize Paystack payment
router.post('/initialize', paymentRateLimit, initializePayment)

// GET /api/payments/verify/:reference - Verify payment
router.get('/verify/:reference', verifyPayment)

// POST /api/payments/webhook/paystack - Paystack webhook handler
router.post('/webhook/paystack', express.raw({ type: 'application/json' }), handlePaystackWebhook)

// POST /api/payments/webhook/mobile-money - Mobile Money webhook handler
router.post('/webhook/mobile-money', handleMobileMoneyWebhook)

export default router

