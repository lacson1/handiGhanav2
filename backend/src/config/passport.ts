import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '@prisma/client'
import { prisma } from '../lib/prisma'

// Serialize user for the session
// Note: Using 'any' here because passport has its own User type that conflicts with Prisma's User type
passport.serializeUser((user: any, done) => {
  done(null, (user as User).id)
})

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        authProvider: true,
      },
    })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Google OAuth Strategy - only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await prisma.user.findUnique({
            where: { googleId: profile.id },
          })

          if (user) {
            // User exists, return user
            return done(null, user)
          }

          // Check if user exists with this email
          const email = profile.emails?.[0]?.value
          if (email) {
            user = await prisma.user.findUnique({
              where: { email },
            })

            if (user) {
              // Link Google account to existing user
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  googleId: profile.id,
                  authProvider: 'google',
                  avatar: user.avatar || profile.photos?.[0]?.value,
                },
              })
              return done(null, user)
            }
          }

          // Create new user
          if (!email) {
            return done(new Error('No email found in Google profile'), undefined)
          }

          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || 'Google User',
              googleId: profile.id,
              authProvider: 'google',
              avatar: profile.photos?.[0]?.value,
              role: 'CUSTOMER',
            },
          })

          done(null, user)
        } catch (error) {
          done(error as Error, undefined)
        }
      }
    )
  )
  console.log('✓ Google OAuth configured')
} else {
  console.log('⚠ Google OAuth not configured - Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable')
}

export default passport

