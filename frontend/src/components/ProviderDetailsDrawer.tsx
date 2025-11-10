import { useState, useEffect } from 'react'
import { X, Star, MapPin, CheckCircle, Clock, Phone, MessageCircle, Calendar, DollarSign, Repeat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Provider, Service } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'
import { servicesApi } from '../lib/api'

interface ProviderDetailsDrawerProps {
  provider: Provider | null
  isOpen: boolean
  onClose: () => void
  onBook: (provider: Provider) => void
}

export default function ProviderDetailsDrawer({ provider, isOpen, onClose, onBook }: ProviderDetailsDrawerProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)

  useEffect(() => {
    if (isOpen && provider?.id) {
      loadServices()
    }
  }, [isOpen, provider?.id])

  const loadServices = async () => {
    if (!provider?.id) return
    setLoadingServices(true)
    try {
      const data = await servicesApi.getAll({ providerId: provider.id, isActive: true })
      setServices(data as Service[])
    } catch (error) {
      console.error('Failed to load services:', error)
      setServices([])
    } finally {
      setLoadingServices(false)
    }
  }

  const handleWhatsApp = () => {
    if (provider?.whatsapp) {
      window.open(`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
    }
  }

  const handleCall = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && provider && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-black">
                        {provider.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {provider.name}
                        </h2>
                        {provider.verified && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.category}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onBook(provider)
                    onClose()
                  }}
                  className="flex-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
                {provider.whatsapp && (
                  <Button
                    variant="outline"
                    onClick={handleWhatsApp}
                    className="px-4"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                )}
                {provider.phone && (
                  <Button
                    variant="outline"
                    onClick={handleCall}
                    className="px-4"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Rating & Stats */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {provider.rating.toFixed(1)}
                  </span>
                </div>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reviews</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {provider.reviewCount}
                  </p>
                </div>
                {provider.completionRate && (
                  <>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {Math.round(provider.completionRate * 100)}%
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className={cn(
                  "font-semibold",
                  provider.availability === "Available Now"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                )}>
                  {provider.availability}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {provider.location}
                </span>
                {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    • Also serves: {provider.serviceAreas.join(', ')}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {provider.description}
                </p>
              </div>

              {/* Services */}
              {loadingServices ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading services...</p>
                </div>
              ) : services.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Available Services
                  </h3>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold ml-2",
                            service.pricingModel === 'pay-as-you-go'
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          )}>
                            {service.pricingModel === 'pay-as-you-go' ? (
                              <>
                                <DollarSign className="h-3 w-3 inline mr-1" />
                                Pay As You Go
                              </>
                            ) : (
                              <>
                                <Repeat className="h-3 w-3 inline mr-1" />
                                Subscription
                              </>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm mt-3">
                          {service.pricingModel === 'pay-as-you-go' ? (
                            <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-semibold">
                                GHS {service.basePrice.toLocaleString()}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">/visit</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-semibold">
                                GHS {service.monthlyPrice?.toLocaleString() || '0'}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">/{service.billingCycle || 'month'}</span>
                              {service.visitsPerPeriod ? (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                                  ({service.visitsPerPeriod} visits)
                                </span>
                              ) : (
                                <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                                  (Unlimited)
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>{service.duration} min</span>
                          </div>
                        </div>
                        {service.pricingModel === 'subscription' && service.subscriptionFeatures && service.subscriptionFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            {service.subscriptionFeatures.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                              >
                                {feature}
                              </span>
                            ))}
                            {service.subscriptionFeatures.length > 3 && (
                              <span className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                +{service.subscriptionFeatures.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Available Services
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No services available at the moment.
                  </p>
                </div>
              )}

              {/* Skills */}
              {provider.skills && provider.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-primary/20 text-gray-900 dark:text-white text-sm font-medium border border-primary/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Slots */}
              {provider.quickSlots && provider.quickSlots.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Quick Booking Slots
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {provider.quickSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onBook(provider)
                          onClose()
                        }}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {slot}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {(provider.phone || provider.whatsapp) && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    {provider.phone && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{provider.phone}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCall}
                        >
                          Call
                        </Button>
                      </div>
                    )}
                    {provider.whatsapp && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{provider.whatsapp}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleWhatsApp}
                        >
                          WhatsApp
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

