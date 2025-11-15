import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { EmailInput } from '../components/ui/EmailInput'
import { PasswordInput } from '../components/ui/PasswordInput'
import { PhoneInput } from '../components/ui/PhoneInput'
import { User } from 'lucide-react'
import { validateEmail, validatePhoneNumber, checkPasswordStrength } from '../utils/formHelpers'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    consentPrivacy: false,
    consentTerms: false,
    consentMarketing: false,
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required'
    } else if (!validatePhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid Ghana phone number'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else {
      const strength = checkPasswordStrength(formData.password)
      if (strength.score < 2) {
        errors.password = 'Password is too weak. Please choose a stronger password.'
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.consentPrivacy) {
      errors.consentPrivacy = 'You must accept the Privacy Policy to continue'
    }

    if (!formData.consentTerms) {
      errors.consentTerms = 'You must accept the Terms of Service to continue'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      setError('Please fix the errors above')
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'CUSTOMER',
      })
      // Note: Consent fields (consentPrivacy, consentTerms, consentMarketing) 
      // should be handled separately if needed for compliance

      // After successful registration, redirect to sign in
      navigate('/signin', {
        state: {
          message: 'Account created successfully! Please sign in.',
          email: formData.email
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({
        ...fieldErrors,
        [field]: ''
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Create Account
          </h2>
          <p className="mt-2 text-center text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Sign up to start booking services
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-5 py-4 rounded-xl text-base font-medium leading-relaxed">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base focus:outline-none focus:border-ghana-green focus:ring-4 focus:ring-ghana-green/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Enter your full name"
                />
                {fieldErrors.name && (
                  <p className="text-base text-red-600 dark:text-red-400 mt-2 font-medium">{fieldErrors.name}</p>
                )}
              </div>
            </div>

            <EmailInput
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              label="Email address"
              error={fieldErrors.email}
              required
              showValidation
              showSuggestions
            />

            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              label="Phone Number"
              error={fieldErrors.phone}
              hint="Ghana phone number (e.g., 024 123 4567)"
              required
              showValidation
            />

            <PasswordInput
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              label="Password"
              error={fieldErrors.password}
              required
              showStrength
              placeholder="Create a strong password"
            />

            <PasswordInput
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              label="Confirm Password"
              error={fieldErrors.confirmPassword}
              required
              placeholder="Confirm your password"
            />
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="consentPrivacy"
                checked={formData.consentPrivacy}
                onChange={(e) => {
                  setFormData({ ...formData, consentPrivacy: e.target.checked })
                  if (fieldErrors.consentPrivacy) {
                    setFieldErrors({ ...fieldErrors, consentPrivacy: '' })
                  }
                }}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                required
              />
              <label htmlFor="consentPrivacy" className="text-sm text-gray-700 dark:text-gray-300">
                I have read and agree to the{' '}
                <Link to="/privacy" className="text-primary hover:underline font-medium" target="_blank">
                  Privacy Policy
                </Link>
                {' '}*
              </label>
            </div>
            {fieldErrors.consentPrivacy && (
              <p className="text-sm text-red-500 ml-6">{fieldErrors.consentPrivacy}</p>
            )}

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="consentTerms"
                checked={formData.consentTerms}
                onChange={(e) => {
                  setFormData({ ...formData, consentTerms: e.target.checked })
                  if (fieldErrors.consentTerms) {
                    setFieldErrors({ ...fieldErrors, consentTerms: '' })
                  }
                }}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                required
              />
              <label htmlFor="consentTerms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline font-medium" target="_blank">
                  Terms of Service
                </Link>
                {' '}*
              </label>
            </div>
            {fieldErrors.consentTerms && (
              <p className="text-sm text-red-500 ml-6">{fieldErrors.consentTerms}</p>
            )}

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="consentMarketing"
                checked={formData.consentMarketing}
                onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="consentMarketing" className="text-sm text-gray-600 dark:text-gray-400">
                I consent to receive marketing communications and promotional offers (optional)
              </label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleSignInButton />

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Want to offer services?{' '}
              <Link
                to="/become-provider"
                className="text-primary hover:underline font-medium"
              >
                Become a Provider
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

