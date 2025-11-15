import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'
import { statsApi } from '../lib/api'
import { cn } from '../lib/utils'

interface AnalyticsDashboardProps {
  providerId?: string
  isAdmin?: boolean
}

const COLORS = ['#facc15', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsDashboard({ providerId, isAdmin = false }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '1y'>('30d')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [bookingsData, setBookingsData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [period, providerId])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Load platform stats
      const platformStats = await statsApi.getPlatformStats()
      setStats(platformStats)

      // Mock data for charts (replace with real API calls)
      // In production, these would be separate API endpoints
      setBookingsData([
        { date: 'Jan', bookings: 45 },
        { date: 'Feb', bookings: 52 },
        { date: 'Mar', bookings: 48 },
        { date: 'Apr', bookings: 61 },
        { date: 'May', bookings: 55 },
        { date: 'Jun', bookings: 67 }
      ])

      setRevenueData([
        { month: 'Jan', revenue: 12500 },
        { month: 'Feb', revenue: 15200 },
        { month: 'Mar', revenue: 14800 },
        { month: 'Apr', revenue: 18100 },
        { month: 'May', revenue: 16500 },
        { month: 'Jun', revenue: 20100 }
      ])

      setCategoryData([
        { name: 'Electrician', value: 25 },
        { name: 'Plumber', value: 20 },
        { name: 'Handyman', value: 18 },
        { name: 'Cleaner', value: 15 },
        { name: 'Carpenter', value: 12 },
        { name: 'Other', value: 10 }
      ])
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</h3>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.totalBookings || 0}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +12% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            GHS {stats?.totalRevenue?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +8% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.activeUsers || 0}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +5% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats?.averageRating?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            +0.2 from last month
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bookings Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#facc15"
                strokeWidth={2}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Revenue (GHS)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Service Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#facc15" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex justify-end gap-2">
        {(['7d', '30d', '3m', '1y'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              period === p
                ? "bg-primary text-black"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '3m' ? '3 Months' : '1 Year'}
          </button>
        ))}
      </div>
    </div>
  )
}

