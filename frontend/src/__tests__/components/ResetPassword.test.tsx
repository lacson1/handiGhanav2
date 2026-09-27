import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import ResetPassword from '../../pages/ResetPassword'
it('prevents a reset without a token', () => {
  render(<MemoryRouter><ResetPassword /></MemoryRouter>)
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid reset link')
  expect(screen.getByRole('button', { name: 'Reset Password' })).toBeDisabled()
})
it('rejects a short password before making a request', () => {
  const network = vi.spyOn(globalThis, 'fetch')
  render(<MemoryRouter initialEntries={['/reset-password?token=test-token']}><ResetPassword /></MemoryRouter>)
  fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'Ab1!' } })
  fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'Ab1!' } })
  fireEvent.submit(screen.getByRole('button', { name: 'Reset Password' }).closest('form')!)
  expect(screen.getByRole('alert')).toHaveTextContent('at least 8 characters')
  expect(network).not.toHaveBeenCalled()
  network.mockRestore()
})
