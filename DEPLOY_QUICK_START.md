# 🚀 Quick Start Deployment

**Time to deploy:** ~15-20 minutes

---

## Step 1: Prerequisites (2 min)

```bash
# Install CLIs
npm install -g vercel
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
vercel login
```

---

## Step 2: Backend → Fly.io (8 min)

```bash
cd backend

# Deploy
fly deploy

# Set secrets (replace with your values)
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"
fly secrets set FRONTEND_URL="https://your-app.vercel.app"
fly secrets set NODE_ENV="production"

# Run migrations
fly ssh console
npx prisma migrate deploy
npx tsx prisma/seed-users.ts
exit

# Verify
fly status
curl https://handighana-backend.fly.dev/health
```

**Backend URL:** `https://handighana-backend.fly.dev`

---

## Step 3: Frontend → Vercel (5 min)

```bash
cd ../frontend

# Deploy
vercel --prod

# Add environment variable in Vercel Dashboard:
# VITE_API_URL = https://handighana-backend.fly.dev/api

# Or via CLI:
vercel env add VITE_API_URL production
# Enter: https://handighana-backend.fly.dev/api

# Redeploy to apply env vars
vercel --prod
```

**Frontend URL:** `https://handighana.vercel.app`

---

## Step 4: Update Backend CORS (2 min)

```bash
cd backend

# Update backend to allow frontend domain
fly secrets set FRONTEND_URL="https://handighana.vercel.app"

# Restart
fly apps restart handighana-backend
```

---

## ✅ Verification

1. **Frontend:** Visit https://handighana.vercel.app
2. **Backend:** Visit https://handighana-backend.fly.dev/health
3. **Test Login:**
   - Email: `customer@test.com`
   - Password: `password123`

---

## 🆘 Quick Fixes

**Backend not responding?**
```bash
fly logs
fly status
fly apps restart handighana-backend
```

**Frontend can't reach backend?**
- Check `VITE_API_URL` in Vercel settings
- Verify `FRONTEND_URL` in Fly.io secrets: `fly secrets list`

**Database issues?**
```bash
fly ssh console
npx prisma migrate deploy
```

---

## 📊 Useful Commands

```bash
# Backend logs
fly logs -f

# Backend shell
fly ssh console

# Redeploy backend
fly deploy

# Redeploy frontend
vercel --prod

# List secrets
fly secrets list
```

---

## 🎉 Done!

Your app is live! 

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

**Deployed URLs:**
- Frontend: https://handighana.vercel.app
- Backend: https://handighana-backend.fly.dev
- API: https://handighana-backend.fly.dev/api

