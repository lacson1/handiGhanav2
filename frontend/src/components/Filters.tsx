import { Filter, X, Search, ChevronDown, ChevronUp, Star, Briefcase, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { FilterState, ServiceCategory, GhanaCity } from '../types'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'
import Button from './ui/Button'

interface FiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const hasActiveFilters = 
    filters.category || 
    filters.location || 
    filters.verified !== undefined || 
    filters.availableNow !== undefined || 
    filters.minRating !== undefined ||
    filters.searchQuery

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.location) count++
    if (filters.verified) count++
    if (filters.availableNow) count++
    if (filters.minRating) count++
    return count
  }

  const clearFilters = () => {
    onFilterChange({})
  }

  const removeFilter = (filterKey: keyof FilterState) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 ${!isExpanded ? 'hidden md:block' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers by name or description..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value || undefined })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className={`px-4 sm:px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 ${!isExpanded ? 'hidden md:flex' : 'flex'} flex-wrap gap-2`}>
          {filters.category && (
            <button
              onClick={() => removeFilter('category')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>{filters.category}</span>
              <X className="h-3.5 w-3.5 group-hover:text-red-600" />
            </button>
          )}
          {filters.location && (
            <button
              onClick={() => removeFilter('location')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>{filters.location}</span>
              <X className="h-3.5 w-3.5 group-hover:text-red-600" />
            </button>
          )}
          {filters.minRating && (
            <button
              onClick={() => removeFilter('minRating')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{filters.minRating}+</span>
              <X className="h-3.5 w-3.5 group-hover:text-red-600" />
            </button>
          )}
          {filters.verified && (
            <button
              onClick={() => removeFilter('verified')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-full text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <span>Verified</span>
              <X className="h-3.5 w-3.5 group-hover:text-red-600" />
            </button>
          )}
          {filters.availableNow && (
            <button
              onClick={() => removeFilter('availableNow')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <span>Available Now</span>
              <X className="h-3.5 w-3.5 group-hover:text-red-600" />
            </button>
          )}
        </div>
      )}

      {/* Filter Options */}
      <div className={`p-4 sm:p-5 ${!isExpanded ? 'hidden md:block' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span>Category</span>
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value as ServiceCategory || undefined })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            >
              <option value="">All Categories</option>
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>Location</span>
            </label>
            <select
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value as GhanaCity || undefined })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            >
              <option value="">All Locations</option>
              {GHANA_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Star className="h-4 w-4 text-gray-500 fill-gray-500" />
              <span>Minimum Rating</span>
            </label>
            <select
              value={filters.minRating || ''}
              onChange={(e) => onFilterChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5 ⭐ & Above</option>
              <option value="4.0">4.0 ⭐ & Above</option>
              <option value="3.5">3.5 ⭐ & Above</option>
              <option value="3.0">3.0 ⭐ & Above</option>
            </select>
          </div>

          {/* Quick Filters Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Filters
            </label>
            <div className="space-y-2">
              {/* Verified Only Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.verified === true}
                  onChange={(e) => onFilterChange({ ...filters, verified: e.target.checked || undefined })}
                  className="rounded w-4 h-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">✓ Verified Only</span>
              </label>

              {/* Available Now Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.availableNow === true}
                  onChange={(e) => onFilterChange({ ...filters, availableNow: e.target.checked || undefined })}
                  className="rounded w-4 h-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">🟢 Available Now</span>
              </label>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        {!hasActiveFilters && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
            Use filters above to narrow down your search results
          </p>
        )}
      </div>
    </div>
  )
}
