import type { User, Provider, Booking, Service, Subscription } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiRequestError extends Error {
  statusCode?: number
  details?: unknown

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.statusCode = statusCode
    this.details = details
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 1
): Promise<T> {
  const token = localStorage.getItem('token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let lastError: Error | null = null

  // Retry logic for failed requests
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      // Handle specific HTTP status codes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: getErrorMessageForStatus(response.status) 
        }))

        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/signin'
        }

        throw new ApiRequestError(
          errorData.message || getErrorMessageForStatus(response.status),
          response.status,
          errorData
        )
      }

      return response.json()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on client errors (4xx) or authentication errors
      if (error instanceof ApiRequestError && error.statusCode && error.statusCode < 500) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

function getErrorMessageForStatus(status: number): string {
  const errorMessages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Authentication required. Please sign in.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This resource already exists or conflicts with another.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again.',
    503: 'Service temporarily unavailable. Please try again.',
  }

  return errorMessages[status] || 'An unexpected error occurred. Please try again.'
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  register: async (data: { email: string; password: string; name: string; phone?: string; role?: string; consentPrivacy?: boolean; consentTerms?: boolean; consentMarketing?: boolean }) => {
    return apiRequest<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  getProfile: async () => {
    return apiRequest<User>('/auth/profile')
  },
  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  exportData: async () => {
    return apiRequest<{ message: string; data: Record<string, unknown>; exportedAt: string }>('/auth/export')
  },
  deleteAccount: async () => {
    return apiRequest<{ message: string }>('/auth/account', {
      method: 'DELETE',
    })
  },
}

// Providers API
export const providersApi = {
  getAll: async (filters?: {
    category?: string
    location?: string
    verified?: boolean
    availableNow?: boolean
    minRating?: number
    search?: string
  }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    const response = await apiRequest<{ data: Provider[]; pagination?: any }>(`/providers${query ? `?${query}` : ''}`)
    // Handle both array response and object with data property
    return Array.isArray(response) ? response : (response.data || [])
  },
  getById: async (id: string) => {
    return apiRequest<Provider>(`/providers/${id}`)
  },
  create: async (data: Partial<Provider>) => {
    return apiRequest<Provider>('/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: Partial<Provider>) => {
    return apiRequest<Provider>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  getCountsByCity: async () => {
    return apiRequest<Record<string, number>>('/providers/counts/by-city')
  },
}

// Bookings API
export const bookingsApi = {
  getAll: async (filters?: { userId?: string; providerId?: string }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }
    const query = params.toString()
    return apiRequest<any[]>(`/bookings${query ? `?${query}` : ''}`)
  },
  getById: async (id: string) => {
    return apiRequest<any>(`/bookings/${id}`)
  },
  create: async (data: {
    providerId: string
    serviceId?: string
    date: string
    time: string
    serviceType: string
    notes?: string
  }) => {
    return apiRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  updateStatus: async (id: string, status: string) => {
    return apiRequest<any>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  },
}

// Payments API
export const paymentsApi = {
  initialize: async (bookingId: string, amount: number, paymentData?: {
    method?: string
    mobileMoneyNumber?: string
    mobileMoneyProvider?: string
    bankAccount?: string
  }) => {
    return apiRequest<{ authorization_url: string; reference: string }>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ bookingId, amount, ...paymentData }),
    })
  },
  verify: async (reference: string) => {
    return apiRequest<any>(`/payments/verify/${reference}`)
  },
}

// Earnings Analytics API
export const earningsApi = {
  getAnalytics: async (providerId: string, period: '7d' | '30d' | '3m' | '1y' = '30d') => {
    return apiRequest<any>(`/providers/${providerId}/earnings/analytics?period=${period}`)
  },
  getTrends: async (providerId: string, months: number = 12) => {
    return apiRequest<any>(`/providers/${providerId}/earnings/trends?months=${months}`)
  },
  getByCategory: async (providerId: string, period: '7d' | '30d' | '3m' | '1y' = '30d') => {
    return apiRequest<any>(`/providers/${providerId}/earnings/categories?period=${period}`)
  },
  exportReport: async (providerId: string, format: 'json' | 'csv' = 'json', period: '7d' | '30d' | '3m' | '1y' = '30d') => {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/earnings/export?format=${format}&period=${period}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    
    if (format === 'csv') {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `earnings-${period}-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      return { success: true }
    }
    
    return response.json()
  }
}

// Upload API
export const uploadApi = {
  uploadImage: async (file: File, folder: string = 'providers') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it with boundary for multipart/form-data
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },
}

// Reviews API
export const reviewsApi = {
  getAll: async (filters?: { providerId?: string; userId?: string }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
    }
    const query = params.toString()
    return apiRequest<any>(`/reviews${query ? `?${query}` : ''}`)
  },
  getByProvider: async (providerId: string, limit?: number) => {
    const params = new URLSearchParams({ providerId })
    if (limit) params.append('limit', String(limit))
    return apiRequest<any>(`/reviews?${params.toString()}`)
  },
  getById: async (id: string) => {
    return apiRequest<any>(`/reviews/${id}`)
  },
  create: async (data: { 
    providerId: string
    userId: string
    rating: number
    comment: string
    bookingId?: string
    photos?: string[]
    isVerified?: boolean
  }) => {
    return apiRequest<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  addResponse: async (reviewId: string, response: string) => {
    return apiRequest<any>(`/reviews/${reviewId}/response`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    })
  },
  update: async (id: string, data: { rating?: number; comment?: string; response?: string }) => {
    return apiRequest<any>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: string) => {
    return apiRequest<any>(`/reviews/${id}`, {
      method: 'DELETE',
    })
  },
}

// Subscriptions API
export const subscriptionsApi = {
  getAll: async (filters?: { userId?: string; status?: string }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return apiRequest<any[]>(`/subscriptions${query ? `?${query}` : ''}`)
  },
  getById: async (id: string) => {
    return apiRequest<any>(`/subscriptions/${id}`)
  },
  create: async (data: {
    userId: string
    serviceId: string
    providerId: string
  }) => {
    return apiRequest<Subscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: Partial<Subscription>) => {
    return apiRequest<Subscription>(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  cancel: async (id: string) => {
    return apiRequest<Subscription>(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    })
  },
  pause: async (id: string) => {
    return apiRequest<Subscription>(`/subscriptions/${id}/pause`, {
      method: 'POST',
    })
  },
  resume: async (id: string) => {
    return apiRequest<Subscription>(`/subscriptions/${id}/resume`, {
      method: 'POST',
    })
  },
}

// Stats API
export const statsApi = {
  getPlatformStats: async () => {
    return apiRequest<{
      totalProviders: number
      verifiedProviders: number
      totalBookings: number
      completedBookings: number
      totalReviews: number
      activeUsers: number
      averageRating: number
      totalCategories: number
      totalLocations: number
    }>('/stats/platform')
  },
  getRecentReviews: async (limit: number = 3) => {
    return apiRequest<any[]>(`/stats/reviews/recent?limit=${limit}`)
  },
  getTrendingSearches: async (limit: number = 5, days: number = 30) => {
    return apiRequest<Array<{ term: string; count: number }>>(`/stats/trending-searches?limit=${limit}&days=${days}`)
  },
  trackSearch: async (data: { query?: string; category?: string; location?: string }) => {
    return apiRequest<{ message: string }>('/stats/track-search', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Chat API
export const chatApi = {
  getOrCreateChat: async (providerId: string, bookingId?: string) => {
    return apiRequest<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ providerId, bookingId }),
    })
  },
  getUserChats: async () => {
    return apiRequest<any>('/chat')
  },
  getChatMessages: async (chatId: string) => {
    return apiRequest<any>(`/chat/${chatId}/messages`)
  },
  sendMessage: async (chatId: string, content: string, messageType: string = 'text', fileUrl?: string) => {
    return apiRequest<any>(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, messageType, fileUrl }),
    })
  },
  markAsRead: async (chatId: string) => {
    return apiRequest<any>(`/chat/${chatId}/read`, {
      method: 'PUT',
    })
  },
}

// Services API
export const servicesApi = {
  getAll: async (filters?: { providerId?: string; isActive?: boolean }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return apiRequest<any[]>(`/services${query ? `?${query}` : ''}`)
  },
  getById: async (id: string) => {
    return apiRequest<any>(`/services/${id}`)
  },
  create: async (data: {
    providerId: string
    name: string
    description: string
    category: string
    pricingModel: 'pay-as-you-go' | 'subscription'
    basePrice: number
    duration: number
    isActive?: boolean
    monthlyPrice?: number
    billingCycle?: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
    subscriptionFeatures?: string[]
    visitsPerPeriod?: number
  }) => {
    return apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: Partial<Service>) => {
    return apiRequest<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: string) => {
    return apiRequest<any>(`/services/${id}`, {
      method: 'DELETE',
    })
  },
}

// Settings API
export const settingsApi = {
  getSettings: async () => {
    return apiRequest<{
      id: string
      userId: string
      emailNotifications: boolean
      smsNotifications: boolean
      pushNotifications: boolean
      bookingReminders: boolean
      promotions: boolean
      profileVisibility: 'public' | 'private'
      showEmail: boolean
      showPhone: boolean
    }>('/settings')
  },
  updateSettings: async (data: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    pushNotifications?: boolean
    bookingReminders?: boolean
    promotions?: boolean
    profileVisibility?: 'public' | 'private'
    showEmail?: boolean
    showPhone?: boolean
  }) => {
    return apiRequest<{ message: string; settings: any }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest<{ message: string }>('/settings/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

// Admin API
export const adminApi = {
  getProviders: async (filters?: { status?: string; verified?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return apiRequest<{ providers: any[]; pagination: any }>(`/admin/providers${query ? `?${query}` : ''}`)
  },
  verifyProvider: async (id: string, approved: boolean, reason?: string) => {
    return apiRequest<any>(`/admin/providers/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ approved, reason }),
    })
  },
  suspendProvider: async (id: string, suspend: boolean, reason?: string) => {
    return apiRequest<any>(`/admin/providers/${id}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ suspend, reason }),
    })
  },
  deleteProvider: async (id: string) => {
    return apiRequest<{ message: string; deletedProvider: { id: string; name: string } }>(`/admin/providers/${id}`, {
      method: 'DELETE',
    })
  },
  getBookings: async (filters?: { status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return apiRequest<{ bookings: any[]; pagination: any }>(`/admin/bookings${query ? `?${query}` : ''}`)
  },
  getStats: async () => {
    return apiRequest<any>('/admin/stats')
  },
  getAnalytics: async (filters?: { startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    const query = params.toString()
    return apiRequest<any>(`/admin/analytics${query ? `?${query}` : ''}`)
  },
}

