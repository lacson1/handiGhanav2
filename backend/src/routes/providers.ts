import express from 'express'
import { getProviders, getProviderById, createProvider, updateProvider, getProviderCountsByCity } from '../controllers/providerController'
import { 
  getEarningsAnalytics, 
  getEarningsTrends, 
  getEarningsByCategory, 
  exportEarningsReport 
} from '../controllers/earningsController'
import { authenticateToken, optionalAuth } from '../middleware/auth'

const router = express.Router()

// GET /api/providers - Get all providers with filters
router.get('/', getProviders)

// GET /api/providers/counts/by-city - Get provider counts by city
router.get('/counts/by-city', getProviderCountsByCity)

// POST /api/providers - Create new provider (authentication optional - handles both cases)
router.post('/', optionalAuth, createProvider)

// Earnings Analytics Routes (must come before /:id route)
// GET /api/providers/:id/earnings/analytics?period=30d
router.get('/:id/earnings/analytics', getEarningsAnalytics)

// GET /api/providers/:id/earnings/trends?months=12
router.get('/:id/earnings/trends', getEarningsTrends)

// GET /api/providers/:id/earnings/categories?period=30d
router.get('/:id/earnings/categories', getEarningsByCategory)

// GET /api/providers/:id/earnings/export?format=csv&period=30d
router.get('/:id/earnings/export', exportEarningsReport)

// GET /api/providers/:id - Get provider by ID (must come after specific routes)
router.get('/:id', getProviderById)

// PUT /api/providers/:id - Update provider (protected)
router.put('/:id', updateProvider)

export default router

