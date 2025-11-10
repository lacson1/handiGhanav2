import { useState, useEffect, useCallback } from 'react'
import type { Booking } from '../types'
import { bookingsApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function useBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await bookingsApi.getAll({ userId: user?.id })
      setBookings(data as Booking[])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings')
      // Fallback to mock bookings for testing
      try {
        const { mockBookings } = await import('../data/mockBookings')
        
        let filteredBookings: Booking[] = []
        
        if (user?.id) {
          // Map provider user IDs to provider IDs
          // provider-1 -> 1, provider-2 -> 2, etc.
          const providerIdMap: Record<string, string> = {
            'provider-1': '1',
            'provider-2': '2',
            'provider-3': '3',
          }
          
          const providerId = providerIdMap[user.id] || user.id
          
          // Filter bookings: customer sees their bookings, provider sees bookings for their provider ID
          filteredBookings = mockBookings.filter(b => {
            if (user.role === 'PROVIDER') {
              return b.providerId === providerId
            } else {
              return b.userId === user.id
            }
          })
        }
        
        setBookings(filteredBookings)
      } catch {
        setBookings([])
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user, fetchBookings])

  const createBooking = async (bookingData: {
    providerId: string
    date: string
    time: string
    serviceType: string
    notes?: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const newBooking = await bookingsApi.create(bookingData)
      setBookings([...bookings, newBooking as Booking])
      return newBooking
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setLoading(true)
    setError(null)
    try {
      const updatedBooking = await bookingsApi.updateStatus(bookingId, status)
      setBookings(bookings.map(b => b.id === bookingId ? updatedBooking as Booking : b))
      return updatedBooking
    } catch (err: any) {
      setError(err.message || 'Failed to update booking')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
  }
}

