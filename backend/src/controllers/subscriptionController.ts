import { Request, Response } from 'express'
import { SubscriptionStatus, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const { userId, status, providerId } = req.query

    const where: Prisma.SubscriptionWhereInput = {}

    if (userId) {
      where.userId = userId as string
    }

    if (providerId) {
      where.providerId = providerId as string
    }

    if (status) {
      where.status = status as SubscriptionStatus
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            basePrice: true,
            monthlyPrice: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(subscriptions)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    res.json(subscription)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      serviceId,
      providerId
    } = req.body

    if (!userId || !serviceId || !providerId) {
      return res.status(400).json({ 
        message: 'User ID, service ID, and provider ID are required' 
      })
    }

    // Verify service exists and get billing cycle
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    if (service.pricingModel !== 'SUBSCRIPTION') {
      return res.status(400).json({ message: 'Service must be a subscription service' })
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

    // Calculate next billing date based on service billing cycle
    const nextBillingDate = new Date()
    if (service.billingCycle === 'WEEKLY') {
      nextBillingDate.setDate(nextBillingDate.getDate() + 7)
    } else if (service.billingCycle === 'MONTHLY') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    } else if (service.billingCycle === 'QUARTERLY') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 3)
    } else if (service.billingCycle === 'YEARLY') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    } else {
      // Default to monthly
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    }

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: String(userId).trim(),
        serviceId: String(serviceId).trim(),
        providerId: String(providerId).trim(),
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate,
        lastBillingDate: new Date(),
        visitsUsed: 0,
        visitsRemaining: service.visitsPerPeriod,
        autoRenew: true
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!existingSubscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    // Prepare update data
    const updateData: Prisma.SubscriptionUpdateInput = {}

    if (updates.status !== undefined) updateData.status = updates.status as SubscriptionStatus
    if (updates.nextBillingDate !== undefined) updateData.nextBillingDate = new Date(updates.nextBillingDate)
    if (updates.lastBillingDate !== undefined) updateData.lastBillingDate = updates.lastBillingDate ? new Date(updates.lastBillingDate) : null
    if (updates.visitsUsed !== undefined) updateData.visitsUsed = Number(updates.visitsUsed)
    if (updates.visitsRemaining !== undefined) updateData.visitsRemaining = updates.visitsRemaining ? Number(updates.visitsRemaining) : null
    if (updates.autoRenew !== undefined) updateData.autoRenew = Boolean(updates.autoRenew)
    if (updates.cancelledAt !== undefined) updateData.cancelledAt = updates.cancelledAt ? new Date(updates.cancelledAt) : null

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    res.json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        autoRenew: false
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: updatedSubscription
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const pauseSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.PAUSED
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    res.json({
      message: 'Subscription paused successfully',
      subscription: updatedSubscription
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const resumeSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id }
    })

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: SubscriptionStatus.ACTIVE
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
      }
    })

    res.json({
      message: 'Subscription resumed successfully',
      subscription: updatedSubscription
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

