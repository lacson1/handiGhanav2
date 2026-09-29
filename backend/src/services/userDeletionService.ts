import { BookingStatus, UserRole } from '@prisma/client'
import { io } from '../server'
import { prisma } from '../lib/prisma'

export type SoftDeleteResult =
  | { ok: true; user: { id: string; name: string; email: string } }
  | { ok: false; status: number; message: string }

// Soft-delete a user account. The rows are kept so bookings, payments,
// payouts and reviews stay intact, but personal data is anonymised and
// every way to sign in is cleared. Used by both admin and self-service
// deletion so the two can't drift apart.
export const softDeleteUser = async (userId: string): Promise<SoftDeleteResult> => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: { select: { id: true } },
    },
  })

  if (!user) {
    return { ok: false, status: 404, message: 'User not found' }
  }

  if (user.role === UserRole.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN, deletedAt: null } })
    if (adminCount <= 1) {
      return { ok: false, status: 400, message: 'Cannot delete the last admin account' }
    }
  }

  // Block deletion while the user has active bookings, as a customer or as a provider
  const activeBookings = await prisma.booking.count({
    where: {
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      OR: [
        { userId: user.id },
        ...(user.provider ? [{ providerId: user.provider.id }] : []),
      ],
    },
  })

  if (activeBookings > 0) {
    return {
      ok: false,
      status: 400,
      message: `Cannot delete an account with ${activeBookings} active booking(s). Please cancel or complete them first.`,
    }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        deletedAt: new Date(),
        name: 'Deleted user',
        email: `deleted-${user.id}@deleted.invalid`,
        phone: null,
        avatar: null,
        password: null,
        googleId: null,
        authProvider: null,
        resetToken: null,
        resetTokenExpiry: null,
        consentMarketing: false,
      },
    }),
    ...(user.provider
      ? [
          prisma.provider.update({
            where: { id: user.provider.id },
            data: {
              name: 'Deleted provider',
              description: '',
              phone: null,
              whatsapp: null,
              avatar: null,
              image: null,
              idDocumentUrl: null,
              references: [],
              workPhotos: [],
              workVideos: [],
              bankAccount: null,
              mobileMoneyNumber: null,
              mobileMoneyProvider: null,
              verified: false,
              availability: 'NOT_AVAILABLE',
            },
          }),
        ]
      : []),
  ])

  // Emit real-time update
  io.emit('user:deleted', { id: user.id, name: user.name })
  if (user.provider) {
    io.emit('provider:deleted', { id: user.provider.id, name: user.name })
  }

  return { ok: true, user: { id: user.id, name: user.name, email: user.email } }
}
