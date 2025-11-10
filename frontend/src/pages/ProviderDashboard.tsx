import { useState, useMemo, useEffect, useRef } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, Star, TrendingUp, Settings, 
  CheckCircle, Clock, Upload, Phone, MessageCircle, Filter,
  DollarSign, GitBranch, Wrench, Users, Moon, Sun
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { useBookings } from '../hooks/useBookings'
import ProtectedRoute from '../components/ProtectedRoute'
import Button from '../components/ui/Button'
import { cn } from '../lib/utils'
// Mock data removed
import type { ServiceCategory, GhanaCity } from '../types'
import FinanceManagement from '../components/FinanceManagement'
import WorkflowManagement from '../components/WorkflowManagement'
import ServicesManagement from '../components/ServicesManagement'
import CustomerManagement from '../components/CustomerManagement'
import ProviderBusinessTools from '../components/ProviderBusinessTools'
import PremiumListing from '../components/PremiumListing'
import ProviderReviewsManagement from '../components/ProviderReviewsManagement'

function DashboardContent() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const socket = useWebSocket()
  const navigate = useNavigate()
  const { bookings, loading, updateBookingStatus } = useBookings()
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'analytics' | 'finance' | 'workflow' | 'services' | 'reviews' | 'customers' | 'business' | 'premium' | 'profile' | 'settings'>('overview')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [autoConfirmBookings, setAutoConfirmBookings] = useState(false)
  const [providerAvatar, setProviderAvatar] = useState<string>('')
  const [providerName, setProviderName] = useState<string>(user?.name || '')

  // Map provider user ID to provider ID
  const providerIdMap: Record<string, string> = {
    'provider-1': '1',
    'provider-2': '2',
    'provider-3': '3',
  }
  const providerId = user?.id ? (providerIdMap[user.id] || user.id) : ''

  // Load provider data to get avatar
  useEffect(() => {
    const loadProvider = async () => {
      if (!providerId) {
        console.log('No providerId, skipping provider load')
        return
      }

      try {
        console.log('Loading provider data for ID:', providerId)
        const { providerService } = await import('../services/providerService')
        const provider = await providerService.getProviderById(providerId)
        
        console.log('Loaded provider:', { id: provider?.id, name: provider?.name, avatar: provider?.avatar })
        
        if (provider) {
          if (provider.avatar) {
            console.log('Setting provider avatar:', provider.avatar)
            setProviderAvatar(provider.avatar)
          } else {
            console.log('No avatar found for provider')
          }
          if (provider.name) {
            setProviderName(provider.name)
          }
        }
      } catch (error) {
        console.error('Failed to load provider data:', error)
      }
    }

    loadProvider()

    // Listen for provider updates
    const handleProviderUpdate = (event: CustomEvent) => {
      const updatedProvider = event.detail
      if (updatedProvider.avatar) {
        setProviderAvatar(updatedProvider.avatar)
      }
      if (updatedProvider.name) {
        setProviderName(updatedProvider.name)
      }
    }

    window.addEventListener('providerUpdated', handleProviderUpdate as EventListener)
    
    return () => {
      window.removeEventListener('providerUpdated', handleProviderUpdate as EventListener)
    }
  }, [providerId])

  // Load notification preferences from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('providerEmailNotifications')
    const savedSms = localStorage.getItem('providerSmsNotifications')
    const savedAuto = localStorage.getItem('autoConfirmBookings')
    if (savedEmail !== null) setEmailNotifications(savedEmail === 'true')
    if (savedSms !== null) setSmsNotifications(savedSms === 'true')
    if (savedAuto !== null) setAutoConfirmBookings(savedAuto === 'true')
  }, [])

  // WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket) return

    socket.on('new-booking', (newBooking: any) => {
      if (newBooking.providerId === providerId) {
        showToast(`New booking received: ${newBooking.serviceType}`, 'success', 4000)
        // Refresh bookings will happen via useBookings hook
      }
    })

    socket.on('booking-status-updated', (updatedBooking: any) => {
      if (updatedBooking.providerId === providerId) {
        showToast(`Booking status updated to ${updatedBooking.status}`, 'info', 3000)
        // Refresh bookings will happen via useBookings hook
      }
    })

    socket.on('provider-verified', (provider: any) => {
      if (provider.id === providerId) {
        showToast('Your account has been verified! 🎉', 'success', 5000)
      }
    })

    socket.on('provider-rejected', (provider: any) => {
      if (provider.id === providerId) {
        showToast('Your verification request was rejected. Please contact support.', 'error', 5000)
      }
    })

    return () => {
      socket.off('new-booking')
      socket.off('booking-status-updated')
      socket.off('provider-verified')
      socket.off('provider-rejected')
    }
  }, [socket, providerId, showToast])

  // Filter bookings for this provider
  const myBookings = useMemo(() => {
    if (!providerId) return []
    return bookings.filter(b => b.providerId === providerId)
  }, [bookings, providerId])

  // Filter by status
  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return myBookings
    return myBookings.filter(b => b.status.toLowerCase() === statusFilter.toLowerCase())
  }, [myBookings, statusFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = myBookings.length
    const completed = myBookings.filter(b => b.status === 'Completed').length
    const pending = myBookings.filter(b => b.status === 'Pending').length
    const confirmed = myBookings.filter(b => b.status === 'Confirmed').length
    const completionRate = total > 0 ? completed / total : 0
    
    // Calculate average rating (mock for now)
    const averageRating = 4.9
    const monthlyBookings = myBookings.filter(b => {
      const bookingDate = new Date(b.date)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear()
    }).length

    return {
      totalBookings: total,
      completedBookings: completed,
      pendingBookings: pending,
      confirmedBookings: confirmed,
      completionRate,
      averageRating,
      monthlyBookings,
      revenue: completed * 150 // Mock revenue calculation
    }
  }, [myBookings])

  const getCustomerInfo = (userId: string): any => {
    return null // TODO: Fetch from usersApi.getById(userId)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase()
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
    return styles[statusUpper as keyof typeof styles] || styles.PENDING
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              {/* Provider Avatar */}
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-black overflow-hidden flex-shrink-0">
                {providerAvatar ? (
                  <img src={providerAvatar} alt={providerName} className="w-full h-full object-cover" />
                ) : (
                  (providerName || user?.name || 'P').charAt(0)
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Provider Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {providerName || user?.name} • {stats.pendingBookings} pending bookings
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Quick Availability Toggle */}
              <div className="flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isAvailable ? 'Available Now' : 'Not Available'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsAvailable(!isAvailable)
                    // TODO: Update provider availability in backend
                    // providersApi.update(providerId, { availability: isAvailable ? 'Available Soon' : 'Available Now' })
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isAvailable ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  )}
                  role="switch"
                  aria-checked={isAvailable}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                    isAvailable ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full sm:w-auto">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'finance', label: 'Finance', icon: DollarSign },
                { id: 'workflow', label: 'Workflow', icon: GitBranch },
                { id: 'services', label: 'Services', icon: Wrench },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'business', label: 'Business Tools', icon: DollarSign },
                { id: 'premium', label: 'Premium', icon: Star },
                { id: 'analytics', label: 'Analytics', icon: Star },
                { id: 'profile', label: 'Profile', icon: Settings },
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
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'blue' },
                    { label: 'Completed', value: stats.completedBookings, icon: CheckCircle, color: 'green' },
                    { label: 'Pending', value: stats.pendingBookings, icon: Clock, color: 'yellow' },
                    { label: 'This Month', value: stats.monthlyBookings, icon: TrendingUp, color: 'purple' }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        <stat.icon className={cn("h-5 w-5", `text-${stat.color}-500`)} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Bookings
                  </h2>
                  {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading...</p>
                  ) : myBookings.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No bookings yet</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {myBookings.slice(0, 5).map((booking) => {
                          const customer = getCustomerInfo(booking.userId)
                          return (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {customer?.name || 'Customer'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {booking.serviceType} • {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                </p>
                              </div>
                              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(booking.status))}>
                                {booking.status}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      {myBookings.length > 5 && (
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => setActiveTab('bookings')}
                        >
                          View All Bookings ({myBookings.length})
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    All Bookings ({myBookings.length})
                  </h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading bookings...</p>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {statusFilter === 'all' ? 'No bookings yet' : `No ${statusFilter} bookings found`}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {statusFilter === 'all' 
                        ? 'Your bookings will appear here once customers start booking your services.'
                        : 'Try selecting a different status filter.'}
                    </p>
                    {statusFilter !== 'all' && (
                      <Button variant="outline" onClick={() => setStatusFilter('all')}>
                        Show All Bookings
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                      const customer = getCustomerInfo(booking.userId)
                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-black">
                                  {customer?.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {customer?.name || 'Customer'}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {booking.serviceType}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusBadge(booking.status))}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString('en-GH', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                              <strong>Customer Notes:</strong> {booking.notes}
                            </p>
                          )}
                          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                            {booking.status === 'Pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={async () => {
                                    try {
                                      await updateBookingStatus(booking.id, 'Confirmed')
                                    } catch (error) {
                                      alert('Failed to confirm booking')
                                    }
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to cancel this booking?')) {
                                      try {
                                        await updateBookingStatus(booking.id, 'Cancelled')
                                      } catch (error) {
                                        alert('Failed to cancel booking')
                                      }
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-700 border-red-300"
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === 'Confirmed' && (
                              <Button 
                                size="sm" 
                                onClick={async () => {
                                  try {
                                    await updateBookingStatus(booking.id, 'Completed')
                                  } catch (error) {
                                    alert('Failed to mark as completed')
                                  }
                                }}
                              >
                                Mark Complete
                              </Button>
                            )}
                            {customer?.phone && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => window.location.href = `tel:${customer.phone}`}
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  Call
                                </Button>
                                {customer.phone && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => window.open(`https://wa.me/${customer.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    WhatsApp
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FinanceManagement providerId={providerId} />
              </motion.div>
            )}

            {activeTab === 'workflow' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <WorkflowManagement providerId={providerId} />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ServicesManagement providerId={providerId} />
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProviderReviewsManagement providerId={providerId} />
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CustomerManagement providerId={providerId} />
              </motion.div>
            )}

            {activeTab === 'business' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProviderBusinessTools />
              </motion.div>
            )}

            {activeTab === 'premium' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PremiumListing providerId={providerId} currentTier="FREE" />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Performance Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completion Rate</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${stats.completionRate * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {Math.round(stats.completionRate * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.averageRating}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ({stats.totalBookings} reviews)
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        GHS {stats.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">This Month's Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.monthlyBookings}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Edit Profile
                </h2>
                <ProfileEditForm />
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
                        onClick={() => {
                          const confirmed = window.confirm('Are you sure you want to change your password?')
                          if (confirmed) {
                            alert('Password change feature coming soon!')
                          }
                        }}
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
                            Receive email updates about new bookings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => {
                              setEmailNotifications(e.target.checked)
                              localStorage.setItem('providerEmailNotifications', String(e.target.checked))
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                            emailNotifications 
                              ? 'bg-primary' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          } after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                            emailNotifications ? 'after:left-[22px]' : 'after:left-[2px]'
                          }`}></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            SMS Notifications
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Receive SMS updates about bookings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={smsNotifications}
                            onChange={(e) => {
                              setSmsNotifications(e.target.checked)
                              localStorage.setItem('providerSmsNotifications', String(e.target.checked))
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                            smsNotifications 
                              ? 'bg-primary' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          } after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                            smsNotifications ? 'after:left-[22px]' : 'after:left-[2px]'
                          }`}></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            Auto-Confirm Bookings
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Automatically confirm new bookings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoConfirmBookings}
                            onChange={(e) => {
                              setAutoConfirmBookings(e.target.checked)
                              localStorage.setItem('autoConfirmBookings', String(e.target.checked))
                            }}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer transition-colors ${
                            autoConfirmBookings 
                              ? 'bg-primary' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          } after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                            autoConfirmBookings ? 'after:left-[22px]' : 'after:left-[2px]'
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
    </div>
  )
}

function ProfileEditForm() {
  const { user } = useAuth()
  
  // Map provider user ID to provider ID (same as in DashboardContent)
  const providerIdMap: Record<string, string> = {
    'provider-1': '1',
    'provider-2': '2',
    'provider-3': '3',
  }
  const providerId = user?.id ? (providerIdMap[user.id] || user.id) : ''

  const [formData, setFormData] = useState({
    name: 'Bis FagQ',
    category: 'Electrician',
    location: 'Cape Coast',
    description: 'Expert in electrical appliances and home wiring.',
    phone: '+233241234567',
    whatsapp: '+233241234567',
    serviceAreas: ['Cape Coast', 'Elmina', 'Saltpond'],
    skills: ['Wiring', 'Appliance Repair', 'Panel Installation']
  })
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load provider data when component mounts
  useEffect(() => {
    const loadProvider = async () => {
      if (!providerId) {
        setLoading(false)
        return
      }

      try {
        const { providerService } = await import('../services/providerService')
        const provider = await providerService.getProviderById(providerId)
        
        if (provider) {
          setFormData({
            name: provider.name || 'Bis FagQ',
            category: provider.category || 'Electrician',
            location: provider.location || 'Cape Coast',
            description: provider.description || 'Expert in electrical appliances and home wiring.',
            phone: provider.phone || '+233241234567',
            whatsapp: provider.whatsapp || provider.phone || '+233241234567',
            serviceAreas: (provider as any).serviceAreas || ['Cape Coast', 'Elmina', 'Saltpond'],
            skills: (provider as any).skills || ['Wiring', 'Appliance Repair', 'Panel Installation']
          })
          // Load existing avatar if available
          if (provider.avatar) {
            setAvatarUrl(provider.avatar)
          }
        }
      } catch (error) {
        console.error('Failed to load provider data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProvider()
  }, [providerId])

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or GIF)')
      return
    }

    // Validate file size (max 2MB as shown in UI)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 2MB.')
      return
    }

    setUploading(true)
    try {
      console.log('Uploading file:', { name: file.name, size: file.size, type: file.type })
      const { uploadApi } = await import('../lib/api')
      const result = await uploadApi.uploadImage(file, 'providers')
      console.log('Upload result:', result)
      setAvatarUrl(result.url)
      alert('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error?.message || 'Failed to upload image. Please try again.'
      alert(errorMessage)
    } finally {
      setUploading(false)
      // Reset file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!providerId) {
      alert('Provider ID not found. Please ensure you are logged in as a provider.')
      return
    }

    try {
      const { providerService } = await import('../services/providerService')
      const updatedProvider = await providerService.updateProvider(providerId, { 
        ...formData, 
        category: formData.category as ServiceCategory,
        location: formData.location as GhanaCity,
        avatar: avatarUrl 
      })
      
      // Update local state with the returned provider data (including avatar)
      if (updatedProvider.avatar) {
        setAvatarUrl(updatedProvider.avatar)
        console.log('Profile updated with avatar:', updatedProvider.avatar)
      } else {
        console.warn('Profile updated but no avatar in response:', updatedProvider)
      }
      
      // Dispatch event to notify other components (like Home page) to refresh
      // Do this BEFORE the page reload so other tabs/pages can refresh
      console.log('Dispatching providerUpdated event...')
      window.dispatchEvent(new CustomEvent('providerUpdated', { 
        detail: updatedProvider 
      }))
      
      // Also dispatch a storage event for cross-tab communication
      localStorage.setItem('providerUpdated', JSON.stringify({
        providerId: updatedProvider.id,
        timestamp: Date.now()
      }))
      
      alert('Profile updated successfully! The page will refresh to show your updated photo.')
      
      // Reload the page to refresh provider cards with updated avatar
      // Give backend a moment to process
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error('Profile update error:', error)
      const errorMessage = error?.message || 'Failed to update profile. Please try again.'
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-black overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            formData.name.charAt(0)
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button 
            variant="outline" 
            type="button" 
            size="sm" 
            disabled={uploading}
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            JPG, PNG or GIF. Max size 2MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Cleaner</option>
            <option>Handyman</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Accra</option>
            <option>Kumasi</option>
            <option>Cape Coast</option>
            <option>Takoradi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline">Cancel</Button>
      </div>
    </form>
  )
}

export default function ProviderDashboard() {
  return (
    <ProtectedRoute requireProvider>
      <DashboardContent />
    </ProtectedRoute>
  )
}

