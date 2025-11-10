import { motion } from 'framer-motion'
import SearchBar from './SearchBar'
import CategoryButtons from './CategoryButtons'
import type { Provider } from '../types'

interface HeroSectionProps {
  onSearch?: (filters: { category?: string; location?: string; query?: string }) => void
  providers?: Provider[]
  onProviderSelect?: (provider: Provider) => void
}

export default function HeroSection({ onSearch, providers = [], onProviderSelect }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-ghana-yellow-subtle via-white to-ghana-green-subtle dark:from-primary/20 dark:via-gray-900 dark:to-primary/10 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Trusted Professionals
            <span className="text-primary block">Across Ghana</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2">
            Find verified electricians, cleaners, plumbers, and more. Book instantly — no calls, no hassle.
          </p>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <SearchBar 
              onSearch={onSearch}
              providers={providers}
              onProviderSelect={onProviderSelect}
            />
          </div>

          {/* Category Buttons */}
          <CategoryButtons onCategorySelect={(category) => onSearch?.({ category })} />
        </motion.div>
      </div>
    </section>
  )
}

