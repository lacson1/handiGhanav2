import { useState, useEffect } from 'react'
import { Clock, MapPin, CheckCircle, Phone, MessageCircle, XCircle } from 'lucide-react'
import type { Booking } from '../types'
import { bookingsApi } from '../lib/api'
import Button from './ui/Button'

interface BookingTrackingProps {
  bookingId: string
  provider?: {
    name: string
    phone?: string
    whatsapp?: string
  }
}

type TrackingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

interface TrackingStep {
  status: TrackingStatus
  label: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

export default function BookingTracking({ bookingId, provider }: BookingTrackingProps) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null)

  useEffect(() => {
    loadBooking()
    // Poll for updates every 30 seconds
    const interval = setInterval(loadBooking, 30000)
    return () => clearInterval(interval)
  }, [bookingId])

  const loadBooking = async () => {
    try {
      const data = await bookingsApi.getById(bookingId)
      setBooking(data)
      
      // Calculate estimated arrival if confirmed
      if (data.status === 'Confirmed' && data.date && data.time) {
        const bookingDateTime = new Date(`${data.date}T${data.time}`)
        const now = new Date()
        const diff = bookingDateTime.getTime() - now.getTime()
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          if (hours > 0) {
            setEstimatedArrival(`${hours}h ${minutes}m`)
          } else {
            setEstimatedArrival(`${minutes}m`)
          }
        } else {
          setEstimatedArrival('Overdue')
        }
      }
    } catch (error) {
      console.error('Failed to load booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrackingSteps = (): TrackingStep[] => {
    const status = booking?.status.toLowerCase() as TrackingStatus || 'pending'
    
    return [
      {
        status: 'pending',
        label: 'Booking Requested',
        description: 'Your booking request has been sent',
        icon: <Clock className="h-5 w-5" />,
        completed: ['pending', 'confirmed', 'in_progress', 'completed'].includes(status)
      },
      {
        status: 'confirmed',
        label: 'Confirmed',
        description: 'Provider has confirmed your booking',
        icon: <CheckCircle className="h-5 w-5" />,
        completed: ['confirmed', 'in_progress', 'completed'].includes(status)
      },
      {
        status: 'in_progress',
        label: 'In Progress',
        description: 'Provider is on the way or working',
        icon: <MapPin className="h-5 w-5" />,
        completed: ['in_progress', 'completed'].includes(status)
      },
      {
        status: 'completed',
        label: 'Completed',
        description: 'Service has been completed',
        icon: <CheckCircle className="h-5 w-5" />,
        completed: status === 'completed'
      }
    ]
  }

  const steps = getTrackingSteps()
  const currentStepIndex = steps.findIndex(s => s.completed && !steps[steps.indexOf(s) + 1]?.completed)
  const activeStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading booking details...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-900 dark:text-white font-semibold mb-2">Booking not found</p>
        <p className="text-gray-500 dark:text-gray-400">Unable to load booking details</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Tracking
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Service: {booking.serviceType}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <div className="relative">
          {steps.map((step, index) => (
            <div key={step.status} className="relative pb-8 last:pb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-full ${
                    step.completed ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
              
              {/* Step Content */}
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-primary text-white'
                      : index === activeStepIndex
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p
                    className={`font-semibold ${
                      step.completed || index === activeStepIndex
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                  {index === activeStepIndex && estimatedArrival && (
                    <p className="text-xs text-primary mt-1 font-medium">
                      Estimated arrival: {estimatedArrival}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {new Date(booking.date).toLocaleDateString('en-GH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
          <span className="font-semibold text-gray-900 dark:text-white">{booking.time}</span>
        </div>
        {booking.notes && (
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Notes</span>
            <p className="text-sm text-gray-900 dark:text-white mt-1">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Provider Contact */}
      {provider && (
        <div className="flex gap-3">
          {provider.phone && (
            <Button
              variant="outline"
              onClick={() => window.location.href = `tel:${provider.phone}`}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Provider
            </Button>
          )}
          {provider.whatsapp && (
            <Button
              variant="outline"
              onClick={() => {
                const message = encodeURIComponent(`Hi ${provider.name}, I have a booking with you. Can you confirm the details?`)
                const whatsappNumber = (provider.whatsapp || '').replace(/[^0-9]/g, '')
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
              }}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
        </div>
      )}

      {/* Status Badge */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Current Status</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'Completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : booking.status === 'Confirmed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : booking.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  )
}

