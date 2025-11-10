import { Filter, X } from 'lucide-react'
import type { FilterState, ServiceCategory, GhanaCity } from '../types'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'
import Button from './ui/Button'

interface FiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const hasActiveFilters = 
    filters.category || 
    filters.location || 
    filters.verified !== undefined || 
    filters.availableNow !== undefined || 
    filters.minRating !== undefined

  const clearFilters = () => {
    onFilterChange({})
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value as ServiceCategory || undefined })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value as GhanaCity || undefined })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          >
            <option value="">All Locations</option>
            {GHANA_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => onFilterChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+ ⭐</option>
            <option value="4.0">4.0+ ⭐</option>
            <option value="3.5">3.5+ ⭐</option>
          </select>
        </div>

        {/* Verified Only Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verified === true}
              onChange={(e) => onFilterChange({ ...filters, verified: e.target.checked || undefined })}
              className="rounded w-5 h-5 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-900 dark:text-white">Verified Only</span>
          </label>
        </div>

        {/* Available Now Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.availableNow === true}
              onChange={(e) => onFilterChange({ ...filters, availableNow: e.target.checked || undefined })}
              className="rounded w-5 h-5 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-900 dark:text-white">Available Now</span>
          </label>
        </div>
      </div>
    </div>
  )
}

