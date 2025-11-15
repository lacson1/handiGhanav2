# 🚀 Deploy HandyGhana Now

Quick deployment guide for both frontend and backend.

## Prerequisites Check

Run these commands to check if you have everything:

```bash
# Check Vercel CLI
vercel --version

# Check Fly.io CLI  
fly version

# If not installed:
npm install -g vercel
curl -L https://fly.io/install.sh | sh
```

## Step 1: Login to Services

```bash
# Login to Fly.io
fly auth login

# Login to Vercel
vercel login
```

## Step 2: Prepare Environment Variables

### Backend Secrets (Fly.io)

You'll need to set these after deployment:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<generate-with-openssl-rand-base64-32>
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
SESSION_SECRET=<generate-random-secret>
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://handighana-backend.fly.dev/api/auth/google/callback
```

### Frontend Environment Variables (Vercel)

Set in Vercel dashboard after deployment:

```env
VITE_API_URL=https://handighana-backend.fly.dev/api
```

## Step 3: Deploy Backend to Fly.io

```bash
cd backend

# Deploy
fly deploy

# After deployment, set secrets:
fly secrets set DATABASE_URL="your-database-url"
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"
fly secrets set FRONTEND_URL="https://your-app.vercel.app"
fly secrets set NODE_ENV="production"
fly secrets set SESSION_SECRET="$(openssl rand -hex 32)"
fly secrets set GOOGLE_CLIENT_ID="your-google-client-id"
fly secrets set GOOGLE_CLIENT_SECRET="your-google-client-secret"
fly secrets set GOOGLE_CALLBACK_URL="https://handighana-backend.fly.dev/api/auth/google/callback"

# Run database migrations
fly ssh console -C "npx prisma migrate deploy"

# Verify backend is running
curl https://handighana-backend.fly.dev/health
```

## Step 4: Deploy Frontend to Vercel

```bash
cd ../frontend

# Deploy
vercel --prod

# Set environment variable (replace with your backend URL)
vercel env add VITE_API_URL production
# When prompted, enter: https://handighana-backend.fly.dev/api

# Redeploy to apply environment variable
vercel --prod
```

## Step 5: Update Backend with Frontend URL

After you get your Vercel frontend URL:

```bash
cd backend

# Update FRONTEND_URL with actual Vercel URL
fly secrets set FRONTEND_URL="https://your-actual-vercel-url.vercel.app"

# Restart backend
fly apps restart handighana-backend
```

## Step 6: Verify Deployment

1. **Backend Health Check:**
   ```bash
   curl https://handighana-backend.fly.dev/health
   ```

2. **Frontend:** Visit your Vercel URL

3. **Test Login:**
   - Email: `customer@test.com`
   - Password: `password123`

## Quick Deployment Script

Or use the automated script:

```bash
chmod +x deploy.sh
./deploy.sh
```

Select option `3` to deploy both.

## Troubleshooting

### Backend Issues

```bash
# View logs
fly logs

# Check status
fly status

# Restart
fly apps restart handighana-backend

# SSH into machine
fly ssh console
```

### Frontend Issues

```bash
# View logs in Vercel dashboard
# Or check build logs:
vercel logs

# Redeploy
vercel --prod
```

### Database Connection Issues

```bash
# SSH into backend
fly ssh console

# Test connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy
```

## Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] API calls from frontend work
- [ ] Google OAuth redirects correctly
- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] CORS configured properly

## URLs After Deployment

- **Backend:** `https://handighana-backend.fly.dev`
- **Frontend:** `https://your-app.vercel.app` (check Vercel dashboard)
- **API:** `https://handighana-backend.fly.dev/api`

## Need Help?

- See `DEPLOYMENT_GUIDE.md` for detailed instructions
- See `DEPLOY_QUICK_START.md` for step-by-step guide
- Check `DEPLOYMENT_CHECKLIST.md` for verification steps
