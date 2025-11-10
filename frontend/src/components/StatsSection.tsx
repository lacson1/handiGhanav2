import { motion } from 'framer-motion'
import { Users, Star, Shield, Heart, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { statsApi } from '../lib/api'

interface PlatformStats {
  totalProviders: number
  verifiedProviders: number
  totalBookings: number
  completedBookings: number
  totalReviews: number
  activeUsers: number
  averageRating: number
  totalCategories: number
  totalLocations: number
}

export default function StatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getPlatformStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!stats) return null

  const displayStats = [
    {
      icon: Users,
      value: `${stats.totalProviders}+`,
      label: 'Service Providers',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Shield,
      value: `${stats.verifiedProviders}+`,
      label: 'Trusted Professionals',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Star,
      value: `${stats.averageRating.toFixed(1)}`,
      label: 'Platform Rating',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Heart,
      value: `${stats.activeUsers}+`,
      label: 'Happy Customers',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Trusted by Thousands Across Ghana
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Join our growing community of satisfied customers and verified professionals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`group text-center ${stat.bgColor} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700`}
            >
              <div className="flex justify-center mb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-ghana-red via-ghana-yellow to-ghana-green px-6 py-3 rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">100% Verified Service Providers</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

