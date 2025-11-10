import express from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController'

const router = express.Router()

// POST /api/auth/register - Register new user
router.post('/register', register)

// POST /api/auth/login - Login user
router.post('/login', login)

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', getProfile)

// PUT /api/auth/profile - Update current user profile (protected)
router.put('/profile', updateProfile)

export default router

