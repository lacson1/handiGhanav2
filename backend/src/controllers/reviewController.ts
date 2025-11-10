import { Request, Response } from 'express'
import { io } from '../server'

// Mock reviews data
const mockReviews: any[] = [
  {
    id: 'rev-001',
    providerId: 'pt-001',
    userId: 'user-1',
    userName: 'Kwame Asante',
    rating: 5,
    comment: 'Excellent work! Very professional and completed the job on time. Highly recommend!',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'rev-002',
    providerId: 'pt-001',
    userId: 'user-2',
    userName: 'Ama Mensah',
    rating: 5,
    comment: 'Great service and fair pricing. Will definitely book again.',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  }
]

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { providerId, userId, limit, offset } = req.query

    let filtered = [...mockReviews]

    if (providerId) {
      filtered = filtered.filter(r => r.providerId === providerId)
    }

    if (userId) {
      filtered = filtered.filter(r => r.userId === userId)
    }

    // Sort by newest first
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Pagination
    const limitNum = limit ? Number(limit) : 10
    const offsetNum = offset ? Number(offset) : 0
    const paginated = filtered.slice(offsetNum, offsetNum + limitNum)

    res.json({
      reviews: paginated,
      total: filtered.length,
      limit: limitNum,
      offset: offsetNum
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const review = mockReviews.find(r => r.id === id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json(review)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createReview = async (req: Request, res: Response) => {
  try {
    const { providerId, userId, rating, comment, bookingId, photos, isVerified } = req.body

    if (!providerId || !userId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }

    // If verified, bookingId is required
    if (isVerified && !bookingId) {
      return res.status(400).json({ message: 'Booking ID is required for verified reviews' })
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      providerId,
      userId,
      userName: 'User', // TODO: Get from user data
      rating: Number(rating),
      comment,
      bookingId: bookingId || null,
      photos: photos || [],
      isVerified: isVerified || false,
      verifiedAt: isVerified ? new Date().toISOString() : null,
      providerResponse: null,
      providerResponseAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockReviews.push(newReview)

    // Emit real-time notification
    io.to(`provider-${providerId}`).emit('new-review', newReview)

    // TODO: Update provider rating in database
    // Calculate new average rating

    res.status(201).json(newReview)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body

    const reviewIndex = mockReviews.findIndex(r => r.id === id)
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' })
    }

    mockReviews[reviewIndex] = {
      ...mockReviews[reviewIndex],
      rating: rating || mockReviews[reviewIndex].rating,
      comment: comment || mockReviews[reviewIndex].comment,
      updatedAt: new Date().toISOString()
    }

    res.json(mockReviews[reviewIndex])
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const reviewIndex = mockReviews.findIndex(r => r.id === id)
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' })
    }

    mockReviews.splice(reviewIndex, 1)
    res.json({ message: 'Review deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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

    const reviewIndex = mockReviews.findIndex(r => r.id === id)
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if response already exists
    if (mockReviews[reviewIndex].providerResponse) {
      return res.status(400).json({ message: 'Response already exists. Use update endpoint to modify.' })
    }

    // Add provider response
    mockReviews[reviewIndex] = {
      ...mockReviews[reviewIndex],
      providerResponse: response.trim(),
      providerResponseAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Emit real-time notification
    io.to(`user-${mockReviews[reviewIndex].userId}`).emit('review-response', {
      reviewId: id,
      response: response.trim()
    })

    res.json(mockReviews[reviewIndex])
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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

    const reviewIndex = mockReviews.findIndex(r => r.id === id)
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Update provider response
    mockReviews[reviewIndex] = {
      ...mockReviews[reviewIndex],
      providerResponse: response.trim(),
      providerResponseAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    res.json(mockReviews[reviewIndex])
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

