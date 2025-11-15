import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']).optional(),
    consentPrivacy: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Privacy Policy',
    }),
    consentTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service',
    }),
    consentMarketing: z.boolean().optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
})

export const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
})

