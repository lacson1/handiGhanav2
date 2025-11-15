import rateLimit from 'express-rate-limit'

// Rate limiter for authentication endpoints (login, register, password reset)
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false,
})

// Rate limiter for general API endpoints
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for upload endpoints
export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per 15 minutes
  message: 'Too many upload requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter for payment endpoints (more restrictive)
export const paymentRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 payment requests per 5 minutes
  message: 'Too many payment requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

