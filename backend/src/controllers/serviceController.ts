import { Request, Response } from 'express'
import { ServiceCategory, PricingModel, BillingCycle, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getServices = async (req: Request, res: Response) => {
  try {
    const { providerId, isActive, category } = req.query

    const where: Prisma.ServiceWhereInput = {}

    if (providerId) {
      where.providerId = providerId as string
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    if (category) {
      where.category = category as ServiceCategory
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(services)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Service operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true,
            location: true
          }
        }
      }
    })

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json(service)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Service operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const createService = async (req: Request, res: Response) => {
  try {
    const {
      providerId,
      name,
      description,
      category,
      pricingModel,
      basePrice,
      duration,
      isActive,
      monthlyPrice,
      billingCycle,
      subscriptionFeatures,
      visitsPerPeriod
    } = req.body

    // Validation
    if (!providerId || !name || !description || !category || !pricingModel) {
      return res.status(400).json({ 
        message: 'Provider ID, name, description, category, and pricing model are required' 
      })
    }

    // Sanitize inputs
    const trimmedName = String(name).trim()
    const trimmedDescription = String(description).trim()
    const trimmedCategory = String(category).trim()

    if (trimmedName.length === 0 || trimmedDescription.length === 0 || trimmedCategory.length === 0) {
      return res.status(400).json({ 
        message: 'Name, description, and category cannot be empty' 
      })
    }

    if (pricingModel !== 'pay-as-you-go' && pricingModel !== 'subscription') {
      return res.status(400).json({ 
        message: 'Pricing model must be either "pay-as-you-go" or "subscription"' 
      })
    }

    const basePriceNum = basePrice ? Number(basePrice) : 0
    const monthlyPriceNum = monthlyPrice ? Number(monthlyPrice) : 0

    if (pricingModel === 'pay-as-you-go' && (isNaN(basePriceNum) || basePriceNum <= 0)) {
      return res.status(400).json({ 
        message: 'Base price is required and must be greater than 0 for pay-as-you-go services' 
      })
    }

    if (pricingModel === 'subscription' && (isNaN(monthlyPriceNum) || monthlyPriceNum <= 0)) {
      return res.status(400).json({ 
        message: 'Monthly price is required and must be greater than 0 for subscription services' 
      })
    }

    // Verify provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    // Validate category
    const validCategories = Object.values(ServiceCategory)
    if (!validCategories.includes(trimmedCategory as ServiceCategory)) {
      return res.status(400).json({ 
        message: `Category must be one of: ${validCategories.join(', ')}` 
      })
    }

    // Create service in database
    const service = await prisma.service.create({
      data: {
        providerId: String(providerId).trim(),
        name: trimmedName,
        description: trimmedDescription,
        category: trimmedCategory as ServiceCategory,
        pricingModel: pricingModel as PricingModel,
        basePrice: basePriceNum,
        duration: duration ? Number(duration) : 60,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        monthlyPrice: pricingModel === 'subscription' && monthlyPriceNum > 0 ? monthlyPriceNum : null,
        billingCycle: billingCycle ? billingCycle as BillingCycle : null,
        subscriptionFeatures: Array.isArray(subscriptionFeatures) ? subscriptionFeatures.map(f => String(f).trim()) : [],
        visitsPerPeriod: visitsPerPeriod ? Number(visitsPerPeriod) : null
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Service operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    })

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Prepare update data
    const updateData: Prisma.ServiceUpdateInput = {}

    if (updates.name !== undefined) updateData.name = String(updates.name).trim()
    if (updates.description !== undefined) updateData.description = String(updates.description).trim()
    if (updates.category !== undefined) updateData.category = updates.category as ServiceCategory
    if (updates.pricingModel !== undefined) updateData.pricingModel = updates.pricingModel as PricingModel
    if (updates.basePrice !== undefined) updateData.basePrice = Number(updates.basePrice)
    if (updates.duration !== undefined) updateData.duration = Number(updates.duration)
    if (updates.isActive !== undefined) updateData.isActive = Boolean(updates.isActive)
    if (updates.monthlyPrice !== undefined) updateData.monthlyPrice = updates.monthlyPrice ? Number(updates.monthlyPrice) : null
    if (updates.billingCycle !== undefined) updateData.billingCycle = updates.billingCycle ? updates.billingCycle as BillingCycle : null
    if (updates.subscriptionFeatures !== undefined) {
      updateData.subscriptionFeatures = Array.isArray(updates.subscriptionFeatures) 
        ? updates.subscriptionFeatures.map((f: string) => String(f).trim()) 
        : []
    }
    if (updates.visitsPerPeriod !== undefined) updateData.visitsPerPeriod = updates.visitsPerPeriod ? Number(updates.visitsPerPeriod) : null

    // Update service in database
    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Service operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    })

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Check if service has active subscriptions
    if (service.subscriptions.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete service with ${service.subscriptions.length} active subscription(s). Please cancel subscriptions first.` 
      })
    }

    // Delete service from database
    await prisma.service.delete({
      where: { id }
    })

    res.json({ message: 'Service deleted successfully' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Service operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

