import { useState, useEffect, useCallback, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../lib/utils'

interface AvailabilityCalendarProps {
  providerId: string
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onTimeSelect: (time: string) => void
  selectedTime?: string
  disabledDates?: Date[]
  onQuickBook?: () => void
  showQuickBook?: boolean
}

interface TimeSlot {
  time: string
  available: boolean
  booked: boolean
}

export default function AvailabilityCalendar({
  providerId,
  selectedDate,
  onDateSelect,
  onTimeSelect,
  selectedTime,
  disabledDates = [],
  onQuickBook,
  showQuickBook = false
}: AvailabilityCalendarProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  // Default time slots (can be fetched from provider settings)
  const defaultTimeSlots = useMemo(() => [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ], [])

  const loadAvailability = useCallback(async (_date: Date) => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await availabilityApi.getSlots(providerId, _date)
      // setAvailableSlots(response.slots)

      // For now, simulate availability check
      // In production, this would check against:
      // 1. Provider's availability slots
      // 2. Existing bookings for that date
      // 3. Provider's working hours

      const slots: TimeSlot[] = defaultTimeSlots.map(time => ({
        time,
        available: true, // Would be determined by API
        booked: false // Would check against bookings
      }))

      setAvailableSlots(slots)
    } catch (error) {
      console.error('Failed to load availability:', error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }, [defaultTimeSlots])

  // Load availability for selected date
  useEffect(() => {
    if (selectedDate && providerId) {
      loadAvailability(selectedDate)
    } else {
      setAvailableSlots([])
    }
  }, [selectedDate, providerId, loadAvailability])

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Disable past dates
    if (date < today) return true

    // Disable dates in disabledDates array
    return disabledDates.some(disabledDate => {
      const d1 = new Date(disabledDate)
      d1.setHours(0, 0, 0, 0)
      const d2 = new Date(date)
      d2.setHours(0, 0, 0, 0)
      return d1.getTime() === d2.getTime()
    })
  }

  const tileClassName = ({ date }: { date: Date }) => {
    if (isDateDisabled(date)) {
      return 'disabled-date'
    }
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'selected-date'
    }
    return ''
  }

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Select a Date
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose your preferred date for the service
          </p>
        </div>
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              onDateSelect(value)
            } else if (Array.isArray(value) && value[0] instanceof Date) {
              onDateSelect(value[0])
            }
          }}
          value={selectedDate || undefined}
          minDate={new Date()}
          tileDisabled={({ date }) => isDateDisabled(date)}
          tileClassName={tileClassName}
          className="w-full border-0"
        />

        <style>{`
          .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
            background: transparent;
          }
          
          /* Navigation */
          .react-calendar__navigation {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
          }
          
          .react-calendar__navigation button {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1f2937;
            min-width: 44px;
            height: 44px;
            background: transparent;
            border: none;
            border-radius: 0.5rem;
            transition: all 0.2s;
            cursor: pointer;
          }
          
          .react-calendar__navigation button:hover:enabled {
            background-color: #f3f4f6;
            color: #000;
          }
          
          .react-calendar__navigation button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          
          .react-calendar__navigation__label {
            font-size: 1.25rem;
            font-weight: 700;
            color: #111827;
            pointer-events: none;
          }
          
          /* Weekday labels */
          .react-calendar__month-view__weekdays {
            margin-bottom: 0.5rem;
          }
          
          .react-calendar__month-view__weekdays__weekday {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #4b5563;
            text-align: center;
          }
          
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
            border-bottom: none;
          }
          
          /* Date tiles */
          .react-calendar__month-view__days {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.25rem;
          }
          
          .react-calendar__tile {
            padding: 0.875rem 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            font-size: 0.9375rem;
            font-weight: 500;
            color: #1f2937;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          
          .react-calendar__tile:hover:not(.disabled-date):not(.react-calendar__tile--active) {
            background-color: #fef3c7;
            border-color: #facc15;
            color: #000;
            transform: scale(1.05);
          }
          
          .react-calendar__tile--active,
          .selected-date {
            background-color: #facc15 !important;
            color: #000 !important;
            font-weight: 700;
            border-color: #facc15 !important;
            box-shadow: 0 2px 4px rgba(250, 204, 21, 0.3);
          }
          
          .react-calendar__tile--now {
            background-color: #eff6ff;
            border-color: #3b82f6;
            color: #1e40af;
            font-weight: 700;
          }
          
          .react-calendar__tile--now:hover:not(.react-calendar__tile--active) {
            background-color: #dbeafe;
            border-color: #60a5fa;
          }
          
          .disabled-date {
            opacity: 0.35;
            cursor: not-allowed;
            background-color: #f9fafb !important;
            border-color: #e5e7eb !important;
            color: #9ca3af !important;
          }
          
          .disabled-date:hover {
            transform: none !important;
            background-color: #f9fafb !important;
          }
          
          /* Neighboring month dates */
          .react-calendar__tile--neighboringMonth {
            opacity: 0.4;
            color: #9ca3af;
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .react-calendar__navigation button {
              color: #f9fafb;
            }
            
            .react-calendar__navigation button:hover:enabled {
              background-color: #374151;
              color: #fff;
            }
            
            .react-calendar__navigation__label {
              color: #f9fafb;
            }
            
            .react-calendar__month-view__weekdays__weekday {
              color: #d1d5db;
            }
            
            .react-calendar__tile {
              background: #1f2937;
              border-color: #374151;
              color: #f9fafb;
            }
            
            .react-calendar__tile:hover:not(.disabled-date):not(.react-calendar__tile--active) {
              background-color: #fef3c7;
              border-color: #facc15;
              color: #000;
            }
            
            .react-calendar__tile--now {
              background-color: #1e3a8a;
              border-color: #3b82f6;
              color: #93c5fd;
            }
            
            .disabled-date {
              background-color: #111827 !important;
              border-color: #374151 !important;
              color: #6b7280 !important;
            }
          }
        `}</style>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Time Slots
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading availability...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => !slot.booked && slot.available && onTimeSelect(slot.time)}
                  disabled={slot.booked || !slot.available}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold transition-all",
                    "border-2 min-h-[56px]",
                    "flex items-center justify-center gap-2",
                    selectedTime === slot.time
                      ? "border-primary bg-primary text-black font-bold shadow-lg scale-105"
                      : slot.booked
                        ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-60"
                        : slot.available
                          ? "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/10 hover:shadow-md text-gray-900 dark:text-white active:scale-95"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50"
                  )}
                >
                  {slot.booked ? (
                    <>
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{slot.time}</span>
                    </>
                  ) : slot.available ? (
                    <>
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                      <span>{slot.time}</span>
                    </>
                  ) : (
                    <span className="text-sm">{slot.time}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No available slots for this date
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Please select another date
              </p>
            </div>
          )}

          {/* Quick Book Button - Appears after time selection */}
          {selectedTime && showQuickBook && onQuickBook && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onQuickBook}
                className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Clock className="h-5 w-5" />
                <span>Confirm Booking for {selectedTime}</span>
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Click to book this time slot instantly
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
