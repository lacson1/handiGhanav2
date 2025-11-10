import { useState } from 'react'
import { Crown, Check, TrendingUp, Zap, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from './ui/Button'

interface PremiumListingProps {
  providerId?: string
  currentTier?: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
  onUpgrade?: (tier: string) => void
}

export default function PremiumListing({ providerId: _providerId, currentTier = 'FREE', onUpgrade }: PremiumListingProps) {
  const [, setSelectedTier] = useState<string>(currentTier)

  const tiers = [
    {
      id: 'FREE',
      name: 'Free',
      price: 0,
      features: [
        'Basic profile listing',
        'Up to 10 service listings',
        'Standard search visibility',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'BASIC',
      name: 'Basic',
      price: 29,
      period: 'month',
      features: [
        'Everything in Free',
        'Up to 25 service listings',
        'Enhanced search visibility',
        'Priority customer support',
        'Basic analytics dashboard'
      ],
      popular: false
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: 79,
      period: 'month',
      features: [
        'Everything in Basic',
        'Unlimited service listings',
        'Top search results placement',
        'Featured provider badge',
        'Advanced analytics',
        'Marketing support',
        '24/7 priority support'
      ],
      popular: true
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      features: [
        'Everything in Premium',
        'Custom branding',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Custom integrations',
        'Volume discounts'
      ],
      popular: false
    }
  ]

  const handleUpgrade = (tierId: string) => {
    setSelectedTier(tierId)
    if (onUpgrade) {
      onUpgrade(tierId)
    }
    // TODO: Integrate with payment system
    alert(`Upgrading to ${tierId} tier...`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Premium Listings
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upgrade to get more visibility and grow your business
        </p>
      </div>

      {/* Current Tier Badge */}
      {currentTier !== 'FREE' && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentTier} Plan
              </p>
            </div>
            <Crown className="h-8 w-8 text-primary" />
          </div>
        </div>
      )}

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => {
          const isCurrent = tier.id === currentTier
          
          return (
            <motion.div
              key={tier.id}
              className={`relative border-2 rounded-xl p-6 ${
                tier.popular
                  ? 'border-primary bg-primary/5'
                  : isCurrent
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              {isCurrent && (
                <div className="absolute -top-3 right-3">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Current
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    GHS {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /{tier.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(tier.id)}
                variant={(tier.popular ? 'primary' : 'outline') as 'primary' | 'outline'}
                className="w-full"
                disabled={isCurrent}
              >
                {isCurrent ? 'Current Plan' : tier.id === 'FREE' ? 'Current' : 'Upgrade'}
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Benefits */}
      <div className="mt-8 p-6 bg-linear-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-900/20 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Why Upgrade?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                More Visibility
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get featured in top search results and reach more customers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                More Bookings
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Premium providers get 3x more bookings on average
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Grow Faster
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access advanced tools and insights to scale your business
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

