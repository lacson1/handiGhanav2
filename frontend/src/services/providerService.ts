import type { Provider, ServiceCategory, GhanaCity } from '../types'
import { providersApi } from '../lib/api'

class ProviderService {
  async getAllProviders(filters?: {
    category?: string
    location?: string
    verified?: boolean
    availableNow?: boolean
    minRating?: number
    search?: string
  }): Promise<Provider[]> {
    try {
      return await providersApi.getAll(filters)
    } catch (error) {
      console.error('Error fetching providers:', error)
      return []
    }
  }

  async getProviderById(id: string): Promise<Provider | null> {
    try {
      return await providersApi.getById(id)
    } catch (error) {
      console.error('Error fetching provider:', error)
      return null
    }
  }

  async searchProviders(query: string, filters?: {
    category?: string
    location?: string
    verified?: boolean
    availableNow?: boolean
    minRating?: number
  }): Promise<Provider[]> {
    try {
      return await providersApi.getAll({ ...filters, search: query })
    } catch (error) {
      console.error('Error searching providers:', error)
      return []
    }
  }

  async createProvider(data: {
    name: string
    email: string
    category: string
    location: string
    contact: string
    bio: string
  }): Promise<Provider> {
    try {
      const providerData: Partial<Provider> = {
        name: data.name,
        category: data.category as ServiceCategory,
        location: data.location as GhanaCity,
        phone: data.contact,
        whatsapp: data.contact,
        description: data.bio,
      }
      const result = await providersApi.create(providerData)
      return result
    } catch (error: unknown) {
      console.error('Error creating provider:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string')
          ? error.response.data.message
          : 'Failed to create provider profile. Please try again.'
      throw new Error(errorMessage)
    }
  }

  async updateProvider(id: string, data: Partial<Provider>): Promise<Provider> {
    try {
      const result = await providersApi.update(id, data)
      return result
    } catch (error: unknown) {
      console.error('Error updating provider:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string')
          ? error.response.data.message
          : 'Failed to update provider'
      throw new Error(errorMessage)
    }
  }
}

export const providerService = new ProviderService()
