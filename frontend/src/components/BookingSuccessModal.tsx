import { CheckCircle, Calendar, Clock, MessageCircle, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Provider } from '../types'
import Button from './ui/Button'

interface BookingSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  provider: Provider | null
  bookingDetails: {
    date: string
    time: string
    notes?: string
  } | null
  onViewDashboard?: () => void
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  provider,
  bookingDetails,
  onViewDashboard
}: BookingSuccessModalProps) {
  if (!provider || !bookingDetails) return null

  const handleWhatsApp = () => {
    if (provider.whatsapp) {
      const message = encodeURIComponent(
        `Hi ${provider.name}! I just booked your ${provider.category} service on HandyGhana for ${new Date(bookingDetails.date).toLocaleDateString()} at ${bookingDetails.time}. Looking forward to working with you!`
      )
      window.open(`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
    }
  }

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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto mb-6"
              >
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your booking with <strong>{provider.name}</strong> has been confirmed.
                </p>
              </motion.div>

              {/* Booking Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(bookingDetails.date).toLocaleDateString('en-GH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingDetails.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Service</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {provider.category}
                  </span>
                </div>
              </motion.div>

              {/* Provider Contact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {provider.name} will reach out to confirm. You can also contact them directly:
                </p>
                <div className="flex gap-2">
                  {provider.whatsapp && (
                    <Button
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                  {provider.phone && (
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `tel:${provider.phone}`}
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-3"
              >
                {onViewDashboard && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onViewDashboard()
                      onClose()
                    }}
                    className="flex-1"
                  >
                    View Dashboard
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

