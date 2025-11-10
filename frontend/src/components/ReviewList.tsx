import { useState, useEffect } from 'react'
import { Star, User, CheckCircle, MessageSquare, Image as ImageIcon } from 'lucide-react'
import { reviewsApi } from '../lib/api'
import { cn } from '../lib/utils'
import type { Review } from '../types'

interface ReviewListProps {
  providerId: string
  limit?: number
}

export default function ReviewList({ providerId, limit = 10 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ average: 0, total: 0 })
  const [expandedPhotos, setExpandedPhotos] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadReviews()
  }, [providerId])

  const loadReviews = async () => {
    try {
      const response = await reviewsApi.getByProvider(providerId, limit)
      setReviews(response.reviews || [])
      
      // Calculate stats
      if (response.reviews && response.reviews.length > 0) {
        const avg = response.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / response.reviews.length
        setStats({ average: avg, total: response.total || 0 })
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats.total > 0 && (
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.average.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            ({stats.total} {stats.total === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-5 w-5 text-black" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.userName || 'Anonymous'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(review.createdAt).toLocaleDateString('en-GH', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {review.comment}
            </p>

            {/* Verified Badge */}
            {review.isVerified && (
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Verified Review
                </span>
              </div>
            )}

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {review.photos.length} photo{review.photos.length > 1 ? 's' : ''} of completed work
                  </span>
                </div>
                <div className={cn(
                  "grid gap-2",
                  review.photos.length === 1 ? "grid-cols-1" :
                  review.photos.length === 2 ? "grid-cols-2" :
                  "grid-cols-3"
                )}>
                  {review.photos.slice(0, expandedPhotos[review.id] ? review.photos.length : 3).map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={photo}
                        alt={`Work photo ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          // Open in lightbox/modal (simplified - just open in new tab)
                          window.open(photo, '_blank')
                        }}
                      />
                    </div>
                  ))}
                </div>
                {review.photos.length > 3 && !expandedPhotos[review.id] && (
                  <button
                    onClick={() => setExpandedPhotos({ ...expandedPhotos, [review.id]: true })}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    View {review.photos.length - 3} more photos
                  </button>
                )}
              </div>
            )}

            {/* Provider Response */}
            {review.providerResponse && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Provider Response
                  </span>
                  {review.providerResponseAt && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {new Date(review.providerResponseAt).toLocaleDateString('en-GH', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {review.providerResponse}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

