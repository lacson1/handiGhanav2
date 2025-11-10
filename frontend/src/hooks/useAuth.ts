import { useAuth as useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const auth = useAuthContext()
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isProvider: auth.isProvider,
    login: auth.login,
    logout: auth.logout,
    signIn: auth.login, // Alias for login
    signOut: auth.logout, // Alias for logout
  }
}

