import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Cookie } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
  }

  const handleClose = () => {
    // If user closes without choosing, default to rejected
    localStorage.setItem('cookieConsent', 'rejected')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 flex items-start gap-3">
                <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    We Use Cookies
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    We use cookies to improve your experience, analyze site usage, and assist in our marketing efforts. 
                    By continuing to use our site, you consent to our use of cookies.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Learn more in our{' '}
                    <Link 
                      to="/privacy" 
                      className="text-primary hover:underline font-medium"
                      onClick={() => setShowBanner(false)}
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

