import express from 'express'
import { 
  getServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController'

const router = express.Router()

// GET /api/services - Get all services with filters (providerId, isActive)
router.get('/', getServices)

// GET /api/services/:id - Get service by ID
router.get('/:id', getServiceById)

// POST /api/services - Create new service (protected)
router.post('/', createService)

// PUT /api/services/:id - Update service (protected)
router.put('/:id', updateService)

// DELETE /api/services/:id - Delete service (protected)
router.delete('/:id', deleteService)

export default router

