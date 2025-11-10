import type { Provider } from '../types'
import { providersApi } from '../lib/api'

class ProviderService {
  async getAllProviders(filters?: any): Promise<Provider[]> {
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

  async searchProviders(query: string, filters?: any): Promise<Provider[]> {
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
      const providerData = {
        name: data.name,
        email: data.email,
        category: data.category,
        location: data.location,
        phone: data.contact,
        whatsapp: data.contact,
        description: data.bio,
      }
      const result = await providersApi.create(providerData)
      if (result.provider) {
        return result.provider as Provider
      }
      return result as Provider
    } catch (error: any) {
      console.error('Error creating provider:', error)
      const errorMessage = error.message || error.response?.data?.message || 'Failed to create provider profile. Please try again.'
      throw new Error(errorMessage)
    }
  }

  async updateProvider(id: string, data: Partial<Provider>): Promise<Provider> {
    try {
      const result = await providersApi.update(id, data)
      if (result.provider) {
        return result.provider as Provider
      }
      return result as Provider
    } catch (error: any) {
      console.error('Error updating provider:', error)
      const errorMessage = error.message || error.response?.data?.message || 'Failed to update provider'
      throw new Error(errorMessage)
    }
  }
}

export const providerService = new ProviderService()
