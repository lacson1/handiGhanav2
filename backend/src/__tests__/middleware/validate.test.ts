import { Request, Response, NextFunction } from 'express'
import { validate } from '../../middleware/validate'
import { z } from 'zod'

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    nextFunction = jest.fn()
  })

  it('should call next() when validation passes', () => {
    const schema = z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    })

    mockRequest.body = {
      email: 'test@example.com',
      password: 'password123',
    }

    const middleware = validate(schema)
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
  })

  it('should return 400 when validation fails', () => {
    const schema = z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    })

    mockRequest.body = {
      email: 'invalid-email',
      password: 'short',
    }

    const middleware = validate(schema)
    middleware(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalled()
    expect(nextFunction).not.toHaveBeenCalled()
  })
})

