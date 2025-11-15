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

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { providerId, date, time, serviceType, notes } = req.body

    // Get user ID from JWT token (if available)
    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        if (!JWT_SECRET) {
          console.error('JWT_SECRET not configured')
          throw new Error('JWT_SECRET not configured')
        }
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
        userId = decoded.userId
        if (!userId) {
          console.warn('JWT token decoded but userId is missing from payload')
        }
      } catch (err) {
        // Log the error for debugging
        console.error('JWT verification failed:', err instanceof Error ? err.message : 'Unknown error')
        // Invalid token, use from body if provided
        userId = req.body.userId
      }
    } else {
      console.warn('No Authorization header found in booking request')
      userId = req.body.userId
    }

    if (!providerId || !date || !time || !serviceType) {
      return res.status(400).json({ message: 'Provider ID, date, time, and service type are required' })
    }

    if (!userId) {
      console.error('Booking creation failed: User ID is required. Auth header present:', !!authHeader)
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
    const booking = await prisma.booking.create({
      data: {
        providerId,
        userId,
        date: new Date(date),
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

