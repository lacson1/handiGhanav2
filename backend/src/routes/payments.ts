import express from 'express'
import { initializePayment, verifyPayment } from '../controllers/paymentController'

const router = express.Router()

// POST /api/payments/initialize - Initialize Paystack payment
router.post('/initialize', initializePayment)

// GET /api/payments/verify/:reference - Verify payment
router.get('/verify/:reference', verifyPayment)

export default router

