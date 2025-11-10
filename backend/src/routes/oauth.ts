import express from 'express'
import passport from 'passport'
import { googleCallback, googleAuthFailure } from '../controllers/oauthController'

const router = express.Router()

// Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: false,
  }),
  googleCallback
)

// Google OAuth failure
router.get('/google/failure', googleAuthFailure)

export default router

