import { Request, Response } from 'express'
import { Prisma, ServiceCategory } from '@prisma/client'
import { io } from '../server'
import { AuthRequest } from '../middleware/auth'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'

export const getProviders = async (req: Request, res: Response) => {
  try {
    const {
      category,
      location,
      verified,
      availableNow,
      minRating,
      search,
      page = '1',
      limit = '20',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20)) // Max 100 per page
    const skip = (pageNum - 1) * limitNum

    // Build filter object for Prisma
    const where: Prisma.ProviderWhereInput = {}

    if (category) {
      where.category = category as ServiceCategory
    }

    if (location) {
      where.location = { contains: location as string, mode: 'insensitive' }
    }

    if (verified === 'true') {
      where.verified = true
    }

    if (minRating) {
      where.rating = { gte: Number(minRating) }
    }

    if (search) {
      const searchQuery = String(search).toLowerCase()
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { location: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }

    // Validate sortBy field
    const validSortFields = ['createdAt', 'rating', 'name', 'location']
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt'
    const orderBy = sortOrder === 'asc' ? 'asc' : 'desc'

    // Execute queries in parallel for better performance
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortField]: orderBy },
        select: {
          id: true,
          name: true,
          category: true,
          location: true,
          rating: true,
          verified: true,
          description: true,
          phone: true,
          whatsapp: true,
          avatar: true,
          createdAt: true,
          // Only select needed fields to reduce payload size
        },
      }),
      prisma.provider.count({ where }),
    ])

    res.json({
      data: providers,
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
    console.error('Error fetching providers:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch providers'
    res.status(500).json({ message: 'Failed to fetch providers', error: errorMessage })
  }
}

export const getProviderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        services: true,
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true }
            }
          }
        }
      }
    })

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    res.json(provider)
  } catch (error: unknown) {
    console.error('Error fetching provider:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch provider'
    res.status(500).json({ message: 'Failed to fetch provider', error: errorMessage })
  }
}

export const createProvider = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      email,
      category,
      location,
      description,
      phone,
      whatsapp,
      skills,
      serviceAreas
    } = req.body

    // Validate required fields
    if (!name || !category || !location || !description) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    let userId = req.userId

    // If user is not authenticated, we need to handle email
    if (!userId) {
      if (!email) {
        return res.status(400).json({ message: 'Email is required for non-authenticated users' })
      }

      // Check if user exists with this email
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (user) {
        // User exists, check if they already have a provider profile
        const existingProvider = await prisma.provider.findUnique({
          where: { userId: user.id }
        })

        if (existingProvider) {
          return res.status(400).json({ 
            message: 'A provider profile already exists for this email. Please sign in to manage your profile.' 
          })
        }

        userId = user.id
      } else {
        // Create new user account with a temporary password
        const tempPassword = crypto.randomBytes(16).toString('hex')
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        user = await prisma.user.create({
          data: {
            email,
            name,
            phone,
            password: hashedPassword,
            role: 'PROVIDER'
          }
        })

        userId = user.id

        // TODO: Send email with temporary credentials or password reset link
        console.log(`New provider account created for ${email}. Temporary password: ${tempPassword}`)
      }
    } else {
      // User is authenticated, check if they already have a provider profile
      const existingProvider = await prisma.provider.findUnique({
        where: { userId }
      })

      if (existingProvider) {
        return res.status(400).json({ message: 'User already has a provider profile' })
      }
    }

    // Create provider profile
    const provider = await prisma.provider.create({
      data: {
        userId,
        name,
        category,
        location,
        description,
        phone: phone || null,
        whatsapp: whatsapp || null,
        skills: skills || [],
        serviceAreas: serviceAreas || [],
      }
    })

    // Update user role to PROVIDER
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'PROVIDER' }
    })

    // Emit real-time update
    io.emit('provider:created', provider)

    res.status(201).json({ 
      message: 'Provider created successfully', 
      provider,
      requiresPasswordSetup: !req.userId && !email ? false : true
    })
  } catch (error: unknown) {
    console.error('Error creating provider:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Provider already exists' })
      }
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create provider'
    res.status(500).json({ message: 'Failed to create provider', error: errorMessage })
  }
}

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const provider = await prisma.provider.update({
      where: { id },
      data: updates
    })

    // Emit real-time update
    io.emit('provider:updated', provider)

    res.json({ message: 'Provider updated successfully', provider })
  } catch (error: unknown) {
    console.error('Error updating provider:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update provider'
    res.status(500).json({ message: 'Failed to update provider', error: errorMessage })
  }
}

export const deleteProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.provider.delete({
      where: { id }
    })

    // Emit real-time update
    io.emit('provider:deleted', { id })

    res.json({ message: 'Provider deleted successfully' })
  } catch (error: unknown) {
    console.error('Error deleting provider:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete provider'
    res.status(500).json({ message: 'Failed to delete provider', error: errorMessage })
  }
}

export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        verified: true,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date()
      }
    })

    // Emit real-time update
    io.emit('provider:verified', provider)

    res.json({ message: 'Provider verified successfully', provider })
  } catch (error: unknown) {
    console.error('Error verifying provider:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify provider'
    res.status(500).json({ message: 'Failed to verify provider', error: errorMessage })
  }
}

export const getProviderCountsByCity = async (req: Request, res: Response) => {
  try {
    // Get all providers with their locations
    const providers = await prisma.provider.findMany({
      select: { location: true }
    })

    // Count providers by city (case-insensitive matching)
    const cityCounts: Record<string, number> = {}
    
    providers.forEach(provider => {
      if (provider.location) {
        // Normalize city name (capitalize first letter, handle variations)
        const normalizedLocation = provider.location.trim()
        
        // Check if location contains any of the popular cities
        const popularCities = ['Accra', 'Kumasi', 'Takoradi', 'Tamale', 'Cape Coast', 'Tema']
        for (const city of popularCities) {
          if (normalizedLocation.toLowerCase().includes(city.toLowerCase())) {
            cityCounts[city] = (cityCounts[city] || 0) + 1
            break
          }
        }
      }
    })

    res.json(cityCounts)
  } catch (error: unknown) {
    console.error('Error fetching provider counts by city:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch provider counts by city'
    res.status(500).json({ message: 'Failed to fetch provider counts by city', error: errorMessage })
  }
}
