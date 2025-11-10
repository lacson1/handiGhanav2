import express from 'express'
import { 
  getSubscriptions, 
  getSubscriptionById, 
  createSubscription, 
  updateSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from '../controllers/subscriptionController'

const router = express.Router()

// GET /api/subscriptions - Get all subscriptions with filters (userId, status)
router.get('/', getSubscriptions)

// GET /api/subscriptions/:id - Get subscription by ID
router.get('/:id', getSubscriptionById)

// POST /api/subscriptions - Create new subscription (protected)
router.post('/', createSubscription)

// PUT /api/subscriptions/:id - Update subscription (protected)
router.put('/:id', updateSubscription)

// POST /api/subscriptions/:id/cancel - Cancel subscription (protected)
router.post('/:id/cancel', cancelSubscription)

// POST /api/subscriptions/:id/pause - Pause subscription (protected)
router.post('/:id/pause', pauseSubscription)

// POST /api/subscriptions/:id/resume - Resume subscription (protected)
router.post('/:id/resume', resumeSubscription)

export default router

