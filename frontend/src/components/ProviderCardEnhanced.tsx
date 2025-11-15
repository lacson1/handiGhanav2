import { Star, MapPin, CheckCircle, Clock, Phone, MessageCircle, Award, TrendingUp, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Provider, Review } from '../types'
import Button from './ui/Button'
import ReviewSnippet from './ReviewSnippet'
import { reviewsApi } from '../lib/api'
import { formatAvailability, isAvailableNow } from '../lib/utils'

interface ProviderCardEnhancedProps {
  provider: Provider
  onBook: (provider: Provider) => void
  onViewProfile: (provider: Provider) => void
  viewMode?: 'grid' | 'list'
}

export default function ProviderCardEnhanced({ 
  provider, 
  onBook, 
  onViewProfile,
  viewMode = 'grid'
}: ProviderCardEnhancedProps) {
  
  // Support both avatar and image fields
  const avatarUrl = provider.avatar || (provider as Provider & { image?: string }).image
  const [recentReview, setRecentReview] = useState<Review | null>(null)
  const [loadingReview, setLoadingReview] = useState(false)

  // Load most recent review
  useEffect(() => {
    if (provider.id && provider.reviewCount > 0) {
      setLoadingReview(true)
      reviewsApi.getByProvider(provider.id, 1)
        .then((response) => {
          if (response.reviews && response.reviews.length > 0) {
            setRecentReview(response.reviews[0] as Review)
          }
        })
        .catch(() => {
          // Silently fail - reviews are optional on cards
        })
        .finally(() => setLoadingReview(false))
    }
  }, [provider.id, provider.reviewCount])
  const handleWhatsApp = () => {
    if (provider.whatsapp) {
      window.open(`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
    }
  }

  const handleCall = () => {
    if (provider.phone) {
      window.location.href = `tel:${provider.phone}`
    }
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/40"
      >
        <div className="flex flex-col sm:flex-row gap-4 p-5">
          {/* Avatar/Image */}
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={provider.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover"
                onError={(e) => {
                  // Failed to load avatar image
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-primary flex items-center justify-center text-2xl font-bold text-black">
                {provider.name.charAt(0)}
              </div>
            )}
            {provider.verified && (
              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {provider.name}
                  </h3>
                  {isAvailableNow(provider.availability) && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      Now
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {provider.category}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-900 dark:text-gray-100 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <span className="font-bold">{provider.location}</span>
                  </div>
                  {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      +{provider.serviceAreas.length} areas
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  {provider.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">
                  ({provider.reviewCount})
                </span>
              </div>
              {provider.completionRate && (
                <>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                  <div className="flex items-center gap-1 text-xs text-gray-800 dark:text-gray-200 font-semibold">
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{Math.round(provider.completionRate * 100)}% completion</span>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-3 leading-relaxed font-medium">
              {provider.description}
            </p>

            {/* Recent Review Snippet */}
            {recentReview && !loadingReview && (
              <div className="mb-3">
                <ReviewSnippet review={recentReview} />
              </div>
            )}

            {/* Skills */}
            {provider.skills && provider.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {provider.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {skill}
                  </span>
                ))}
                {provider.skills.length > 3 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                    +{provider.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                onClick={() => onBook(provider)}
                className="flex-1 w-full sm:w-auto min-h-[44px]"
              >
                Book Now
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProfile(provider)}
                  className="flex-1 sm:flex-none min-h-[44px]"
                >
                  <Eye className="h-5 w-5 sm:mr-1" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                {provider.whatsapp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWhatsApp}
                    className="px-3 min-w-[44px] min-h-[44px]"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                )}
                {provider.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCall}
                    className="px-3 min-w-[44px] min-h-[44px]"
                    title="Call"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid View (Enhanced)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary/40"
    >
      {/* Header with Image/Avatar */}
      <div className="relative h-48 bg-linear-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={provider.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              console.error('Failed to load avatar image:', avatarUrl)
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-black shadow-lg">
              {provider.name.charAt(0)}
            </div>
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {provider.verified && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}
        
            {isAvailableNow(provider.availability) && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  Available Now
                </span>
              </div>
            )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1 shadow-xl border border-gray-200 dark:border-gray-700">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {provider.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 truncate">
              {provider.name}
            </h3>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
              {provider.category}
            </p>
          </div>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {provider.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-900 dark:text-gray-200 font-bold">
            ({provider.reviewCount} reviews)
          </span>
          {provider.completionRate && (
            <>
              <div className="h-3 w-px bg-gray-400 dark:bg-gray-500" />
              <div className="flex items-center gap-1 text-xs text-gray-900 dark:text-gray-100 font-bold">
                <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>{Math.round(provider.completionRate * 100)}%</span>
              </div>
            </>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-900 dark:text-gray-100 mb-3">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-700 dark:text-gray-300" />
          <span className="truncate font-bold">{provider.location}</span>
          {provider.serviceAreas && provider.serviceAreas.length > 0 && (
            <span className="ml-1.5 text-xs text-gray-700 dark:text-gray-300 font-semibold">
              +{provider.serviceAreas.length} areas
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-3 min-h-[2.5rem] leading-relaxed font-semibold">
          {provider.description}
        </p>

        {/* Recent Review Snippet */}
        {recentReview && !loadingReview && (
          <div className="mb-3">
            <ReviewSnippet review={recentReview} />
          </div>
        )}

        {/* Skills Tags */}
        {provider.skills && provider.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.skills.slice(0, 2).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800"
              >
                {skill}
              </span>
            ))}
            {provider.skills.length > 2 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                +{provider.skills.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Quick Slots */}
        {provider.quickSlots && provider.quickSlots.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
              Quick Book:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {provider.quickSlots.slice(0, 2).map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onBook(provider)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Button
            size="sm"
            onClick={() => onBook(provider)}
            className="flex-1 w-full sm:w-auto min-h-[44px]"
          >
            Book Now
          </Button>
          <div className="flex gap-3">
            {provider.whatsapp && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-3 min-h-[44px] min-w-[44px]"
                title="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            )}
            {provider.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="flex-1 sm:flex-none px-3 min-h-[44px] min-w-[44px]"
                title="Call"
              >
                <Phone className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(provider)}
              className="flex-1 sm:flex-none min-h-[44px] sm:px-3"
              title="View Profile"
            >
              <Eye className="h-5 w-5 sm:mr-1" />
              <span className="hidden sm:inline">View</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

