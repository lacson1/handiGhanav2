import { Request, Response, NextFunction } from 'express'
import { authRateLimit, apiRateLimit } from '../../middleware/rateLimit'

// Mock express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
    next()
  })
})

describe('Rate Limiting Middleware', () => {
  it('should export authRateLimit', () => {
    expect(authRateLimit).toBeDefined()
  })

  it('should export apiRateLimit', () => {
    expect(apiRateLimit).toBeDefined()
  })
})

