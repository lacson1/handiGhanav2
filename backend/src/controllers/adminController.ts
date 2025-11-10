import { Request, Response } from 'express'
import prisma from '../prisma'
import { io } from '../server'
import { sendProviderApprovalEmail } from '../services/emailService'
import { sendSMS } from '../services/smsService'
import { VerificationStatus } from '@prisma/client'

// Get all providers (admin only)
export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const { status, verified, page = 1, limit = 20 } = req.query

    const where: any = {}

    if (status) {
      where.verificationStatus = status as VerificationStatus
    }
    if (verified === 'true') {
      where.verified = true
    } else if (verified === 'false') {
      where.verified = false
    }

    const providers = await prisma.provider.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
        bookings: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.provider.count({ where })

    res.json({
      providers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error: any) {
    console.error('Error fetching providers:', error)
    res.status(500).json({ message: 'Failed to fetch providers', error: error.message })
  }
}

// Approve/verify provider
export const verifyProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { approved, reason } = req.body

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        verified: approved,
        verificationStatus: approved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED,
        verifiedAt: approved ? new Date() : null,
      },
    })

    // Send notification
    io.emit('provider:verification', {
      providerId: id,
      verified: approved,
      reason,
    })

    // Send email notification
    if (approved && provider.user) {
      await sendProviderApprovalEmail(provider.user.email, provider.name)
      
      // Send SMS if phone available
      if (provider.phone) {
        await sendSMS({
          to: provider.phone,
          message: `Congratulations! Your HandyGhana provider account has been approved. You can now start accepting bookings.`,
        })
      }
    }

    res.json({
      message: `Provider ${approved ? 'approved' : 'rejected'} successfully`,
      provider: updatedProvider,
    })
  } catch (error: any) {
    console.error('Error verifying provider:', error)
    res.status(500).json({ message: 'Failed to verify provider', error: error.message })
  }
}

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProviders,
      verifiedProviders,
      pendingProviders,
      totalBookings,
      completedBookings,
      totalRevenue,
      totalUsers,
    ] = await Promise.all([
      prisma.provider.count(),
      prisma.provider.count({ where: { verified: true } }),
      prisma.provider.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'Completed' } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      prisma.user.count(),
    ])

    // Get recent activity
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        provider: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
    })

    const recentProviders = await prisma.provider.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    })

    res.json({
      stats: {
        providers: {
          total: totalProviders,
          verified: verifiedProviders,
          pending: pendingProviders,
          rejectionRate: totalProviders > 0 ? ((totalProviders - verifiedProviders) / totalProviders * 100).toFixed(1) : 0,
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : 0,
        },
        revenue: {
          total: totalRevenue._sum.amount || 0,
          average: totalBookings > 0 ? ((totalRevenue._sum.amount || 0) / totalBookings).toFixed(2) : 0,
        },
        users: {
          total: totalUsers,
        },
      },
      recentActivity: {
        bookings: recentBookings,
        providers: recentProviders,
      },
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message })
  }
}

// Suspend/unsuspend provider
export const toggleProviderSuspension = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { suspend, reason } = req.body

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: {
        canReceiveBookings: !suspend,
        verificationStatus: suspend ? VerificationStatus.SUSPENDED : provider.verificationStatus,
      },
    })

    // Notify provider
    io.to(`provider-${id}`).emit('account:status', {
      suspended: suspend,
      reason,
    })

    // Send notification
    if (provider.user) {
      await sendSMS({
        to: provider.phone || '',
        message: suspend
          ? `Your HandyGhana account has been suspended. Reason: ${reason}. Contact support for assistance.`
          : `Your HandyGhana account has been reactivated. You can now receive bookings again.`,
      })
    }

    res.json({
      message: `Provider ${suspend ? 'suspended' : 'reactivated'} successfully`,
      provider: updatedProvider,
    })
  } catch (error: any) {
    console.error('Error toggling provider suspension:', error)
    res.status(500).json({ message: 'Failed to update provider status', error: error.message })
  }
}

// Get all bookings (admin only)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    const where: any = {}
    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payment: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.booking.count({ where })

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message })
  }
}

// Get platform analytics
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter: any = {}
    if (startDate) dateFilter.gte = new Date(startDate as string)
    if (endDate) dateFilter.lte = new Date(endDate as string)

    const where = dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}

    // Growth metrics
    const [newProviders, newUsers, newBookings] = await Promise.all([
      prisma.provider.count({ where }),
      prisma.user.count({ where }),
      prisma.booking.count({ where }),
    ])

    // Revenue by category
    const revenueByCategory = await prisma.payment.groupBy({
      by: ['bookingId'],
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
        ...(where.createdAt && { createdAt: where.createdAt }),
      },
    })

    // Provider performance
    const topProviders = await prisma.provider.findMany({
      take: 10,
      orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
      include: {
        bookings: {
          where: { status: 'Completed' },
          select: { id: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    })

    res.json({
      growth: {
        providers: newProviders,
        users: newUsers,
        bookings: newBookings,
      },
      revenue: {
        total: revenueByCategory.reduce((sum, item) => sum + (item._sum.amount || 0), 0),
        byCategory: revenueByCategory,
      },
      topProviders: topProviders.map((p) => ({
        id: p.id,
        name: p.name,
        rating: p.rating,
        completedBookings: p.bookings.length,
        averageReview: p.reviews.length > 0
          ? (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(1)
          : 0,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message })
  }
}

export default {
  getAllProviders,
  verifyProvider,
  getDashboardStats,
  toggleProviderSuspension,
  getAllBookings,
  getAnalytics,
}

