import express from 'express'
import { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBookingStatus 
} from '../controllers/bookingController'
import { validate } from '../middleware/validate'
import { createBookingSchema, updateBookingStatusSchema } from '../validators/booking.validator'

const router = express.Router()

// GET /api/bookings - Get all bookings (filtered by user/provider)
router.get('/', getBookings)

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', getBookingById)

// POST /api/bookings - Create new booking
router.post('/', validate(createBookingSchema), createBooking)

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', validate(updateBookingStatusSchema), updateBookingStatus)

export default router

