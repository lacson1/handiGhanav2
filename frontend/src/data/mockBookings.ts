import type { Booking } from '../types'

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    providerId: '1', // Bis FagQ
    userId: 'customer-1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    time: '10:00 AM',
    serviceType: 'Electrical Repair',
    notes: 'Need to fix faulty wiring in the kitchen',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-2',
    providerId: '2', // Ama Brown
    userId: 'customer-2',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    time: '2:00 PM',
    serviceType: 'Deep Cleaning',
    notes: 'Full house deep cleaning needed',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-3',
    providerId: '3', // Kwame Mensah
    userId: 'customer-1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    time: '3:00 PM',
    serviceType: 'Plumbing Repair',
    notes: 'Bathroom leak repair',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-4',
    providerId: '4', // Sarah Osei
    userId: 'customer-3',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    time: '11:00 AM',
    serviceType: 'Furniture Assembly',
    notes: 'Assemble new dining table and chairs',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-5',
    providerId: '1', // Bis FagQ
    userId: 'customer-2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    time: '9:00 AM',
    serviceType: 'Panel Installation',
    notes: 'Install new electrical panel',
    status: 'Completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-6',
    providerId: '2', // Ama Brown
    userId: 'customer-1',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    time: '8:00 AM',
    serviceType: 'Office Cleaning',
    notes: 'Weekly office cleaning service',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-7',
    providerId: '5', // Emmanuel Asante
    userId: 'customer-3',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    time: '1:00 PM',
    serviceType: 'Custom Cabinet',
    notes: 'Build custom kitchen cabinets',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'booking-8',
    providerId: '6', // Grace Adjei
    userId: 'customer-2',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
    time: '10:00 AM',
    serviceType: 'Interior Painting',
    notes: 'Paint living room and bedroom',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Additional booking for provider-1 (Bis FagQ) to test provider dashboard
  {
    id: 'booking-9',
    providerId: '1', // Bis FagQ (provider-1)
    userId: 'customer-3',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    time: '2:00 PM',
    serviceType: 'Appliance Repair',
    notes: 'Fix washing machine',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

