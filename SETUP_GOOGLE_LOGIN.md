# 🔐 Google Login Setup Guide for HandiGhana

## ✅ Current Status
- ✅ Backend OAuth routes configured
- ✅ Frontend Google Sign-In button ready  
- ✅ OAuth callback handling implemented
- ⚠️  **Need:** Google OAuth credentials from Google Cloud Console

---

## 📋 Step-by-Step Setup

### **1️⃣ Create Google OAuth Credentials**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (if you don't have one)
   - Click "Select a project" dropdown at the top
   - Click "NEW PROJECT"
   - Project name: `HandiGhana` (or any name you prefer)
   - Click "CREATE"

3. **Enable Google OAuth**
   - In your project, go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type → Click "CREATE"
   - Fill in the required fields:
     - App name: `HandiGhana`
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE" through the remaining screens

4. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `HandiGhana Web Client`
   
5. **Configure Authorized URLs**
   
   **For Development (localhost):**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3001
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3001/api/auth/google/callback
     ```
   
   Click "CREATE"

6. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-xxxxx`)
   - **Keep these safe!** You'll need them in the next step

---

### **2️⃣ Configure Backend Environment Variables**

1. **Generate a Session Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output (a long random string)

2. **Edit Backend .env File**
   
   Open: `/backend/.env` and add these lines:
   
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   
   # Session Secret (use the generated string from step 1)
   SESSION_SECRET=your-generated-session-secret-here
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Replace:**
   - `your-client-id-here` with your actual Google Client ID
   - `your-client-secret-here` with your actual Google Client Secret
   - `your-generated-session-secret-here` with the generated session secret

3. **Restart the Backend Server**
   ```bash
   cd backend
   pkill -f nodemon
   PORT=3001 npm run dev
   ```

---

### **3️⃣ Test Google Login**

1. **Open the App**
   - Go to: http://localhost:5173

2. **Click Sign In**
   - Go to the Sign In page
   - Click "Continue with Google" button

3. **Expected Flow:**
   - ✅ Redirects to Google's login page
   - ✅ You sign in with your Google account
   - ✅ Google asks for permission to share your profile
   - ✅ Redirects back to HandiGhana
   - ✅ You're automatically logged in!

---

## 🚀 Production Setup (When Ready to Deploy)

When deploying to production (e.g., `https://handighana.com`):

1. **Update Google Cloud Console:**
   - Add production URLs to "Authorized JavaScript origins":
     ```
     https://handighana.com
     https://api.handighana.com
     ```
   - Add production redirect URI:
     ```
     https://api.handighana.com/api/auth/google/callback
     ```

2. **Update Production .env:**
   ```env
   GOOGLE_CALLBACK_URL=https://api.handighana.com/api/auth/google/callback
   FRONTEND_URL=https://handighana.com
   ```

---

## 🐛 Troubleshooting

### **Error: "redirect_uri_mismatch"**
- ✅ Check that the redirect URI in Google Cloud Console **exactly** matches:
  - Development: `http://localhost:3001/api/auth/google/callback`
  - Production: Your actual domain

### **Error: "Client ID not found"**
- ✅ Make sure you copied the full Client ID (includes `.apps.googleusercontent.com`)
- ✅ Check for extra spaces in the .env file

### **Backend doesn't start after adding credentials**
- ✅ Make sure there are no syntax errors in .env
- ✅ No quotes needed around the values
- ✅ Each variable on a new line

### **Still not working?**
- ✅ Check backend logs: `cat backend/backend.log`
- ✅ Should see: `✓ Google OAuth configured`
- ✅ If not, credentials aren't loaded properly

---

## 📝 Quick Reference

**Where to find things:**
- Backend OAuth config: `/backend/src/config/passport.ts`
- OAuth routes: `/backend/src/routes/oauth.ts`
- Frontend button: `/frontend/src/components/GoogleSignInButton.tsx`
- OAuth callback page: `/frontend/src/pages/OAuthCallback.tsx`

**Key Environment Variables:**
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=random-64-character-hex-string
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Success Indicators

When Google Login is working correctly, you'll see:
1. ✅ Backend logs show: `✓ Google OAuth configured`
2. ✅ "Continue with Google" button appears on Sign In page
3. ✅ Clicking it redirects to Google
4. ✅ After signing in with Google, you're redirected back and logged in
5. ✅ Your Google profile picture and name appear in the app

---

**Need help?** Check the logs:
```bash
# Backend logs
cat backend/backend.log | tail -20

# Frontend dev server
cat frontend/frontend.log | tail -20
```

