import { Request, Response } from 'express'

// Mock services data - in production, this would come from Prisma
// For now, we'll use a simple in-memory store
let mockServices: any[] = [
  {
    id: 'service-1',
    providerId: '1',
    name: 'Electrical Repair',
    description: 'Expert repair for all electrical issues including wiring, outlets, and panels',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 200,
    duration: 120,
    isActive: true
  },
  {
    id: 'service-2',
    providerId: '1',
    name: 'Panel Installation',
    description: 'Professional installation of electrical panels and circuit breakers',
    category: 'Electrician',
    pricingModel: 'pay-as-you-go',
    basePrice: 500,
    duration: 240,
    isActive: true
  },
  {
    id: 'service-3',
    providerId: '1',
    name: 'Monthly Maintenance Plan',
    description: 'Regular monthly maintenance and inspection service for your electrical systems',
    category: 'Electrician',
    pricingModel: 'subscription',
    basePrice: 50,
    monthlyPrice: 150,
    billingCycle: 'monthly',
    duration: 90,
    visitsPerPeriod: 2,
    subscriptionFeatures: [
      'Priority Support',
      'Monthly Inspection',
      'Preventive Maintenance',
      '10% Discount on Repairs'
    ],
    isActive: true
  },
  {
    id: 'service-4',
    providerId: '4',
    name: 'Furniture Assembly',
    description: 'Professional assembly of furniture including IKEA, flat-pack, and custom pieces',
    category: 'Handyman',
    pricingModel: 'pay-as-you-go',
    basePrice: 150,
    duration: 90,
    isActive: true
  },
  {
    id: 'service-5',
    providerId: '4',
    name: 'Mounting & Installation',
    description: 'Wall mounting for TVs, shelves, pictures, and other fixtures',
    category: 'Handyman',
    pricingModel: 'pay-as-you-go',
    basePrice: 100,
    duration: 60,
    isActive: true
  },
  {
    id: 'service-6',
    providerId: '4',
    name: 'General Home Repairs',
    description: 'Versatile handyman service for all your home repair needs',
    category: 'Handyman',
    pricingModel: 'pay-as-you-go',
    basePrice: 120,
    duration: 120,
    isActive: true
  }
]

export const getServices = async (req: Request, res: Response) => {
  try {
    const { providerId, isActive } = req.query

    let filtered = [...mockServices]

    // Filter by provider
    if (providerId) {
      filtered = filtered.filter(s => s.providerId === providerId)
    }

    // Filter by active status
    if (isActive !== undefined) {
      filtered = filtered.filter(s => s.isActive === (isActive === 'true'))
    }

    res.json(filtered)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const service = mockServices.find(s => s.id === id)

    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    res.json(service)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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

    if (!providerId || !name || !description || !category || !pricingModel) {
      return res.status(400).json({ 
        message: 'Provider ID, name, description, category, and pricing model are required' 
      })
    }

    if (pricingModel === 'pay-as-you-go' && (!basePrice || basePrice <= 0)) {
      return res.status(400).json({ 
        message: 'Base price is required and must be greater than 0 for pay-as-you-go services' 
      })
    }

    if (pricingModel === 'subscription' && (!monthlyPrice || monthlyPrice <= 0)) {
      return res.status(400).json({ 
        message: 'Monthly price is required and must be greater than 0 for subscription services' 
      })
    }

    const newService = {
      id: `service-${Date.now()}`,
      providerId,
      name,
      description,
      category,
      pricingModel,
      basePrice: basePrice || 0,
      duration: duration || 60,
      isActive: isActive !== undefined ? isActive : true,
      monthlyPrice: monthlyPrice || undefined,
      billingCycle: billingCycle || undefined,
      subscriptionFeatures: subscriptionFeatures || [],
      visitsPerPeriod: visitsPerPeriod || undefined
    }

    mockServices.push(newService)

    // TODO: Save to database with Prisma
    // const service = await prisma.service.create({ data: { ... } })

    res.status(201).json({
      message: 'Service created successfully',
      service: newService
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const serviceIndex = mockServices.findIndex(s => s.id === id)
    
    if (serviceIndex === -1) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Update service
    const updatedService = {
      ...mockServices[serviceIndex],
      ...updates,
      id // Don't allow ID changes
    }

    mockServices[serviceIndex] = updatedService

    // TODO: Update in database with Prisma
    // const service = await prisma.service.update({ where: { id }, data: updates })

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const serviceIndex = mockServices.findIndex(s => s.id === id)
    
    if (serviceIndex === -1) {
      return res.status(404).json({ message: 'Service not found' })
    }

    mockServices.splice(serviceIndex, 1)

    // TODO: Delete from database with Prisma
    // await prisma.service.delete({ where: { id } })

    res.json({ message: 'Service deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

