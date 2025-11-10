# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment.

---

## 🔧 Pre-Deployment

### Accounts & Services
- [ ] Vercel account created
- [ ] Fly.io account created
- [ ] Database ready (PostgreSQL)
- [ ] Cloudinary account (for image uploads)
- [ ] Twilio account (for SMS - optional)
- [ ] SendGrid account (for emails - optional)
- [ ] Sentry project (for monitoring - optional)

### Tools Installed
- [ ] Vercel CLI: `npm install -g vercel`
- [ ] Fly.io CLI: `curl -L https://fly.io/install.sh | sh`
- [ ] Logged into Vercel: `vercel login`
- [ ] Logged into Fly.io: `fly auth login`

### Environment Variables Prepared
- [ ] Database URL (PostgreSQL connection string)
- [ ] JWT Secret (generated with `openssl rand -base64 32`)
- [ ] Cloudinary credentials
- [ ] Twilio credentials (if using SMS)
- [ ] SendGrid API key (if using email)
- [ ] Sentry DSN (if using monitoring)

---

## 🗄️ Database Setup

- [ ] Database created
- [ ] Connection string saved securely
- [ ] Database accessible from Fly.io region
- [ ] Test connection successful

---

## 🔧 Backend Deployment

### Configuration
- [ ] `fly.toml` reviewed and updated
- [ ] `Dockerfile` working correctly
- [ ] `start.sh` script executable
- [ ] Prisma schema up to date

### Deployment
- [ ] `fly deploy` successful
- [ ] All secrets set in Fly.io:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL`
  - [ ] `NODE_ENV=production`
  - [ ] `CLOUDINARY_*` (if using)
  - [ ] `TWILIO_*` (if using)
  - [ ] `SENDGRID_*` (if using)
  - [ ] `SENTRY_DSN` (if using)
- [ ] Migrations run successfully: `npx prisma migrate deploy`
- [ ] Demo users seeded: `npx tsx prisma/seed-users.ts`

### Verification
- [ ] Backend status: `fly status` shows healthy
- [ ] Health endpoint: `https://handighana-backend.fly.dev/health` returns 200
- [ ] API test: `https://handighana-backend.fly.dev/api/test` works
- [ ] Logs show no errors: `fly logs`

---

## 🎨 Frontend Deployment

### Configuration
- [ ] `vercel.json` configured
- [ ] `vite.config.ts` production-ready
- [ ] Build command works locally: `npm run build`

### Deployment
- [ ] `vercel --prod` successful
- [ ] Environment variables set in Vercel:
  - [ ] `VITE_API_URL` = Backend API URL
  - [ ] `VITE_SENTRY_DSN` (if using)

### Verification
- [ ] Frontend loads: `https://handighana.vercel.app`
- [ ] No console errors in browser
- [ ] API calls working (check Network tab)
- [ ] Build successful in Vercel dashboard

---

## 🔄 Integration Testing

### CORS & Communication
- [ ] Frontend can reach backend API
- [ ] CORS headers configured correctly
- [ ] `FRONTEND_URL` set in backend matches actual frontend URL
- [ ] WebSocket connection working (if using)

### Authentication
- [ ] Sign up works
- [ ] Sign in works with demo credentials:
  - [ ] Customer: `customer@test.com` / `password123`
  - [ ] Provider: `provider@test.com` / `password123`
- [ ] JWT tokens issued correctly
- [ ] Protected routes working
- [ ] Logout works

### Core Features
- [ ] Search providers works
- [ ] Provider profiles load
- [ ] Booking creation works
- [ ] Image uploads work (if using Cloudinary)
- [ ] SMS notifications work (if using Twilio)
- [ ] Email notifications work (if using SendGrid)

---

## 🔐 Security

- [ ] HTTPS enforced on both frontend and backend
- [ ] JWT secret is strong (32+ characters random)
- [ ] Database credentials secure
- [ ] API keys not exposed in frontend code
- [ ] CORS properly configured (not `*` in production)
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention measures in place

---

## 📊 Monitoring

- [ ] Sentry error tracking configured
- [ ] Backend logs accessible: `fly logs`
- [ ] Frontend logs in Vercel dashboard
- [ ] Health checks configured
- [ ] Uptime monitoring set up (optional)

---

## 📚 Documentation

- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] README updated with live URLs
- [ ] Team knows how to access logs
- [ ] Incident response plan (optional)

---

## 🚀 Post-Deployment

### Immediate Tasks
- [ ] Test all critical user flows
- [ ] Verify email/SMS if configured
- [ ] Check error tracking dashboard
- [ ] Monitor logs for first hour

### Within 24 Hours
- [ ] Load test (if expecting traffic)
- [ ] Set up database backups
- [ ] Configure alerts for downtime
- [ ] Share URLs with stakeholders

### Within Week
- [ ] Set up custom domain (optional)
- [ ] Configure CDN (Vercel handles this)
- [ ] Review and optimize database queries
- [ ] Set up monitoring dashboards

---

## 🎉 Deployment Complete!

**Live URLs:**
- Frontend: `https://handighana.vercel.app`
- Backend: `https://handighana-backend.fly.dev`
- API: `https://handighana-backend.fly.dev/api`

**Next Steps:**
1. Share with team
2. Begin user testing
3. Monitor performance
4. Iterate based on feedback

---

**Deployed by:** _______________  
**Date:** _______________  
**Version:** _______________

