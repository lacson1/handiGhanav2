import { z } from 'zod'

import { ServiceCategory } from '@prisma/client'
const serviceCategoryEnum = z.nativeEnum(ServiceCategory)

export const createProviderSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional(),
    avatar: z.string().url().optional(),
    firstService: z.object({ name: z.string().min(2), basePrice: z.number().positive(), duration: z.number().int().min(30).max(480) }).optional(),
    category: serviceCategoryEnum,
    location: z.string().min(2, 'Location is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    skills: z.array(z.string()).optional(),
    serviceAreas: z.array(z.string()).optional(),
  }),
})

export const updateProviderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Provider ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    category: serviceCategoryEnum.optional(),
    location: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    skills: z.array(z.string()).optional(),
    serviceAreas: z.array(z.string()).optional(),
    avatar: z.string().url().optional(),
  }),
})

