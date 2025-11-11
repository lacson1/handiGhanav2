import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Star, CheckCircle, 
  X, FileText, User, Users, Repeat, Settings, Moon, Sun, Gift, RotateCcw
} from 'lucide-react'
import SubscriptionManagement from '../components/SubscriptionManagement'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { useBookings } from '../hooks/useBookings'
import ProtectedRoute from '../components/ProtectedRoute'
import Button from '../components/ui/Button'
import ReviewModal from '../components/ReviewModal'
import HowItWorks from '../components/HowItWorks'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import BookingModal from '../components/BookingModal'
import ProfilePhotoUpload from '../components/ProfilePhotoUpload'
import ReferralProgram from '../components/ReferralProgram'
import BookingTracking from '../components/BookingTracking'
import { bookingsApi } from '../lib/api'
import type { Provider } from '../types'
import { cn } from '../lib/utils'

// Mock bookings data
const mockBookings = [
  {
    id: 'b-001',
    providerId: 'pt-001',
    providerName: 'Bis FagQ',
    providerCategory: 'Electrician',
    date: '2024-01-20',
    time: '2:00 PM',
    serviceType: 'Electrical Repair',
    status: 'COMPLETED',
    notes: 'Fix kitchen wiring',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'b-002',
    providerId: 'pt-002',
    providerName: 'Ama Brown',
    providerCategory: 'Cleaner',
    date: '2024-01-22',
    time: '10:00 AM',
    serviceType: 'Deep Cleaning',
    status: 'CONFIRMED',
    notes: 'Full house cleaning',
    createdAt: '2024-01-18T14:30:00Z'
  },
  {
    id: 'b-003',
    providerId: 'pt-003',
    providerName: 'Kwame Mensah',
    providerCategory: 'Plumber',
    date: '2024-01-25',
    time: '3:00 PM',
    serviceType: 'Leak Repair',
    status: 'PENDING',
    notes: 'Fix bathroom leak',
    createdAt: '2024-01-19T09:00:00Z'
  }
]

function CustomerDashboardContent() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const socket = useWebSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const { bookings: userBookings } = useBookings()
  const [activeTab, setActiveTab] = useState<'bookings' | 'providers' | 'subscriptions' | 'reviews' | 'referrals' | 'profile' | 'settings'>('bookings')
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState<string | null>(null)
  const [bookings, setBookings] = useState(mockBookings)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  useEffect(() => {
    loadBookings()
    // Load notification preferences from localStorage
    const savedEmail = localStorage.getItem('emailNotifications')
    const savedSms = localStorage.getItem('smsNotifications')
    if (savedEmail !== null) setEmailNotifications(savedEmail === 'true')
    if (savedSms !== null) setSmsNotifications(savedSms === 'true')
  }, [])

  // WebSocket listeners for real-time booking updates
  useEffect(() => {
    if (!socket) return

    socket.on('booking-status-updated', (updatedBooking: any) => {
      if (updatedBooking.userId === user?.id) {
        setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
        showToast(`Your booking status has been updated to ${updatedBooking.status}`, 'info', 4000)
      }
    })

    socket.on('booking-created', (newBooking: any) => {
      if (newBooking.userId === user?.id) {
        setBookings(prev => [newBooking, ...prev])
        showToast('New booking created successfully!', 'success', 3000)
      }
    })

    return () => {
      socket.off('booking-status-updated')
      socket.off('booking-created')
    }
  }, [socket, user?.id, showToast])

  // Sync bookings from useBookings hook
  useEffect(() => {
    if (userBookings.length > 0) {
      // Convert Booking type to the format used in this component
      const formattedBookings = userBookings.map(booking => {
        const provider: any = null // Will be fetched from API
        return {
          id: booking.id,
          providerId: booking.providerId,
          providerName: provider?.name || 'Unknown Provider',
          providerCategory: provider?.category || 'Unknown',
          date: booking.date,
          time: booking.time,
          serviceType: booking.serviceType,
          status: booking.status.toUpperCase(),
          notes: booking.notes || '',
          createdAt: booking.createdAt
        }
      })
      setBookings(formattedBookings)
    }
  }, [userBookings])

  // Handle hash-based navigation
  useEffect(() => {
    if (location.hash === '#providers') {
      setActiveTab('providers')
      setTimeout(() => {
        const element = document.getElementById('providers-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.replaceState(null, '', '/my-bookings')
        }
      }, 100)
    } else if (location.hash === '#how-it-works') {
      setTimeout(() => {
        const element = document.getElementById('how-it-works')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.replaceState(null, '', '/my-bookings')
        }
      }, 100)
    }
  }, [location.hash])

  const loadBookings = async () => {
    try {
      // TODO: Get userId from auth
      const data = await bookingsApi.getAll({ userId: 'current-user-id' })
      if (data && data.length > 0) {
        setBookings(data)
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsApi.updateStatus(bookingId, 'CANCELLED')
        await loadBookings()
        alert('Booking cancelled successfully')
      } catch (error) {
        alert('Failed to cancel booking')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return styles[status as keyof typeof styles] || styles.PENDING
  }

  const handleWriteReview = (booking: any) => {
    setSelectedBooking(booking)
    setIsReviewModalOpen(true)
  }

  const handleRebook = (booking: any) => {
    const provider: any = null // Will be fetched from API
    if (provider) {
      setSelectedProvider(provider)
      // Pre-fill booking details for rebooking
      setSelectedBooking({
        ...booking,
        rebookMode: true,
        defaultService: booking.serviceType,
        defaultDate: booking.date,
        defaultTime: booking.time,
        defaultNotes: booking.notes
      })
      setIsBookingModalOpen(true)
    }
  }

  // Get unique providers from bookings
  const myProviders = useMemo(() => {
    const providerMap = new Map<string, { provider: Provider; bookingCount: number; lastBooking: string }>()
    
    // Use real bookings if available, otherwise use mock
    const allBookings = userBookings.length > 0 ? userBookings : bookings
    
    allBookings.forEach(booking => {
      const provider: any = null // Will be fetched from API
      if (provider) {
        const existing = providerMap.get(provider.id)
        if (existing) {
          existing.bookingCount++
          if (new Date(booking.date) > new Date(existing.lastBooking)) {
            existing.lastBooking = booking.date
          }
        } else {
          providerMap.set(provider.id, {
            provider,
            bookingCount: 1,
            lastBooking: booking.date
          })
        }
      }
    })
    
    return Array.from(providerMap.values())
      .sort((a, b) => new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime())
  }, [userBookings, bookings])

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED')
  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                onClick={() => navigate('/')}
              >
                Find Providers
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'bookings', label: 'My Bookings', icon: Calendar },
                { id: 'providers', label: 'My Providers', icon: Users, badge: myProviders.length },
                { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
                { id: 'reviews', label: 'My Reviews', icon: Star },
                { id: 'referrals', label: 'Referrals', icon: Gift },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary text-black font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Stats */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Bookings</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{upcomingBookings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{completedBookings.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Upcoming Bookings */}
                {upcomingBookings.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Upcoming Bookings
                    </h2>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {booking.providerName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.providerCategory} • {booking.serviceType}
                              </p>
                            </div>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(booking.status))}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString('en-GH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <FileText className="h-4 w-4 inline mr-1" />
                              {booking.notes}
                            </p>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBookingForTracking(booking.id)}
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Track Booking
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/provider/${booking.providerId}`)}
                            >
                              View Provider
                            </Button>
                            {booking.status === 'PENDING' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Bookings */}
                {completedBookings.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Completed Bookings
                    </h2>
                    <div className="space-y-4">
                      {completedBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {booking.providerName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.providerCategory} • {booking.serviceType}
                              </p>
                            </div>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(booking.status))}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString('en-GH')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => handleRebook(booking)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Rebook
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWriteReview(booking)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Write Review
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/provider/${booking.providerId}`)}
                            >
                              View Provider
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bookings.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Start by browsing our verified service providers and book your first service
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Browse Providers
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'providers' && (
              <motion.div
                id="providers-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Providers You've Booked With
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {myProviders.length} {myProviders.length === 1 ? 'provider' : 'providers'}
                      </p>
                    </div>
                    <Button onClick={() => navigate('/')}>
                      Find More Providers
                    </Button>
                  </div>

                  {myProviders.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No providers yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start booking services to see your providers here
                      </p>
                      <Button onClick={() => navigate('/')}>
                        Browse Providers
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProviders.map(({ provider, bookingCount, lastBooking }) => (
                        <motion.div
                          key={provider.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            {provider.avatar ? (
                              <img
                                src={provider.avatar}
                                alt={provider.name}
                                className="h-16 w-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-black">
                                {provider.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                  {provider.name}
                                </h3>
                                {provider.verified && (
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {provider.category}
                              </p>
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {provider.rating.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  ({provider.reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Bookings</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {bookingCount} {bookingCount === 1 ? 'time' : 'times'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Last booking</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {new Date(lastBooking).toLocaleDateString('en-GH', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{provider.location}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedProvider(provider)
                                setIsDrawerOpen(true)
                              }}
                              className="flex-1"
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProvider(provider)
                                setIsBookingModalOpen(true)
                              }}
                              className="flex-1"
                            >
                              <Repeat className="h-4 w-4 mr-1" />
                              Book Again
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'subscriptions' && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SubscriptionManagement userId={user.id} />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  My Reviews
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Your reviews will appear here
                </p>
              </motion.div>
            )}

            {activeTab === 'referrals' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ReferralProgram />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  My Profile
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Profile Photo
                    </label>
                    <ProfilePhotoUpload
                      currentAvatar={user?.avatar}
                      size="lg"
                      onUpdate={(avatarUrl) => {
                        // Update local user state
                        const updatedUser = { ...user, avatar: avatarUrl }
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                        window.location.reload()
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Settings
                </h2>
                <div className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {theme === 'light' ? (
                        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Theme
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {theme === 'light' ? 'Light mode' : 'Dark mode'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Switch to Dark
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Switch to Light
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Account Settings */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Account
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setActiveTab('profile')}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/settings')}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Preferences
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            Email Notifications
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Receive email updates about your bookings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => {
                              setEmailNotifications(e.target.checked)
                              localStorage.setItem('emailNotifications', String(e.target.checked))
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                            emailNotifications 
                              ? 'bg-primary' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                            emailNotifications ? 'after:translate-x-full' : 'after:translate-x-0'
                          }`}></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            SMS Notifications
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Receive SMS updates about your bookings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={smsNotifications}
                            onChange={(e) => {
                              setSmsNotifications(e.target.checked)
                              localStorage.setItem('smsNotifications', String(e.target.checked))
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                            smsNotifications 
                              ? 'bg-primary' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                            smsNotifications ? 'after:translate-x-full' : 'after:translate-x-0'
                          }`}></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-red-200 dark:border-red-900/30">
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 dark:text-red-400 dark:border-red-800"
                        onClick={() => {
                          const confirmed = window.confirm(
                            'Are you sure you want to delete your account? This action cannot be undone.'
                          )
                          if (confirmed) {
                            alert('Account deletion feature coming soon!')
                          }
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedBooking(null)
          }}
          providerId={selectedBooking.providerId}
          providerName={selectedBooking.providerName}
          bookingId={selectedBooking.id}
          onSuccess={() => {
            loadBookings()
          }}
        />
      )}

      {/* Provider Details Drawer */}
      <ProviderDetailsDrawer
        provider={selectedProvider}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedProvider(null)
        }}
        onBook={(provider) => {
          setSelectedProvider(provider)
          setIsDrawerOpen(false)
          setIsBookingModalOpen(true)
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        provider={selectedProvider}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedProvider(null)
        }}
        onConfirm={(booking) => {
          // Booking confirmed
          setIsBookingModalOpen(false)
          setSelectedProvider(null)
          loadBookings()
        }}
      />

      {/* Booking Tracking Modal */}
      {selectedBookingForTracking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Booking Tracking
                </h2>
                <button
                  onClick={() => setSelectedBookingForTracking(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <BookingTracking
                bookingId={selectedBookingForTracking}
                provider={undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CustomerDashboard() {
  return (
    <ProtectedRoute>
      <CustomerDashboardContent />
    </ProtectedRoute>
  )
}

