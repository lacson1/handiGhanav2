import type { FilterState, Provider, ServiceCategory, GhanaCity } from '../types'
import { SERVICE_CATEGORIES, isAvailableNow } from './utils'

export const SORT_OPTIONS = {
  relevance: 'Recommended',
  'rating-high': 'Highest rated',
  'rating-low': 'Lowest rated',
  'reviews-high': 'Most reviewed',
  'name-asc': 'Name: A to Z',
  'name-desc': 'Name: Z to A',
} as const
export type SortOption = keyof typeof SORT_OPTIONS

export function readSearchFilters(params: URLSearchParams): FilterState {
  const category = params.get('category') as ServiceCategory
  const rating = Number(params.get('rating'))
  return {
    searchQuery: params.get('q') || undefined,
    category: SERVICE_CATEGORIES.includes(category) ? category : undefined,
    location: (params.get('location') || undefined) as GhanaCity | undefined,
    minRating: [3, 3.5, 4, 4.5].includes(rating) ? rating : undefined,
    verified: params.get('verified') === 'true' || undefined,
    availableNow: params.get('available') === 'true' || undefined,
  }
}

export function writeSearchFilters(filters: FilterState, current = new URLSearchParams()) {
  const params = new URLSearchParams(current)
  const values = {
    q: filters.searchQuery,
    category: filters.category,
    location: filters.location,
    rating: filters.minRating,
    verified: filters.verified,
    available: filters.availableNow,
  }
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, String(value))
    else params.delete(key)
  }
  return params
}

export function filterAndSortProviders(providers: Provider[], filters: FilterState, sort: SortOption) {
  const query = filters.searchQuery?.trim().toLowerCase()
  const location = filters.location?.trim().toLowerCase()
  const result = providers.filter(provider => {
    if (filters.category && provider.category !== filters.category) return false
    if (location && ![provider.location, ...(provider.serviceAreas || [])].some(area => area.toLowerCase().includes(location))) return false
    if (filters.verified && !provider.verified) return false
    if (filters.availableNow && !isAvailableNow(provider.availability)) return false
    if (filters.minRating && (provider.reviewCount === 0 || provider.rating < filters.minRating)) return false
    if (query && ![provider.name, provider.category, provider.description, ...(provider.skills || [])].some(value => value.toLowerCase().includes(query))) return false
    return true
  })
  switch (sort) {
    case 'rating-high': return result.sort((a, b) => b.rating - a.rating)
    case 'rating-low': return result.sort((a, b) => a.rating - b.rating)
    case 'reviews-high': return result.sort((a, b) => b.reviewCount - a.reviewCount)
    case 'name-asc': return result.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc': return result.sort((a, b) => b.name.localeCompare(a.name))
    default: return result
  }
}
