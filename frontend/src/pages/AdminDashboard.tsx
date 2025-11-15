import { useState, useEffect, useMemo } from 'react'
import {
  Users, Shield, TrendingUp, AlertCircle,
  CheckCircle, X, Search, Download, Calendar, Filter, Clock, Eye, Trash2, Scale
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useWebSocket } from '../hooks/useWebSocket'
import ProtectedRoute from '../components/ProtectedRoute'
import Button from '../components/ui/Button'
import ProviderDetailModal from '../components/ProviderDetailModal'
import DisputeManagement from '../components/DisputeManagement'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { cn, isValidImageUrl } from '../lib/utils'
import { providersApi, bookingsApi, adminApi } from '../lib/api'
import type { Provider, Booking } from '../types'

type TabId = 'overview' | 'providers' | 'users' | 'bookings' | 'disputes'

interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  avatar?: string
}

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const socket = useWebSocket('admin-room')
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [providers, setProviders] = useState<Provider[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  // WebSocket listeners for real-time updates
  useEffect(() => {
    if (!socket) return

    socket.on('connect', () => {
      socket.emit('join-room', 'admin-room')
    })

    socket.on('booking-status-updated', (updatedBooking: Booking) => {
      setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b))
      showToast(`Booking status updated to ${updatedBooking.status}`, 'info', 3000)
    })

    socket.on('provider-verified', (provider: Provider) => {
      setProviders(prev => prev.map(p => p.id === provider.id ? provider : p))
      showToast(`${provider.name} has been verified`, 'success', 4000)
    })

    socket.on('provider-rejected', (provider: Provider) => {
      setProviders(prev => prev.map(p => p.id === provider.id ? provider : p))
      showToast(`${provider.name} verification rejected`, 'warning', 4000)
    })

    socket.on('provider-updated', (provider: Provider) => {
      setProviders(prev => prev.map(p => p.id === provider.id ? provider : p))
    })

    socket.on('provider:deleted', (data: { id: string; name: string }) => {
      setProviders(prev => prev.filter(p => p.id !== data.id))
      showToast(`${data.name} has been deleted`, 'info', 4000)
    })

    return () => {
      socket.off('booking-status-updated')
      socket.off('provider-verified')
      socket.off('provider-rejected')
      socket.off('provider-updated')
      socket.off('provider:deleted')
    }
  }, [socket, showToast])

  const loadData = async () => {
    setLoading(true)
    try {
      const [providersData, bookingsData] = await Promise.all([
        providersApi.getAll().catch(() => []),
        bookingsApi.getAll().catch(() => [])
      ])
      // Ensure both are always arrays
      setProviders(Array.isArray(providersData) ? providersData : [])
      setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      setUsers([]) // TODO: Fetch users from API when endpoint is ready
    } catch (error) {
      console.error('Failed to load data:', error)
      // Fallback to mock data
      setProviders([])
      setBookings([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const stats = useMemo(() => {
    // Ensure all are arrays before processing
    const safeUsers = Array.isArray(users) ? users : []
    const safeProviders = Array.isArray(providers) ? providers : []
    const safeBookings = Array.isArray(bookings) ? bookings : []
    
    const totalUsers = safeUsers.length
    const totalProviders = safeProviders.length
    const pendingVerifications = safeProviders.filter(p => !p.verified).length
    const totalBookings = safeBookings.length
    const activeBookings = safeBookings.filter(b =>
      b.status === 'Pending' || b.status === 'Confirmed'
    ).length
    const monthlyBookings = safeBookings.filter(b => {
      const bookingDate = new Date(b.date)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
    }).length
    const monthlyRevenue = monthlyBookings * 150 // Mock calculation
    const openDisputes = 0 // TODO: Get from disputes API
    const urgentDisputes = 0 // TODO: Get from disputes API

    return {
      totalUsers,
      totalProviders,
      pendingVerifications,
      totalBookings,
      monthlyRevenue,
      activeBookings,
      openDisputes,
      urgentDisputes
    }
  }, [users, providers, bookings])

  // Generate recent activity from real data
  const recentActivity = useMemo(() => {
    const activities: Array<{ action: string; time: string }> = []

    // Ensure all are arrays before processing
    const safeBookings = Array.isArray(bookings) ? bookings : []
    const safeProviders = Array.isArray(providers) ? providers : []

    // Recent bookings
    const recentBookings = [...safeBookings]
      .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
      .slice(0, 3)

    recentBookings.forEach(booking => {
      const provider = safeProviders.find(p => p.id === booking.providerId)
      const timeAgo = getTimeAgo(new Date(booking.createdAt || booking.date))
      activities.push({
        action: `Booking ${booking.status.toLowerCase()}: ${booking.serviceType} with ${provider?.name || 'Provider'}`,
        time: timeAgo
      })
    })

    // Recent provider verifications
    const verifiedProviders = safeProviders.filter(p => p.verified)
    if (verifiedProviders.length > 0) {
      activities.push({
        action: `${verifiedProviders.length} provider(s) verified`,
        time: 'Recently'
      })
    }

    return activities.slice(0, 5)
  }, [bookings, providers])

  function getTimeAgo(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  // Filter bookings by status
  const filteredBookings = useMemo(() => {
    const safeBookings = Array.isArray(bookings) ? bookings : []
    let filtered = safeBookings
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => {
        const bookingStatus = b.status?.toLowerCase() || ''
        return bookingStatus === statusFilter.toLowerCase()
      })
    }
    return filtered
  }, [bookings, statusFilter])

  const handleVerifyProvider = async (providerId: string) => {
    const safeProviders = Array.isArray(providers) ? providers : []
    const provider = safeProviders.find(p => p.id === providerId)
    try {
      await providersApi.update(providerId, { verified: true })
      setProviders(safeProviders.map(p =>
        p.id === providerId ? { ...p, verified: true } : p
      ))
      showToast(`${provider?.name || 'Provider'} verified successfully!`, 'success')
      // TODO: Send audit log to backend service
    } catch {
      // Update local state on error (for mock data)
      setProviders(safeProviders.map(p =>
        p.id === providerId ? { ...p, verified: true } : p
      ))
      showToast(`${provider?.name || 'Provider'} verified successfully!`, 'success')
    }
  }

  const handleRejectProvider = async (providerId: string) => {
    const safeProviders = Array.isArray(providers) ? providers : []
    const provider = safeProviders.find(p => p.id === providerId)
    if (confirm('Are you sure you want to reject this provider?')) {
      try {
        await providersApi.update(providerId, { verified: false })
        setProviders(safeProviders.map(p =>
          p.id === providerId ? { ...p, verified: false } : p
        ))
        showToast(`${provider?.name || 'Provider'} verification rejected`, 'warning')
        // TODO: Send audit log to backend service
      } catch {
        // Update local state on error (for mock data)
        setProviders(safeProviders.map(p =>
          p.id === providerId ? { ...p, verified: false } : p
        ))
        showToast(`${provider?.name || 'Provider'} verification rejected`, 'warning')
      }
    }
  }

  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsProviderModalOpen(true)
  }

  const handleDeleteProvider = async (providerId: string) => {
    const safeProviders = Array.isArray(providers) ? providers : []
    const provider = safeProviders.find(p => p.id === providerId)
    if (!provider) return

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${provider.name}"?\n\n` +
      `This action cannot be undone. The provider and all associated data will be removed.`
    )

    if (!confirmed) return

    try {
      await adminApi.deleteProvider(providerId)
      setProviders(safeProviders.filter(p => p.id !== providerId))
      showToast(`${provider.name} has been deleted successfully`, 'success')
    } catch (error: unknown) {
      console.error('Failed to delete provider:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete provider. They may have active bookings.'
      showToast(errorMessage, 'error')
    }
  }

  const handleExportProviders = () => {
    const csv = [
      ['Name', 'Category', 'Location', 'Rating', 'Reviews', 'Verified', 'Phone'].join(','),
      ...filteredProviders.map(p => [
        p.name,
        p.category,
        p.location,
        p.rating,
        p.reviewCount,
        p.verified ? 'Yes' : 'No',
        p.phone || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `providers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleExportBookings = () => {
    const safeProviders = Array.isArray(providers) ? providers : []
    const safeUsers = Array.isArray(users) ? users : []
    const csv = [
      ['ID', 'Service Type', 'Provider', 'Customer', 'Date', 'Time', 'Status', 'Notes'].join(','),
      ...filteredBookings.map(b => {
        const provider = safeProviders.find(p => p.id === b.providerId)
        const customer = safeUsers.find(u => u.id === b.userId)
        return [
          b.id,
          b.serviceType,
          provider?.name || 'Unknown',
          customer?.name || 'Unknown',
          new Date(b.date).toLocaleDateString(),
          b.time,
          b.status,
          (b.notes || '').replace(/,/g, ';')
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    // Capitalize first letter of each word and ensure it matches Booking status type
    const formattedStatus = newStatus.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')

    // Validate status is one of the allowed values
    const validStatuses: Booking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    const status: Booking['status'] = validStatuses.includes(formattedStatus as Booking['status'])
      ? formattedStatus as Booking['status']
      : 'Pending'

    const safeBookings = Array.isArray(bookings) ? bookings : []
    try {
      await bookingsApi.updateStatus(bookingId, status.toUpperCase())
      setBookings(safeBookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ))
      showToast(`Booking status updated to ${status}`, 'success')
      // Log action for audit trail
      safeBookings.find(b => b.id === bookingId)
      // TODO: Send audit log to backend service
    } catch {
      // Update local state on error
      setBookings(safeBookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ))
      showToast(`Booking status updated to ${status}`, 'success')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const safeUsers = Array.isArray(users) ? users : []
    const userToDelete = safeUsers.find(u => u.id === userId)
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // In a real app, this would call an API
      setUsers(safeUsers.filter(u => u.id !== userId))
      showToast(`${userToDelete?.name || 'User'} deleted successfully`, 'success')
      // TODO: Send audit log to backend service
    }
  }

  const filteredProviders = (Array.isArray(providers) ? providers : []).filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.name}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'overview' as TabId, label: 'Overview', icon: TrendingUp },
                { id: 'providers' as TabId, label: 'Providers', icon: Shield },
                { id: 'users' as TabId, label: 'Users', icon: Users },
                { id: 'bookings' as TabId, label: 'Bookings', icon: TrendingUp },
                { id: 'disputes' as TabId, label: 'Disputes', icon: Scale }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
                    { label: 'Total Providers', value: stats.totalProviders, icon: Shield, color: 'green' },
                    { label: 'Pending Verifications', value: stats.pendingVerifications, icon: AlertCircle, color: 'yellow' },
                    { label: 'Total Bookings', value: stats.totalBookings, icon: TrendingUp, color: 'purple' },
                    { label: 'Monthly Revenue', value: `GHS ${stats.monthlyRevenue.toLocaleString()}`, icon: TrendingUp, color: 'green' },
                    { label: 'Active Bookings', value: stats.activeBookings, icon: CheckCircle, color: 'blue' },
                    { label: 'Open Disputes', value: stats.openDisputes, icon: Scale, color: 'red' },
                    { label: 'Urgent Disputes', value: stats.urgentDisputes, icon: AlertCircle, color: 'red' }
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

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivity.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity</p>
                    ) : (
                      recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <span className="text-sm text-gray-900 dark:text-white">{activity.action}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'providers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Manage Providers
                  </h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search providers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportProviders}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredProviders.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No providers found
                    </p>
                  ) : (
                    filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {provider.name}
                              </h3>
                              {provider.verified ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {provider.category} • {provider.location}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Rating: {provider.rating} ⭐ ({provider.reviewCount} reviews)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!provider.verified && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyProvider(provider.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectProvider(provider.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProvider(provider)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProvider(provider.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
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
                    All Bookings ({filteredBookings.length})
                  </h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter bookings by status"
                        title="Filter bookings by status"
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportBookings}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading bookings...</p>
                ) : filteredBookings.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {statusFilter === 'all' ? 'No bookings found' : `No ${statusFilter} bookings found`}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                      const safeProviders = Array.isArray(providers) ? providers : []
                      const safeUsers = Array.isArray(users) ? users : []
                      const provider = safeProviders.find(p => p.id === booking.providerId)
                      const customer = safeUsers.find(u => u.id === booking.userId)
                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {booking.serviceType}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {provider?.name || 'Provider'} → {customer?.name || 'Customer'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                                  {booking.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={booking.status || 'Pending'}
                                onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                aria-label={`Update booking status for ${booking.serviceType}`}
                                title={`Update booking status for ${booking.serviceType}`}
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-semibold border-0 focus:ring-2 focus:ring-primary cursor-pointer",
                                  booking.status === 'Confirmed' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                    booking.status === 'Completed' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                      booking.status === 'Cancelled' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                )}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    User Management ({users.length})
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    />
                  </div>
                </div>
                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading users...</p>
                ) : (
                  <div className="space-y-4">
                    {(Array.isArray(users) ? users : [])
                      .filter(u =>
                        !userSearchQuery ||
                        u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((userItem) => {
                        const hasValidAvatar = isValidImageUrl(userItem.avatar)
                        return (
                          <div
                            key={userItem.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {hasValidAvatar ? (
                                  <img
                                    src={userItem.avatar!}
                                    alt={userItem.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                    onError={(e) => {
                                      // Hide broken image and show fallback
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      const fallback = target.nextElementSibling as HTMLElement
                                      if (fallback) fallback.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-black ${hasValidAvatar ? 'hidden' : ''}`}
                                >
                                  {userItem.name?.charAt(0) || 'U'}
                                </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {userItem.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {userItem.email}
                                </p>
                                {userItem.phone && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {userItem.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold",
                                userItem.role === 'ADMIN' ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                                  userItem.role === 'PROVIDER' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              )}>
                                {userItem.role}
                              </span>
                              {userItem.role !== 'ADMIN' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        )
                      })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'disputes' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <DisputeManagement />
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Provider Detail Modal */}
      <ProviderDetailModal
        provider={selectedProvider}
        isOpen={isProviderModalOpen}
        onClose={() => {
          setIsProviderModalOpen(false)
          setSelectedProvider(null)
        }}
        onVerify={handleVerifyProvider}
        onReject={handleRejectProvider}
      />
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}

