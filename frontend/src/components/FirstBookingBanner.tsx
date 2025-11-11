import { motion } from 'framer-motion'
import { Tag, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function FirstBookingBanner() {
  const { isAuthenticated, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show banner if user is authenticated but hasn't used first booking discount
    // Check localStorage to see if they've already used the discount
    if (isAuthenticated && user) {
      const hasUsedDiscount = localStorage.getItem(`firstBooking_${user.id}`) === 'true'
      if (!hasUsedDiscount) {
        setIsVisible(true)
      }
    }
  }, [isAuthenticated, user])

  // Don't show if already dismissed or not eligible
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-2xl px-4"
    >
      <div className="bg-gradient-to-r from-ghana-green via-primary to-ghana-yellow text-black rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Welcome Bonus! 🎉</h3>
            <p className="text-sm font-medium">
              Get <span className="font-bold">15% OFF</span> your first booking! Use code: <span className="font-bold bg-white/30 px-2 py-0.5 rounded">WELCOME15</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Close banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

