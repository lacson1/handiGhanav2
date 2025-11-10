# Fly.io Deployment Guide

## ✅ Backend Deployment Status

### App Created
- **App Name:** `handighana-backend`
- **Region:** `iad` (Washington, D.C.)
- **URL:** https://handighana-backend.fly.dev

## 🔧 Configuration

### Environment Variables Set
- `NODE_ENV=production`
- `PORT=3001`
- `FRONTEND_URL=https://handighana-backend.fly.dev`
- `JWT_SECRET` (set with secure random value)

### Required Environment Variables

You may need to set these additional secrets:

```bash
cd backend

# Database (if using Fly Postgres)
fly secrets set DATABASE_URL="postgresql://..."

# Payment APIs (optional for now)
fly secrets set PAYSTACK_SECRET_KEY="sk_live_..."
fly secrets set MTN_MOMO_API_KEY="your_key"
fly secrets set MTN_MOMO_USER_ID="your_user_id"
fly secrets set MTN_MOMO_API_SECRET="your_secret"
fly secrets set VODAFONE_CASH_API_KEY="your_key"
fly secrets set VODAFONE_CASH_MERCHANT_ID="your_merchant_id"
```

## 🚀 Deployment Commands

### Deploy
```bash
cd backend
fly deploy
```

### Check Status
```bash
fly status
fly logs
```

### View App
```bash
fly open
```

### Scale App
```bash
fly scale count 1
fly scale vm shared-cpu-1x --memory 512
```

## 📊 Database Setup

### Option 1: Fly Postgres (Recommended)
```bash
# Create database
fly postgres create --name handighana-db --region iad

# Attach to app
fly postgres attach handighana-db

# Run migrations
fly ssh console -C "cd /app && npx prisma migrate deploy"
```

### Option 2: External Database
Set `DATABASE_URL` secret with your external PostgreSQL connection string.

## 🔍 Monitoring

- **View Logs:** `fly logs`
- **SSH into app:** `fly ssh console`
- **Check metrics:** `fly status`
- **View secrets:** `fly secrets list`

## 🌐 App URLs

- **API Base:** https://handighana-backend.fly.dev
- **Health Check:** https://handighana-backend.fly.dev/health
- **API Endpoints:** https://handighana-backend.fly.dev/api/*

## 📝 Next Steps

1. ✅ App created
2. ⏳ Deployment in progress
3. ⏳ Set up database
4. ⏳ Configure environment variables
5. ⏳ Update frontend API URL

---

**App Name:** handighana-backend  
**Status:** Deploying...

