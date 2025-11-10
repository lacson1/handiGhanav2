import express from 'express'
import { register, login, getProfile, requestPasswordReset, resetPassword } from '../controllers/authController'

const router = express.Router()

// POST /api/auth/register - Register new user
router.post('/register', register)

// POST /api/auth/login - Login user
router.post('/login', login)

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', getProfile)

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', requestPasswordReset)

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', resetPassword)

export default router

