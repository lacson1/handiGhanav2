import { slotsForDate } from '../utils/availability'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BookingStatus, Prisma } from '@prisma/client'
import { io } from '../server'
import { sendBookingConfirmation, sendBookingNotification } from '../utils/emailService'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET
if (process.env.NODE_ENV !== 'production' && (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production')) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set or using default value. Please set a strong secret in production!')
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { providerId, date, time, serviceType, notes, serviceId } = req.body

    const userId = req.userId

    if (!providerId || !date || !time || !serviceType) {
      return res.status(400).json({ message: 'Provider ID, date, time, and service type are required' })
    }

    if (!userId) {
      console.error('Booking creation failed: authenticated user ID is required')
      return res.status(401).json({ 
        message: 'Authentication required. Please sign in to create a booking.',
        details: 'User ID is required. Please ensure you are signed in and your session is valid.'
      })
    }

    // Verify provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      include: { user: true }
    })

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create booking in database
    const booking = await prisma.$transaction(async tx => {
      // Serialize bookings for this provider so concurrent requests cannot reserve the same time.
      await tx.$queryRaw`SELECT id FROM providers WHERE id = ${providerId} FOR UPDATE`
      const day = new Date(date.slice(0, 10) + 'T00:00:00.000Z')
      const service = serviceId ? await tx.service.findFirst({ where: { id: serviceId, providerId, isActive: true } }) : null
      if (serviceId && !service) throw new Error('SERVICE_UNAVAILABLE')
      const duration = service?.duration || 60
      const windows = await tx.availabilitySlot.findMany({ where: { providerId, OR: [{ date: day }, { isRecurring: true, date: { lte: day } }] } })
      const busy = await tx.booking.findMany({ where: { providerId, date: { gte: day, lt: new Date(day.getTime() + 86400000) }, status: { in: ['PENDING', 'CONFIRMED'] } }, select: { time: true, estimatedDuration: true } })
      if (!slotsForDate(date.slice(0, 10), windows, busy, duration).some(slot => slot.time === time && slot.available)) throw new Error('SLOT_UNAVAILABLE')
      return tx.booking.create({
      data: {
        providerId,
        userId,
        date: day,
        estimatedDuration: duration,
        time,
        serviceType,
        notes: notes || null,
        status: BookingStatus.PENDING
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true,
            location: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    })

    // Send real-time notification via WebSocket
    io.to(`provider-${providerId}`).emit('new-booking', booking)
    io.to(`user-${userId}`).emit('booking-created', booking)

    // Send email notifications (async, don't wait)
    if (provider.user?.email && user.email) {
      sendBookingNotification(provider.user.email, user.name || 'Customer', {
        date,
        time,
        serviceType,
      }).catch(console.error)
    }

    res.status(201).json(booking)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'SLOT_UNAVAILABLE') return res.status(409).json({ message: 'This time is no longer available. Choose another time.' })
    if (error instanceof Error && error.message === 'SERVICE_UNAVAILABLE') return res.status(400).json({ message: 'This service is no longer available.' })
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Booking operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { userId, providerId, status, page = '1', limit = '20', sortBy = 'createdAt', sortOrder = 'desc' } = req.query

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20)) // Max 100 per page
    const skip = (pageNum - 1) * limitNum

    const where: Prisma.BookingWhereInput = {}

    if (userId) {
      where.userId = userId as string
    }

    if (providerId) {
      where.providerId = providerId as string
    }

    if (status) {
      where.status = status as BookingStatus
    }

    // Validate sortBy field
    const validSortFields = ['createdAt', 'date', 'status', 'amount']
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt'
    const orderBy = sortOrder === 'asc' ? 'asc' : 'desc'

    // Execute queries in parallel
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortField]: orderBy },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              category: true,
              location: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.booking.count({ where }),
    ])

    res.json({
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPreviousPage: pageNum > 1,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Booking operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true,
            location: true,
            phone: true,
            whatsapp: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        payment: true
      }
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    res.json(booking)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Booking operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = Object.values(BookingStatus)
    if (!validStatuses.includes(status as BookingStatus)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      })
    }

    // Get existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            user: true
          }
        },
        user: true
      }
    })

    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Update booking in database
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { 
        status: status as BookingStatus,
        ...(status === BookingStatus.COMPLETED && !existingBooking.actualEndTime && {
          actualEndTime: new Date()
        })
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true,
            location: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Send real-time notification
    io.emit('booking-status-updated', updatedBooking)
    io.to(`provider-${updatedBooking.providerId}`).emit('booking-status-updated', updatedBooking)
    io.to(`user-${updatedBooking.userId}`).emit('booking-status-updated', updatedBooking)

    // Send confirmation email if status is CONFIRMED
    if (status === BookingStatus.CONFIRMED && existingBooking.user?.email && existingBooking.provider?.name) {
      sendBookingConfirmation(existingBooking.user.email, existingBooking.provider.name, {
        date: existingBooking.date.toISOString(),
        time: existingBooking.time,
        serviceType: existingBooking.serviceType,
      }).catch(console.error)
    }

    res.json({ 
      message: 'Booking status updated successfully', 
      booking: updatedBooking 
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Booking operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

