import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { io } from '../server'

const prisma = new PrismaClient()

export const getProviders = async (req: Request, res: Response) => {
  try {
    const { category, location, verified, availableNow, minRating, search } = req.query

    // Build filter object for Prisma
    const where: any = {}

    if (category) {
      where.category = category
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

    const providers = await prisma.provider.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    res.json(providers)
  } catch (error: any) {
    console.error('Error fetching providers:', error)
    res.status(500).json({ message: 'Failed to fetch providers', error: error.message })
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
  } catch (error: any) {
    console.error('Error fetching provider:', error)
    res.status(500).json({ message: 'Failed to fetch provider', error: error.message })
  }
}

export const createProvider = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      category,
      location,
      description,
      phone,
      whatsapp,
      skills,
      serviceAreas
    } = req.body

    const provider = await prisma.provider.create({
      data: {
        userId,
        name,
        category,
        location,
        description,
        phone,
        whatsapp,
        skills: skills || [],
        serviceAreas: serviceAreas || [],
      }
    })

    // Emit real-time update
    io.emit('provider:created', provider)

    res.status(201).json({ message: 'Provider created successfully', provider })
  } catch (error: any) {
    console.error('Error creating provider:', error)
    res.status(500).json({ message: 'Failed to create provider', error: error.message })
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
  } catch (error: any) {
    console.error('Error updating provider:', error)
    res.status(500).json({ message: 'Failed to update provider', error: error.message })
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
  } catch (error: any) {
    console.error('Error deleting provider:', error)
    res.status(500).json({ message: 'Failed to delete provider', error: error.message })
  }
}

export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const provider = await prisma.provider.update({
      where: { id },
      data: {
        verified: true,
        verificationStatus: 'APPROVED',
        verifiedAt: new Date()
      }
    })

    // Emit real-time update
    io.emit('provider:verified', provider)

    res.json({ message: 'Provider verified successfully', provider })
  } catch (error: any) {
    console.error('Error verifying provider:', error)
    res.status(500).json({ message: 'Failed to verify provider', error: error.message })
  }
}
