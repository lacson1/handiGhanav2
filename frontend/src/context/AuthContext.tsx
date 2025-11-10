import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
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
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isProvider: false
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

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
    } catch (error: any) {
      throw new Error(error.message || 'Invalid credentials')
    }
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
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
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
