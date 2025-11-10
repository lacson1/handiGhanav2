import { Request, Response } from 'express'
import { Subscription } from '../types/controller.types'

// Mock subscriptions data - in production, this would come from Prisma
let mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    userId: 'customer-1',
    serviceId: 'service-3',
    providerId: '1',
    status: 'ACTIVE',
    startDate: new Date('2024-01-01').toISOString(),
    nextBillingDate: new Date('2024-02-01').toISOString(),
    lastBillingDate: new Date('2024-01-01').toISOString(),
    visitsUsed: 1,
    visitsRemaining: 1, // 2 total, 1 used
    autoRenew: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'sub-2',
    userId: 'customer-1',
    serviceId: 'service-4',
    providerId: '4',
    status: 'ACTIVE',
    startDate: new Date('2024-01-10').toISOString(),
    nextBillingDate: new Date('2024-02-10').toISOString(),
    lastBillingDate: new Date('2024-01-10').toISOString(),
    visitsUsed: 3,
    visitsRemaining: undefined, // Unlimited
    autoRenew: true,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString()
  }
]

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.query

    let filtered = [...mockSubscriptions]

    // Filter by user
    if (userId) {
      filtered = filtered.filter(s => s.userId === userId)
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(s => s.status === status)
    }

    res.json(filtered)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Subscription operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const subscription = mockSubscriptions.find(s => s.id === id)

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

    // Calculate next billing date based on service billing cycle
    // For now, default to monthly
    const nextBillingDate = new Date()
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId: String(userId).trim(),
      serviceId: String(serviceId).trim(),
      providerId: String(providerId).trim(),
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      lastBillingDate: new Date().toISOString(),
      visitsUsed: 0,
      visitsRemaining: undefined, // Will be set based on service
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockSubscriptions.push(newSubscription)

    // TODO: Save to database with Prisma
    // const subscription = await prisma.subscription.create({ data: { ... } })

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: newSubscription
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

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.id === id)
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    // Update subscription
    const updatedSubscription = {
      ...mockSubscriptions[subscriptionIndex],
      ...updates,
      id, // Don't allow ID changes
      updatedAt: new Date().toISOString()
    }

    mockSubscriptions[subscriptionIndex] = updatedSubscription

    // TODO: Update in database with Prisma
    // const subscription = await prisma.subscription.update({ where: { id }, data: updates })

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

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.id === id)
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    const updatedSubscription: Subscription = {
      ...mockSubscriptions[subscriptionIndex],
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      autoRenew: false,
      updatedAt: new Date().toISOString()
    }

    mockSubscriptions[subscriptionIndex] = updatedSubscription

    // TODO: Update in database with Prisma
    // await prisma.subscription.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date() } })

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

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.id === id)
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    const updatedSubscription: Subscription = {
      ...mockSubscriptions[subscriptionIndex],
      status: 'PAUSED',
      updatedAt: new Date().toISOString()
    }

    mockSubscriptions[subscriptionIndex] = updatedSubscription

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

    const subscriptionIndex = mockSubscriptions.findIndex(s => s.id === id)
    
    if (subscriptionIndex === -1) {
      return res.status(404).json({ message: 'Subscription not found' })
    }

    const updatedSubscription: Subscription = {
      ...mockSubscriptions[subscriptionIndex],
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    }

    mockSubscriptions[subscriptionIndex] = updatedSubscription

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

