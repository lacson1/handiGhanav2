import { z } from 'zod'

export const createBookingSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    serviceId: z.string().optional(),
    date: z.string().datetime({ message: 'Invalid date format' }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    serviceType: z.string().min(1, 'Service type is required'),
    notes: z.string().optional(),
  }),
})

export const updateBookingStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], {
      message: 'Invalid booking status',
    }),
  }),
})

