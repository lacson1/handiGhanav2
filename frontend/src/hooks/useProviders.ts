import { useState, useMemo, useEffect } from 'react'
import type { Provider, FilterState, Service } from '../types'
import { providersApi, servicesApi } from '../lib/api'

export function useProviders(filters?: FilterState) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch services when pricing model filter is active
  useEffect(() => {
    if (filters?.pricingModel) {
      const loadServices = async () => {
        try {
          const data = await servicesApi.getAll({ isActive: true })
          setServices(data as Service[])
        } catch (error) {
          console.error('Failed to load services for filtering:', error)
          setServices([])
        }
      }
      loadServices()
    } else {
      setServices([])
    }
  }, [filters?.pricingModel])

  const filteredProviders = useMemo(() => {
    if (!filters) return providers

    let result = [...providers]

    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    if (filters.location) {
      result = result.filter(p => p.location === filters.location)
    }

    if (filters.verified === true) {
      result = result.filter(p => p.verified)
    }

    if (filters.availableNow === true) {
      result = result.filter(p => p.availability === "Available Now")
    }

    if (filters.minRating) {
      result = result.filter(p => p.rating >= filters.minRating!)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    // Filter by pricing model - only show providers that have services with the selected pricing model
    if (filters.pricingModel && services.length > 0) {
      const providerIdsWithPricingModel = new Set(
        services
          .filter(s => s.pricingModel === filters.pricingModel)
          .map(s => s.providerId)
          .filter(Boolean) // Remove undefined/null values
      )
      result = result.filter(p => providerIdsWithPricingModel.has(p.id))
    }

    return result
  }, [providers, filters, services])

  const fetchProviders = async (customFilters?: FilterState) => {
    setLoading(true)
    setError(null)
    try {
      const data = await providersApi.getAll(customFilters || filters)
      setProviders(data as Provider[])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch providers')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  const getProviderById = (id: string) => {
    return providers.find(p => p.id === id)
  }

  return {
    providers,
    filteredProviders,
    loading,
    error,
    fetchProviders,
    getProviderById,
  }
}

