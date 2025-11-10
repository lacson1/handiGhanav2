import { useState } from 'react'
import { X, Star, Upload, Trash2, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { reviewsApi, uploadApi } from '../lib/api'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  providerId: string
  providerName: string
  bookingId?: string
  onSuccess?: () => void
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  providerId, 
  providerName,
  bookingId,
  onSuccess 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const newFiles = Array.from(files).slice(0, 5 - photos.length) // Max 5 photos
    if (newFiles.length === 0) {
      alert('Maximum 5 photos allowed')
      return
    }

    setUploadingPhotos(true)
    try {
      const uploadPromises = newFiles.map(file => uploadApi.uploadImage(file, 'reviews'))
      const responses = await Promise.all(uploadPromises)
      const urls = responses.map(r => r.url)
      
      setPhotos([...photos, ...newFiles])
      setPhotoUrls([...photoUrls, ...urls])
    } catch (error) {
      alert('Failed to upload photos. Please try again.')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
    setPhotoUrls(photoUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bookingId) {
      alert('This review requires a completed booking. Please complete a booking first.')
      return
    }

    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review')
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Get userId from auth context
      await reviewsApi.create({
        providerId,
        userId: 'current-user-id',
        rating,
        comment: comment.trim(),
        bookingId,
        photos: photoUrls,
        isVerified: true // Verified because it's linked to a completed booking
      })

      setRating(0)
      setComment('')
      setPhotos([])
      setPhotoUrls([])
      onSuccess?.()
      onClose()
      alert('Thank you for your review!')
    } catch (error) {
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Rate Your Experience
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      How was your service with {providerName}?
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={cn(
                              "h-8 w-8 transition-colors",
                              star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {rating === 5 && 'Excellent!'}
                        {rating === 4 && 'Great!'}
                        {rating === 3 && 'Good'}
                        {rating === 2 && 'Fair'}
                        {rating === 1 && 'Poor'}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      placeholder="Share your experience... (minimum 10 characters)"
                      required
                      minLength={10}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {comment.length}/10 characters minimum
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Photos of Completed Work (Optional)
                    </label>
                    <div className="space-y-3">
                      {photoUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {photoUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Review photo ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {photos.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              PNG, JPG up to 5MB ({photos.length}/5)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handlePhotoUpload(e.target.files)}
                            disabled={uploadingPhotos}
                          />
                        </label>
                      )}
                      {uploadingPhotos && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          Uploading photos...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Verified Review Badge */}
                  {bookingId && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-green-700 dark:text-green-300">
                        This will be a verified review linked to your completed booking
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

