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
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              We are committed to complying with Ghana's Data Protection Act, 2012 (Act 843) and ensuring your personal data is protected in accordance with applicable data protection laws.
            </p>
            {/* DPC Registration - Update this when you receive your registration number */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Data Protection Commission Registration:</strong> We are registered with the Data Protection Commission (DPC) of Ghana. 
                {/* Registration Number: [YOUR_DPC_REGISTRATION_NUMBER] - Update this after registration */}
              </p>
            </div>
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
              Your Rights (Ghana Act 843)
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>Under Ghana's Data Protection Act 843, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Right to Access:</strong> You can request and receive a copy of all your personal data we hold. You can export your data from your account settings.</li>
                <li><strong>Right to Rectification:</strong> You can correct inaccurate or incomplete information by updating your profile in account settings.</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your personal data at any time. You can delete your account from your account settings, which will permanently remove all your data.</li>
                <li><strong>Right to Object:</strong> You can object to certain processing activities, such as marketing communications.</li>
                <li><strong>Right to Data Portability:</strong> You can export your data in a structured, commonly used format (JSON) from your account settings.</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw your consent at any time by updating your preferences in account settings.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@handyghana.com" className="text-primary hover:underline">privacy@handyghana.com</a> or use the features available in your account settings.
              </p>
            </div>
          </section>

          {/* Data Transfer */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Transfer and International Processing
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your personal data may be transferred to and processed in countries outside of Ghana, including the United States, where our backend servers and some of our service providers are located.
              </p>
              <p>
                We ensure appropriate safeguards are in place for such transfers, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard Contractual Clauses (SCCs) with our service providers</li>
                <li>Data Processing Agreements (DPAs) with all third-party processors</li>
                <li>Verification that destination countries provide an adequate level of data protection</li>
                <li>Implementation of appropriate technical and organizational security measures</li>
              </ul>
              <p className="mt-4">
                <strong>Third-Party Service Providers:</strong> We work with the following service providers who may process your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Fly.io</strong> (USA) - Backend hosting and data processing</li>
                <li><strong>Vercel</strong> (Global) - Frontend hosting and content delivery</li>
                <li><strong>Cloudinary</strong> (Global) - Image storage and processing</li>
                <li><strong>Sentry</strong> (Global) - Error tracking and monitoring</li>
                <li><strong>Paystack</strong> (Ghana) - Payment processing</li>
              </ul>
              <p className="mt-4">
                All our service providers are bound by strict data processing agreements and are required to maintain the same level of data protection as required under Ghana's Data Protection Act 843.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cookies and Tracking Technologies
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We use cookies and similar tracking technologies to improve your experience on our platform. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our platform</li>
                <li>Provide personalized content and features</li>
                <li>Improve security and prevent fraud</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our platform.
              </p>
              <p>
                We will ask for your consent before using non-essential cookies. You can withdraw your consent at any time.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Retention
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Data:</strong> Retained until you delete your account</li>
                <li><strong>Booking History:</strong> Retained for 7 years for tax and legal record-keeping purposes</li>
                <li><strong>Payment Information:</strong> Processed securely by Paystack and retained per their policy</li>
                <li><strong>ID Documents:</strong> Deleted after provider verification is complete</li>
                <li><strong>Analytics Data:</strong> Retained for 90 days for service improvement purposes</li>
              </ul>
              <p className="mt-4">
                When you delete your account, we will permanently delete or anonymize your personal data, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </div>
          </section>

          {/* Data Breach Notification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Breach Notification
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                In the event of a data breach that may affect your personal data, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Notify the Data Protection Commission (DPC) promptly</li>
                <li>Notify affected users without undue delay</li>
                <li>Provide information about the nature of the breach</li>
                <li>Explain the measures we are taking to address the breach</li>
                <li>Advise on steps you can take to protect yourself</li>
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
                If you have any questions about this Privacy Policy, our data practices, or to exercise your rights under Ghana's Data Protection Act 843, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@handyghana.com" className="text-primary hover:underline">privacy@handyghana.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+233504910179" className="text-primary hover:underline">+233 50 491 0179</a></p>
                <p className="mt-4">
                  <strong>Data Protection Officer:</strong> For data protection inquiries, you can also contact our Data Protection Officer at{' '}
                  <a href="mailto:dpo@handyghana.com" className="text-primary hover:underline">dpo@handyghana.com</a>
                </p>
                <p className="mt-4">
                  <strong>Data Protection Commission (DPC):</strong> You also have the right to lodge a complaint with the DPC if you believe your data protection rights have been violated. Contact the DPC at{' '}
                  <a href="https://www.dataprotection.org.gh" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.dataprotection.org.gh</a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

