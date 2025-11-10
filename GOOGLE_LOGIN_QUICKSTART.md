# 🚀 Google Login - Quick Start Guide

## ✅ What's Already Done

Your app already has **all the code** needed for Google login:
- ✅ Backend OAuth routes configured
- ✅ Frontend Google Sign-In button ready
- ✅ OAuth callback handling implemented
- ✅ User authentication flow complete

**You just need to add Google OAuth credentials!**

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Get Google Credentials (2 minutes)

1. Go to: **https://console.cloud.google.com/**
2. Create a project (e.g., "HandiGhana")
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click **"CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Configure:
   - Type: **Web application**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3001
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3001/api/auth/google/callback
     ```
6. Click **"CREATE"** and copy:
   - **Client ID** (ends with `.apps.googleusercontent.com`)
   - **Client Secret** (starts with `GOCSPX-`)

### Step 2: Configure Backend (2 minutes)

1. **Create or edit** `/backend/.env` file:

```env
# Database (keep your existing DATABASE_URL)
DATABASE_URL="your-existing-database-url"

# JWT Secret (keep your existing one)
JWT_SECRET=your-existing-jwt-secret

# Google OAuth - ADD THESE:
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Session Secret - GENERATE THIS:
SESSION_SECRET=run-node-command-below-to-generate

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

2. **Generate SESSION_SECRET** by running:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as `SESSION_SECRET`

3. **Replace** `your-client-id` and `your-client-secret` with actual values from Step 1

### Step 3: Restart Backend (1 minute)

```bash
cd backend
pkill -f nodemon
PORT=3001 npm run dev
```

**Check logs** - you should see:
```
✓ Google OAuth configured
🚀 Server running on http://0.0.0.0:3001
```

If you see `⚠ Google OAuth not configured`, check your `.env` file for errors.

### Step 4: Test It! (30 seconds)

1. Open: **http://localhost:5173/signin**
2. Click **"Continue with Google"** button
3. Sign in with your Google account
4. ✅ You're automatically logged in!

---

## 🎨 Where to Find Google Sign-In Button

The Google Sign-In button appears on these pages:
- **Sign In page**: `/signin`
- **Sign Up page**: `/signup`

Look for the button with the Google logo that says "Continue with Google"

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error
**Problem:** The redirect URI doesn't match what's in Google Console

**Fix:** 
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure **Authorized redirect URIs** includes:
   ```
   http://localhost:3001/api/auth/google/callback
   ```
4. Save and try again

### "Google OAuth not configured" in logs
**Problem:** Environment variables not loaded

**Fix:**
1. Check `/backend/.env` file exists
2. Check no typos in variable names
3. No extra spaces or quotes around values
4. Restart backend server

### Button doesn't appear
**Problem:** Frontend not connecting to backend

**Fix:**
1. Check backend is running on port 3001
2. Check frontend is running on port 5173
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📱 How It Works

```
User clicks "Continue with Google"
    ↓
Redirects to Google's login page
    ↓
User signs in with Google
    ↓
Google redirects back to your app
    ↓
Backend creates/finds user account
    ↓
Frontend receives auth token
    ↓
User is logged in! ✅
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** to Git (already in `.gitignore`)
2. **Keep Client Secret private** - it's called "secret" for a reason!
3. **SESSION_SECRET should be random** - use the generator command
4. **In production**, update redirect URIs to your domain

---

## 🚀 Production Deployment

When deploying (e.g., to `handighana.com`):

1. **Update Google Cloud Console:**
   - Add: `https://handighana.com`
   - Add: `https://api.handighana.com/api/auth/google/callback`

2. **Update production `.env`:**
   ```env
   GOOGLE_CALLBACK_URL=https://api.handighana.com/api/auth/google/callback
   FRONTEND_URL=https://handighana.com
   ```

---

## ✅ Success Checklist

- [ ] Created Google OAuth client in Google Cloud Console
- [ ] Added authorized redirect URIs
- [ ] Got Client ID and Client Secret
- [ ] Added credentials to `/backend/.env`
- [ ] Generated and added SESSION_SECRET
- [ ] Restarted backend server
- [ ] Backend logs show: `✓ Google OAuth configured`
- [ ] Can see "Continue with Google" button
- [ ] Successfully logged in with Google account

---

## 📞 Need Help?

**Check logs:**
```bash
# Backend
cat backend/backend.log | grep -i google

# See if OAuth is working
cat backend/backend.log | tail -20
```

**Test backend OAuth endpoint:**
```bash
curl http://localhost:3001/api/auth/google
# Should redirect to Google (you'll see HTML)
```

**Common Files:**
- Backend config: `/backend/src/config/passport.ts`
- OAuth routes: `/backend/src/routes/oauth.ts`
- Frontend button: `/frontend/src/components/GoogleSignInButton.tsx`
- OAuth callback: `/frontend/src/pages/OAuthCallback.tsx`

---

## 🎉 That's It!

Your app is now ready for Google Sign-In. Users can:
- Sign up with Google (automatic account creation)
- Sign in with existing Google account
- Link Google account to existing email account

No passwords needed - just click and sign in! ✨

