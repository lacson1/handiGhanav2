import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { io } from '../server'
import { prisma } from '../lib/prisma'

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { providerId, userId, limit, offset, isVerified, page, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

    const where: Prisma.ReviewWhereInput = {}

    if (providerId) {
      where.providerId = providerId as string
    }

    if (userId) {
      where.userId = userId as string
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true'
    }

    // Support both offset/limit and page/limit pagination
    let limitNum: number
    let skip: number

    if (page) {
      // Use page-based pagination
      const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
      limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20))
      skip = (pageNum - 1) * limitNum
    } else {
      // Use offset-based pagination (backward compatibility)
      limitNum = limit ? Math.min(100, Number(limit)) : 20
      skip = offset ? Number(offset) : 0
    }

    // Validate sortBy field
    const validSortFields = ['createdAt', 'rating', 'updatedAt']
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt'
    const orderBy = sortOrder === 'asc' ? 'asc' : 'desc'

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          provider: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          [sortField]: orderBy
        },
        take: limitNum,
        skip
      }),
      prisma.review.count({ where })
    ])

    res.json({
      data: reviews,
      pagination: page ? {
        page: Math.max(1, parseInt(page as string, 10) || 1),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: (Math.max(1, parseInt(page as string, 10) || 1)) < Math.ceil(total / limitNum),
        hasPreviousPage: (Math.max(1, parseInt(page as string, 10) || 1)) > 1,
      } : {
        total,
        limit: limitNum,
        offset: skip,
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true,
            category: true
          }
        },
        booking: {
          select: {
            id: true,
            serviceType: true,
            date: true
          }
        }
      }
    })

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json(review)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const createReview = async (req: Request, res: Response) => {
  try {
    const { providerId, userId, rating, comment, bookingId, photos, isVerified } = req.body

    // Validation
    if (!providerId || !userId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const ratingNum = Number(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' })
    }

    const trimmedComment = String(comment).trim()
    if (trimmedComment.length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' })
    }

    if (trimmedComment.length < 10) {
      return res.status(400).json({ message: 'Comment must be at least 10 characters long' })
    }

    // If verified, bookingId is required
    if (isVerified && !bookingId) {
      return res.status(400).json({ message: 'Booking ID is required for verified reviews' })
    }

    // Verify user and provider exist
    const [user, provider] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.provider.findUnique({ where: { id: providerId } })
    ])

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    // If verified, verify booking exists and belongs to user
    if (isVerified && bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      })

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
      }

      if (booking.userId !== userId || booking.providerId !== providerId) {
        return res.status(403).json({ message: 'Booking does not belong to this user or provider' })
      }

      if (booking.status !== 'COMPLETED') {
        return res.status(400).json({ message: 'Can only review completed bookings' })
      }
    }

    // Create review in database
    const newReview = await prisma.review.create({
      data: {
        providerId: String(providerId).trim(),
        userId: String(userId).trim(),
        rating: ratingNum,
        comment: trimmedComment,
        bookingId: bookingId || null,
        photos: photos || [],
        isVerified: isVerified || false,
        verifiedAt: isVerified ? new Date() : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Calculate and update provider rating
    const allReviews = await prisma.review.findMany({
      where: { providerId },
      select: { rating: true }
    })

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : ratingNum

    await prisma.provider.update({
      where: { id: providerId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: allReviews.length
      }
    })

    // Emit real-time notification
    io.to(`provider-${providerId}`).emit('new-review', newReview)

    res.status(201).json(newReview)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Prepare update data
    const updateData: Prisma.ReviewUpdateInput = {}
    
    if (rating !== undefined) {
      const ratingNum = Number(rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' })
      }
      updateData.rating = ratingNum
    }

    if (comment !== undefined) {
      const trimmedComment = String(comment).trim()
      if (trimmedComment.length === 0) {
        return res.status(400).json({ message: 'Comment cannot be empty' })
      }
      if (trimmedComment.length < 10) {
        return res.status(400).json({ message: 'Comment must be at least 10 characters long' })
      }
      updateData.comment = trimmedComment
    }

    // Update review in database
    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Recalculate provider rating if rating changed
    if (rating !== undefined) {
      const allReviews = await prisma.review.findMany({
        where: { providerId: existingReview.providerId },
        select: { rating: true }
      })

      const averageRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

      await prisma.provider.update({
        where: { id: existingReview.providerId },
        data: {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount: allReviews.length
        }
      })
    }

    res.json(updatedReview)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Get review before deleting to update provider rating
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const providerId = review.providerId

    // Delete review from database
    await prisma.review.delete({
      where: { id }
    })

    // Recalculate provider rating
    const allReviews = await prisma.review.findMany({
      where: { providerId },
      select: { rating: true }
    })

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0

    await prisma.provider.update({
      where: { id: providerId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: allReviews.length
      }
    })

    res.json({ message: 'Review deleted successfully' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const addProviderResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { response } = req.body

    if (!response || response.trim().length === 0) {
      return res.status(400).json({ message: 'Response text is required' })
    }

    if (response.trim().length < 10) {
      return res.status(400).json({ message: 'Response must be at least 10 characters' })
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if response already exists
    if (existingReview.providerResponse) {
      return res.status(400).json({ message: 'Response already exists. Use update endpoint to modify.' })
    }

    // Add provider response in database
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        providerResponse: response.trim(),
        providerResponseAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Emit real-time notification
    io.to(`user-${existingReview.userId}`).emit('review-response', {
      reviewId: id,
      response: response.trim()
    })

    res.json(updatedReview)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateProviderResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { response } = req.body

    if (!response || response.trim().length === 0) {
      return res.status(400).json({ message: 'Response text is required' })
    }

    if (response.trim().length < 10) {
      return res.status(400).json({ message: 'Response must be at least 10 characters' })
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id }
    })

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Update provider response in database
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        providerResponse: response.trim(),
        providerResponseAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        provider: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.json(updatedReview)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews'
    console.error('Get reviews error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

