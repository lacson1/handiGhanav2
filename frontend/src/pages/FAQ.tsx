import { useState } from 'react'
import { ChevronDown, Search, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: 'What is Handighana?',
    answer: 'Handighana is Ghana\'s leading platform for connecting customers with trusted, verified service providers across various categories including electricians, plumbers, cleaners, carpenters, and more.'
  },
  {
    category: 'General',
    question: 'How does Handighana work?',
    answer: 'Simply search for the service you need, browse verified providers in your area, compare ratings and reviews, then book directly through our platform or contact providers via phone or WhatsApp.'
  },
  {
    category: 'Booking',
    question: 'How do I book a service?',
    answer: 'Click "Book Now" on any provider\'s card, select your preferred date and time, add any special notes, and confirm your booking. You\'ll receive instant confirmation and the provider\'s contact details.'
  },
  {
    category: 'Booking',
    question: 'Can I cancel or reschedule my booking?',
    answer: 'Yes, you can cancel or reschedule bookings from your dashboard. We recommend notifying the provider at least 24 hours in advance for courtesy.'
  },
  {
    category: 'Booking',
    question: 'What is the "Request a Quote" feature?',
    answer: 'If you\'re unsure about pricing or need a custom service, you can request a quote. Providers will review your requirements and send you a personalized price estimate.'
  },
  {
    category: 'Payment',
    question: 'How do I pay for services?',
    answer: 'Payment is typically arranged directly with the service provider. We support cash, mobile money (MTN, Vodafone, AirtelTigo), bank transfer, and card payments depending on the provider.'
  },
  {
    category: 'Payment',
    question: 'Is there a booking fee?',
    answer: 'No! Browsing and booking through Handighana is completely free for customers. You only pay the provider for the service rendered.'
  },
  {
    category: 'Providers',
    question: 'Are providers verified?',
    answer: 'Yes! All providers undergo a verification process including ID verification, reference checks, and background screening. Look for the verified badge (✓) on provider profiles.'
  },
  {
    category: 'Providers',
    question: 'How do I become a service provider on Handighana?',
    answer: 'Click "Become a Provider" in the navigation menu, fill out the registration form with your details, upload required documents, and wait for our verification team to review your application.'
  },
  {
    category: 'Safety',
    question: 'What if I\'m not satisfied with a service?',
    answer: 'We take quality seriously. Leave a review and rating after your service. If you have a serious complaint, contact our support team and we\'ll help mediate the issue.'
  },
  {
    category: 'Safety',
    question: 'Is my personal information safe?',
    answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for more details.'
  },
  {
    category: 'Account',
    question: 'Do I need an account to use Handighana?',
    answer: 'You can browse providers without an account, but creating one allows you to book services, track bookings, leave reviews, and manage your profile.'
  },
  {
    category: 'Account',
    question: 'What is the first booking discount?',
    answer: 'New users get 15% off their first booking! Use code WELCOME15 when making your first service booking.'
  }
]

const categories = ['All', 'General', 'Booking', 'Payment', 'Providers', 'Safety', 'Account']

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about Handighana
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-black'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No questions found matching your search.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
                      expandedQuestion === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-primary/10 dark:bg-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help you anytime
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/233504910179"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#128C7E] transition-colors"
            >
              WhatsApp Support
            </a>
            <a
              href="mailto:info@handyghana.com"
              className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-ghana-yellow transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

