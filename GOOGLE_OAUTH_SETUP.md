# Google OAuth Setup Guide

This guide will walk you through setting up Google login for HandyGhana.

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing one
   - Give it a name (e.g., "HandyGhana")
   - Click "Create"

3. **Enable Google+ API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "People API"
   - Click on it and click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" (unless you have a Google Workspace)
     - Fill in the required fields:
       - App name: "HandyGhana"
       - User support email: Your email
       - Developer contact: Your email
     - Click "Save and Continue"
     - Add scopes: `email`, `profile`, `openid`
     - Click "Save and Continue"
     - Add test users (optional for development)
     - Click "Save and Continue"

5. **Create OAuth Client ID**
   - Application type: Select "Web application"
   - Name: "HandyGhana Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3001` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3001/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a popup with your Client ID and Client Secret
   - **IMPORTANT**: Copy these immediately (you won't see the secret again!)
   - If you missed it, you can view the Client ID in the credentials list, but you'll need to regenerate the secret

## Step 2: Configure Backend Environment Variables

1. **Open your backend `.env` file**
   ```bash
   cd backend
   # If you don't have a .env file, create one:
   cp .env.example .env  # if .env.example exists
   ```

2. **Add the following variables:**
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   
   # Frontend URL (for OAuth redirects)
   FRONTEND_URL=http://localhost:5173
   
   # Session Secret (for OAuth sessions)
   SESSION_SECRET=your-random-secret-key-here
   ```

3. **Generate a Session Secret** (if you don't have one):
   ```bash
   # Option 1: Use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Option 2: Use OpenSSL
   openssl rand -hex 32
   
   # Option 3: Use an online generator
   # Visit: https://randomkeygen.com/
   ```

## Step 3: Verify Your Setup

1. **Check that your `.env` file has all required variables:**
   ```env
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-jwt-secret
   PORT=3001
   NODE_ENV=development
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=...
   ```

2. **Restart your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check the console output:**
   - You should see: `✓ Google OAuth configured`
   - If you see: `⚠ Google OAuth not configured`, check your environment variables

## Step 4: Test Google Login

1. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to the sign-in page:**
   - Go to: http://localhost:5173/signin

3. **Click "Continue with Google"**
   - You should be redirected to Google's login page
   - After logging in, you'll be redirected back to your app
   - You should be automatically logged in

## Troubleshooting

### Issue: "Google OAuth not configured" in console

**Solution:**
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in your `.env` file
- Make sure there are no extra spaces or quotes around the values
- Restart your backend server after changing `.env`

### Issue: "redirect_uri_mismatch" error

**Solution:**
- Go back to Google Cloud Console → Credentials
- Edit your OAuth client
- Make sure the redirect URI in Google Console matches exactly:
  - `http://localhost:3001/api/auth/google/callback` (development)
  - Or your production URL if in production
- The URL must match exactly (including http vs https, port numbers, etc.)

### Issue: "access_denied" error

**Solution:**
- If you're in development mode, make sure you've added your email as a test user in the OAuth consent screen
- Go to "APIs & Services" → "OAuth consent screen" → "Test users" → Add your email

### Issue: User not being created

**Solution:**
- Check your database connection
- Check backend logs for errors
- Make sure Prisma migrations have been run: `npm run prisma:migrate`

### Issue: Frontend redirect not working

**Solution:**
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default is `http://localhost:5173` for Vite
- Make sure the frontend route `/auth/callback` exists (it should be in `App.tsx`)

## Production Setup

For production, you'll need to:

1. **Update Google Cloud Console:**
   - Add your production domain to authorized JavaScript origins
   - Add your production callback URL to authorized redirect URIs
   - Example:
     - Origin: `https://handighana.com`
     - Redirect: `https://handighana.com/api/auth/google/callback`

2. **Update environment variables:**
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   FRONTEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```

3. **Publish your OAuth consent screen:**
   - Go to "OAuth consent screen" in Google Cloud Console
   - Click "Publish App" (required for production)
   - Note: This may require verification if you're requesting sensitive scopes

## Security Notes

- **Never commit your `.env` file to git**
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Use different credentials for development and production
- Regularly rotate your secrets
- Use HTTPS in production

## Quick Reference

**Backend Routes:**
- `GET /api/auth/google` - Initiates Google OAuth
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/google/failure` - Handles OAuth failures

**Frontend Routes:**
- `/signin` - Sign in page with Google button
- `/auth/callback` - OAuth callback handler

**Environment Variables:**
- `GOOGLE_CLIENT_ID` - Required
- `GOOGLE_CLIENT_SECRET` - Required
- `GOOGLE_CALLBACK_URL` - Optional (has default)
- `FRONTEND_URL` - Required for redirects
- `SESSION_SECRET` - Required for OAuth sessions

