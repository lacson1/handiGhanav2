import { Request, Response } from 'express'
import { io } from '../server'
import { mockProviders, getProviderById as getProvider, MockProvider } from '../data/mockData'

// In-memory store for providers (starts with mock data, gets updated with new providers)
let providersStore = [...mockProviders]

export const getProviders = async (req: Request, res: Response) => {
  try {
    const { category, location, verified, availableNow, minRating, search } = req.query

    let filtered = [...providersStore]

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(p => p.location === location)
    }

    // Filter by verified status
    if (verified === 'true') {
      filtered = filtered.filter(p => p.verified === true)
    }

    // Filter by availability
    if (availableNow === 'true') {
      filtered = filtered.filter(p => p.availability === "Available Now")
    }

    // Filter by minimum rating
    if (minRating) {
      filtered = filtered.filter(p => p.rating >= Number(minRating))
    }

    // Search filter
    if (search) {
      const query = String(search).toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      )
    }

    res.json(filtered)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Provider operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getProviderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // First check in-memory store, then fallback to mock data
    let provider = providersStore.find(p => p.id === id)
    if (!provider) {
      provider = getProvider(id)
    }

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    res.json(provider)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Provider operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const createProvider = async (req: Request, res: Response) => {
  try {
    const { name, category, location, description, phone, whatsapp, bio } = req.body

    // Validation
    if (!name || !category || !location || !description) {
      return res.status(400).json({ message: 'Name, category, location, and description are required' })
    }

    // Sanitize inputs
    const trimmedName = String(name).trim()
    const trimmedCategory = String(category).trim()
    const trimmedLocation = String(location).trim()
    const trimmedDescription = String(description || bio || '').trim()

    if (trimmedName.length === 0 || trimmedCategory.length === 0 || trimmedLocation.length === 0 || trimmedDescription.length === 0) {
      return res.status(400).json({ message: 'Name, category, location, and description cannot be empty' })
    }

    // Create new provider
    const newProvider: MockProvider = {
      id: `provider-${Date.now()}`,
      name: trimmedName,
      category: trimmedCategory,
      location: trimmedLocation,
      description: trimmedDescription,
      rating: 0,
      reviewCount: 0,
      verified: false,
      availability: "Available Now" as const,
      phone: phone ? String(phone).trim() : whatsapp ? String(whatsapp).trim() : undefined,
      whatsapp: whatsapp ? String(whatsapp).trim() : phone ? String(phone).trim() : undefined,
      serviceAreas: [location],
      skills: [],
      joinedDate: new Date().toISOString().split('T')[0]
    }

    // Add to in-memory store
    providersStore.push(newProvider)

    // TODO: Save to database with Prisma
    // const provider = await prisma.provider.create({ data: { ... } })

    res.status(201).json({
      message: 'Provider created successfully',
      provider: newProvider
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Provider operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // First check in-memory store, then fallback to mock data
    let providerIndex = providersStore.findIndex(p => p.id === id)
    let provider = providerIndex !== -1 ? providersStore[providerIndex] : getProvider(id)
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    // Update provider
    const updatedProvider = {
      ...provider,
      ...updates,
      id // Don't allow ID changes
    }

    // Update or add to in-memory store
    if (providerIndex !== -1) {
      // Update existing entry in store
      providersStore[providerIndex] = updatedProvider
    } else {
      // Add to store if it came from mock data (so future fetches get updated version)
      providersStore.push(updatedProvider)
    }

    // TODO: Update in database with Prisma
    // const provider = await prisma.provider.update({ where: { id }, data: updates })

    // Emit WebSocket event for provider verification
    if (updates.verified !== undefined) {
      if (updates.verified) {
        io.emit('provider-verified', updatedProvider)
        io.to(`provider-${id}`).emit('provider-verified', updatedProvider)
      } else {
        io.emit('provider-rejected', updatedProvider)
        io.to(`provider-${id}`).emit('provider-rejected', updatedProvider)
      }
    } else {
      // General provider update
      io.emit('provider-updated', updatedProvider)
    }

    res.json({
      message: 'Provider updated successfully',
      provider: updatedProvider
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed'
    console.error('Provider operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

