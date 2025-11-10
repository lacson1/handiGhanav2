import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import StatsSection from '../components/StatsSection'
import TrustBadges from '../components/TrustBadges'
import TestimonialsSection from '../components/TestimonialsSection'
import FAQSection from '../components/FAQSection'
import FilterBarEnhanced from '../components/FilterBarEnhanced'
import ProviderCardEnhanced from '../components/ProviderCardEnhanced'
import BookingModal from '../components/BookingModal'
import BookingSuccessModal from '../components/BookingSuccessModal'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import type { Provider, FilterState } from '../types'
import { providersApi } from '../lib/api'
import { providerService } from '../services/providerService'
import { useNavigate } from 'react-router-dom'
import { useBookings } from '../hooks/useBookings'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { createBooking } = useBookings()
  const { isAuthenticated } = useAuth()
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerProvider, setDrawerProvider] = useState<Provider | null>(null)
  const [lastBooking, setLastBooking] = useState<{ date: string; time: string; notes?: string } | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'newest' | 'name'>('rating')
  const [providers, setProviders] = useState<Provider[]>([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  // Load providers from API
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true)
        const fetchedProviders = await providerService.getAllProviders()
        console.log('Loaded providers from API:', fetchedProviders.length)
        console.log('Provider with ID 1:', fetchedProviders.find(p => p.id === '1'))
        // Log avatar for debugging
        const provider1 = fetchedProviders.find(p => p.id === '1')
        if (provider1) {
          console.log('Provider 1 avatar:', provider1.avatar)
        }
        setProviders(fetchedProviders)
      } catch (error) {
        console.error('Failed to load providers from API, using mock data:', error)
        setProviders([])
      } finally {
        setLoadingProviders(false)
      }
    }

    loadProviders()

    // Listen for provider updates to refresh the list
    const handleProviderUpdate = (event?: CustomEvent) => {
      console.log('Provider updated event received, refreshing list...', event?.detail)
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        loadProviders()
      }, 500)
    }

    // Listen for custom event
    window.addEventListener('providerUpdated', handleProviderUpdate as EventListener)
    // Refresh when window regains focus (user comes back from another tab)
    window.addEventListener('focus', loadProviders)
    // Also listen for storage events (in case data is updated in another tab)
    window.addEventListener('storage', loadProviders)

    return () => {
      window.removeEventListener('providerUpdated', handleProviderUpdate as EventListener)
      window.removeEventListener('focus', loadProviders)
      window.removeEventListener('storage', loadProviders)
    }
  }, [])

  const filteredProviders = useMemo(() => {
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

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'reviews':
          return b.reviewCount - a.reviewCount
        case 'newest':
          const dateA = new Date(a.joinedDate || 0).getTime()
          const dateB = new Date(b.joinedDate || 0).getTime()
          return dateB - dateA
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [providers, filters, sortBy])

  const handleSearch = (searchFilters: { category?: string; location?: string; query?: string }) => {
    setFilters({
      ...filters,
      category: searchFilters.category as any,
      location: searchFilters.location as any,
      searchQuery: searchFilters.query,
    })
    // Scroll to providers section
    document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBook = (provider: Provider) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      if (confirm('Please sign in to book a service. Would you like to sign in now?')) {
        navigate('/signin', { state: { returnTo: '/', providerId: provider.id } })
      }
      return
    }
    
    setSelectedProvider(provider)
    setIsBookingModalOpen(true)
  }

  const handleViewProfile = (provider: Provider) => {
    setDrawerProvider(provider)
    setIsDrawerOpen(true)
  }

  const handleBookingConfirm = async (booking: { date: string; time: string; notes: string }) => {
    if (!selectedProvider) return

    try {
      // Optimistic update - create booking immediately
      await createBooking({
        providerId: selectedProvider.id,
        date: booking.date,
        time: booking.time,
        serviceType: selectedProvider.category,
        notes: booking.notes
      })

      // Show success modal
      setLastBooking(booking)
      setIsBookingModalOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  const handleProviderSelect = (provider: Provider) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      if (confirm('Please sign in to book a service. Would you like to sign in now?')) {
        navigate('/signin', { state: { returnTo: '/', providerId: provider.id } })
      }
      setIsDrawerOpen(false)
      return
    }
    
    setSelectedProvider(provider)
    setIsDrawerOpen(false)
    setIsBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection 
        onSearch={handleSearch}
        providers={providers}
        onProviderSelect={handleProviderSelect}
      />

      {/* Trust Badges */}
      <TrustBadges />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Stats Section with Real Data */}
      <StatsSection />

      {/* Providers Section */}
      <section id="providers" className="py-12 sm:py-16 bg-gradient-to-b from-white to-ghana-green-subtle/20 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Find Trusted Professionals
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Verified electricians, cleaners, plumbers, and more across Ghana
            </p>
          </div>

          <FilterBarEnhanced
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProviders.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loadingProviders ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Loading providers...
                </h3>
              </div>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No providers found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8"
              : "space-y-3 sm:space-y-4 mt-4 sm:mt-6 lg:mt-8"
            }>
              {filteredProviders.map((provider) => (
                <ProviderCardEnhanced
                  key={provider.id}
                  provider={provider}
                  onBook={handleBook}
                  onViewProfile={handleViewProfile}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section with Real Reviews */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Booking Modal */}
      <BookingModal
        provider={selectedProvider}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBookingConfirm}
      />

      {/* Booking Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        provider={selectedProvider}
        bookingDetails={lastBooking}
        onViewDashboard={() => navigate('/my-bookings')}
      />

      {/* Provider Details Drawer */}
      <ProviderDetailsDrawer
        provider={drawerProvider}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setDrawerProvider(null)
        }}
        onBook={handleProviderSelect}
      />
    </div>
  )
}

