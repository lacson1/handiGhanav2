import express from 'express'
import { getSettings, updateSettings, changePassword } from '../controllers/settingsController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// All settings routes require authentication
router.use(authenticateToken)

// GET /api/settings - Get user settings
router.get('/', getSettings)

// PUT /api/settings - Update user settings
router.put('/', updateSettings)

// POST /api/settings/change-password - Change password
router.post('/change-password', changePassword)

export default router

