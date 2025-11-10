# 🚀 Quick Deployment Guide

## Current Status

✅ **Fly.io Setup:**
- Logged in as: `bisoyef@gmail.com`
- Backend app: `handighana-backend` (currently suspended)
- Database: `handighana-db` (deployed)

✅ **Tools Installed:**
- Fly CLI: Installed ✓
- Vercel CLI: Installed locally ✓

---

## 🎯 Deploy Now - 3 Simple Steps

### Step 1: Deploy Backend to Fly.io (2 minutes)

```bash
cd /Users/lacbis/handiGhanav2/backend

# Deploy (this will wake up and update the app)
fly deploy

# Check status
fly status

# View logs (optional)
fly logs
```

**Your backend will be at:** `https://handighana-backend.fly.dev`

---

### Step 2: Deploy Frontend to Vercel (2 minutes)

```bash
cd /Users/lacbis/handiGhanav2/frontend

# Login to Vercel (first time only)
npx vercel login

# Deploy to production
npx vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No (or Yes if you have one)
# - What's your project's name? handighana
# - In which directory is your code? ./ (or press Enter)
```

**Your frontend will be at:** `https://handighana.vercel.app` (or similar)

---

### Step 3: Connect Frontend & Backend (1 minute)

#### A. Update Frontend Environment Variable

**Option 1: Via Vercel Dashboard (Recommended)**
1. Go to: https://vercel.com/dashboard
2. Select your `handighana` project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - Variable: `VITE_API_URL`
   - Value: `https://handighana-backend.fly.dev/api`
   - Environment: Production
5. Click **Save**
6. Go to **Deployments** → Click on latest deployment → **Redeploy**

**Option 2: Via CLI**
```bash
cd /Users/lacbis/handiGhanav2/frontend

# Set API URL
npx vercel env add VITE_API_URL production
# When prompted, enter: https://handighana-backend.fly.dev/api

# Redeploy
npx vercel --prod
```

#### B. Update Backend CORS Settings

```bash
cd /Users/lacbis/handiGhanav2/backend

# Update FRONTEND_URL with your Vercel URL
fly secrets set FRONTEND_URL="https://handighana.vercel.app"

# Restart backend
fly apps restart handighana-backend
```

---

## ✅ Verification Checklist

After deployment, test these:

### 1. Backend Health Check
```bash
curl https://handighana-backend.fly.dev/health
# Should return: {"status":"healthy"}
```

### 2. Frontend Loads
Visit: `https://handighana.vercel.app` (your actual URL)
- ✓ Home page loads
- ✓ No console errors
- ✓ Provider cards display

### 3. Authentication Works
- ✓ Sign in with: `provider@test.com` / `provider123`
- ✓ Can access provider dashboard
- ✓ Can update profile
- ✓ Photo uploads work

### 4. API Connection
Open browser console and check:
- ✓ No CORS errors
- ✓ API requests succeed
- ✓ Data loads from backend

---

## 🔧 Important Environment Variables

### Backend (Fly.io Secrets)

Check what's set:
```bash
cd /Users/lacbis/handiGhanav2/backend
fly secrets list
```

Required secrets:
```bash
# Database (should already be set)
fly secrets set DATABASE_URL="your-postgres-url"

# JWT Secret (should already be set)
fly secrets set JWT_SECRET="your-secret-key"

# Frontend URL (update with your Vercel URL)
fly secrets set FRONTEND_URL="https://handighana.vercel.app"

# Node Environment
fly secrets set NODE_ENV="production"
```

Optional (for full features):
```bash
# Cloudinary (for photo uploads)
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name"
fly secrets set CLOUDINARY_API_KEY="your-api-key"
fly secrets set CLOUDINARY_API_SECRET="your-api-secret"

# Twilio (for SMS notifications)
fly secrets set TWILIO_ACCOUNT_SID="your-sid"
fly secrets set TWILIO_AUTH_TOKEN="your-token"
fly secrets set TWILIO_PHONE_NUMBER="your-number"
```

### Frontend (Vercel Environment Variables)

Set in Vercel Dashboard:
- `VITE_API_URL` = `https://handighana-backend.fly.dev/api`

---

## 🐛 Troubleshooting

### Backend Not Responding

```bash
cd /Users/lacbis/handiGhanav2/backend

# Check status
fly status

# View logs
fly logs

# Restart app
fly apps restart handighana-backend

# If still issues, redeploy
fly deploy
```

### Frontend Build Fails

```bash
cd /Users/lacbis/handiGhanav2/frontend

# Build locally first to test
npm run build

# If successful, deploy again
npx vercel --prod
```

### CORS Errors

Make sure:
1. `FRONTEND_URL` in Fly.io matches your Vercel URL exactly
2. No trailing slashes in URLs
3. Both apps are using HTTPS

Fix:
```bash
cd /Users/lacbis/handiGhanav2/backend
fly secrets set FRONTEND_URL="https://your-actual-url.vercel.app"
fly apps restart handighana-backend
```

### Database Migration Needed

```bash
cd /Users/lacbis/handiGhanav2/backend

# SSH into Fly.io
fly ssh console

# Run migrations
npx prisma migrate deploy

# Seed demo data (optional)
npx tsx prisma/seed-users.ts

# Exit
exit
```

---

## 📊 Monitor Your Deployment

### Backend Logs (Real-time)
```bash
cd /Users/lacbis/handiGhanav2/backend
fly logs -f
```

### Backend Metrics
```bash
fly dashboard
# Opens web dashboard with metrics
```

### Frontend Logs
1. Visit: https://vercel.com/dashboard
2. Select your project
3. Click on deployment
4. View logs and analytics

---

## 🔄 Redeploying After Changes

### Backend Changes
```bash
cd /Users/lacbis/handiGhanav2/backend
fly deploy
```

### Frontend Changes
```bash
cd /Users/lacbis/handiGhanav2/frontend
npx vercel --prod
```

### Database Schema Changes
```bash
cd /Users/lacbis/handiGhanav2/backend

# Create migration locally
npx prisma migrate dev --name your_change_name

# Deploy to production
fly ssh console
npx prisma migrate deploy
exit
```

---

## 💰 Cost Estimate

### Current Setup (Free Tier):
- **Fly.io**: Free tier includes 3 shared VMs, 3GB storage
- **Vercel**: Free Hobby plan includes 100GB bandwidth
- **Total**: $0/month for hobby/testing

### When You Need to Scale:
- **Fly.io**: ~$5-10/month for small production app
- **Vercel**: $20/month for Pro plan (1TB bandwidth, analytics)
- **Total**: ~$25-30/month for production

---

## 🎉 Deployment Complete!

Once deployed, your app will be live at:

- **Frontend**: https://handighana.vercel.app (your actual URL)
- **Backend**: https://handighana-backend.fly.dev
- **API**: https://handighana-backend.fly.dev/api

Share with your users and start getting feedback!

---

## 📞 Need Help?

- Fly.io Docs: https://fly.io/docs/
- Vercel Docs: https://vercel.com/docs
- Full Guide: See `DEPLOYMENT_GUIDE.md`

---

**Ready to deploy? Start with Step 1!** 🚀

