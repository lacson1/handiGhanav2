import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, it, expect, vi } from 'vitest'
import SampleBooking from '../../components/SampleBooking'
import { sampleProviders } from '../../lib/sampleData'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
describe('Sample booking', () => {
  it('requires visit details, preserves edits and simulates completion without network requests', async () => {
    const network = vi.spyOn(globalThis, 'fetch')
    const close = vi.fn()
    const user = userEvent.setup()
    render(<SampleBooking provider={sampleProviders[0]} onClose={close} />)
    await user.click(screen.getByRole('button', { name: 'Review sample request' }))
    expect(screen.getByRole('heading', { name: 'Plan your sample visit' })).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Service'), 'sample-light')
    await user.type(screen.getByLabelText('Preferred date'), '2099-10-02')
    await user.selectOptions(screen.getByLabelText('Example time slot'), '11:00')
    await user.type(screen.getByLabelText('Job notes (optional)'), 'Sample light fitting')
    await user.click(screen.getByRole('button', { name: 'Review sample request' }))
    expect(screen.getByText('GHS 200')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Edit details' }))
    expect(screen.getByLabelText('Job notes (optional)')).toHaveValue('Sample light fitting')
    await user.click(screen.getByRole('button', { name: 'Review sample request' }))
    await user.click(screen.getByRole('button', { name: 'Simulate booking request' }))
    expect(screen.getByRole('status')).toHaveTextContent('no booking was created')
    expect(network).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Back to sample professionals' }))
    expect(close).toHaveBeenCalledOnce()
    network.mockRestore()
  })
})
