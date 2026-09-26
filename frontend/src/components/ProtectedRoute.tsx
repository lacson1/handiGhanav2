import { Navigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const { isAuthenticated, isProvider, user, isLoading } = useAuth()

  if (isLoading) return <p role="status">Loading your account…</p>

  if (!isAuthenticated) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`} replace />
  }

  if (requireProvider && !isProvider) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

