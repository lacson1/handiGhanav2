import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { SERVICE_CATEGORIES, formatCategory } from '../lib/utils'
import { providerService } from '../services/providerService'
import { useAuth } from '../context/AuthContext'
import ProviderVerification from '../components/ProviderVerification'
import { LocationInput } from '../components/ui/LocationInput'
import { PhoneInput } from '../components/ui/PhoneInput'
import { User, Mail } from 'lucide-react'

export default function BecomeProvider() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: '',
    location: '',
    contact: '',
    bio: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [providerId, setProviderId] = useState<string | undefined>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const provider = await providerService.createProvider(formData)
      if (!provider || !provider.id) {
        throw new Error('Invalid response from server. Provider ID not found.')
      }
      setProviderId(provider.id)
      setShowVerification(true)
      setLoading(false) // Reset loading state on success
      // Don't navigate yet - show verification first
    } catch (err: unknown) {
      console.error('Provider creation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create provider profile. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  if (showVerification && providerId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ProviderVerification
            providerId={providerId}
            onComplete={() => {
              alert('Verification submitted! Your profile will be reviewed within 24-48 hours.')
              if (isAuthenticated && user?.role === 'PROVIDER') {
                navigate('/provider-dashboard')
              } else {
                const message = formData.email 
                  ? 'Provider profile created! Use "Forgot Password" on the sign-in page to set your password and access your account.'
                  : 'Provider profile created! Please sign in.'
                navigate('/signin', { state: { message } })
              }
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Become a Provider
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join Handighana and start offering your services to customers across Ghana.
            {!isAuthenticated && (
              <span className="block mt-2 text-sm">
                You'll be prompted to sign in after creating your profile.
              </span>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isAuthenticated}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>
              {isAuthenticated && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Email is taken from your account
                </p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{formatCategory(cat)}</option>
                ))}
              </select>
            </div>

            <LocationInput
              value={formData.location}
              onChange={(value) => handleFieldChange('location', value)}
              label="Location *"
              hint="Select your primary service location"
              required
            />

            <PhoneInput
              value={formData.contact}
              onChange={(value) => handleFieldChange('contact', value)}
              label="Contact (Phone/WhatsApp) *"
              hint="Your main contact number for customers"
              required
              showValidation
            />

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio/Description *
              </label>
              <textarea
                id="bio"
                name="bio"
                required
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us about your services and experience..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

