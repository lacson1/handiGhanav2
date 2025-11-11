import { FileText, CheckCircle, AlertCircle, Shield, Users } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-GH', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Welcome to Handighana! These Terms of Service ("Terms") govern your access to and use of our platform. By using Handighana, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                By accessing or using Handighana, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our platform.
              </p>
            </div>
          </section>

          {/* Services */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                2. Our Services
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>Handighana provides a platform that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Connects customers with verified service providers</li>
                <li>Facilitates booking and communication</li>
                <li>Provides reviews and ratings</li>
                <li>Offers customer support</li>
              </ul>
              <p className="font-semibold text-gray-900 dark:text-white">
                Note: Handighana is a marketplace platform. We do not directly provide the services offered by providers.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
            </div>
          </section>

          {/* Bookings and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Bookings and Payments
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Bookings are subject to provider availability and acceptance</li>
                <li>Payment arrangements are typically made directly with providers</li>
                <li>Prices are set by service providers, not Handighana</li>
                <li>Cancellation policies are determined by individual providers</li>
                <li>You are responsible for ensuring timely payment for services received</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                5. User Conduct
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Harass, abuse, or harm other users or providers</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Attempt to bypass security measures</li>
                <li>Scrape, data mine, or use automated tools without permission</li>
                <li>Impersonate another person or entity</li>
                <li>Post spam or unsolicited promotional content</li>
              </ul>
            </div>
          </section>

          {/* Reviews and Ratings */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Reviews and Ratings
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>When posting reviews, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide honest, accurate feedback based on personal experience</li>
                <li>Not post defamatory, abusive, or offensive content</li>
                <li>Not include personal contact information</li>
                <li>Allow Handighana to use your review for marketing purposes</li>
              </ul>
            </div>
          </section>

          {/* Verification */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                7. Provider Verification
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                While we conduct verification checks on service providers, Handighana does not guarantee the quality, safety, or legality of services provided. Users should exercise reasonable caution and judgment.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Handighana is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or services provided by third-party providers. Our total liability shall not exceed the amount you paid to us in the past 12 months.
              </p>
            </div>
          </section>

          {/* Disputes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Disputes with Providers
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Disputes between users and service providers should be resolved directly between the parties. Handighana may provide mediation assistance but is not obligated to resolve disputes.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Termination
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We may modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Governing Law
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                These Terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved in the courts of Ghana.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="mb-4">
                If you have questions about these Terms, contact us:
              </p>
              <div className="space-y-2">
                <p>Email: <a href="mailto:legal@handyghana.com" className="text-primary hover:underline">legal@handyghana.com</a></p>
                <p>Phone: <a href="tel:+233504910179" className="text-primary hover:underline">+233 50 491 0179</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

