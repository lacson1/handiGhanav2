import { useState, useEffect, useRef } from 'react'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Provider } from '../types'

interface InstantSearchResultsProps {
  query: string
  providers: Provider[]
  onSelect: (provider: Provider) => void
  onClose: () => void
}

export default function InstantSearchResults({ query, providers, onSelect, onClose }: InstantSearchResultsProps) {
  const [topResults, setTopResults] = useState<Provider[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setTopResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const filtered = providers
      .filter(p =>
        p.name?.toLowerCase().includes(searchTerm) ||
        p.category?.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
        p.location?.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => {
        // Prioritize verified and available providers
        let scoreA = a.rating || 0
        let scoreB = b.rating || 0
        if (a.verified) scoreA += 0.5
        if (a.availability === 'Available Now') scoreA += 0.5
        if (b.verified) scoreB += 0.5
        if (b.availability === 'Available Now') scoreB += 0.5
        return scoreB - scoreA
      })
      .slice(0, 3)

    setTopResults(filtered)
  }, [query, providers])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (topResults.length > 0) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [topResults, onClose])

  if (!query.trim() || topResults.length === 0) return null

  return (
    <AnimatePresence>
      {topResults.length > 0 && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Top Results ({topResults.length})
            </div>
            {topResults.map((provider) => (
              <button
                key={provider.id}
                onClick={() => onSelect(provider)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {provider.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                        {provider.name}
                      </h4>
                      {provider.verified && (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {provider.category}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{provider.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

