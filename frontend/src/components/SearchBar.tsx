import { useState, useRef } from 'react'
import { Search, Briefcase, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'
import Button from './ui/Button'
import InstantSearchResults from './InstantSearchResults'
import type { Provider } from '../types'

interface SearchBarProps {
  onSearch?: (filters: { category?: string; location?: string; query?: string }) => void
  providers?: Provider[]
  onProviderSelect?: (provider: Provider) => void
}

export default function SearchBar({ onSearch, providers = [], onProviderSelect }: SearchBarProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showInstantResults, setShowInstantResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    const filters = {
      category: selectedCategory || undefined,
      location: selectedLocation || undefined,
      query: searchQuery || undefined,
    }
    
    if (onSearch) {
      onSearch(filters)
    } else {
      // Navigate to search results with query params
      const params = new URLSearchParams()
      if (filters.query) params.append('q', filters.query)
      if (filters.category) params.append('category', filters.category)
      if (filters.location) params.append('location', filters.location)
      navigate(`/search?${params.toString()}`)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-ghana-yellow/20">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Keyword Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search services, providers, or locations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowInstantResults(true)
            }}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setShowInstantResults(true)
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setShowInstantResults(false)
                handleSearch()
              }
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {providers.length > 0 && showInstantResults && searchQuery.trim().length >= 2 && (
            <InstantSearchResults
              query={searchQuery}
              providers={providers}
              onSelect={(provider) => {
                if (onProviderSelect) {
                  onProviderSelect(provider)
                }
                setSearchQuery('')
                setShowInstantResults(false)
              }}
              onClose={() => setShowInstantResults(false)}
            />
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex-1 relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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

        {/* Location Dropdown */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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

        {/* Search Button */}
        <Button onClick={handleSearch} size="lg" className="w-full sm:w-auto min-h-[48px]">
          Search
        </Button>
      </div>
    </div>
  )
}

