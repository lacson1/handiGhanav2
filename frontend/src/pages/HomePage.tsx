import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Search, Calendar } from 'lucide-react'
import Hero from '../components/Hero'
import FilterBar from '../components/FilterBar'
import ProviderCard from '../components/ProviderCard'
import BookingModal from '../components/BookingModal'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import type { Provider, FilterState } from '../types'
import { mockProviders } from '../utils/mockData'
export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerProvider, setDrawerProvider] = useState<Provider | null>(null)

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
    setSelectedProvider(provider)
    setIsBookingModalOpen(true)
  }

  const handleViewProfile = (provider: Provider) => {
    setDrawerProvider(provider)
    setIsDrawerOpen(true)
  }

  const handleBookingConfirm = (booking: { date: string; time: string; notes: string }) => {
    console.log('Booking confirmed:', { provider: selectedProvider, ...booking })
    // TODO: Send to backend API
    alert(`Booking confirmed with ${selectedProvider?.name} for ${booking.date} at ${booking.time}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-gradient-to-b from-white via-ghana-yellow-subtle/30 to-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Search,
                title: "Find",
                description: "Search for trusted professionals by category and location"
              },
              {
                icon: Calendar,
                title: "Book",
                description: "Choose a date and time that works for you. Book instantly online."
              },
              {
                icon: CheckCircle,
                title: "Done",
                description: "Get your work done by verified professionals. Leave a review!"
              }
            ].map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ghana-red/10 via-primary/20 to-ghana-green/10 mb-4 border-2 border-ghana-yellow/30">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProviders.length}
          />

          {filteredProviders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No providers found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
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
        </div>
      </section>

      {/* Booking Modal */}
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
  )
}

