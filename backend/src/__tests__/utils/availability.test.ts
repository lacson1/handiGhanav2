import { slotsForDate, validDate, minutes } from '../../utils/availability'
const date = '2099-10-05'
const window = { date: new Date(date), startTime: '09:00', endTime: '12:00', isAvailable: true, isRecurring: false, recurringPattern: null }
const now = new Date('2099-10-01')
it('requires published hours and rejects invalid dates', () => {
  expect(slotsForDate(date, [], [], 60, now)).toEqual([])
  expect(validDate('2026-02-30')).toBe(false)
  expect(validDate('2026-09-26')).toBe(true)
  expect(minutes('12:00 AM')).toBe(0)
  expect(minutes('1:00 PM')).toBe(780)
  expect(minutes('24:00')).toBeNaN()
})
it('excludes overlapping visits, time off, and starts too close to closing', () => {
  const slots = slotsForDate(date, [window, { ...window, startTime: '11:00', endTime: '12:00', isAvailable: false }], [{ time: '9:00 AM', estimatedDuration: 90 }], 60, now)
  expect(slots.filter(slot => slot.available)).toEqual([])
  expect(slots.find(slot => slot.time === '09:30')?.booked).toBe(true)
  expect(slots.some(slot => slot.time === '11:30')).toBe(false)
})
it('honours service duration, recurring hours, and past times', () => {
  const slots = slotsForDate('2099-10-06', [{ ...window, isRecurring: true, recurringPattern: 'daily' }], [], 120, now)
  expect(slots.filter(slot => slot.available).map(slot => slot.time)).toEqual(['09:00', '09:30', '10:00'])
  expect(slotsForDate(date, [window], [], 60, new Date('2099-10-05T10:00:00Z')).filter(slot => slot.available).map(slot => slot.time)).toEqual(['10:30', '11:00'])
})
