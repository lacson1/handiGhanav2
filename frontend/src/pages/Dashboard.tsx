import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBookings } from '../hooks/useBookings'
import { useProviders } from '../hooks/useProviders'
import { Calendar, Clock, CheckCircle, XCircle, Phone, MessageCircle, MapPin, Star, Filter } from 'lucide-react'
import Button from '../components/ui/Button'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { bookings, loading, updateBookingStatus } = useBookings()
  const { data: providers = [] } = useProviders()
  const [activeTab, setActiveTab] = useState<'bookings' | 'jobs'>('bookings')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Helper function to get provider by ID
  const getProviderById = (id: string) => {
    return providers.find((p: any) => p.id === id)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to view your dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access your bookings and manage your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/signin')}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const myBookings = user ? bookings.filter(b => b.userId === user.id) : []
  const myJobs = user ? bookings.filter(b => {
    // Map provider user IDs to provider IDs
    const providerIdMap: Record<string, string> = {
      'provider-1': '1',
      'provider-2': '2',
      'provider-3': '3',
    }
    const providerId = providerIdMap[user.id] || user.id
    return b.providerId === providerId
  }) : []

  // Filter bookings by status
  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return myBookings
    return myBookings.filter(b => b.status.toLowerCase() === statusFilter.toLowerCase())
  }, [myBookings, statusFilter])

  // Calculate stats
  const stats = useMemo(() => {
    const total = myBookings.length
    const pending = myBookings.filter(b => b.status === 'Pending').length
    const confirmed = myBookings.filter(b => b.status === 'Confirmed').length
    const completed = myBookings.filter(b => b.status === 'Completed').length
    return { total, pending, confirmed, completed }
  }, [myBookings])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
      case 'Confirmed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateBookingStatus(bookingId, 'Cancelled')
      } catch (error) {
        alert('Failed to cancel booking')
      }
    }
  }

  const handleContactProvider = (_providerId: string, phone?: string, whatsapp?: string) => {
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
    } else if (phone) {
      window.location.href = `tel:${phone}`
    }
  }

  const getProviderInfo = (providerId: string) => {
    return getProviderById(providerId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Cards */}
        {activeTab === 'bookings' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.confirmed}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            My Bookings ({myBookings.length})
          </button>
          {user?.role === 'PROVIDER' && (
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              My Jobs ({myJobs.length})
            </button>
          )}
        </div>

        {/* Filter */}
        {activeTab === 'bookings' && (
          <div className="mb-6 flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'bookings' ? (
              <div>
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {statusFilter === 'all' 
                        ? "You don't have any bookings yet."
                        : `No ${statusFilter} bookings found.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                      const provider = getProviderInfo(booking.providerId)
                      return (
                        <div
                          key={booking.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {booking.serviceType}
                                </h3>
                                {getStatusIcon(booking.status)}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status}
                                </span>
                              </div>
                              
                              {/* Provider Info */}
                              {provider && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-black">
                                      {provider.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {provider.name}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span>{provider.rating.toFixed(1)}</span>
                                        <span>•</span>
                                        <MapPin className="h-3 w-3" />
                                        <span>{provider.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
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
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                  <strong>Notes:</strong> {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {provider && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/provider/${provider.id}`)}
                                >
                                  View Provider
                                </Button>
                                {provider.whatsapp && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContactProvider(provider.id, provider.phone, provider.whatsapp)}
                                    title="WhatsApp"
                                  >
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    WhatsApp
                                  </Button>
                                )}
                                {provider.phone && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContactProvider(provider.id, provider.phone, provider.whatsapp)}
                                    title="Call"
                                  >
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                )}
                              </>
                            )}
                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                className="ml-auto text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {myJobs.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      You don't have any jobs yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {job.serviceType}
                              </h3>
                              {getStatusIcon(job.status)}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  job.status
                                )}`}
                              >
                                {job.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(job.date).toLocaleDateString('en-GH', { 
                                  weekday: 'short', 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.time}
                              </span>
                            </div>
                            {job.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <strong>Customer Notes:</strong> {job.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions for Provider */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                          {job.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await updateBookingStatus(job.id, 'Confirmed')
                                  } catch (error) {
                                    alert('Failed to confirm booking')
                                  }
                                }}
                              >
                                Confirm Booking
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (confirm('Are you sure you want to cancel this booking?')) {
                                    try {
                                      await updateBookingStatus(job.id, 'Cancelled')
                                    } catch (error) {
                                      alert('Failed to cancel booking')
                                    }
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {job.status === 'Confirmed' && (
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  await updateBookingStatus(job.id, 'Completed')
                                } catch (error) {
                                  alert('Failed to mark as completed')
                                }
                              }}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

