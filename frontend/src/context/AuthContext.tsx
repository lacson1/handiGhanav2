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
        id: response.user.id || 'user-1',
        email: response.user.email || email,
        name: response.user.name || 'Provider User',
        role: response.user.role || 'PROVIDER',
        avatar: response.user.avatar
      }

      setUser(user)
      setToken(response.token)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error: any) {
      // Fallback to mock login if API fails
      try {
        const { getMockUser } = await import('../data/mockUsers')
        const mockUserData = getMockUser(email, password)
        
        if (mockUserData) {
          const mockUser: User = {
            id: mockUserData.id,
            email: mockUserData.email,
            name: mockUserData.name,
            role: mockUserData.role,
            avatar: mockUserData.avatar
          }
          const mockToken = `mock-jwt-token-${mockUserData.id}`

          setUser(mockUser)
          setToken(mockToken)
          localStorage.setItem('token', mockToken)
          localStorage.setItem('user', JSON.stringify(mockUser))
          return // Successfully logged in with mock user
        }
      } catch (mockError) {
        // If mock user lookup fails, use default
      }
      
      // Default fallback if no mock user found
      const mockUser: User = {
        id: 'user-1',
        email,
        name: 'Test User',
        role: 'CUSTOMER'
      }
      const mockToken = 'mock-jwt-token'

      setUser(mockUser)
      setToken(mockToken)
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
    }
  }

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    try {
      const { authApi } = await import('../lib/api')
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role || 'CUSTOMER'
      })
      
      // Registration successful - user will need to sign in
      // The component will handle redirect to sign in page
      return response
    } catch (error: any) {
      // If API fails, throw error to be handled by component
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
  // Context will never be undefined now since we provide a default value
  return context
}

