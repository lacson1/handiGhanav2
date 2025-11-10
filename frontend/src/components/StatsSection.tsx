import { motion } from 'framer-motion'
import { Users, Star, Briefcase, MapPin } from 'lucide-react'
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
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
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
      value: `${stats.verifiedProviders}+`,
      label: 'Verified Providers',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Star,
      value: `${stats.completedBookings}+`,
      label: 'Completed Bookings',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Briefcase,
      value: `${stats.totalCategories}+`,
      label: 'Service Categories',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      value: `${stats.totalLocations}+`,
      label: 'Cities Covered',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {displayStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${stat.color} mb-3 sm:mb-4`}>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

