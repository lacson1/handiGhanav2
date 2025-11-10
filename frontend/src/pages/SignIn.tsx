import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import GoogleSignInButton from '../components/GoogleSignInButton'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showDemoOptions, setShowDemoOptions] = useState(false)

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message)
      if (location.state.email) {
        setEmail(location.state.email)
      }
      // Clear state to prevent showing message on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect based on user role
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === 'PROVIDER') {
          navigate('/provider-dashboard')
        } else if (user.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/my-bookings')
        }
      } else {
        navigate('/my-bookings')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    setLoading(true)

    try {
      await login(demoEmail, demoPassword)
      // Redirect based on user role
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.role === 'PROVIDER') {
          navigate('/provider-dashboard')
        } else if (user.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/my-bookings')
        }
      } else {
        navigate('/my-bookings')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSecretClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount >= 5) {
      setShowDemoOptions(!showDemoOptions)
      setClickCount(0)
    }
    
    // Reset click count after 2 seconds
    setTimeout(() => setClickCount(0), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative">
        {/* Hidden Demo Access - Click 5 times on the title area */}
        <div 
          onClick={handleSecretClick}
          className="absolute top-0 left-0 right-0 h-24 cursor-default z-10"
          title=""
          style={{ pointerEvents: 'auto' }}
        />
        
        <div className="relative z-20" style={{ pointerEvents: 'none' }}>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your Handighana account
          </p>
        </div>
        <form className="mt-8 space-y-6 relative z-20" onSubmit={handleSubmit} style={{ pointerEvents: 'auto' }}>
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/20 transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <a href="/forgot-password" className="text-sm font-medium text-ghana-green dark:text-ghana-green-light hover:text-ghana-green-dark transition-colors">
              Forgot your password?
            </a>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want to offer services?{' '}
              <button
                type="button"
                onClick={() => navigate('/become-provider')}
                className="text-primary hover:underline font-medium"
              >
                Become a Provider
              </button>
            </p>
          </div>

          {/* Demo Options - Only shown after secret activation */}
          {showDemoOptions && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
                Demo Access
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('customer@test.com', 'password123')}
                  disabled={loading}
                  className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('provider@test.com', 'password123')}
                  disabled={loading}
                  className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Provider
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@test.com', 'admin123')}
                  disabled={loading}
                  className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

