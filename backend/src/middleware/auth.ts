import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }

      req.userId = decoded.userId
      req.userRole = decoded.role
      next()
    })
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' })
  }
}

// Optional authentication - attaches user info if token is present, but doesn't reject if missing
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      // No token provided - continue without authentication
      return next()
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (!err && decoded) {
        // Token is valid - attach user info
        req.userId = decoded.userId
        req.userRole = decoded.role
      }
      // Continue regardless of token validity
      next()
    })
  } catch (error) {
    // Even on error, continue without authentication
    next()
  }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export default { authenticateToken, optionalAuth, requireAdmin }

