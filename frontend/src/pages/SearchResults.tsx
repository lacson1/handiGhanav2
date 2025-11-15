import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowUpDown, Grid3x3, List } from 'lucide-react'
import Filters from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import BookingModal from '../components/BookingModal'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import SearchBar from '../components/SearchBar'
import type { Provider, FilterState, ServiceCategory, GhanaCity } from '../types'
import { providersApi } from '../lib/api'

type SortOption = 'relevance' | 'rating-high' | 'rating-low' | 'name-asc' | 'name-desc' | 'reviews-high'
type ViewMode = 'grid' | 'list'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({})
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerProvider, setDrawerProvider] = useState<Provider | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])

  // Fetch providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await providersApi.getAll()
        setProviders(data as Provider[])
      } catch {
        // Error fetching providers - show empty state
        setProviders([])
      }
    }
    fetchProviders()
  }, [])

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const query = searchParams.get('q') || undefined

    setFilters({
      category: category as ServiceCategory | undefined,
      location: location as GhanaCity | undefined,
      searchQuery: query,
    })
  }, [searchParams])

  const filteredProviders = useMemo(() => {
    let result: Provider[] = providers

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
        (p.description && p.description.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating-high':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        result = [...result].sort((a, b) => a.rating - b.rating)
        break
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'reviews-high':
        result = [...result].sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'relevance':
      default:
        // Keep original order (relevance/default)
        // You could add custom relevance logic here
        break
    }

    return result
  }, [providers, filters, sortBy])

  const handleBook = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsBookingModalOpen(true)
  }

  const handleViewProfile = (provider: Provider) => {
    setDrawerProvider(provider)
    setIsDrawerOpen(true)
  }

  const handleBookingConfirm = (booking: { date: string; time: string; notes: string }) => {
    // Booking confirmed - modal will show success message
    setIsBookingModalOpen(false)
  }

  const handleSearch = (newFilters: { category?: string; location?: string; query?: string }) => {
    const params = new URLSearchParams()
    if (newFilters.query) params.append('q', newFilters.query)
    if (newFilters.category) params.append('category', newFilters.category)
    if (newFilters.location) params.append('location', newFilters.location)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Search Results
        </h1>

        {/* Search Bar for refinement */}
        <div className="mb-6">
          <SearchBar 
            onSearch={handleSearch}
            providers={providers}
            onProviderSelect={(provider) => {
              setDrawerProvider(provider)
              setIsDrawerOpen(true)
            }}
          />
        </div>

        <div className="mb-6">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Count, Sort, and View Toggle */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
          </p>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              >
                <option value="relevance">Relevance</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="rating-low">Rating: Low to High</option>
                <option value="reviews-high">Most Reviews</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No providers found matching your criteria.
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onBook={handleBook}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}

        <BookingModal
          provider={selectedProvider}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
        />

        {/* Provider Details Drawer */}
        <ProviderDetailsDrawer
          provider={drawerProvider}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false)
            setDrawerProvider(null)
          }}
          onBook={(provider) => {
            setDrawerProvider(null)
            setIsDrawerOpen(false)
            setSelectedProvider(provider)
            setIsBookingModalOpen(true)
          }}
        />
      </div>
    </div>
  )
}

