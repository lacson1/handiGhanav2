import { Shield, Lock, Eye, Users, FileText, Mail } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
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
              At Handighana, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, phone number</li>
                <li>Location and service preferences</li>
                <li>Booking history and service requests</li>
                <li>Payment information (processed securely)</li>
                <li>Reviews and ratings</li>
                <li>Communications with us and service providers</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Connect you with service providers</li>
                <li>Process bookings and payments</li>
                <li>Send you confirmations, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Detect, prevent, and address fraud and security issues</li>
                <li>Analyze platform usage and improve user experience</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information Sharing
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>We may share your information in the following situations:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With Service Providers:</strong> We share necessary booking details with providers to fulfill your service requests</li>
                <li><strong>With Your Consent:</strong> We share information when you explicitly agree</li>
                <li><strong>For Legal Reasons:</strong> We may disclose information if required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> Information may be transferred in connection with business transactions</li>
              </ul>
              <p className="font-semibold text-gray-900 dark:text-white">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Security
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your information</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h2>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p>Email: <a href="mailto:privacy@handyghana.com" className="text-primary hover:underline">privacy@handyghana.com</a></p>
                <p>Phone: <a href="tel:+233504910179" className="text-primary hover:underline">+233 50 491 0179</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

