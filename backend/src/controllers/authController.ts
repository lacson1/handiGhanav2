import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../services/emailService'
import { PrismaError } from '../types/controller.types'
import { prisma } from '../lib/prisma'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Existing login function
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { provider: true }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check if user has a password (OAuth users might not have a password)
    if (!user.password) {
      return res.status(401).json({ 
        message: 'This account uses social login. Please sign in with Google.' 
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        provider: user.provider
      }
    })
  } catch (error: unknown) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    res.status(500).json({ message: 'Login failed', error: errorMessage })
  }
}

// Existing register function
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role, consentPrivacy, consentTerms, consentMarketing } = req.body

    // Validate required consents (Ghana Act 843 compliance)
    if (!consentPrivacy || !consentTerms) {
      return res.status(400).json({ 
        message: 'You must accept the Privacy Policy and Terms of Service to register' 
      })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with consent data
    const now = new Date()
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || 'CUSTOMER',
        consentPrivacy: consentPrivacy || false,
        consentTerms: consentTerms || false,
        consentMarketing: consentMarketing || false,
        consentPrivacyAt: consentPrivacy ? now : null,
        consentTermsAt: consentTerms ? now : null,
        consentMarketingAt: consentMarketing ? now : null,
      }
    })

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'User already exists' })
      }
    }
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    res.status(500).json({ message: 'Registration failed', error: errorMessage })
  }
}

// NEW: Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return res.json({ 
        message: 'If an account exists with that email, you will receive a password reset link' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send email
    await sendPasswordResetEmail(user.email, user.name, resetToken)

    res.json({ 
      message: 'If an account exists with that email, you will receive a password reset link' 
    })
  } catch (error: unknown) {
    console.error('Password reset request error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request'
    res.status(500).json({ message: 'Failed to process request', error: errorMessage })
  }
}

// NEW: Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date() // Token not expired
        }
      }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    res.json({ message: 'Password reset successful. You can now login with your new password.' })
  } catch (error: unknown) {
    console.error('Password reset error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
    res.status(500).json({ message: 'Password reset failed', error: errorMessage })
  }
}

// Existing get profile function
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as { userId?: string }).userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { provider: true }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      provider: user.provider
    })
  } catch (error: unknown) {
    console.error('Get profile error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to get profile'
    res.status(500).json({ message: 'Failed to get profile', error: errorMessage })
  }
}

// Export user data (Ghana Act 843 - Right to data portability)
export const exportUserData = async (req: Request, res: Response) => {
  try {
    const userId = (req as { userId?: string }).userId

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        provider: {
          include: {
            services: true
          }
        },
        bookings: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                category: true,
                location: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        reviews: {
          include: {
            provider: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        subscriptions: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        },
        settings: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prepare export data (exclude sensitive fields like password)
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        consentPrivacy: user.consentPrivacy,
        consentTerms: user.consentTerms,
        consentMarketing: user.consentMarketing,
        consentPrivacyAt: user.consentPrivacyAt,
        consentTermsAt: user.consentTermsAt,
        consentMarketingAt: user.consentMarketingAt,
      },
      provider: user.provider ? {
        id: user.provider.id,
        name: user.provider.name,
        category: user.provider.category,
        location: user.provider.location,
        description: user.provider.description,
        phone: user.provider.phone,
        whatsapp: user.provider.whatsapp,
        verified: user.provider.verified,
        rating: user.provider.rating,
        reviewCount: user.provider.reviewCount,
        availability: user.provider.availability,
        serviceAreas: user.provider.serviceAreas,
        skills: user.provider.skills,
        joinedDate: user.provider.joinedDate,
        services: user.provider.services.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          basePrice: s.basePrice,
          duration: s.duration,
          pricingModel: s.pricingModel
        }))
      } : null,
      bookings: user.bookings.map(b => ({
        id: b.id,
        date: b.date,
        time: b.time,
        serviceType: b.serviceType,
        status: b.status,
        amount: b.amount,
        paymentStatus: b.paymentStatus,
        paymentMethod: b.paymentMethod,
        notes: b.notes,
        createdAt: b.createdAt,
        provider: b.provider
      })),
      reviews: user.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        provider: r.provider,
        createdAt: r.createdAt,
        isVerified: r.isVerified
      })),
      subscriptions: user.subscriptions.map(s => ({
        id: s.id,
        status: s.status,
        startDate: s.startDate,
        nextBillingDate: s.nextBillingDate,
        service: s.service
      })),
      settings: user.settings
    }

    res.json({
      message: 'Data export successful',
      data: exportData,
      exportedAt: new Date().toISOString(),
      format: 'JSON'
    })
  } catch (error: unknown) {
    console.error('Data export error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Export failed'
    res.status(500).json({ message: 'Export failed', error: errorMessage })
  }
}

// Delete user account (Ghana Act 843 - Right to erasure)
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as { userId?: string }).userId

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete user (cascade will handle related records based on schema)
    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ 
      message: 'Account deleted successfully. All your data has been permanently removed.' 
    })
  } catch (error: unknown) {
    console.error('Account deletion error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Deletion failed'
    res.status(500).json({ message: 'Deletion failed', error: errorMessage })
  }
}

export default {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  getProfile
}
