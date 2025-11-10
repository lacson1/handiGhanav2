# ✅ Pre-Deployment Checklist

Before deploying to production, make sure everything is ready!

---

## 🗄️ **1. Database Setup**

### **Get Production Database URL:**

**Option A: Supabase (Recommended - Free tier available)**
```
1. Go to https://supabase.com
2. Create account & new project
3. Go to Settings → Database
4. Copy "Connection string" (URI mode)
5. Format: postgresql://postgres:[password]@[host]:5432/postgres
```

**Option B: Neon (Free tier)**
```
1. Go to https://neon.tech
2. Create account & project
3. Copy connection string
```

**Option C: Railway (Easy setup)**
```
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy DATABASE_URL
```

- [ ] Production database URL obtained
- [ ] Database URL tested locally
- [ ] Database is accessible from Fly.io region

---

## 🔑 **2. Environment Variables**

### **Backend Secrets Needed:**

Generate secrets:
```bash
# JWT Secret
openssl rand -base64 32

# Session Secret  
openssl rand -hex 32
```

- [ ] `DATABASE_URL` - Your production PostgreSQL URL
- [ ] `JWT_SECRET` - Generated 32-byte random string
- [ ] `SESSION_SECRET` - Generated 32-byte random string
- [ ] `FRONTEND_URL` - Will be set after frontend deployment
- [ ] `NODE_ENV` - Set to "production"

### **Frontend Environment Variables:**

- [ ] `VITE_API_URL` - Backend API URL (set after backend deployment)

---

## 🔐 **3. Security Check**

- [ ] All sensitive data in `.env` files (not committed to git)
- [ ] `.env` files in `.gitignore`
- [ ] No hardcoded passwords or secrets in code
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (if needed)

---

## 🧪 **4. Local Testing**

Build and test locally first:

```bash
# Backend - Test production build
cd backend
npm run build
node dist/server.js
# ✅ Should start without errors

# Frontend - Test production build  
cd frontend
npm run build
npm run preview
# ✅ Should serve correctly
```

- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] No build errors or warnings
- [ ] Production build works locally

---

## 📦 **5. Dependencies Check**

```bash
# Backend
cd backend
npm outdated
npm audit

# Frontend
cd frontend
npm outdated
npm audit
```

- [ ] No critical vulnerabilities
- [ ] All dependencies up to date (or documented why not)
- [ ] No unused dependencies

---

## 🗃️ **6. Database Migrations**

- [ ] All migrations created
- [ ] Migrations tested locally
- [ ] Seed data prepared (if needed)
- [ ] Database indexes added (performance optimization)

---

## 📝 **7. Code Quality**

- [ ] All TypeScript errors fixed
- [ ] Linter warnings addressed
- [ ] Console logs removed (or conditional)
- [ ] Error handling in place
- [ ] Loading states for all async operations

---

## 🚀 **8. Platform Accounts**

### **Fly.io (Backend):**
```bash
# Install CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

- [ ] Fly.io account created
- [ ] Fly.io CLI installed
- [ ] Logged into Fly.io
- [ ] Payment method added (free tier available)

### **Vercel (Frontend):**
```bash
# Install CLI
npm install -g vercel

# Login
vercel login
```

- [ ] Vercel account created
- [ ] Vercel CLI installed  
- [ ] Logged into Vercel
- [ ] GitHub connected (recommended)

---

## 📊 **9. Monitoring Setup (Optional)**

- [ ] Error tracking (Sentry already configured)
- [ ] Analytics (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring (UptimeRobot, etc.)
- [ ] Log management

---

## 🌐 **10. Domain (Optional)**

If using custom domain:

- [ ] Domain purchased
- [ ] DNS access available
- [ ] SSL certificate (automatic with Vercel/Fly.io)

---

## ✅ **11. Final Checks**

- [ ] Git repository up to date
- [ ] All changes committed
- [ ] README updated
- [ ] Deployment docs reviewed
- [ ] Backup plan in place

---

## 🎯 **Quick Start Commands**

Once checklist is complete:

```bash
# Option 1: Use automated script
./deploy-production.sh

# Option 2: Manual deployment
# See DEPLOY_QUICK_START.md for step-by-step
```

---

## 📞 **Need Help?**

- **Fly.io Docs**: https://fly.io/docs/
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## 🎉 **Ready to Deploy?**

If all checkboxes are checked, you're ready to run:

```bash
./deploy-production.sh
```

**Estimated deployment time: 15-20 minutes** ⏱️

---

## ⚠️ **Common Issues**

### **"DATABASE_URL not set"**
- Make sure you set the secret in Fly.io:
  ```bash
  fly secrets set DATABASE_URL="your-url"
  ```

### **"Build failed"**
- Run `npm run build` locally first
- Check for TypeScript errors
- Check for missing dependencies

### **"Health check failed"**
- Check logs: `fly logs`
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### **"CORS error"**
- Make sure FRONTEND_URL is set in backend
- Check allowed origins in server.ts

---

## 🔄 **After Deployment**

1. **Test the app thoroughly**
   - Sign up/login
   - Browse providers
   - Make test booking
   - Test all major features

2. **Monitor for 24 hours**
   - Check logs regularly
   - Monitor error rates
   - Watch response times

3. **Set up alerts**
   - Downtime alerts
   - Error rate alerts
   - Performance alerts

---

**Good luck with your deployment! 🚀**

