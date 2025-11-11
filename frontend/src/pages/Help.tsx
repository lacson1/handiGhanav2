import { HelpCircle, MessageCircle, Mail, Phone, Book, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We're here to help! Find answers and get support.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <a
            href="https://wa.me/233504910179"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#25D366]"
          >
            <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#25D366] transition-colors">
              <MessageCircle className="h-6 w-6 text-[#25D366] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              WhatsApp Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Chat with us instantly for quick assistance
            </p>
            <span className="text-[#25D366] font-semibold">Start Chat →</span>
          </a>

          <a
            href="mailto:support@handyghana.com"
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-primary"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
              <Mail className="h-6 w-6 text-primary group-hover:text-black transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Send us a detailed message
            </p>
            <span className="text-primary font-semibold">Send Email →</span>
          </a>

          <a
            href="tel:+233504910179"
            className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-ghana-green"
          >
            <div className="w-12 h-12 bg-ghana-green/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-ghana-green transition-colors">
              <Phone className="h-6 w-6 text-ghana-green group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Phone Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Call us directly for immediate help
            </p>
            <span className="text-ghana-green font-semibold">Call Now →</span>
          </a>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/faq"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Book className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  FAQs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find answers to common questions
                </p>
              </div>
            </Link>

            <Link
              to="/become-provider"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Become a Provider
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join our platform as a service provider
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Common Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Common Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                For Customers
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• How to book a service</li>
                <li>• Cancelling or rescheduling bookings</li>
                <li>• Payment methods and issues</li>
                <li>• Leaving reviews and ratings</li>
                <li>• Account settings and profile</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                For Service Providers
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Getting verified on the platform</li>
                <li>• Managing bookings and calendar</li>
                <li>• Setting prices and availability</li>
                <li>• Responding to reviews</li>
                <li>• Premium membership benefits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-primary/10 rounded-2xl px-8 py-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Support Hours
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monday - Saturday: 8:00 AM - 8:00 PM GMT<br />
              Sunday: 10:00 AM - 6:00 PM GMT<br />
              <span className="text-sm text-gray-500 dark:text-gray-500 mt-2 block">
                (WhatsApp support available 24/7 for emergencies)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

