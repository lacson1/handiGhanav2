# 🚀 Deploy HandiGhana NOW

## Quick Deployment in 3 Steps (15 minutes)

---

## ⚡ Prerequisites (2 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Fly.io CLI (already installed ✅)

# 3. Login to services
fly auth login
vercel login
```

---

## 🎯 Step 1: Get Database URL (5 minutes)

### **Option A: Supabase (Recommended)**

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Create account (GitHub login fastest)
4. **New Project**:
   - Name: `handighana`
   - Password: (save this!)
   - Region: Choose closest to you
5. Wait ~2 minutes for database
6. Go to **Settings** → **Database** → **Connection string**
7. Copy the **URI** format
8. Replace `[YOUR-PASSWORD]` with your password

```
postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
```

---

## 🚀 Step 2: Deploy Backend (5 minutes)

```bash
cd backend

# Deploy to Fly.io
fly deploy

# Set secrets (replace with your values)
fly secrets set DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@HOST:5432/postgres"
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"
fly secrets set SESSION_SECRET="$(openssl rand -hex 32)"
fly secrets set FRONTEND_URL="https://handighana.vercel.app"
fly secrets set NODE_ENV="production"

# Run migrations
fly ssh console -C "npx prisma migrate deploy"

# Test it
curl https://handighana-backend.fly.dev/health
# Should return: {"status":"ok","message":"HandyGhana API is running"}
```

**✅ Backend URL:** `https://handighana-backend.fly.dev`

---

## 🌐 Step 3: Deploy Frontend (3 minutes)

```bash
cd ../frontend

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://handighana-backend.fly.dev/api

# Deploy
vercel --prod

# Done! Note your URL (e.g., https://handighana.vercel.app)
```

**✅ Frontend URL:** Check terminal output or Vercel dashboard

---

## ✨ That's It!

Your app is now live! 🎉

### **Test Your App:**

1. Visit your Vercel URL
2. Sign up for an account
3. Browse providers
4. Everything should work!

---

## 📊 Post-Deployment

### **View Logs:**
```bash
# Backend logs
fly logs -a handighana-backend

# Follow logs in real-time
fly logs -a handighana-backend -f
```

### **Update Backend:**
```bash
cd backend
fly deploy
```

### **Update Frontend:**
```bash
cd frontend
vercel --prod
```

---

## 🆘 Quick Fixes

### **Backend not responding?**
```bash
fly status -a handighana-backend
fly logs -a handighana-backend
fly apps restart handighana-backend
```

### **Database connection issues?**
```bash
# Check secrets are set
fly secrets list -a handighana-backend

# Re-run migrations
fly ssh console -a handighana-backend -C "npx prisma migrate deploy"
```

### **Frontend can't reach backend?**
- Check Vercel environment variables: `vercel env ls`
- Make sure `VITE_API_URL` is set correctly
- Redeploy: `vercel --prod`

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://handighana-backend.fly.dev`
- **API**: `https://handighana-backend.fly.dev/api`

---

## 🔧 Advanced: Custom Domain (Optional)

### **For Frontend (Vercel):**
1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your domain
4. Follow DNS instructions

### **For Backend (Fly.io):**
```bash
fly certs add api.yourdomain.com
```

---

## 📱 PWA Setup

Your app is already a PWA! Users can:
- Install it on their phone
- Use it offline
- Get app-like experience

---

## 🎉 Congratulations!

Your HandiGhana app is now:
- ✅ **Live in production**
- ✅ **Fast and optimized**
- ✅ **Secure and scalable**
- ✅ **Ready for users**

### **Next Steps:**
1. Share your app URL
2. Monitor logs for first 24h
3. Set up analytics (optional)
4. Add custom domain (optional)
5. Start getting users! 🚀

---

## 💡 Pro Tips

1. **Free Tiers:**
   - Supabase: 500MB database
   - Fly.io: 3 shared-cpu-1x, 256MB VMs
   - Vercel: Unlimited deployments

2. **Monitoring:**
   ```bash
   # Watch backend health
   watch -n 30 'curl https://handighana-backend.fly.dev/health'
   ```

3. **Backup Database:**
   ```bash
   # From Supabase dashboard
   # Settings → Database → Backups
   ```

4. **Scale if needed:**
   ```bash
   # Add more backend instances
   fly scale count 2 -a handighana-backend
   
   # Upgrade machine
   fly scale vm shared-cpu-2x -a handighana-backend
   ```

---

**Need help?** Check the full guide: `DEPLOY_QUICK_START.md`

**Have questions?** Check logs first: `fly logs -f`

🎊 **Your app is LIVE! Go celebrate!** 🎊

