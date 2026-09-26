import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomeSearch from '../../components/HomeSearch'
import { statsApi } from '../../lib/api'

vi.mock('../../lib/api', () => ({ statsApi: { trackSearch: vi.fn() } }))
function Destination() {
  const location = useLocation()
  return <output aria-label="Search destination">{location.pathname + location.search}</output>
}
function setup() {
  render(<MemoryRouter><Routes><Route path="/" element={<HomeSearch />} /><Route path="/search" element={<Destination />} /></Routes></MemoryRouter>)
  return userEvent.setup()
}
beforeEach(() => { vi.mocked(statsApi.trackSearch).mockReset() })

describe('Homepage search navigation', () => {
  it('submits trimmed filters with Enter even if analytics never responds', async () => {
    vi.mocked(statsApi.trackSearch).mockReturnValue(new Promise(() => {}))
    const user = setup()
    await user.type(screen.getByLabelText('Service'), '  Kitchen & bath  ')
    await user.selectOptions(screen.getByLabelText('Category'), 'Plumber')
    await user.type(screen.getByLabelText('Location'), ' Cape Coast ')
    await user.keyboard('{Enter}')
    const destination = screen.getByLabelText('Search destination').textContent!
    const params = new URLSearchParams(destination.split('?')[1])
    expect(params.get('q')).toBe('Kitchen & bath')
    expect(params.get('category')).toBe('Plumber')
    expect(params.get('location')).toBe('Cape Coast')
  })
  it('opens all services for an empty search even if analytics fails', async () => {
    vi.mocked(statsApi.trackSearch).mockRejectedValue(new Error('Offline'))
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Search' }))
    expect(screen.getByLabelText('Search destination')).toHaveTextContent(/^\/search$/)
  })
  it('uses the supported category filter for popular service links', async () => {
    const user = setup()
    await user.click(screen.getByRole('link', { name: 'Cleaner' }))
    expect(screen.getByLabelText('Search destination')).toHaveTextContent('/search?category=Cleaner')
  })
})
