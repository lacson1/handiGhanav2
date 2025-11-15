import { useState, useEffect, useCallback } from 'react'
import { X, Clock, DollarSign, Repeat, Gift, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Provider, Service } from '../types'
import Button from './ui/Button'
import PaymentModal from './PaymentModal'
import AvailabilityCalendar from './AvailabilityCalendar'
import { bookingsApi, servicesApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

interface BookingModalProps {
  provider: Provider | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (booking: { date: string; time: string; notes: string }) => void
  showPayment?: boolean
  defaultService?: Service
}

export default function BookingModal({ provider, isOpen, onClose, onConfirm, showPayment = false, defaultService }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateString, setSelectedDateString] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [notes, setNotes] = useState('')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState<string>('')
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [isFirstBooking, setIsFirstBooking] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const FIRST_BOOKING_DISCOUNT_PERCENT = 15 // Matches WELCOME15 banner
  const REFERRAL_DISCOUNT_PERCENT = 10

  const checkFirstBooking = useCallback(async () => {
    if (!user) return
    try {
      // ⚠️ SECURITY NOTE: This should be moved to backend!
      // Current implementation uses localStorage which can be manipulated by users.
      // TODO: Replace with backend API call: GET /api/users/:id/first-booking-status
      // Backend should track hasCompletedFirstBooking on User model
      const hasCompletedFirstBooking = localStorage.getItem(`firstBooking_${user.id}`) === 'true'
      setIsFirstBooking(!hasCompletedFirstBooking)
    } catch (error) {
      console.error('Failed to check first booking:', error)
    }
  }, [user])

  const loadServices = useCallback(async () => {
    if (!provider || !provider.id) return
    setLoadingServices(true)
    try {
      const data = await servicesApi.getAll({ providerId: provider.id, isActive: true })
      setServices(data as Service[])
      // Auto-select default service if provided, otherwise first service if only one available
      if (defaultService) {
        const foundService = data.find((s: Service) => s.id === defaultService.id)
        if (foundService) {
          setSelectedService(foundService as Service)
        }
      } else if (data.length === 1) {
        setSelectedService(data[0] as Service)
      }
    } catch (error) {
      console.error('Failed to load services:', error)
      setServices([])
    } finally {
      setLoadingServices(false)
    }
  }, [provider, defaultService])

  useEffect(() => {
    if (isOpen && provider && provider.id) {
      loadServices()
      checkFirstBooking()
      // Check for referral code in URL
      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get('ref')
      if (ref) {
        setReferralCode(ref)
      }
      // Set default service if provided
      if (defaultService) {
        setSelectedService(defaultService)
      }
    } else {
      // Reset form when modal closes
      setSelectedDate(null)
      setSelectedDateString('')
      setSelectedTime('')
      setSelectedService(null)
      setNotes('')
    }
  }, [isOpen, provider, defaultService, loadServices, checkFirstBooking])

  // Update date string when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateString(selectedDate.toISOString().split('T')[0])
    } else {
      setSelectedDateString('')
    }
  }, [selectedDate])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime('') // Reset time when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleQuickBook = async () => {
    // Quick book after time selection - create booking immediately
    if (!selectedDateString || !selectedTime || !provider) {
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert('Please sign in to create a booking. You will be redirected to the sign in page.')
      window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    try {
      // Create booking via API
      const booking = await bookingsApi.create({
        providerId: provider.id,
        serviceId: selectedService?.id || 'custom',
        date: selectedDateString,
        time: selectedTime,
        serviceType: selectedService?.name || `${provider.category} - Custom Quote`,
        notes: notes.trim() || 'Quick booking'
      })

      setCreatedBookingId(booking.id)

      if (showPayment) {
        setIsPaymentOpen(true)
      } else {
        onConfirm({
          date: selectedDateString,
          time: selectedTime,
          notes: notes.trim() || 'Quick booking'
        })
        setSelectedDate(null)
        setSelectedDateString('')
        setSelectedTime('')
        setSelectedService(null)
        setNotes('')
        onClose()
      }
    } catch (error: unknown) {
      console.error('Booking creation error:', error)
      const err = error as { message?: string; details?: { message?: string } | string; statusCode?: number }
      let errorMessage = err?.message || 'Failed to create booking. Please try again.'

      if (err?.details) {
        if (typeof err.details === 'string') {
          errorMessage = err.details
        } else if (err.details.message) {
          errorMessage = err.details.message
        }
      }

      const statusCode = err?.statusCode
      if (statusCode === 401 || errorMessage.toLowerCase().includes('authentication') || errorMessage.toLowerCase().includes('sign in')) {
        alert(errorMessage + '\n\nYou will be redirected to the sign in page.')
        window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname)
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert('Please sign in to create a booking. You will be redirected to the sign in page.')
      window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    if (selectedDateString && selectedTime && provider) {
      try {
        // Create booking via API
        // If no service selected, use custom service with provider's category
        const booking = await bookingsApi.create({
          providerId: provider.id,
          serviceId: selectedService?.id || 'custom',
          date: selectedDateString,
          time: selectedTime,
          serviceType: selectedService?.name || `${provider.category} - Custom Quote`,
          notes: notes.trim()
        })

        setCreatedBookingId(booking.id)

        if (showPayment) {
          setIsPaymentOpen(true)
        } else {
          onConfirm({
            date: selectedDateString,
            time: selectedTime,
            notes: notes.trim()
          })
          setSelectedDate(null)
          setSelectedDateString('')
          setSelectedTime('')
          setSelectedService(null)
          setNotes('')
          onClose()
        }
      } catch (error: unknown) {
        console.error('Booking creation error:', error)
        // Show the actual error message from the API
        const err = error as { message?: string; details?: { message?: string } | string; statusCode?: number }
        let errorMessage = err?.message || 'Failed to create booking. Please try again.'

        if (err?.details) {
          if (typeof err.details === 'string') {
            errorMessage = err.details
          } else if (err.details.message) {
            errorMessage = err.details.message
          }
        }

        // If it's an authentication error, redirect to sign in
        const statusCode = err?.statusCode
        if (statusCode === 401 || errorMessage.toLowerCase().includes('authentication') || errorMessage.toLowerCase().includes('sign in')) {
          alert(errorMessage + '\n\nYou will be redirected to the sign in page.')
          window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname)
        } else {
          alert(errorMessage)
        }
      }
    }
  }

  const getServicePrice = (service: Service) => {
    if (service.pricingModel === 'pay-as-you-go') {
      return service.basePrice
    } else {
      return service.monthlyPrice || 0
    }
  }

  const calculateDiscount = (price: number) => {
    let discount = 0
    if (isFirstBooking) {
      discount += price * (FIRST_BOOKING_DISCOUNT_PERCENT / 100)
    }
    if (referralCode) {
      discount += price * (REFERRAL_DISCOUNT_PERCENT / 100)
    }
    return discount
  }

  const getFinalPrice = (service: Service) => {
    const basePrice = getServicePrice(service)
    const discount = calculateDiscount(basePrice)
    return Math.max(0, basePrice - discount)
  }

  const handlePaymentSuccess = () => {
    onConfirm({
      date: selectedDateString,
      time: selectedTime,
      notes: notes.trim()
    })
    setSelectedDate(null)
    setSelectedDateString('')
    setSelectedTime('')
    setNotes('')
    setIsPaymentOpen(false)
    onClose()
  }

  if (!provider) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Book with {provider.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {provider.category} • {provider.location}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Service Selection */}
                {loadingServices ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading services...</p>
                  </div>
                ) : services.length > 0 ? (
                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      Select Service *
                    </label>
                    <div className="space-y-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 transition-all text-left",
                            selectedService?.id === service.id
                              ? "border-primary bg-primary/10"
                              : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold ml-2 shrink-0",
                              service.pricingModel === 'pay-as-you-go'
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            )}>
                              {service.pricingModel === 'pay-as-you-go' ? (
                                <DollarSign className="h-3 w-3 inline mr-1" />
                              ) : (
                                <Repeat className="h-3 w-3 inline mr-1" />
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-base">
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
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>{service.duration} min</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {!selectedService && (
                      <p className="text-base text-red-600 dark:text-red-400 mt-2 font-medium">Please select a service</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Custom Quote Request
                        </p>
                        <p className="text-base text-blue-700 dark:text-blue-300 leading-relaxed">
                          This provider hasn't listed specific services yet. Your booking will be sent as a custom quote request. They'll contact you with pricing details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendar & Time Selection */}
                {provider && (
                  <AvailabilityCalendar
                    providerId={provider.id}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onTimeSelect={handleTimeSelect}
                    selectedTime={selectedTime}
                    onQuickBook={() => {
                      void handleQuickBook()
                    }}
                    showQuickBook={true}
                  />
                )}

                {/* Discount Banner */}
                {(isFirstBooking || referralCode) && selectedService && (
                  <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Special Discount Applied!
                      </p>
                    </div>
                    <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      {isFirstBooking && (
                        <p>🎉 First booking discount: {FIRST_BOOKING_DISCOUNT_PERCENT}% off</p>
                      )}
                      {referralCode && (
                        <p>🎁 Referral discount: {REFERRAL_DISCOUNT_PERCENT}% off</p>
                      )}
                      {selectedService && (
                        <p className="font-semibold mt-2">
                          Original: GHS {getServicePrice(selectedService).toLocaleString()} →
                          Final: GHS {getFinalPrice(selectedService).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe what you need..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}

      {provider && selectedService && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          bookingId={createdBookingId}
          amount={selectedService ? getServicePrice(selectedService) : 0}
          discount={selectedService ? calculateDiscount(getServicePrice(selectedService)) : 0}
          onSuccess={() => {
            if (isFirstBooking && user) {
              localStorage.setItem(`firstBooking_${user.id}`, 'true')
            }
            handlePaymentSuccess()
          }}
        />
      )}
    </AnimatePresence>
  )
}

