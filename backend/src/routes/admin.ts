import express from 'express'
import {
  getAllProviders,
  verifyProvider,
  getDashboardStats,
  toggleProviderSuspension,
  getAllBookings,
  getAnalytics,
  deleteProvider,
} from '../controllers/adminController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// All admin routes require authentication
// TODO: Add admin role check middleware
router.use(authenticateToken)

// Dashboard stats
router.get('/stats', getDashboardStats)

// Analytics
router.get('/analytics', getAnalytics)

// Provider management
router.get('/providers', getAllProviders)
router.put('/providers/:id/verify', verifyProvider)
router.put('/providers/:id/suspend', toggleProviderSuspension)
router.delete('/providers/:id', deleteProvider)

// Booking management
router.get('/bookings', getAllBookings)

export default router

