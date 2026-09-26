import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import ProtectedRoute from '../../components/ProtectedRoute'
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ isAuthenticated: false, isLoading: false }) }))
function Destination() { const location = useLocation(); return <p>{location.pathname}{location.search}</p> }
it('preserves the requested page and filters for sign-in', () => {
  render(<MemoryRouter initialEntries={['/my-bookings?status=pending']}><Routes><Route path="/my-bookings" element={<ProtectedRoute><p>Private page</p></ProtectedRoute>} /><Route path="/signin" element={<Destination />} /></Routes></MemoryRouter>)
  expect(screen.getByText('/signin?redirect=%2Fmy-bookings%3Fstatus%3Dpending')).toBeInTheDocument()
  expect(screen.queryByText('Private page')).not.toBeInTheDocument()
})
