import { z } from 'zod'

export const createReviewSchema = z.object({
  body: z.object({
    providerId: z.string().min(1, 'Provider ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().min(10, 'Comment must be at least 10 characters'),
    bookingId: z.string().optional(),
    photos: z.array(z.string().url()).optional(),
    isVerified: z.boolean().optional(),
  }),
})

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Review ID is required'),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).optional(),
    response: z.string().optional(),
  }),
})

