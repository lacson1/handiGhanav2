import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, expect, it, vi } from 'vitest'
import SearchResults from '../../pages/SearchResults'
import { providersApi, servicesApi, bookingsApi } from '../../lib/api'
vi.mock('../../lib/api', () => ({ providersApi: { getAll: vi.fn() }, servicesApi: { getAll: vi.fn() }, bookingsApi: { create: vi.fn() } }))
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
it('connects sample filtering, the real profile drawer, and simulated booking without live APIs', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={['/demo']}><SearchResults sample /></MemoryRouter>)
  await user.selectOptions(screen.getByLabelText('Category'), 'Electrician')
  expect(screen.getAllByRole('article')).toHaveLength(1)
  await user.click(within(screen.getByRole('article')).getByRole('button', { name: 'View profile' }))
  expect(await screen.findByText('Socket inspection')).toBeInTheDocument()
  expect(screen.getByText('Light fitting installation')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Book Now', exact: true }))
  const modal = screen.getByRole('dialog')
  await user.type(within(modal).getByLabelText('Preferred date'), '2099-10-02')
  await user.selectOptions(within(modal).getByLabelText('Example time slot'), '14:00')
  await user.click(within(modal).getByRole('button', { name: 'Review sample request' }))
  await user.click(within(modal).getByRole('button', { name: 'Simulate booking request' }))
  expect(within(modal).getByRole('status')).toHaveTextContent('No provider was contacted')
  expect(providersApi.getAll).not.toHaveBeenCalled()
  expect(servicesApi.getAll).not.toHaveBeenCalled()
  expect(bookingsApi.create).not.toHaveBeenCalled()
})
