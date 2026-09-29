import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  authProvider?: 'local' | 'google' | 'facebook' | string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithToken: (token: string, user: User) => void
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isProvider: boolean
}

// Default context value to prevent undefined context
const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  login: async () => {},
  loginWithToken: () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isProvider: false
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

function readStoredSession(): { token: string; user: User } | null {
  try {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) as User }
    }
  } catch {
    // Storage unavailable or corrupt user data: treat as signed out
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Restore the stored session synchronously so the first render already
  // knows the user is signed in. Restoring it in an effect let ProtectedRoute
  // redirect to "/" before the effect ran, whenever a protected page was loaded.
  const [storedSession] = useState(readStoredSession)
  const [user, setUser] = useState<User | null>(storedSession?.user ?? null)
  const [token, setToken] = useState<string | null>(storedSession?.token ?? null)

  const login = async (email: string, password: string) => {
    try {
      const { authApi } = await import('../lib/api')
      const response = await authApi.login(email, password)
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        avatar: response.user.avatar
      }

      setUser(user)
      setToken(response.token)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials'
      throw new Error(errorMessage)
    }
  }

  const loginWithToken = (token: string, user: User) => {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<void> => {
    try {
      const { authApi } = await import('../lib/api')
      const result = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role || 'CUSTOMER'
      })
      
      // Registration successful - user will need to sign in
      // The component will handle redirect to sign in page
      void result
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginWithToken,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isProvider: user?.role === 'PROVIDER'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
