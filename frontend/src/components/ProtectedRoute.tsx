import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireProvider?: boolean
  requireAdmin?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireProvider = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isProvider, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requireProvider && !isProvider) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

