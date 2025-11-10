export type ServiceCategory = 
  | "Electrician"
  | "Plumber"
  | "Cleaner"
  | "Handyman"
  | "Carpenter"
  | "Painter"
  | "Mechanic"
  | "Gardener"
  | "Tiler"
  | "Welder"

export type GhanaCity = 
  | "Accra"
  | "Kumasi"
  | "Cape Coast"
  | "Takoradi"
  | "Tema"
  | "Tamale"
  | "Sunyani"
  | "Ho"
  | "Koforidua"
  | "Techiman"

export interface Provider {
  id: string
  name: string
  category: ServiceCategory
  location: GhanaCity
  rating: number
  reviewCount: number
  completionRate?: number
  verified: boolean
  description: string
  availability: "Available Now" | "Available Soon" | "Not Available"
  quickSlots?: string[]
  phone?: string
  whatsapp?: string
  image?: string
  avatar?: string
  serviceAreas?: string[]
  skills?: string[]
  joinedDate?: string
}

export interface Booking {
  id: string
  providerId: string
  userId: string
  date: string
  time: string
  serviceType: string
  notes?: string
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  createdAt: string
}

export interface Review {
  id: string
  providerId: string
  userId: string
  bookingId?: string // Link to completed booking
  rating: number
  comment: string
  photos?: string[] // URLs of work photos
  providerResponse?: string // Provider's response
  providerResponseAt?: string
  isVerified?: boolean // Verified post-job review
  verifiedAt?: string
  createdAt: string
  userName?: string
}

export interface FilterState {
  category?: ServiceCategory
  location?: GhanaCity
  verified?: boolean
  availableNow?: boolean
  minRating?: number
  searchQuery?: string
  pricingModel?: PricingModel // Filter by service pricing model
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded'
  method: 'Mobile Money' | 'Card' | 'Bank Transfer' | 'Cash'
  transactionId?: string
  paidAt?: string
  createdAt: string
}

export interface Invoice {
  id: string
  bookingId: string
  customerName: string
  serviceType: string
  amount: number
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
  dueDate: string
  issuedDate: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

export interface Earnings {
  id: string
  period: string
  totalEarnings: number
  completedJobs: number
  pendingPayout: number
  paidOut: number
  transactions: Payment[]
}

export interface WorkflowTask {
  id: string
  bookingId: string
  title: string
  description: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate: string
  assignedTo?: string
  notes?: string
  createdAt: string
  tags?: string[]
  estimatedHours?: number
  actualHours?: number
  completedAt?: string
  templateId?: string
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  tasks: Omit<WorkflowTask, 'id' | 'bookingId' | 'createdAt' | 'status'>[]
  category: string
}

export interface TaskActivity {
  id: string
  taskId: string
  type: 'created' | 'updated' | 'completed' | 'comment' | 'status_changed'
  message: string
  userId?: string
  createdAt: string
}

export type PricingModel = 'pay-as-you-go' | 'subscription'

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Service {
  id: string
  providerId?: string // Provider who offers this service
  name: string
  description: string
  category: ServiceCategory
  pricingModel: PricingModel
  basePrice: number // For pay-as-you-go: price per service. For subscription: one-time setup fee
  duration: number // in minutes
  isActive: boolean
  image?: string
  // Subscription-specific fields
  monthlyPrice?: number // Monthly subscription price
  billingCycle?: BillingCycle // Billing frequency
  subscriptionFeatures?: string[] // Features included in subscription
  visitsPerPeriod?: number // Number of visits included per billing cycle (null = unlimited)
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  totalBookings: number
  totalSpent: number
  lastBookingDate?: string
  rating?: number
  avatar?: string
}

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED'

export interface Subscription {
  id: string
  userId: string
  serviceId: string
  providerId: string
  status: SubscriptionStatus
  startDate: string
  nextBillingDate: string
  lastBillingDate?: string
  visitsUsed: number
  visitsRemaining?: number // null = unlimited
  autoRenew: boolean
  cancelledAt?: string
  createdAt: string
  updatedAt: string
  // Populated fields
  service?: Service
  provider?: Provider
}

export type DisputeStatus = 'Open' | 'In Review' | 'Resolved' | 'Closed' | 'Escalated'
export type DisputePriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type DisputeType = 'Service Quality' | 'Payment Issue' | 'Cancellation' | 'Refund Request' | 'Other'

export interface Dispute {
  id: string
  bookingId: string
  userId: string
  providerId: string
  type: DisputeType
  status: DisputeStatus
  priority: DisputePriority
  title: string
  description: string
  customerStatement?: string
  providerStatement?: string
  adminNotes?: string
  resolution?: string
  refundAmount?: number
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  // Populated fields
  customerName?: string
  providerName?: string
  serviceType?: string
  bookingDate?: string
  amount?: number
}

