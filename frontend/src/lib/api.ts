const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  register: async (data: { email: string; password: string; name: string; phone?: string; role?: string }) => {
    return apiRequest<{ message: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  getProfile: async () => {
    return apiRequest<any>('/auth/profile')
  },
  updateProfile: async (data: { name?: string; phone?: string; avatar?: string }) => {
    return apiRequest<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
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
    return apiRequest<any[]>(`/providers${query ? `?${query}` : ''}`)
  },
  getById: async (id: string) => {
    return apiRequest<any>(`/providers/${id}`)
  },
  create: async (data: any) => {
    return apiRequest<any>('/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: any) => {
    return apiRequest<any>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
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
    return apiRequest<any>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: any) => {
    return apiRequest<any>(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  cancel: async (id: string) => {
    return apiRequest<any>(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    })
  },
  pause: async (id: string) => {
    return apiRequest<any>(`/subscriptions/${id}/pause`, {
      method: 'POST',
    })
  },
  resume: async (id: string) => {
    return apiRequest<any>(`/subscriptions/${id}/resume`, {
      method: 'POST',
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
    return apiRequest<any>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  update: async (id: string, data: any) => {
    return apiRequest<any>(`/services/${id}`, {
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

