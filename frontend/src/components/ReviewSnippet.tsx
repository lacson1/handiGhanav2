import { Star, CheckCircle } from 'lucide-react'
import type { Review } from '../types'

interface ReviewSnippetProps {
  review: Review
  showFull?: boolean
}

export default function ReviewSnippet({ review, showFull = false }: ReviewSnippetProps) {
  const displayComment = showFull 
    ? review.comment 
    : review.comment.length > 80 
      ? review.comment.substring(0, 80) + '...' 
      : review.comment

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {review.userName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < review.rating
                    ? 'fill-amber-500 text-amber-500'
                    : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          {review.isVerified && (
            <div title="Verified Review">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          {displayComment}
        </p>
        {review.userName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            — {review.userName}
          </p>
        )}
      </div>
    </div>
  )
}

