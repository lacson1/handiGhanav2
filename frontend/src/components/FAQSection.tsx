import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How do I book a service provider?',
      answer: 'Simply search for the service you need, browse verified professionals, and click "Book Now". Choose your preferred date and time, and you\'re all set! You can also contact providers directly via WhatsApp.'
    },
    {
      question: 'Are all service providers verified?',
      answer: 'Yes! All our professionals go through a thorough verification process including ID checks, skills assessment, and background verification to ensure quality and safety.'
    },
    {
      question: 'How do I make payments?',
      answer: 'We use Paystack for secure online payments. You can pay with mobile money, cards, or bank transfers. Payment is only processed after you confirm the booking.'
    },
    {
      question: 'What if I need to cancel or reschedule?',
      answer: 'You can cancel or reschedule your booking from your dashboard. Please note our cancellation policy: free cancellation up to 24 hours before the scheduled time.'
    },
    {
      question: 'Which cities do you cover?',
      answer: 'We currently operate in major cities across Ghana including Accra, Kumasi, Takoradi, Cape Coast, Tema, Tamale, and more. We\'re constantly expanding to new locations!'
    },
    {
      question: 'How can I become a service provider?',
      answer: 'Click on "Become a Provider" in the navigation menu, fill out the registration form with your details and qualifications, and our team will review your application within 24-48 hours.'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about Handighana
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform flex-shrink-0 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

