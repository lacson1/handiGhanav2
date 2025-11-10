import { useState } from 'react'
import { Calendar, Clock, CheckCircle, X } from 'lucide-react'
import { cn } from '../lib/utils'
import Button from './ui/Button'

interface TimeSlot {
  time: string
  available: boolean
}

interface AvailabilityCalendarProps {
  providerId: string
  onSlotSelect?: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}

export default function AvailabilityCalendar({ 
  providerId: _providerId, 
  onSlotSelect,
  selectedDate,
  selectedTime 
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDateState, setSelectedDateState] = useState(selectedDate || '')

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const days = getDaysInMonth(currentMonth)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    return dateOnly >= today
  }

  const isDateSelected = (date: Date | null) => {
    if (!date) return false
    return date.toISOString().split('T')[0] === selectedDateState
  }

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    setSelectedDateState(dateStr)
  }

  const timeSlots: TimeSlot[] = [
    { time: '8:00 AM', available: true },
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false },
    { time: '5:00 PM', available: true },
    { time: '6:00 PM', available: true },
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Date & Time
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            ←
          </Button>
          <span className="px-4 py-1 text-sm font-semibold text-gray-900 dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            →
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={idx} className="aspect-square" />
            }

            const available = isDateAvailable(date)
            const selected = isDateSelected(date)
            const isToday = date.toDateString() === today.toDateString()

            return (
              <button
                key={idx}
                onClick={() => available && handleDateSelect(date)}
                disabled={!available}
                className={cn(
                  "aspect-square rounded-lg text-sm font-medium transition-all",
                  available
                    ? "hover:bg-primary/20 cursor-pointer"
                    : "opacity-30 cursor-not-allowed",
                  selected
                    ? "bg-primary text-black font-semibold"
                    : "text-gray-700 dark:text-gray-300",
                  isToday && !selected && "ring-2 ring-primary/50"
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDateState && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Times
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time
              return (
                <button
                  key={slot.time}
                  onClick={() => {
                    if (slot.available && onSlotSelect) {
                      onSlotSelect(selectedDateState, slot.time)
                    }
                  }}
                  disabled={!slot.available}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    slot.available
                      ? "hover:bg-primary/20 cursor-pointer border-2"
                      : "opacity-30 cursor-not-allowed border-2 border-gray-200 dark:border-gray-700",
                    isSelected
                      ? "bg-primary text-black border-primary font-semibold"
                      : slot.available
                      ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  {slot.available ? (
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {slot.time}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <X className="h-3 w-3" />
                      {slot.time}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!selectedDateState && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          Select a date to see available time slots
        </p>
      )}
    </div>
  )
}

