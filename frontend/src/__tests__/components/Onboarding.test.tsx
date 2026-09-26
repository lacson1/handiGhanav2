import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { it, expect, vi } from 'vitest'
import BecomeProvider from '../../pages/BecomeProvider'
import { providersApi } from '../../lib/api'
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ isAuthenticated: true, user: { name: 'Sample Professional' } }) }))
vi.mock('../../lib/api', () => ({ providersApi: { create: vi.fn().mockResolvedValue({ id: 'sample' }) }, uploadApi: { uploadImage: vi.fn() } }))
vi.mock('../../components/ProviderVerification', () => ({ default: () => <p>Verification next</p> }))
it('preserves profile and service details through preview and submits only on confirmation', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter><BecomeProvider /></MemoryRouter>)
  await user.selectOptions(screen.getByLabelText('Category'), 'Electrician')
  await user.selectOptions(screen.getByLabelText('Based in'), 'Accra')
  await user.type(screen.getByLabelText('Phone / WhatsApp'), '+233241234567')
  await user.type(screen.getByLabelText('About your work'), 'Electrical checks and repairs')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.type(screen.getByLabelText('Service name'), 'Socket inspection')
  await user.type(screen.getByLabelText('Price per visit (GH₵)'), '150')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  expect(screen.getByRole('heading', { name: 'Preview your profile' })).toBeInTheDocument()
  expect(providersApi.create).not.toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: 'Back', exact: true }))
  expect(screen.getByLabelText('Service name')).toHaveValue('Socket inspection')
  await user.click(screen.getByRole('button', { name: 'Continue' }))
  await user.click(screen.getByRole('button', { name: 'Create professional profile' }))
  expect(await screen.findByText('Verification next')).toBeInTheDocument()
  expect(providersApi.create).toHaveBeenCalledWith(expect.objectContaining({ category: 'Electrician', firstService: { name: 'Socket inspection', basePrice: 150, duration: 60 } }))
})
