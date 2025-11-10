import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { io } from '../server'
import { sendBookingConfirmation, sendBookingNotification } from '../utils/emailService'
import { mockBookings, getMockUserById, getProviderById } from '../data/mockData'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// In-memory store for bookings (in production, use database)
let bookingsStore = [...mockBookings]

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { providerId, date, time, serviceType, notes } = req.body

    // Get user ID from JWT token (if available)
    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (err) {
        // Invalid token, use from body if provided
        userId = req.body.userId
      }
    } else {
      userId = req.body.userId
    }

    if (!providerId || !date || !time || !serviceType) {
      return res.status(400).json({ message: 'Provider ID, date, time, and service type are required' })
    }

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' })
    }

    // Create new booking
    const booking = {
      id: `booking-${Date.now()}`,
      providerId,
      userId,
      date,
      time,
      serviceType,
      notes: notes || '',
      status: 'Pending' as const,
      createdAt: new Date().toISOString()
    }

    // Add to store
    bookingsStore.push(booking)

    // TODO: Save to database with Prisma
    // const booking = await prisma.booking.create({ data: { ... } })

    // Send real-time notification via WebSocket
    io.to(`provider-${providerId}`).emit('new-booking', booking)
    io.to(`user-${userId}`).emit('booking-created', booking)

    // Get user and provider info for email
    const user = getMockUserById(userId)
    const provider = getProviderById(providerId)

    // Send email notifications (async, don't wait)
    // Note: In production, get provider's email from user account
    if (provider && user) {
      sendBookingNotification('provider@example.com', user.name, {
        date,
        time,
        serviceType,
      }).catch(console.error)
    }

    res.status(201).json(booking)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { userId, providerId } = req.query

    let filtered = [...bookingsStore]

    // Filter by userId
    if (userId) {
      filtered = filtered.filter(b => b.userId === userId)
    }

    // Filter by providerId
    if (providerId) {
      filtered = filtered.filter(b => b.providerId === providerId)
    }

    // If no filters, return all (or empty in production)
    // TODO: Implement with Prisma
    // const bookings = await prisma.booking.findMany({ where: { ... } })

    res.json(filtered)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const booking = bookingsStore.find(b => b.id === id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // TODO: Implement with Prisma
    // const booking = await prisma.booking.findUnique({ where: { id } })

    res.json(booking)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    const bookingIndex = bookingsStore.findIndex(b => b.id === id)

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Update booking
    const updatedBooking = {
      ...bookingsStore[bookingIndex],
      status,
      updatedAt: new Date().toISOString()
    }

    bookingsStore[bookingIndex] = updatedBooking

    // TODO: Update in database with Prisma
    // const booking = await prisma.booking.update({ where: { id }, data: { status } })

    // Send real-time notification
    io.emit('booking-status-updated', updatedBooking)
    io.to(`provider-${updatedBooking.providerId}`).emit('booking-status-updated', updatedBooking)
    io.to(`user-${updatedBooking.userId}`).emit('booking-status-updated', updatedBooking)

    // Send confirmation email if status is CONFIRMED
    if (status === 'Confirmed') {
      const user = getMockUserById(updatedBooking.userId)
      const provider = getProviderById(updatedBooking.providerId)

      if (user && provider) {
        sendBookingConfirmation(user.email || 'customer@example.com', provider.name, {
          date: updatedBooking.date,
          time: updatedBooking.time,
          serviceType: updatedBooking.serviceType,
        }).catch(console.error)
      }
    }

    res.json({ 
      message: 'Booking status updated successfully', 
      booking: updatedBooking 
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

