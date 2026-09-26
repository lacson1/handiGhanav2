import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { it, expect, vi } from 'vitest'
import AvailabilityCalendar from '../../components/AvailabilityCalendar'
import { providersApi } from '../../lib/api'
vi.mock('../../lib/api', () => ({ providersApi: { getAvailability: vi.fn() } }))
it('shows API availability, disables booked slots, and offers retry on failure', async () => {
  const user = userEvent.setup()
  const select = vi.fn()
  vi.mocked(providersApi.getAvailability).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ slots: [{ time: '09:00', available: false, booked: true }, { time: '11:00', available: true, booked: false }] })
  render(<AvailabilityCalendar providerId="sample" serviceId="service" selectedDate={new Date(2099, 9, 5)} onDateSelect={vi.fn()} onTimeSelect={select} />)
  expect(await screen.findByRole('alert')).toHaveTextContent('couldn’t check availability')
  await user.click(screen.getByRole('button', { name: 'Retry availability' }))
  expect(await screen.findByRole('button', { name: '09:00' })).toBeDisabled()
  await user.click(screen.getByRole('button', { name: '11:00' }))
  expect(select).toHaveBeenCalledWith('11:00')
  await waitFor(() => expect(providersApi.getAvailability).toHaveBeenCalledWith('sample', '2099-10-05', 'service'))
})
