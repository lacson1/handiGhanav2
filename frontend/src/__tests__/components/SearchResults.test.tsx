import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SearchResults from '../../pages/SearchResults'
import { providersApi } from '../../lib/api'
import type { Provider } from '../../types'
vi.mock('../../lib/api', () => ({ providersApi: { getAll: vi.fn() } }))
vi.mock('../../components/QuoteRequestModal', () => ({ default: () => null }))
vi.mock('../../components/BookingModal', () => ({ default: ({ isOpen, provider }: { isOpen: boolean; provider: Provider | null }) => isOpen ? <div role="dialog" aria-label="Book professional">{provider?.name}</div> : null }))
vi.mock('../../components/ProviderDetailsDrawer', () => ({ default: ({ isOpen, provider }: { isOpen: boolean; provider: Provider | null }) => isOpen ? <div role="dialog" aria-label="Professional profile">{provider?.name}</div> : null }))
const providers: Provider[] = [
  { id: '1', userId: 'u1', name: 'Test Plumbing', category: 'Plumber', location: 'Accra', serviceAreas: ['East Legon'], rating: 4.7, reviewCount: 8, verified: true, description: 'Pipe repairs and installation', availability: 'Available Now' },
  { id: '2', userId: 'u2', name: 'Test Cleaning', category: 'Cleaner', location: 'Kumasi', rating: 0, reviewCount: 0, verified: false, description: 'Home cleaning', availability: 'Available Soon' },
]
function CurrentUrl() { const location = useLocation(); return <div aria-label="Current URL">{location.search}</div> }
function setup(url = '/search') {
  render(<MemoryRouter initialEntries={[url]}><SearchResults /><CurrentUrl /></MemoryRouter>)
  return userEvent.setup()
}
beforeEach(() => { vi.mocked(providersApi.getAll).mockReset() })
describe('Search results', () => {
  it('shows loading instead of claiming no results', () => {
    vi.mocked(providersApi.getAll).mockReturnValue(new Promise(() => {}))
    setup()
    expect(screen.getByRole('status')).toHaveTextContent('Finding professionals')
    expect(screen.queryByText('No matches just yet')).not.toBeInTheDocument()
  })
  it('retries a failed request without dropping URL filters', async () => {
    vi.mocked(providersApi.getAll).mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(providers)
    const user = setup('/search?category=Plumber&verified=true')
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load professionals')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('article', { name: 'Test Plumbing' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Test Cleaning' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('category=Plumber&verified=true')
  })
  it('synchronizes filters with the URL and clears an empty result', async () => {
    vi.mocked(providersApi.getAll).mockResolvedValue(providers)
    const user = setup('/search?location=East+Legon&view=list&sort=rating-high')
    expect(await screen.findByRole('article', { name: 'Test Plumbing' })).toBeInTheDocument()
    expect(screen.getByLabelText('Location')).toHaveValue('East Legon')
    await user.click(screen.getByRole('button', { name: /More filters/ }))
    await user.selectOptions(screen.getByLabelText('Category'), 'Cleaner')
    expect(screen.getByText('No matches just yet')).toBeInTheDocument()
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('category=Cleaner')
    await user.click(within(screen.getByLabelText('Provider filters')).getByRole('button', { name: 'Clear filters' }))
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByLabelText('Current URL')).toHaveTextContent('?view=list&sort=rating-high')
    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'true')
  })
  it('shows honest review status and preserves booking and profile actions', async () => {
    vi.mocked(providersApi.getAll).mockResolvedValue(providers)
    const user = setup()
    const card = await screen.findByRole('article', { name: 'Test Cleaning' })
    expect(within(card).getByText('No reviews yet')).toBeInTheDocument()
    await user.click(within(card).getByRole('button', { name: 'Book now' }))
    expect(screen.getByRole('dialog', { name: 'Book professional' })).toHaveTextContent('Test Cleaning')
    await user.click(within(card).getByRole('button', { name: 'View profile' }))
    expect(screen.getByRole('dialog', { name: 'Professional profile' })).toHaveTextContent('Test Cleaning')
  })
})

it('keeps sample discovery isolated from the live provider API', async () => {
  render(<MemoryRouter initialEntries={['/demo?category=Electrician']}><SearchResults sample /></MemoryRouter>)
  expect(await screen.findByRole('article', { name: 'Sample Electrical' })).toBeInTheDocument()
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(providersApi.getAll).not.toHaveBeenCalled()
  expect(screen.queryByRole('button', { name: /Request a quote/ })).not.toBeInTheDocument()
})
