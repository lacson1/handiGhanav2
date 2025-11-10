import type { Payment, Invoice, Earnings } from '../types'

export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    bookingId: 'booking-1',
    amount: 250,
    status: 'Completed',
    method: 'Mobile Money',
    transactionId: 'TXN-2024-001',
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'payment-2',
    bookingId: 'booking-5',
    amount: 500,
    status: 'Completed',
    method: 'Card',
    transactionId: 'TXN-2024-002',
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'payment-3',
    bookingId: 'booking-9',
    amount: 180,
    status: 'Pending',
    method: 'Mobile Money',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    bookingId: 'booking-1',
    customerName: 'John Doe',
    serviceType: 'Electrical Repair',
    amount: 250,
    status: 'Paid',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { description: 'Electrical Repair Service', quantity: 1, price: 200 },
      { description: 'Materials', quantity: 1, price: 50 }
    ]
  },
  {
    id: 'inv-2',
    bookingId: 'booking-9',
    customerName: 'Jane Smith',
    serviceType: 'Appliance Repair',
    amount: 180,
    status: 'Sent',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { description: 'Appliance Repair Service', quantity: 1, price: 150 },
      { description: 'Parts Replacement', quantity: 1, price: 30 }
    ]
  }
]

export const mockEarnings: Earnings[] = [
  {
    id: 'earn-1',
    period: 'January 2024',
    totalEarnings: 750,
    completedJobs: 2,
    pendingPayout: 180,
    paidOut: 750,
    transactions: mockPayments.filter(p => p.status === 'Completed')
  },
  {
    id: 'earn-2',
    period: 'December 2023',
    totalEarnings: 1200,
    completedJobs: 5,
    pendingPayout: 0,
    paidOut: 1200,
    transactions: []
  }
]

