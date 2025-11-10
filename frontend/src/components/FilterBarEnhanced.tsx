import { useState } from 'react'
import { Filter, X, ChevronDown, SlidersHorizontal, SortAsc, Grid3x3, List } from 'lucide-react'
import type { FilterState, ServiceCategory, GhanaCity } from '../types'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface FilterBarEnhancedProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  resultCount?: number
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  sortBy?: 'rating' | 'reviews' | 'newest' | 'name'
  onSortChange?: (sort: 'rating' | 'reviews' | 'newest' | 'name') => void
}

export default function FilterBarEnhanced({ 
  filters, 
  onFilterChange, 
  resultCount,
  viewMode = 'grid',
  onViewModeChange,
  sortBy = 'rating',
  onSortChange
}: FilterBarEnhancedProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const hasActiveFilters = 
    filters.category || 
    filters.location || 
    filters.verified !== undefined || 
    filters.availableNow !== undefined || 
    filters.minRating !== undefined

  const clearFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = [
    filters.category,
    filters.location,
    filters.verified,
    filters.availableNow,
    filters.minRating
  ].filter(Boolean).length

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
          {/* Left: Filters */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Filter Label */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              {/* Category Filter */}
              <div className="relative w-full sm:w-auto min-w-[140px]">
                <select
                  value={filters.category || ''}
                  onChange={(e) => onFilterChange({ ...filters, category: e.target.value as ServiceCategory || undefined })}
                  className="appearance-none w-full px-3 sm:px-4 py-2.5 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px] cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Location Filter */}
              <div className="relative w-full sm:w-auto min-w-[140px]">
                <select
                  value={filters.location || ''}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value as GhanaCity || undefined })}
                  className="appearance-none w-full px-3 sm:px-4 py-2.5 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px] cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {GHANA_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Rating Filter */}
              <div className="relative w-full sm:w-auto min-w-[120px]">
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => onFilterChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
                  className="appearance-none w-full px-3 sm:px-4 py-2.5 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px] cursor-pointer"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                  <option value="3.0">3.0+ ⭐</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={filters.verified === true}
                    onChange={(e) => onFilterChange({ ...filters, verified: e.target.checked || undefined })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900 dark:text-white whitespace-nowrap">Verified</span>
                </label>

                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={filters.availableNow === true}
                    onChange={(e) => onFilterChange({ ...filters, availableNow: e.target.checked || undefined })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900 dark:text-white whitespace-nowrap">Available Now</span>
                </label>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors min-h-[44px]",
                  showAdvanced
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-medium">More</span>
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 min-h-[44px]"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Right: View Options & Sort */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
            {/* Result Count */}
            {resultCount !== undefined && (
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <span className="font-semibold text-gray-900 dark:text-white">{resultCount}</span> <span className="hidden sm:inline">results</span>
              </div>
            )}

            {/* Sort */}
            {onSortChange && (
              <div className="relative flex-1 sm:flex-none min-w-[140px] sm:min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as any)}
                  className="appearance-none w-full px-3 sm:px-4 py-2.5 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px] cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
                <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            )}

            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === 'grid'
                      ? "bg-primary text-black"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  )}
                  title="Grid View"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === 'list'
                      ? "bg-primary text-black"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  )}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </div>
              {/* Add more advanced filters here if needed */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                More filter options coming soon...
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Active:</span>
              {filters.category && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {filters.category}
                  <button
                    onClick={() => onFilterChange({ ...filters, category: undefined })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {filters.location}
                  <button
                    onClick={() => onFilterChange({ ...filters, location: undefined })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.minRating && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {filters.minRating}+ ⭐
                  <button
                    onClick={() => onFilterChange({ ...filters, minRating: undefined })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.verified && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Verified
                  <button
                    onClick={() => onFilterChange({ ...filters, verified: undefined })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.availableNow && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Available Now
                  <button
                    onClick={() => onFilterChange({ ...filters, availableNow: undefined })}
                    className="ml-1.5 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

