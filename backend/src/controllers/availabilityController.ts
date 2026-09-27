import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { slotsForDate, validDate, minutes } from '../utils/availability'

export async function getAvailability(req: Request, res: Response) {
  const date = String(req.query.date || '')
  if (!validDate(date)) return res.status(400).json({ message: 'Use a valid date (YYYY-MM-DD).' })
  const day = new Date(`${date}T00:00:00.000Z`)
  const end = new Date(day.getTime() + 86400000)
  try {
    const provider = await prisma.provider.findUnique({ where: { id: req.params.id } })
    if (!provider) return res.status(404).json({ message: 'Provider not found' })
    const service = req.query.serviceId ? await prisma.service.findFirst({ where: { id: String(req.query.serviceId), providerId: provider.id, isActive: true } }) : null
    if (req.query.serviceId && !service) return res.status(400).json({ message: 'Service not available' })
    const [windows, bookings] = await Promise.all([
      prisma.availabilitySlot.findMany({ where: { providerId: provider.id, OR: [{ date: day }, { isRecurring: true, date: { lte: day } }] } }),
      prisma.booking.findMany({ where: { providerId: provider.id, date: { gte: day, lt: end }, status: { in: ['PENDING', 'CONFIRMED'] } }, select: { time: true, estimatedDuration: true } })
    ])
    return res.json({ slots: slotsForDate(date, windows, bookings, service?.duration || 60), timezone: 'Africa/Accra' })
  } catch { return res.status(500).json({ message: 'Unable to check availability. Please retry.' }) }
}

export async function saveAvailability(req: AuthRequest, res: Response) {
  const { date, startTime, endTime, isAvailable } = req.body
  if (typeof date !== 'string' || !validDate(date) || typeof startTime !== 'string' || typeof endTime !== 'string' || !/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime) || !Number.isFinite(minutes(startTime)) || !Number.isFinite(minutes(endTime)) || minutes(startTime) >= minutes(endTime) || typeof isAvailable !== 'boolean') return res.status(400).json({ message: 'Choose a valid date and time range.' })
  try {
    const provider = await prisma.provider.findUnique({ where: { id: req.params.id } })
    if (!req.userId || provider?.userId !== req.userId) return res.status(403).json({ message: 'Only the profile owner can set availability.' })
    const day = new Date(`${date}T00:00:00.000Z`)
    const slot = await prisma.availabilitySlot.upsert({ where: { providerId_date_startTime: { providerId: provider.id, date: day, startTime } }, create: { providerId: provider.id, date: day, startTime, endTime, isAvailable }, update: { endTime, isAvailable, isRecurring: false, recurringPattern: null } })
    return res.json(slot)
  } catch { return res.status(500).json({ message: 'Unable to save availability.' }) }
}
