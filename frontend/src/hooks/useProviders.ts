import { useQuery } from '@tanstack/react-query'
import { providersApi } from '../lib/api'

export function useProviders(filters?: {
  category?: string
  location?: string
  verified?: boolean
  availableNow?: boolean
  minRating?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: () => providersApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

export function useProvider(id: string) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: () => providersApi.getById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id, // Only fetch if ID exists
  })
}
