import { describe, it, expect, vi, beforeEach } from 'vitest'
import { providersApi } from '../../lib/api'

// Mock fetch
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should make API requests with correct base URL', async () => {
    const mockResponse = { data: [] }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    await providersApi.getAll()

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/providers'),
      expect.any(Object)
    )
  })

  it('should include authorization token when available', async () => {
    localStorage.setItem('token', 'test-token')
    const mockResponse = { data: [] }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    await providersApi.getAll()

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })
})

