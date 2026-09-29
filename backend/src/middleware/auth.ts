import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

interface JwtPayload {
  userId?: string
  role?: string
  [key: string]: unknown
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, async (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }

      if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
        try {
          if (!(await isActiveUser(decoded.userId as string))) {
            return res.status(401).json({ message: 'Account no longer exists' })
          }
        } catch (error) {
          return res.status(500).json({ message: 'Authentication error' })
        }
        req.userId = decoded.userId as string
        req.userRole = decoded.role as string
      }
      next()
    })
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' })
  }
}

// Tokens outlive soft-deleted accounts, so check the account still exists.
const isActiveUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  })
  return user !== null
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

    jwt.verify(token, JWT_SECRET, async (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (!err && decoded && typeof decoded === 'object' && 'userId' in decoded) {
        // Token is valid - attach user info unless the account has been deleted
        const active = await isActiveUser(decoded.userId as string).catch(() => false)
        if (active) {
          req.userId = decoded.userId as string
          req.userRole = decoded.role as string
        }
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
  if (req.userRole?.toUpperCase() !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export default { authenticateToken, optionalAuth, requireAdmin }

