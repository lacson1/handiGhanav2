import { providersApi } from '../lib/api'
import type { Provider } from '../types'

export const providerService = {
  async getAllProviders(filters?: {
    category?: string
    location?: string
    verified?: boolean
    availableNow?: boolean
    minRating?: number
    search?: string
  }): Promise<Provider[]> {
    try {
      const data = await providersApi.getAll(filters)
      return data as Provider[]
    } catch (error) {
      // Fallback to mock data
      const { mockProviders } = await import('../data/mockProviders')
      return mockProviders
    }
  },

  async getProviderById(id: string): Promise<Provider | null> {
    try {
      const data = await providersApi.getById(id)
      return data as Provider
    } catch (error) {
      // Fallback to mock data
      const { mockProviders } = await import('../data/mockProviders')
      return mockProviders.find(p => p.id === id) || null
    }
  },

  async createProvider(data: {
    name: string
    category: string
    location: string
    contact: string
    bio: string
  }): Promise<Provider> {
    try {
      const providerData = {
        name: data.name,
        category: data.category,
        location: data.location,
        phone: data.contact,
        whatsapp: data.contact,
        description: data.bio,
        rating: 0,
        reviewCount: 0,
        verified: false,
        availability: "Available Now" as const,
      }
      const result = await providersApi.create(providerData)
      // Backend returns { message: '...', provider: {...} }
      // Extract the provider object from the response
      if (result.provider) {
        return result.provider as Provider
      }
      // Fallback: if response is already a provider object
      return result as Provider
    } catch (error: any) {
      console.error('Error creating provider:', error)
      // Extract error message from API response if available
      const errorMessage = error.message || error.response?.data?.message || 'Failed to create provider profile. Please try again.'
      throw new Error(errorMessage)
    }
  },

  async updateProvider(id: string, data: Partial<Provider>): Promise<Provider> {
    try {
      const result = await providersApi.update(id, data)
      // Backend returns { message: '...', provider: {...} }
      // Extract the provider object from the response
      if (result.provider) {
        return result.provider as Provider
      }
      // Fallback: if response is already a provider object
      return result as Provider
    } catch (error: any) {
      console.error('Error updating provider:', error)
      const errorMessage = error.message || error.response?.data?.message || 'Failed to update provider'
      throw new Error(errorMessage)
    }
  },
}

