import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Provider, FilterState } from '../types'
import { providersApi } from '../lib/api'

interface ProviderContextType {
  providers: Provider[]
  filters: FilterState
  setFilters: (filters: FilterState) => void
  filteredProviders: Provider[]
  searchProviders: (query: string) => void
  getProviderById: (id: string) => Provider | undefined
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined)

export function ProviderProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [filters, setFilters] = useState<FilterState>({})

  // Fetch providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await providersApi.getAll()
        setProviders(data as Provider[])
      } catch (error) {
        console.error('Failed to fetch providers:', error)
        setProviders([])
      }
    }
    fetchProviders()
  }, [])

  const filteredProviders = providers.filter(provider => {
    if (filters.category && provider.category !== filters.category) return false
    if (filters.location && provider.location !== filters.location) return false
    if (filters.verified === true && !provider.verified) return false
    if (filters.availableNow === true && provider.availability !== "Available Now") return false
    if (filters.minRating && provider.rating < filters.minRating) return false
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      if (
        !provider.name.toLowerCase().includes(query) &&
        !provider.category.toLowerCase().includes(query) &&
        !provider.description.toLowerCase().includes(query)
      ) return false
    }
    return true
  })

  const searchProviders = (query: string) => {
    setFilters({ ...filters, searchQuery: query })
  }

  const getProviderById = (id: string) => {
    return providers.find(p => p.id === id)
  }

  return (
    <ProviderContext.Provider
      value={{
        providers,
        filters,
        setFilters,
        filteredProviders,
        searchProviders,
        getProviderById,
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export function useProviderContext() {
  const context = useContext(ProviderContext)
  if (context === undefined) {
    throw new Error('useProviderContext must be used within a ProviderProvider')
  }
  return context
}

