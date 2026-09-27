import { useState } from 'react'
import { providersApi } from '../lib/api'

export default function ProviderWorkingHours({ providerId }: { providerId: string }) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [isAvailable, setIsAvailable] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  return <section className="onboarding-panel"><h2>Working hours</h2><p>Publish a time range for a specific date, or block time off. All times are Ghana time (GMT). Booked visits are automatically excluded. No published hours means no bookable slots.</p><form onSubmit={async event => {
    event.preventDefault(); setMessage(''); setFailed(false)
    if (startTime >= endTime) { setFailed(true); setMessage('End time must be after start time.'); return }
    setSaving(true)
    try { await providersApi.saveAvailability(providerId, { date, startTime, endTime, isAvailable }); setMessage(`${isAvailable ? 'Working hours' : 'Time off'} saved for ${date}, ${startTime}–${endTime}.`) }
    catch (error) { setFailed(true); setMessage(error instanceof Error ? error.message : 'Unable to save hours.') }
    finally { setSaving(false) }
  }}><label>Date<input type="date" required min={new Date().toISOString().slice(0, 10)} value={date} onChange={event => setDate(event.target.value)} /></label><label>Start time<input type="time" required value={startTime} onChange={event => setStartTime(event.target.value)} /></label><label>End time<input type="time" required value={endTime} onChange={event => setEndTime(event.target.value)} /></label><label>Availability<select value={String(isAvailable)} onChange={event => setIsAvailable(event.target.value === 'true')}><option value="true">Available for bookings</option><option value="false">Time off / unavailable</option></select></label><p>Saving again with the same date and start time updates that range.</p><button className="onboarding-primary" disabled={!providerId || saving}>{saving ? 'Saving…' : 'Save working hours'}</button>{message && <p role={failed ? 'alert' : 'status'}>{message}</p>}</form></section>
}
