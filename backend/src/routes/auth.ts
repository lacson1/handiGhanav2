import express from 'express'
import { register, login, getProfile, requestPasswordReset, resetPassword, exportUserData, deleteUserAccount } from '../controllers/authController'
import { authenticateToken } from '../middleware/auth'
import { authRateLimit } from '../middleware/rateLimit'
import { validate } from '../middleware/validate'
import { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema } from '../validators/auth.validator'

const router = express.Router()

// POST /api/auth/register - Register new user
router.post('/register', authRateLimit, validate(registerSchema), register)

// POST /api/auth/login - Login user
router.post('/login', authRateLimit, validate(loginSchema), login)

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticateToken, getProfile)

// GET /api/auth/export - Export user data (protected)
router.get('/export', authenticateToken, exportUserData)

// DELETE /api/auth/account - Delete user account (protected)
router.delete('/account', authenticateToken, deleteUserAccount)

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', authRateLimit, validate(requestPasswordResetSchema), requestPasswordReset)

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', authRateLimit, validate(resetPasswordSchema), resetPassword)

export default router

