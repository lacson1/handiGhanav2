import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from '../../components/ui/Button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="primary">Test</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-primary')
  })
})

