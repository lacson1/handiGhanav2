import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/signin?error=authentication_failed`)
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

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(fullUser))}`
    res.redirect(redirectUrl)
  } catch (error) {
    console.error('OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/signin?error=authentication_failed`)
  }
}

export const googleAuthFailure = (req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_URL}/signin?error=authentication_failed`)
}

