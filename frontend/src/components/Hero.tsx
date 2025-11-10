import { useState } from 'react'
import { Search, MapPin, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'

interface HeroProps {
  onSearch: (filters: { category?: string; location?: string; query?: string }) => void
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleSearch = () => {
    onSearch({
      category: selectedCategory || undefined,
      location: selectedLocation || undefined,
      query: searchQuery || undefined,
    })
  }

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
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 border border-ghana-yellow/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1 relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="">All Locations</option>
                  {GHANA_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSearch} size="lg" className="w-full sm:w-auto min-h-[48px]">
                Search
              </Button>
            </div>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
            {['Electrician', 'Plumber', 'Cleaner', 'Handyman'].map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(category)
                  onSearch({ category })
                }}
                className="hover:bg-ghana-yellow-subtle hover:border-ghana-yellow/50 hover:text-black transition-colors border-ghana-green/20"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

