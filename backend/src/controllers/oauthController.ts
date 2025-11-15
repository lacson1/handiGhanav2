import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { prisma } from '../lib/prisma'

interface AuthenticatedRequest extends Request {
  user?: User
}

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest
    const user = authReq.user

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=authentication_failed`)
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Get full user data including provider info if exists
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        provider: true,
      },
    })

    // If user not found (shouldn't happen, but handle gracefully)
    if (!fullUser) {
      console.error('OAuth callback error: User not found after authentication', user.id)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      return res.redirect(`${frontendUrl}/signin?error=user_not_found`)
    }

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(fullUser))}`
    res.redirect(redirectUrl)
  } catch (error: unknown) {
    console.error('OAuth callback error:', error)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    res.redirect(`${frontendUrl}/signin?error=authentication_failed`)
  }
}

export const googleAuthFailure = (req: Request, res: Response) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  res.redirect(`${frontendUrl}/signin?error=authentication_failed`)
}

