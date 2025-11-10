import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './ui/Button'
import type { Provider } from '../types'

interface ProviderDetailModalProps {
  provider: Provider | null
  isOpen: boolean
  onClose: () => void
  onVerify?: (id: string) => void
  onReject?: (id: string) => void
}

export default function ProviderDetailModal({
  provider,
  isOpen,
  onClose,
  onVerify,
  onReject
}: ProviderDetailModalProps) {
  if (!provider) return null

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Provider Details
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    {provider.avatar ? (
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-black">
                        {provider.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {provider.name}
                        </h3>
                        {provider.verified ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm rounded-full font-semibold">
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-sm rounded-full font-semibold">
                            Pending Verification
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {provider.category} • {provider.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{provider.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rating</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {provider.rating} ⭐ ({provider.reviewCount} reviews)
                      </p>
                    </div>
                    {provider.completionRate && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Completion Rate</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {Math.round(provider.completionRate * 100)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {provider.phone && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h4>
                      <p className="text-gray-600 dark:text-gray-400">{provider.phone}</p>
                    </div>
                  )}

                  {provider.serviceAreas && provider.serviceAreas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.serviceAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {provider.skills && provider.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/25 text-gray-900 dark:text-white text-sm rounded-lg font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!provider.verified && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => {
                          onVerify?.(provider.id)
                          onClose()
                        }}
                        className="flex-1"
                      >
                        Verify Provider
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onReject?.(provider.id)
                          onClose()
                        }}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

