# 🚀 Deployment Guide - Handighana

Complete guide to deploy **Handighana** with:
- **Frontend** → Vercel
- **Backend** → Fly.io

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **Accounts Created:**
   - [Vercel Account](https://vercel.com/signup)
   - [Fly.io Account](https://fly.io/app/sign-up)

2. ✅ **CLI Tools Installed:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Install Fly.io CLI
   curl -L https://fly.io/install.sh | sh
   ```

3. ✅ **Database Ready:**
   - PostgreSQL database (hosted on Fly.io, Supabase, Neon, or other)
   - Database URL ready

4. ✅ **External Services Configured:**
   - Cloudinary account (for image uploads)
   - Twilio account (for SMS - optional)
   - SendGrid account (for emails - optional)
   - Sentry project (for error tracking - optional)

---

## 🗄️ Part 1: Database Setup

### Option A: PostgreSQL on Fly.io (Recommended)

```bash
# Create a PostgreSQL database on Fly.io
cd /Users/lacbis/handiGhanav2/backend
fly postgres create --name handighana-db --region iad

# Save the connection string provided
# It will look like: postgres://...
```

### Option B: External PostgreSQL (Supabase, Neon, etc.)

1. Create a PostgreSQL database on your preferred service
2. Copy the connection string
3. Ensure it allows connections from anywhere (for Fly.io)

---

## 🔧 Part 2: Backend Deployment (Fly.io)

### Step 1: Login to Fly.io

```bash
fly auth login
```

### Step 2: Set Environment Variables

```bash
cd /Users/lacbis/handiGhanav2/backend

# Set Database URL
fly secrets set DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Set JWT Secret (generate a strong random string)
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"

# Set Frontend URL (update after deploying frontend)
fly secrets set FRONTEND_URL="https://your-app.vercel.app"

# Set Node Environment
fly secrets set NODE_ENV="production"

# Optional: Cloudinary (for image uploads)
fly secrets set CLOUDINARY_CLOUD_NAME="your-cloud-name"
fly secrets set CLOUDINARY_API_KEY="your-api-key"
fly secrets set CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Twilio (for SMS)
fly secrets set TWILIO_ACCOUNT_SID="your-account-sid"
fly secrets set TWILIO_AUTH_TOKEN="your-auth-token"
fly secrets set TWILIO_PHONE_NUMBER="your-twilio-number"

# Optional: SendGrid (for emails)
fly secrets set SENDGRID_API_KEY="your-sendgrid-key"
fly secrets set SENDGRID_FROM_EMAIL="noreply@handighana.com"

# Optional: Sentry (for error tracking)
fly secrets set SENTRY_DSN="your-sentry-dsn"
```

### Step 3: Deploy Backend

```bash
# Deploy to Fly.io
fly deploy

# Check deployment status
fly status

# View logs
fly logs

# Your backend will be at: https://handighana-backend.fly.dev
```

### Step 4: Run Database Migrations

```bash
# SSH into the Fly.io machine
fly ssh console

# Inside the container, run migrations
npx prisma migrate deploy

# Seed demo users (optional)
npx tsx prisma/seed-users.ts

# Exit
exit
```

### Step 5: Verify Backend

```bash
# Test health check
curl https://handighana-backend.fly.dev/health

# Test API
curl https://handighana-backend.fly.dev/api/test
```

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Login to Vercel

```bash
cd /Users/lacbis/handiGhanav2/frontend
vercel login
```

### Step 2: Link Project

```bash
# Initialize Vercel project
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - What's your project's name? handighana
# - In which directory is your code? ./
# - Want to modify settings? No
```

### Step 3: Set Environment Variables on Vercel

**Option A: Via CLI**

```bash
# Set API URL (use your Fly.io backend URL)
vercel env add VITE_API_URL production
# Enter: https://handighana-backend.fly.dev/api

# Optional: Sentry DSN
vercel env add VITE_SENTRY_DSN production
# Enter: your-sentry-dsn
```

**Option B: Via Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `handighana` project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_API_URL` = `https://handighana-backend.fly.dev/api`
   - `VITE_SENTRY_DSN` = `your-sentry-dsn` (optional)

### Step 4: Deploy Frontend

```bash
# Deploy to production
vercel --prod

# Your frontend will be at: https://handighana.vercel.app
# (or your custom domain)
```

### Step 5: Update Backend with Frontend URL

```bash
cd /Users/lacbis/handiGhanav2/backend

# Update the FRONTEND_URL in Fly.io
fly secrets set FRONTEND_URL="https://handighana.vercel.app"

# Restart the backend
fly apps restart handighana-backend
```

---

## ✅ Part 4: Verification

### Test the Deployment

1. **Frontend Health Check:**
   - Visit: `https://handighana.vercel.app`
   - Should see the home page

2. **Backend Health Check:**
   - Visit: `https://handighana-backend.fly.dev/health`
   - Should see: `{"status":"healthy"}`

3. **API Connection:**
   - Open browser console on frontend
   - Check for any API errors
   - Try signing in with demo credentials:
     - Customer: `customer@test.com` / `password123`
     - Provider: `provider@test.com` / `password123`

4. **WebSocket Connection:**
   - Login as provider
   - Check dashboard for real-time updates

---

## 🔄 Part 5: Continuous Deployment

### Frontend (Vercel)

**Automatic deployment is already set up!**

- Every push to `main` branch → Auto-deploys to production
- Every push to other branches → Creates preview deployments

### Backend (Fly.io)

**Manual deployment:**

```bash
cd /Users/lacbis/handiGhanav2/backend
fly deploy
```

**Or set up GitHub Actions** for auto-deployment (optional).

---

## 🌐 Part 6: Custom Domain (Optional)

### Frontend Domain (Vercel)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `handighana.com`)
3. Update DNS records as instructed
4. Vercel will auto-provision SSL certificate

### Backend Domain (Fly.io)

```bash
# Add custom domain
fly certs create api.handighana.com

# Follow instructions to update DNS
```

Then update frontend environment variable:

```bash
vercel env add VITE_API_URL production
# Enter: https://api.handighana.com/api
```

---

## 📊 Part 7: Monitoring & Logs

### Backend Logs (Fly.io)

```bash
# View real-time logs
fly logs

# View last 100 lines
fly logs -n 100

# Follow logs
fly logs -f
```

### Frontend Logs (Vercel)

1. Go to **Vercel Dashboard** → **Deployments**
2. Click on deployment → **View Logs**

### Sentry (Error Tracking)

- Both frontend and backend send errors to Sentry
- Monitor at: [Sentry Dashboard](https://sentry.io)

---

## 🛠️ Part 8: Scaling & Performance

### Backend Scaling (Fly.io)

```bash
# Scale to multiple regions
fly regions add lhr fra # London, Frankfurt

# Scale machine resources
fly scale vm shared-cpu-1x --memory 1024

# Scale number of machines
fly scale count 2
```

### Frontend (Vercel)

- **Automatic global CDN distribution**
- No manual scaling needed

---

## 🔐 Part 9: Security Checklist

- [x] Use strong JWT_SECRET (generated with `openssl rand -base64 32`)
- [x] Database password is strong and secure
- [x] All secrets stored in environment variables
- [x] HTTPS enforced on both frontend and backend
- [x] CORS configured correctly
- [x] Rate limiting enabled (check backend middleware)
- [ ] Set up firewall rules for database access
- [ ] Enable Fly.io's built-in DDoS protection
- [ ] Add domain to verified senders in SendGrid
- [ ] Set up backup strategy for database

---

## 💰 Part 10: Cost Estimate

### Fly.io (Backend)

- **Free Tier:**
  - 3 shared-cpu-1x VMs with 256MB RAM
  - 3GB persistent volume storage
  - 160GB outbound data transfer

- **Estimated Cost (Paid):**
  - Small app: ~$5-10/month
  - Medium traffic: ~$15-30/month

### Vercel (Frontend)

- **Hobby (Free):**
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS

- **Pro ($20/month):**
  - 1TB bandwidth
  - Analytics
  - Team collaboration

### PostgreSQL Database

- **Fly.io Postgres:** ~$2-5/month for small DB
- **Supabase Free:** 500MB storage, good for development
- **Neon Free:** Generous free tier

**Total Estimated Cost:** **$0-40/month** depending on traffic and tier selection.

---

## 🆘 Troubleshooting

### Common Issues

**1. Database Connection Failed**

```bash
# Check if DATABASE_URL is set
fly secrets list

# Test database connection
fly ssh console
# Then inside: npx prisma db pull
```

**2. Frontend Can't Reach Backend**

- Check `VITE_API_URL` in Vercel settings
- Verify CORS settings in backend (`FRONTEND_URL`)
- Check if backend is running: `fly status`

**3. Prisma Migration Errors**

```bash
# Reset database (⚠️ destroys data!)
fly ssh console
npx prisma migrate reset --force

# Or apply specific migration
npx prisma migrate deploy
```

**4. Build Failed on Fly.io**

```bash
# Check logs
fly logs

# Common fix: Increase memory during build
fly deploy --vm-memory 1024
```

**5. Frontend Build Failed on Vercel**

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Clear build cache: Redeploy with "Clear cache and deploy"

---

## 📞 Support & Resources

- **Fly.io Docs:** https://fly.io/docs/
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs/
- **Project GitHub:** (Add your repo URL)

---

## 🎉 Deployment Complete!

Your Handighana app is now live:

- **Frontend:** https://handighana.vercel.app
- **Backend:** https://handighana-backend.fly.dev
- **API:** https://handighana-backend.fly.dev/api

**Next Steps:**
1. ✅ Test all features end-to-end
2. ✅ Create demo data (run seed scripts)
3. ✅ Set up monitoring alerts
4. ✅ Share with users!

---

**Last Updated:** November 10, 2025  
**Maintained By:** Handighana Development Team

