import express from 'express'
import { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBookingStatus 
} from '../controllers/bookingController'

const router = express.Router()

// GET /api/bookings - Get all bookings (filtered by user/provider)
router.get('/', getBookings)

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', getBookingById)

// POST /api/bookings - Create new booking
router.post('/', createBooking)

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', updateBookingStatus)

export default router

