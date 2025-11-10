import type { Customer } from '../types'

export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: 'John Doe',
    email: 'customer@test.com',
    phone: '+233241111111',
    totalBookings: 3,
    totalSpent: 750,
    lastBookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5
  },
  {
    id: 'customer-2',
    name: 'Mary Mensah',
    email: 'mary@test.com',
    phone: '+233241111112',
    totalBookings: 2,
    totalSpent: 500,
    lastBookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4.5
  },
  {
    id: 'customer-3',
    name: 'Kofi Asante',
    email: 'kofi@test.com',
    phone: '+233241111113',
    totalBookings: 1,
    totalSpent: 180,
    lastBookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5
  }
]

