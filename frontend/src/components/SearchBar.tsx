import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Briefcase, X, TrendingUp, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SERVICE_CATEGORIES } from '../lib/utils'
import Button from './ui/Button'
import InstantSearchResults from './InstantSearchResults'
import { AutocompleteInput } from './ui/AutocompleteInput'
import { LocationInput } from './ui/LocationInput'
import { getServiceSuggestions, serviceCategories, getCategoryIcon } from '../utils/formHelpers'
import { statsApi } from '../lib/api'
import type { AutocompleteOption } from '../hooks/useAutocomplete'
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
  const [serviceSuggestions, setServiceSuggestions] = useState<AutocompleteOption[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [trendingSearches, setTrendingSearches] = useState<Array<{ term: string; count: number; icon: string }>>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Fetch trending searches from API
  useEffect(() => {
    const fetchTrendingSearches = async () => {
      try {
        const trending = await statsApi.getTrendingSearches(5, 30)
        // Map trending searches to include icons based on category
        const trendingWithIcons = trending.map(item => {
          // Try to extract category from search term
          const termLower = item.term.toLowerCase()
          let icon = '🔍' // default icon

          // Check if term contains category keywords
          for (const [category, categoryIcon] of Object.entries({
            'electrician': '⚡',
            'plumber': '🔧',
            'cleaner': '🧹',
            'cleaning': '🧹',
            'carpenter': '🪚',
            'painter': '🎨',
            'mechanic': '🔩',
            'gardener': '🌱',
            'handyman': '🛠️',
            'tiler': '⬜',
            'welder': '🔥',
            'ac repair': '❄️',
            'appliance': '🔌',
            'roofing': '🏠',
            'masonry': '🧱',
            'security': '🔒'
          })) {
            if (termLower.includes(category)) {
              icon = categoryIcon
              break
            }
          }

          return { ...item, icon }
        })

        // If no trending searches from DB, use fallback
        if (trendingWithIcons.length === 0) {
          setTrendingSearches([
            { term: 'Electrician Accra', count: 0, icon: '⚡' },
            { term: 'Plumber Emergency', count: 0, icon: '🔧' },
            { term: 'House Cleaning', count: 0, icon: '🧹' }
          ])
        } else {
          setTrendingSearches(trendingWithIcons)
        }
      } catch (error) {
        console.error('Error fetching trending searches:', error)
        // Fallback to empty array or default values
        setTrendingSearches([])
      }
    }

    fetchTrendingSearches()
  }, [])

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent.slice(0, 5))
  }, [])

  // Save search to recent searches
  const saveSearch = (query: string) => {
    if (!query.trim()) return
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [query, ...recent.filter((q: string) => q !== query)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    setRecentSearches(updated)
  }

  // Generate smart service suggestions based on query
  const generateSuggestions = useCallback(() => {
    if (searchQuery.length > 0) {
      const suggestions = getServiceSuggestions(searchQuery)
      const options: AutocompleteOption[] = suggestions.map(suggestion => ({
        value: suggestion,
        label: suggestion,
        description: `Find ${suggestion.toLowerCase()} near you`,
        icon: getCategoryIcon(suggestion)
      }))
      setServiceSuggestions(options)
    } else if (isFocused) {
      // Show popular categories when empty and focused
      const popularOptions: AutocompleteOption[] = serviceCategories.slice(0, 8).map(cat => ({
        value: cat,
        label: cat,
        description: 'Popular category',
        icon: getCategoryIcon(cat)
      }))
      setServiceSuggestions(popularOptions)
    } else {
      setServiceSuggestions([])
    }
  }, [searchQuery, isFocused])

  useEffect(() => {
    generateSuggestions()
  }, [generateSuggestions])

  const handleSearch = async () => {
    const filters = {
      category: selectedCategory || undefined,
      location: selectedLocation || undefined,
      query: searchQuery || undefined,
    }

    // Track search in analytics (fire and forget)
    try {
      await statsApi.trackSearch({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        location: selectedLocation || undefined,
      })
    } catch (error) {
      // Silently fail - don't block search if tracking fails
      console.error('Error tracking search:', error)
    }

    // Save to recent searches
    if (searchQuery) {
      saveSearch(searchQuery)
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
    setShowInstantResults(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowInstantResults(false)
    searchInputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-ghana-yellow/20 transition-all">
      {/* Smart Search Tips */}
      <div className="mb-3 flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-ghana-yellow animate-pulse" />
          <span className="font-medium">
            {isFocused ? 'Type or select from suggestions below' : 'Click to start searching'}
          </span>
        </div>
        {recentSearches.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem('recentSearches')
              setRecentSearches([])
            }}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Recent:</span>
          {recentSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(term)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Trending Searches */}
      {!searchQuery && recentSearches.length === 0 && trendingSearches.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-ghana-yellow-subtle to-ghana-green-subtle dark:from-primary/10 dark:to-primary/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-ghana-red" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Trending Now</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.slice(0, 3).map((item, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(item.term)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
              >
                <span>{item.icon}</span>
                <span>{item.term}</span>
                {item.count > 0 && <span className="text-xs text-gray-400">({item.count})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Enhanced Keyword Search with Autocomplete */}
        <div className="flex-1 relative">
          <div className="relative">
            <div
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                // Only blur if focus is moving outside the search container
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setTimeout(() => setIsFocused(false), 150)
                }
              }}
            >
              <AutocompleteInput
                ref={searchInputRef}
                options={serviceSuggestions}
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value)
                  if (value.length >= 2) {
                    setShowInstantResults(true)
                  }
                }}
                onSelect={(option) => {
                  setSearchQuery(option.value)
                  setShowInstantResults(false)
                }}
                placeholder="Search services, providers..."
                icon={<Search className="h-5 w-5" />}
                minChars={0}
                className="min-h-[48px]"
              />
            </div>
            {/* Clear Search Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
          </div>
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

        {/* Category Dropdown with Better UX */}
        <div className="flex-1 relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Select service category"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-h-[48px]"
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location with Autocomplete */}
        <div className="flex-1">
          <LocationInput
            value={selectedLocation}
            onChange={(value) => setSelectedLocation(value)}
            label=""
            hint=""
            className="min-h-[48px]"
          />
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} size="lg" className="w-full sm:w-auto min-h-[48px] px-8">
          Search
        </Button>
      </div>
    </div>
  )
}

