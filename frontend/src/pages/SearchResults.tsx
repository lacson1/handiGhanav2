import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Filters from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import BookingModal from '../components/BookingModal'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import type { Provider, FilterState } from '../types'
import { mockProviders } from '../data/mockProviders'
import { useNavigate } from 'react-router-dom'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerProvider, setDrawerProvider] = useState<Provider | null>(null)

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.get('category') || undefined
    const location = searchParams.get('location') || undefined
    const query = searchParams.get('q') || undefined

    setFilters({
      category: category as any,
      location: location as any,
      searchQuery: query,
    })
  }, [searchParams])

  const filteredProviders = useMemo(() => {
    let result = [...mockProviders]

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

    return result
  }, [filters])

  const handleBook = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsBookingModalOpen(true)
  }

  const handleViewProfile = (provider: Provider) => {
    setDrawerProvider(provider)
    setIsDrawerOpen(true)
  }

  const handleBookingConfirm = (booking: { date: string; time: string; notes: string }) => {
    console.log('Booking confirmed:', { provider: selectedProvider, ...booking })
    alert(`Booking confirmed with ${selectedProvider?.name} for ${booking.date} at ${booking.time}`)
    setIsBookingModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Search Results
        </h1>

        <div className="mb-6">
          <Filters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No providers found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

