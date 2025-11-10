import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Phone, Mail, Calendar, DollarSign, 
  Star, MessageCircle, Filter, TrendingUp
} from 'lucide-react'
// mockCustomers removed - using empty array
import type { Customer } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface CustomerManagementProps {
  providerId: string
}

export default function CustomerManagement({ providerId: _providerId }: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'bookings' | 'spent' | 'recent'>('recent')

  const [customers] = useState<Customer[]>([])
  
  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let result = [...customers]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone?.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'bookings':
          return b.totalBookings - a.totalBookings
        case 'spent':
          return b.totalSpent - a.totalSpent
        case 'recent':
          if (!a.lastBookingDate) return 1
          if (!b.lastBookingDate) return -1
          return new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime()
        default:
          return 0
      }
    })

    return result
  }, [searchQuery, sortBy, customers])

  // Calculate stats
  const stats = useMemo(() => {
    const totalCustomers = customers.length
    const totalBookings = customers.reduce((sum: number, c: Customer) => sum + c.totalBookings, 0)
    const totalRevenue = customers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0)
    const avgRating = customers.length > 0 ? customers.reduce((sum: number, c: Customer) => sum + (c.rating || 0), 0) / customers.length : 0

    return {
      totalCustomers,
      totalBookings,
      totalRevenue,
      avgRating
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Management
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your customer relationships and track interactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: stats.totalCustomers, icon: TrendingUp, color: 'blue' },
          { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'green' },
          { label: 'Total Revenue', value: `GHS ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'purple' },
          { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Star, color: 'yellow' }
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

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="recent">Sort by Recent</option>
              <option value="name">Sort by Name</option>
              <option value="bookings">Sort by Bookings</option>
              <option value="spent">Sort by Spent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No customers found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}

interface CustomerCardProps {
  customer: Customer
}

function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-black">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {customer.name}
            </h4>
            {customer.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {customer.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Mail className="h-4 w-4" />
          <span className="truncate">{customer.email}</span>
        </div>
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bookings</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {customer.totalBookings}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            GHS {customer.totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {customer.lastBookingDate && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="h-3 w-3" />
          <span>Last booking: {new Date(customer.lastBookingDate).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        {customer.phone && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`https://wa.me/${customer.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}

