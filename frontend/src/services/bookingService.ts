import { bookingsApi } from '../lib/api'
import type { Booking } from '../types'

export const bookingService = {
  async getAllBookings(filters?: { userId?: string; providerId?: string }): Promise<Booking[]> {
    try {
      const data = await bookingsApi.getAll(filters)
      return data as Booking[]
    } catch (error) {
      // Return empty array on error
      return []
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const data = await bookingsApi.getById(id)
      return data as Booking
    } catch (error) {
      return null
    }
  },

  async createBooking(data: {
    providerId: string
    date: string
    time: string
    serviceType: string
    notes?: string
  }): Promise<Booking> {
    try {
      const result = await bookingsApi.create(data)
      return result as Booking
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create booking')
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    try {
      const result = await bookingsApi.updateStatus(id, status)
      return result as Booking
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update booking status')
    }
  },
}

