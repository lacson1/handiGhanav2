import { createBooking } from '../../controllers/bookingController'
import { prisma } from '../../lib/prisma'
import type { AuthRequest } from '../../middleware/auth'
import type { Response } from 'express'
jest.mock('../../server', () => ({ io: { to: jest.fn(() => ({ emit: jest.fn() })) } }))
jest.mock('../../utils/emailService', () => ({ sendBookingNotification: jest.fn().mockResolvedValue(undefined) }))
jest.mock('../../lib/prisma', () => ({ prisma: { provider: { findUnique: jest.fn() }, user: { findUnique: jest.fn() }, $transaction: jest.fn() } }))
const request = { userId: 'customer', headers: {}, body: { providerId: 'professional', date: '2099-10-05T00:00:00.000Z', time: '09:00', serviceType: 'Inspection', serviceId: 'service' } } as AuthRequest
function response() { const res = { status: jest.fn(), json: jest.fn() }; res.status.mockReturnValue(res); return res as unknown as Response }
beforeEach(() => { jest.clearAllMocks(); (prisma.provider.findUnique as jest.Mock).mockResolvedValue({ id: 'professional' }); (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'customer' }) })
it('rejects occupied intervals without writing another booking', async () => {
  const tx = { $queryRaw: jest.fn(), service: { findFirst: jest.fn().mockResolvedValue({ duration: 60 }) }, availabilitySlot: { findMany: jest.fn().mockResolvedValue([{ date: new Date('2099-10-05'), startTime: '09:00', endTime: '17:00', isAvailable: true, isRecurring: false }]) }, booking: { findMany: jest.fn().mockResolvedValue([{ time: '09:00', estimatedDuration: 90 }]), create: jest.fn() } }
  ;(prisma.$transaction as jest.Mock).mockImplementation(callback => callback(tx))
  const res = response(); await createBooking(request, res)
  expect(res.status).toHaveBeenCalledWith(409)
  expect(tx.booking.create).not.toHaveBeenCalled()
  expect(tx.$queryRaw).toHaveBeenCalled()
})
it('persists service duration with a free published slot', async () => {
  const tx = { $queryRaw: jest.fn(), service: { findFirst: jest.fn().mockResolvedValue({ duration: 90 }) }, availabilitySlot: { findMany: jest.fn().mockResolvedValue([{ date: new Date('2099-10-05'), startTime: '09:00', endTime: '17:00', isAvailable: true, isRecurring: false }]) }, booking: { findMany: jest.fn().mockResolvedValue([]), create: jest.fn().mockResolvedValue({ id: 'booking' }) } }
  ;(prisma.$transaction as jest.Mock).mockImplementation(callback => callback(tx))
  const res = response(); await createBooking(request, res)
  expect(res.status).toHaveBeenCalledWith(201)
  expect(tx.booking.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ estimatedDuration: 90, time: '09:00', userId: 'customer' }) }))
})
