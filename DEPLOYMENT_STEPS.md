# 🚀 Deployment Steps for HandyGhana

## Current Status
- ✅ Fly.io CLI: Installed & Logged in (bisoyef@gmail.com)
- ✅ Vercel CLI: Installed & Logged in (lacson1)
- ✅ Backend configured (fly.toml, Dockerfile ready)
- ✅ Frontend configured (vercel.json ready)

## Step 1: Deploy Backend to Fly.io

```bash
cd backend

# Deploy (this will create the app if it doesn't exist)
fly deploy

# After deployment, you'll need to set secrets:
fly secrets set DATABASE_URL="postgresql://user:password@host:5432/dbname"
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"
fly secrets set FRONTEND_URL="https://your-app.vercel.app"  # Update after frontend deploy
fly secrets set NODE_ENV="production"
fly secrets set SESSION_SECRET="$(openssl rand -hex 32)"
fly secrets set GOOGLE_CLIENT_ID="your-google-client-id"
fly secrets set GOOGLE_CLIENT_SECRET="your-google-client-secret"
fly secrets set GOOGLE_CALLBACK_URL="https://handighana-backend.fly.dev/api/auth/google/callback"

# Run database migrations
fly ssh console -C "npx prisma migrate deploy"

# Verify backend
curl https://handighana-backend.fly.dev/health
```

**Backend URL:** `https://handighana-backend.fly.dev`

## Step 2: Deploy Frontend to Vercel

```bash
cd frontend

# Deploy to production
vercel --prod

# Set environment variable (when prompted, enter your backend URL)
vercel env add VITE_API_URL production
# Enter: https://handighana-backend.fly.dev/api

# Redeploy to apply environment variable
vercel --prod
```

**Note:** Vercel will give you a URL like `https://handighana-xxxxx.vercel.app`

## Step 3: Update Backend with Frontend URL

After you get your Vercel URL:

```bash
cd backend

# Update FRONTEND_URL with your actual Vercel URL
fly secrets set FRONTEND_URL="https://your-actual-vercel-url.vercel.app"

# Restart backend to apply changes
fly apps restart handighana-backend
```

## Step 4: Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Add to "Authorized redirect URIs":
   - `https://handighana-backend.fly.dev/api/auth/google/callback`
5. Save

## Step 5: Verify Deployment

1. **Backend Health:**
   ```bash
   curl https://handighana-backend.fly.dev/health
   ```
   Should return: `{"status":"ok","message":"HandyGhana API is running"}`

2. **Frontend:** Visit your Vercel URL

3. **Test Login:**
   - Email: `customer@test.com`
   - Password: `password123`

## Quick Commands

### Backend Management
```bash
# View logs
fly logs

# Check status
fly status

# Restart
fly apps restart handighana-backend

# SSH into machine
fly ssh console

# View secrets
fly secrets list
```

### Frontend Management
```bash
# View deployments
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# View environment variables
vercel env ls
```

## Environment Variables Checklist

### Backend (Fly.io Secrets)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Random secret for JWT tokens
- [ ] `FRONTEND_URL` - Your Vercel frontend URL
- [ ] `NODE_ENV` - Set to "production"
- [ ] `SESSION_SECRET` - Random secret for sessions
- [ ] `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- [ ] `GOOGLE_CALLBACK_URL` - Backend callback URL

### Frontend (Vercel Environment Variables)
- [ ] `VITE_API_URL` - Backend API URL (https://handighana-backend.fly.dev/api)

## Troubleshooting

### Backend won't start
```bash
fly logs
fly ssh console
# Check if migrations ran: npx prisma migrate deploy
```

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel
- Check `FRONTEND_URL` in Fly.io secrets
- Verify CORS settings in backend

### Database connection issues
```bash
fly ssh console
npx prisma db pull
npx prisma migrate deploy
```

## Ready to Deploy?

Run the automated script:
```bash
./deploy-both.sh
```

Or deploy manually following the steps above.

