import express from 'express'
import { 
  createReview, 
  getReviews, 
  getReviewById, 
  updateReview,
  deleteReview,
  addProviderResponse,
  updateProviderResponse
} from '../controllers/reviewController'

const router = express.Router()

// GET /api/reviews - Get all reviews (with filters)
router.get('/', getReviews)

// GET /api/reviews/:id - Get review by ID
router.get('/:id', getReviewById)

// POST /api/reviews - Create new review
router.post('/', createReview)

// PUT /api/reviews/:id - Update review
router.put('/:id', updateReview)

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', deleteReview)

// POST /api/reviews/:id/response - Add provider response to review
router.post('/:id/response', addProviderResponse)

// PUT /api/reviews/:id/response - Update provider response
router.put('/:id/response', updateProviderResponse)

export default router

