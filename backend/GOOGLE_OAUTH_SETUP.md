# Google OAuth Setup Instructions

## Required Environment Variables

Add the following variables to your `/backend/.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret-here

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

## How to Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name it (e.g., "HandiGhana")

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application"
   - Name it (e.g., "HandiGhana Web")

5. **Configure Authorized URLs**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3001
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3001/api/auth/google/callback
     ```

6. **Copy Credentials**
   - Copy the "Client ID" and "Client secret"
   - Add them to your `.env` file

7. **Generate Session Secret**
   Run this command to generate a random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Production Setup

For production, update the URLs:

```env
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-domain.com
```

And add these to your Google Cloud Console:
- Authorized JavaScript origins: `https://your-domain.com`
- Authorized redirect URIs: `https://your-domain.com/api/auth/google/callback`

