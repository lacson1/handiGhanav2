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

export const getTrendingSearches = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5
    const days = parseInt(req.query.days as string) || 30 // Default to last 30 days
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Get all search events from the last N days
    const searchEvents = await prisma.analytics.findMany({
      where: {
        eventType: 'search',
        createdAt: {
          gte: cutoffDate
        }
      },
      select: {
        eventData: true,
        createdAt: true
      }
    })

    // Aggregate search terms and their counts
    const searchCounts: Record<string, number> = {}
    
    searchEvents.forEach(event => {
      const eventData = event.eventData as any
      // Try multiple fields to extract search term
      let searchTerm = eventData?.searchTerm || eventData?.query || eventData?.term || eventData?.search
      
      // If no direct search term, construct from category and location
      if (!searchTerm || searchTerm === 'general search') {
        const category = eventData?.category
        const location = eventData?.location
        const query = eventData?.query
        
        if (query) {
          searchTerm = query
        } else if (category && location) {
          searchTerm = `${category} ${location}`
        } else if (category) {
          searchTerm = category
        } else if (location) {
          searchTerm = location
        }
      }
      
      if (searchTerm && typeof searchTerm === 'string') {
        const normalizedTerm = searchTerm.trim()
        if (normalizedTerm && normalizedTerm !== 'general search') {
          searchCounts[normalizedTerm] = (searchCounts[normalizedTerm] || 0) + 1
        }
      }
    })

    // Convert to array, sort by count, and take top N
    const trending = Object.entries(searchCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    res.json(trending)
  } catch (error: any) {
    console.error('Error fetching trending searches:', error)
    res.status(500).json({ message: 'Failed to fetch trending searches', error: error.message })
  }
}

export const trackSearch = async (req: Request, res: Response) => {
  try {
    const { query, category, location } = req.body
    const userId = (req as any).user?.id // Optional: track which user searched

    if (!query && !category && !location) {
      return res.status(400).json({ message: 'At least one search parameter is required' })
    }

    // Create a search term from the query parameters for better trending aggregation
    // Priority: query > category + location > category > location
    let searchTerm = query
    if (!searchTerm) {
      const parts: string[] = []
      if (category) parts.push(category)
      if (location) parts.push(location)
      searchTerm = parts.length > 0 ? parts.join(' ') : 'general search'
    }

    await prisma.analytics.create({
      data: {
        userId: userId || null,
        eventType: 'search',
        eventData: {
          query: query || null,
          category: category || null,
          location: location || null,
          searchTerm: searchTerm.trim()
        }
      }
    })

    res.status(201).json({ message: 'Search tracked successfully' })
  } catch (error: any) {
    console.error('Error tracking search:', error)
    res.status(500).json({ message: 'Failed to track search', error: error.message })
  }
}

