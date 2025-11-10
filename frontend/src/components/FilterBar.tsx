import { Filter, X } from 'lucide-react'
import type { FilterState, ServiceCategory, GhanaCity, PricingModel } from '../types'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'
import Button from './ui/Button'

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  resultCount?: number
}

export default function FilterBar({ filters, onFilterChange, resultCount }: FilterBarProps) {
  const hasActiveFilters = 
    filters.category || 
    filters.location || 
    filters.verified !== undefined || 
    filters.availableNow !== undefined || 
    filters.minRating !== undefined ||
    filters.pricingModel !== undefined

  const clearFilters = () => {
    onFilterChange({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b-2 border-b-ghana-yellow/20 border-t-ghana-green/10 dark:border-gray-700 sticky top-16 z-40">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
            {resultCount !== undefined && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({resultCount} results)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value as ServiceCategory || undefined })}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-ghana-yellow/40 min-h-[44px]"
            >
              <option value="">All Categories</option>
              {SERVICE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Location Filter */}
            <select
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value as GhanaCity || undefined })}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-ghana-yellow/40 min-h-[44px]"
            >
              <option value="">All Locations</option>
              {GHANA_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Verified Filter */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={filters.verified === true}
                onChange={(e) => onFilterChange({ ...filters, verified: e.target.checked || undefined })}
                className="rounded"
              />
              <span className="text-sm text-gray-900 dark:text-white">Verified Only</span>
            </label>

            {/* Available Now Filter */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <input
                type="checkbox"
                checked={filters.availableNow === true}
                onChange={(e) => onFilterChange({ ...filters, availableNow: e.target.checked || undefined })}
                className="rounded"
              />
              <span className="text-sm text-gray-900 dark:text-white">Available Now</span>
            </label>

            {/* Rating Filter */}
            <select
              value={filters.minRating || ''}
              onChange={(e) => onFilterChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-ghana-yellow/40 min-h-[44px]"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4.0">4.0+ ⭐</option>
              <option value="3.5">3.5+ ⭐</option>
            </select>

            {/* Pricing Model Filter */}
            <select
              value={filters.pricingModel || ''}
              onChange={(e) => onFilterChange({ ...filters, pricingModel: e.target.value as PricingModel || undefined })}
              className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-ghana-yellow/40 min-h-[44px]"
            >
              <option value="">All Pricing</option>
              <option value="pay-as-you-go">Pay As You Go</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

