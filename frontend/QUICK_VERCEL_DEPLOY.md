# Quick Vercel Deployment Guide

## 🚀 Fast Deployment Steps

### Backend Info (Fly.io)
- **Backend URL:** `https://handighana-backend.fly.dev`
- **API Base:** `https://handighana-backend.fly.dev/api`

### Deploy Frontend to Vercel

#### Option 1: CLI (Fastest)
```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts, then:
vercel env add VITE_API_URL production
# Enter: https://handighana-backend.fly.dev/api
vercel --prod
```

#### Option 2: Dashboard
1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your Git repository
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://handighana-backend.fly.dev/api`
   - Apply to: Production, Preview, Development
5. Click Deploy

## ⚙️ Environment Variable

**Required:**
```
VITE_API_URL=https://handighana-backend.fly.dev/api
```

## 🔧 Post-Deployment

### Update Backend CORS (if needed)

After deploying to Vercel, you'll get a URL like `https://your-project.vercel.app`

Update Fly.io backend to allow your Vercel domain:

```bash
cd backend
# Set FRONTEND_URL to include your Vercel domain
fly secrets set FRONTEND_URL="https://your-project.vercel.app"
# Or if you want to allow multiple origins, update server.ts CORS config
fly deploy
```

**Note:** The backend currently uses `app.use(cors())` which allows all origins, so CORS should work automatically. However, Socket.IO uses `FRONTEND_URL`, so you may want to update that.

## ✅ Verify Deployment

1. Visit your Vercel URL
2. Check browser console for errors
3. Test API calls (login, fetch providers, etc.)
4. Verify backend is accessible: `https://handighana-backend.fly.dev/health`

## 📝 Quick Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

**Backend:** Fly.io (`https://handighana-backend.fly.dev`)  
**Frontend:** Vercel (your deployment URL)

