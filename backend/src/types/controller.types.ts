// Shared types for controllers

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface ApiResponse<T = unknown> {
  message?: string
  data?: T
  error?: ApiError
}

// Prisma error type
export interface PrismaError extends Error {
  code?: string
  meta?: {
    target?: string[]
    cause?: string
  }
}

// Review types
export interface Review {
  id: string
  providerId: string
  userId: string
  userName: string
  rating: number
  comment: string
  bookingId?: string | null
  photos?: string[]
  isVerified: boolean
  verifiedAt?: string | null
  providerResponse?: string | null
  providerResponseAt?: string | null
  createdAt: string
  updatedAt: string
}

// Service types
export interface Service {
  id: string
  providerId: string
  name: string
  description: string
  category: string
  pricingModel: 'pay-as-you-go' | 'subscription'
  basePrice: number
  duration: number
  isActive: boolean
  monthlyPrice?: number
  billingCycle?: string
  subscriptionFeatures?: string[]
  visitsPerPeriod?: number
}

// Subscription types
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED'

export interface Subscription {
  id: string
  userId: string
  serviceId: string
  providerId: string
  status: SubscriptionStatus
  startDate: string
  nextBillingDate: string
  lastBillingDate: string
  visitsUsed: number
  visitsRemaining?: number
  autoRenew: boolean
  cancelledAt?: string
  createdAt: string
  updatedAt: string
}

// Payout types
export type PayoutMethod = 'MOBILE_MONEY_MTN' | 'MOBILE_MONEY_VODAFONE' | 'MOBILE_MONEY_AIRTELTIGO' | 'BANK_TRANSFER'
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface Payout {
  id: string
  providerId: string
  amount: number
  method: PayoutMethod
  status: PayoutStatus
  recipientNumber?: string
  bankAccount?: string
  transactionId?: string
  createdAt: string
  completedAt?: string
}

export interface Wallet {
  providerId: string
  balance: number
  pendingBalance: number
  totalEarned: number
  totalWithdrawn: number
  lastUpdated: string
}

// Earnings types
export interface EarningsDataPoint {
  date: string
  dayKey: string
  earnings: number
  jobs: number
  payout: number
  transactions: number
}

export interface MonthlyTrend {
  month: string
  monthNumber: number
  year: number
  earnings: number
  jobs: number
  avgPerJob: number
  payout: number
}

export interface CategoryBreakdown {
  category: string
  earnings: number
  jobs: number
  percentage: number
  color: string
}

