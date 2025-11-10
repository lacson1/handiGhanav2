import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    // Get counts in parallel for better performance
    const [
      totalProviders,
      verifiedProviders,
      totalBookings,
      completedBookings,
      totalReviews,
      activeUsers,
      serviceCategories
    ] = await Promise.all([
      prisma.provider.count(),
      prisma.provider.count({ where: { verified: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.review.count(),
      prisma.user.count(),
      prisma.provider.groupBy({
        by: ['category'],
        _count: true
      })
    ])

    // Calculate average rating across all providers
    const providerRatings = await prisma.provider.aggregate({
      _avg: { rating: true }
    })

    // Get unique service locations
    const locations = await prisma.provider.findMany({
      select: { location: true },
      distinct: ['location']
    })

    res.json({
      totalProviders,
      verifiedProviders,
      totalBookings,
      completedBookings,
      totalReviews,
      activeUsers,
      averageRating: providerRatings._avg.rating || 0,
      totalCategories: serviceCategories.length,
      totalLocations: locations.length
    })
  } catch (error: any) {
    console.error('Error fetching platform stats:', error)
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message })
  }
}

export const getRecentReviews = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 3
    
    const reviews = await prisma.review.findMany({
      where: {
        rating: { gte: 4 }, // Only show positive reviews
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        },
        provider: {
          select: { name: true, location: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    res.json(reviews)
  } catch (error: any) {
    console.error('Error fetching recent reviews:', error)
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message })
  }
}

