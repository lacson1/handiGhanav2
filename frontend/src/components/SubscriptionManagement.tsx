import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Repeat, 
  X, Pause, Play, CheckCircle2, AlertCircle,
  Infinity
} from 'lucide-react'
import type { Subscription, Service, Provider } from '../types'
import Button from './ui/Button'
import { cn } from '../lib/utils'
import { subscriptionsApi, servicesApi, providersApi } from '../lib/api'

interface SubscriptionManagementProps {
  userId: string
}

export default function SubscriptionManagement({ userId }: SubscriptionManagementProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadSubscriptions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await subscriptionsApi.getAll({ userId })
      const subscriptionsWithDetails = await Promise.all(
        (data as Subscription[]).map(async (sub) => {
          try {
            const [service, provider] = await Promise.all([
              servicesApi.getById(sub.serviceId),
              providersApi.getById(sub.providerId)
            ])
            return {
              ...sub,
              service: service as Service,
              provider: provider as Provider
            }
          } catch (error) {
            console.error('Failed to load subscription details:', error)
            return sub
          }
        })
      )
      setSubscriptions(subscriptionsWithDetails)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      return
    }

    try {
      await subscriptionsApi.cancel(subscriptionId)
      await loadSubscriptions()
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    }
  }

  const handlePause = async (subscriptionId: string) => {
    try {
      await subscriptionsApi.pause(subscriptionId)
      await loadSubscriptions()
    } catch (error) {
      console.error('Failed to pause subscription:', error)
      alert('Failed to pause subscription. Please try again.')
    }
  }

  const handleResume = async (subscriptionId: string) => {
    try {
      await subscriptionsApi.resume(subscriptionId)
      await loadSubscriptions()
    } catch (error) {
      console.error('Failed to resume subscription:', error)
      alert('Failed to resume subscription. Please try again.')
    }
  }

  const filteredSubscriptions = statusFilter === 'all' 
    ? subscriptions 
    : subscriptions.filter(s => s.status === statusFilter)

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      PAUSED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
    return styles[status as keyof typeof styles] || styles.ACTIVE
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Subscriptions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your active service subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Subscriptions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscriptions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {subscriptions.filter(s => s.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Paused</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {subscriptions.filter(s => s.status === 'PAUSED').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Cost</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            GHS {subscriptions
              .filter(s => s.status === 'ACTIVE' && s.service?.monthlyPrice)
              .reduce((sum, s) => sum + (s.service?.monthlyPrice || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading subscriptions...</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {statusFilter === 'all' 
              ? 'No subscriptions yet.' 
              : `No ${statusFilter.toLowerCase()} subscriptions found.`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Subscribe to services from providers to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubscriptions.map((subscription) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Repeat className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {subscription.service?.name || 'Service'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subscription.provider?.name || 'Provider'}
                      </p>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      getStatusBadge(subscription.status)
                    )}>
                      {subscription.status}
                    </span>
                  </div>
                  {subscription.service?.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {subscription.service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Price</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    GHS {subscription.service?.monthlyPrice?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Billing</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Visits Used</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {subscription.visitsUsed}
                    {subscription.visitsRemaining !== undefined ? (
                      <span className="text-gray-500 dark:text-gray-400">
                        {' / '}
                        {subscription.visitsRemaining + subscription.visitsUsed}
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        <Infinity className="h-3 w-3 inline" />
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Auto Renew</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {subscription.autoRenew ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        On
                      </span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <X className="h-4 w-4" />
                        Off
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {subscription.service?.subscriptionFeatures && subscription.service.subscriptionFeatures.length > 0 && (
                <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Features Included</p>
                  <div className="flex flex-wrap gap-2">
                    {subscription.service.subscriptionFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {subscription.status === 'ACTIVE' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePause(subscription.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(subscription.id)}
                      className="text-red-600 hover:text-red-700 border-red-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
                {subscription.status === 'PAUSED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResume(subscription.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                )}
                {subscription.status === 'CANCELLED' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Cancelled on {subscription.cancelledAt ? formatDate(subscription.cancelledAt) : 'N/A'}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

