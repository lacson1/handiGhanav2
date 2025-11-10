import { motion } from 'framer-motion'
import { Shield, CreditCard, Headphones, CheckCircle } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: '100% Verified',
      description: 'All professionals verified'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Powered by Paystack'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help'
    },
    {
      icon: CheckCircle,
      title: 'Quality Guarantee',
      description: 'Satisfaction guaranteed'
    }
  ]

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-primary/5 via-ghana-yellow/5 to-ghana-green/5 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 mb-2 sm:mb-3">
                <badge.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                {badge.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

