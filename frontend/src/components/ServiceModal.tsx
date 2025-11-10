import { useState, useEffect } from 'react'
import { X, DollarSign, Clock, Repeat, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Service, ServiceCategory, PricingModel, BillingCycle } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (service: Omit<Service, 'id'>) => void
  service?: Service | null
}

const serviceCategories: ServiceCategory[] = [
  'Electrician', 'Plumber', 'Cleaner', 'Handyman',
  'Carpenter', 'Painter', 'Mechanic', 'Gardener', 'Tiler', 'Welder'
]

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electrician' as ServiceCategory,
    pricingModel: 'pay-as-you-go' as PricingModel,
    basePrice: 0,
    duration: 60,
    isActive: true,
    monthlyPrice: 0,
    billingCycle: 'monthly' as BillingCycle,
    subscriptionFeatures: [] as string[],
    visitsPerPeriod: undefined as number | undefined
  })
  const [featureInput, setFeatureInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        category: service.category,
        pricingModel: service.pricingModel || 'pay-as-you-go',
        basePrice: service.basePrice,
        duration: service.duration,
        isActive: service.isActive,
        monthlyPrice: service.monthlyPrice || 0,
        billingCycle: service.billingCycle || 'monthly',
        subscriptionFeatures: service.subscriptionFeatures || [],
        visitsPerPeriod: service.visitsPerPeriod
      })
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Electrician',
        pricingModel: 'pay-as-you-go',
        basePrice: 0,
        duration: 60,
        isActive: true,
        monthlyPrice: 0,
        billingCycle: 'monthly',
        subscriptionFeatures: [],
        visitsPerPeriod: undefined
      })
    }
    setFeatureInput('')
    setErrors({})
  }, [service, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.pricingModel === 'pay-as-you-go') {
      if (formData.basePrice <= 0) {
        newErrors.basePrice = 'Price must be greater than 0'
      }
    } else {
      if (formData.monthlyPrice <= 0) {
        newErrors.monthlyPrice = 'Monthly price must be greater than 0'
      }
    }
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addFeature = () => {
    if (featureInput.trim() && !formData.subscriptionFeatures.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        subscriptionFeatures: [...formData.subscriptionFeatures, featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      subscriptionFeatures: formData.subscriptionFeatures.filter(f => f !== feature)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
      onClose()
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {service ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="e.g., Electrical Repair"
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none",
                      errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    )}
                    placeholder="Describe your service in detail..."
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* Pricing Model Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Pricing Model *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricingModel: 'pay-as-you-go' })}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        formData.pricingModel === 'pay-as-you-go'
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-gray-900 dark:text-white">Pay As You Go</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Customer pays per service visit
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pricingModel: 'subscription' })}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        formData.pricingModel === 'subscription'
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Repeat className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-gray-900 dark:text-white">Subscription</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Recurring payment model
                      </p>
                    </button>
                  </div>
                </div>

                {/* Pricing Fields */}
                {formData.pricingModel === 'pay-as-you-go' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Price Per Visit (GHS) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.basePrice ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        )}
                        placeholder="0.00"
                      />
                      {errors.basePrice && <p className="text-sm text-red-500 mt-1">{errors.basePrice}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        className={cn(
                          "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                          errors.duration ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        )}
                        placeholder="60"
                      />
                      {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          <DollarSign className="h-4 w-4 inline mr-1" />
                          Monthly Price (GHS) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.monthlyPrice}
                          onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
                          className={cn(
                            "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                            errors.monthlyPrice ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          )}
                          placeholder="0.00"
                        />
                        {errors.monthlyPrice && <p className="text-sm text-red-500 mt-1">{errors.monthlyPrice}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          <Repeat className="h-4 w-4 inline mr-1" />
                          Billing Cycle *
                        </label>
                        <select
                          value={formData.billingCycle}
                          onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Duration Per Visit (minutes) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                          className={cn(
                            "w-full px-4 py-2 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary",
                            errors.duration ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          )}
                          placeholder="60"
                        />
                        {errors.duration && <p className="text-sm text-red-500 mt-1">{errors.duration}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Visits Per Period
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.visitsPerPeriod || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            visitsPerPeriod: e.target.value ? parseInt(e.target.value) : undefined 
                          })}
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Leave empty for unlimited"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Number of visits included. Leave empty for unlimited.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Setup Fee (GHS) - Optional
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        One-time fee charged when customer subscribes
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Subscription Features
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addFeature()
                            }
                          }}
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Add a feature (e.g., Priority Support, 24/7 Availability)"
                        />
                        <Button type="button" onClick={addFeature} size="sm">
                          Add
                        </Button>
                      </div>
                      {formData.subscriptionFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.subscriptionFeatures.map((feature, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-gray-900 dark:text-white text-sm"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {feature}
                              <button
                                type="button"
                                onClick={() => removeFeature(feature)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-900 dark:text-white">
                    Service is active and available for booking
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button type="submit" className="flex-1">
                    {service ? 'Update Service' : 'Create Service'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

