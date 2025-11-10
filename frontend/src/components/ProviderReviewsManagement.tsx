import { useState, useEffect, useCallback } from 'react'
import { Star, MessageSquare, Send, Edit2, CheckCircle, Image as ImageIcon } from 'lucide-react'
import { reviewsApi } from '../lib/api'
import type { Review } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface ProviderReviewsManagementProps {
  providerId: string
}

export default function ProviderReviewsManagement({ providerId }: ProviderReviewsManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ average: 0, total: 0 })
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [editingResponse, setEditingResponse] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = useCallback(async () => {
    try {
      const response = await reviewsApi.getByProvider(providerId, 50)
      setReviews(response.reviews || [])
      
      if (response.reviews && response.reviews.length > 0) {
        const avg = response.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / response.reviews.length
        setStats({ average: avg, total: response.total || 0 })
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim() || responseText.trim().length < 10) {
      alert('Response must be at least 10 characters')
      return
    }

    setSubmitting(true)
    try {
      if (editingResponse === reviewId) {
        // Update existing response
        await reviewsApi.update(reviewId, { response: responseText.trim() })
      } else {
        // Add new response
        await reviewsApi.addResponse(reviewId, responseText.trim())
      }
      
      await loadReviews()
      setRespondingTo(null)
      setEditingResponse(null)
      setResponseText('')
      alert('Response submitted successfully!')
    } catch {
      alert('Failed to submit response. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartResponse = (review: Review) => {
    if (review.providerResponse) {
      setEditingResponse(review.id)
      setResponseText(review.providerResponse)
    } else {
      setResponseText('')
    }
    setRespondingTo(review.id)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and respond to customer feedback
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.average.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Reviews from customers will appear here
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-black font-semibold">
                        {review.userName?.[0] || 'U'}
                      </span>
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
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-GH', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
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
                      <div className="grid grid-cols-3 gap-2">
                        {review.photos.slice(0, 3).map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Work photo ${idx + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(photo, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Provider Response Section */}
              {review.providerResponse ? (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        Your Response
                      </span>
                      {review.providerResponseAt && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {new Date(review.providerResponseAt).toLocaleDateString('en-GH')}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartResponse(review)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  {respondingTo === review.id && editingResponse === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                        placeholder="Your response..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={submitting || responseText.trim().length < 10}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          {submitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRespondingTo(null)
                            setEditingResponse(null)
                            setResponseText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {review.providerResponse}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  {respondingTo === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                        placeholder="Write a response to this review... (minimum 10 characters)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={submitting || responseText.trim().length < 10}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          {submitting ? 'Submitting...' : 'Submit Response'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRespondingTo(null)
                            setResponseText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {responseText.length}/10 characters minimum
                      </p>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartResponse(review)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond to Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

