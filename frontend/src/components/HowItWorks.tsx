import { Search, Calendar, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Find',
      description: 'Search trusted professionals by category and location'
    },
    {
      icon: Calendar,
      title: 'Book',
      description: 'Choose a date and time that works for you. Book instantly online.'
    },
    {
      icon: CheckCircle,
      title: 'Done',
      description: 'Get your work done by verified professionals. Leave a review!'
    }
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-gradient-to-b from-white via-ghana-yellow-subtle/30 to-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ghana-red/10 via-primary/20 to-ghana-green/10 mb-4 border-2 border-ghana-yellow/30">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

