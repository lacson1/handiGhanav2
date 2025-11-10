import { Star, MapPin, CheckCircle, Clock, Phone, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Provider } from '../types'
import Button from './ui/Button'

interface ProviderCardProps {
  provider: Provider
  onBook: (provider: Provider) => void
  onViewProfile: (provider: Provider) => void
}

export default function ProviderCard({ provider, onBook, onViewProfile }: ProviderCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-ghana-yellow/40"
    >
      {/* Header with Image/Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-ghana-yellow-subtle via-primary/20 to-ghana-green-subtle">
        {provider.avatar ? (
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-black">
              {provider.name.charAt(0)}
            </div>
          </div>
        )}
        {provider.verified && (
          <div className="absolute top-3 right-3">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg">
              <CheckCircle className="h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
        )}
        {provider.availability === "Available Now" && (
          <div className="absolute top-3 left-3">
            <span className="bg-ghana-green text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Clock className="h-3 w-3" />
              Available Now
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {provider.category}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-semibold text-gray-900 dark:text-white">
              {provider.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({provider.reviewCount} reviews)
          </span>
          {provider.completionRate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • {Math.round(provider.completionRate * 100)}% completion
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {provider.location}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {provider.description}
        </p>

        {/* Quick Slots */}
        {provider.quickSlots && provider.quickSlots.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quick Book:
            </p>
            <div className="flex flex-wrap gap-2">
              {provider.quickSlots.slice(0, 3).map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onBook(provider)}
                  className="text-xs px-2 py-1 rounded-lg bg-ghana-yellow-subtle hover:bg-ghana-yellow-light text-gray-700 dark:text-gray-300 transition-colors border border-ghana-yellow/20"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBook(provider)}
            className="flex-1 min-h-[44px]"
          >
            Book Now
          </Button>
          {provider.whatsapp && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="px-3 min-h-[44px] min-w-[44px]"
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
              className="px-3 min-h-[44px] min-w-[44px]"
              title="Call"
            >
              <Phone className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewProfile(provider)}
          className="w-full mt-2 min-h-[44px]"
        >
          View Profile
        </Button>
      </div>
    </motion.div>
  )
}

