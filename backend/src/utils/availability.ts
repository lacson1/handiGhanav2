// All service dates and times are interpreted in Ghana (UTC).
export const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
export const minutes = (value: string) => {
  const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i)
  if (!match) return NaN
  let hour = Number(match[1]); const minute = Number(match[2])
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) return NaN
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0)
  return hour * 60 + minute
}
type Window = { date: Date; startTime: string; endTime: string; isAvailable: boolean; isRecurring: boolean; recurringPattern: string | null }
type Busy = { time: string; estimatedDuration: number | null }
export function slotsForDate(date: string, windows: Window[], bookings: Busy[], duration = 60, now = new Date()) {
  const day = new Date(`${date}T00:00:00.000Z`)
  const relevant = windows.filter(window => {
    const origin = window.date.toISOString().slice(0, 10)
    if (origin === date) return true
    if (!window.isRecurring || origin > date) return false
    const weekday = day.getUTCDay()
    return window.recurringPattern === 'daily' || (window.recurringPattern === 'weekly' && window.date.getUTCDay() === weekday) || (window.recurringPattern === 'weekdays' && weekday > 0 && weekday < 6) || (window.recurringPattern === 'weekends' && (weekday === 0 || weekday === 6))
  })
  const blocked = relevant.filter(window => !window.isAvailable).map(window => [minutes(window.startTime), minutes(window.endTime)])
  const busy = bookings.map(booking => { const start = minutes(booking.time); return [start, start + (booking.estimatedDuration || 60)] })
  const starts = new Set<number>()
  relevant.filter(window => window.isAvailable).forEach(window => {
    for (let start = minutes(window.startTime); start + duration <= minutes(window.endTime); start += 30) starts.add(start)
  })
  return [...starts].sort((a, b) => a - b).map(start => {
    const booked = busy.some(([from, to]) => start < to && start + duration > from)
    const unavailable = blocked.some(([from, to]) => start < to && start + duration > from)
    return { time: `${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`, booked, available: !booked && !unavailable && day.getTime() + start * 60000 > now.getTime() }
  })
}
