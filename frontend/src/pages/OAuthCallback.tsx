import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const userStr = searchParams.get('user')
      const error = searchParams.get('error')

      if (error) {
        console.error('OAuth error:', error)
        navigate('/signin?error=Google sign-in failed')
        return
      }

      if (!token || !userStr) {
        navigate('/signin?error=Invalid callback')
        return
      }

      try {
        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userStr))

        // Validate required fields
        if (!userData || !userData.id || !userData.email || !userData.name || !userData.role) {
          throw new Error('Invalid user data received from authentication')
        }

        // Map to User type (only include fields that match User interface)
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar || null
        }

        // Use loginWithToken to update auth context
        loginWithToken(token, user)

        // Redirect based on role
        if (user.role === 'PROVIDER') {
          navigate('/provider-dashboard')
        } else if (user.role === 'ADMIN') {
          navigate('/admin')
        } else {
          navigate('/my-bookings')
        }
      } catch (error: unknown) {
        console.error('Error processing OAuth callback:', error)
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        navigate(`/signin?error=${encodeURIComponent(errorMessage)}`)
      }
    }

    handleCallback()
  }, [searchParams, navigate, loginWithToken])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}

