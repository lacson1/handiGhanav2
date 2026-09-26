import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import SignUp from '../../pages/SignUp'
import SignIn from '../../pages/SignIn'
import { authApi } from '../../lib/api'
import { safeReturnPath } from '../../lib/authRedirect'
vi.mock('../../lib/api', () => ({ authApi: { register: vi.fn(), login: vi.fn() } }))
vi.mock('../../components/GoogleSignInButton', () => ({ default: () => null }))
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
function setup() {
  render(<AuthProvider><MemoryRouter initialEntries={['/signup?redirect=%2Fbecome-provider']}><Routes><Route path="/signup" element={<SignUp />} /><Route path="/signin" element={<SignIn />} /><Route path="/become-provider" element={<h1>Professional setup</h1>} /></Routes></MemoryRouter></AuthProvider>)
  return userEvent.setup()
}
it('carries consent through the real auth context and returns professionals to setup after sign-in', async () => {
  vi.mocked(authApi.register).mockResolvedValue({ message: 'Created', user: { id: 'sample', name: 'Sample Tester', email: 'sample@example.com', role: 'CUSTOMER' } } as never)
  vi.mocked(authApi.login).mockResolvedValue({ token: 'test-token', user: { id: 'sample', name: 'Sample Tester', email: 'sample@example.com', role: 'CUSTOMER' } } as never)
  const user = setup()
  await user.type(screen.getByLabelText('Full Name'), 'Sample Tester')
  await user.type(screen.getByLabelText(/Email address/), 'sample@example.com')
  await user.type(screen.getByLabelText(/Phone Number/), '0241234567')
  await user.type(screen.getByLabelText(/^Password/), 'Ab1!')
  await user.type(screen.getByLabelText(/^Confirm Password/), 'Ab1!')
  await user.click(screen.getByLabelText(/I.*Privacy Policy/))
  await user.click(screen.getByLabelText(/I.*Terms of Service/))
  await user.click(screen.getByRole('button', { name: 'Create Account' }))
  expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
  expect(authApi.register).not.toHaveBeenCalled()
  await user.clear(screen.getByLabelText(/^Password/))
  await user.type(screen.getByLabelText(/^Password/), 'SampleTest123!')
  await user.clear(screen.getByLabelText(/^Confirm Password/))
  await user.type(screen.getByLabelText(/^Confirm Password/), 'SampleTest123!')
  await user.click(screen.getByRole('button', { name: 'Create Account' }))
  expect(await screen.findByText('Account created successfully! Please sign in.')).toBeInTheDocument()
  expect(authApi.register).toHaveBeenCalledWith(expect.objectContaining({ consentPrivacy: true, consentTerms: true, consentMarketing: false, role: 'CUSTOMER' }))
  expect(screen.getByLabelText(/Email/)).toHaveValue('sample@example.com')
  await user.type(screen.getByLabelText('Password'), 'SampleTest123!')
  await user.click(screen.getByRole('button', { name: 'Sign In', exact: true }))
  expect(await screen.findByRole('heading', { name: 'Professional setup' })).toBeInTheDocument()
})
it('rejects external return paths and preserves internal search filters', () => {
  for (const value of ['https://example.com', '//example.com', '/\\example.com', '/\nexample.com']) expect(safeReturnPath(value)).toBeNull()
  expect(safeReturnPath('/search?category=Electrician')).toBe('/search?category=Electrician')
})
