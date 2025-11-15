import express from 'express'
import {
  getAllProviders,
  verifyProvider,
  getDashboardStats,
  toggleProviderSuspension,
  getAllBookings,
  getAnalytics,
  deleteProvider,
  updateUserRole,
  updateUserRoleByEmail,
} from '../controllers/adminController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticateToken)
router.use((req, res, next) => {
  const authReq = req as { userRole?: string }
  if (authReq.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
})

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

// User management
router.put('/users/:userId/role', updateUserRole)
router.put('/users/role', updateUserRoleByEmail)

export default router

