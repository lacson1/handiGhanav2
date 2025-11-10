import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import { statsApi } from '../lib/api'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: {
    name: string
    avatar: string | null
  }
  provider: {
    name: string
    location: string
  }
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await statsApi.getRecentReviews(3)
        setReviews(data)
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Real experiences from satisfied customers across Ghana
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) return null

  // Generate avatar emoji based on name
  const getAvatarEmoji = (name: string) => {
    const emojis = ['👨🏿‍💼', '👩🏿‍💼', '👨🏿‍💻', '👩🏿‍💻', '👨🏿', '👩🏿']
    const index = name.charCodeAt(0) % emojis.length
    return emojis[index]
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Real experiences from satisfied customers across Ghana
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">
                  {review.user.avatar || getAvatarEmoji(review.user.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {review.user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.provider.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                "{review.comment}"
              </p>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Service by {review.provider.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

