# 🚀 HandyGhana - Quick Setup Guide

## ✅ **Current Status**

**✅ Fully Deployed:**
- Backend: https://handighana-backend.fly.dev
- Frontend: https://frontend-fkcjzjded-lacs-projects-650efe27.vercel.app
- Database: PostgreSQL on Fly.io
- Real Providers: 6 service providers loaded
- Code: https://github.com/lacson1/handiGhanav2

**✅ Features Implemented:**
- User authentication (JWT)
- Provider profiles
- Booking system
- Payment integration
- Reviews & ratings
- Real-time notifications (Socket.io)
- Email notifications (SendGrid) - *needs config*
- Error monitoring (Sentry) - *needs config*

---

## ⚙️ **5-Minute Setup**

### Step 1: Configure SendGrid (Email Notifications)

```bash
# 1. Sign up at https://sendgrid.com
# 2. Create API Key (Settings → API Keys → Create API Key)
# 3. Verify sender email (Settings → Sender Authentication)

# 4. Add to backend:
cd /Users/lacbis/handiGhanav2/backend
fly secrets set SENDGRID_API_KEY="SG.your-api-key-here"
fly secrets set FROM_EMAIL="noreply@handyghana.com"
fly secrets set FRONTEND_URL="https://frontend-fkcjzjded-lacs-projects-650efe27.vercel.app"

# 5. Restart:
fly apps restart handighana-backend
```

### Step 2: Configure Sentry (Error Tracking)

```bash
# 1. Sign up at https://sentry.io
# 2. Create 2 projects:
#    - Node.js (backend)
#    - React (frontend)

# 3. Configure Backend:
fly secrets set SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# 4. Configure Frontend:
cd /Users/lacbis/handiGhanav2/frontend
npx vercel env add VITE_SENTRY_DSN production
# Paste your frontend DSN

# 5. Redeploy frontend:
npx vercel --prod
```

---

## 📱 **Test Your App**

### Visit Your Live App:
**Frontend:** https://frontend-fkcjzjded-lacs-projects-650efe27.vercel.app

### Test Flow:

1. **Register as Customer**
   - Email: test-customer@example.com
   - Create account
   - Browse providers

2. **View Real Providers**
   - Bis FagQ (Electrician - Cape Coast)
   - Ama Brown (Cleaner - Accra)
   - Jonathan Hood (Network Setup - Accra)
   - Alfred Kwadjo (Veterinary - Accra)
   - Value Health Pharmacy (Pharmacy - Accra)
   - Stephen Corquaye (Veterinary - Accra)

3. **Make a Booking**
   - Select a provider
   - Choose service & date
   - Complete booking
   - *Email confirmation sent (once SendGrid configured)*

4. **Register as Provider**
   - Create provider account
   - Fill profile
   - Upload photos
   - Wait for admin approval

5. **Admin Dashboard**
   - Register admin account
   - Verify providers
   - Manage bookings
   - View analytics

---

## 🔧 **Development Workflow**

### Local Development:

```bash
# Backend:
cd /Users/lacbis/handiGhanav2/backend
npm install
npm run dev

# Frontend:
cd /Users/lacbis/handiGhanav2/frontend
npm install
npm run dev
```

### Deploy Changes:

```bash
# 1. Commit to GitHub:
git add .
git commit -m "Your message"
git push origin main

# 2. Deploy Backend:
cd backend
fly deploy

# 3. Deploy Frontend:
cd frontend
npx vercel --prod
```

---

## 📊 **Environment Variables**

### Backend (Fly.io) - Current:
```bash
DATABASE_URL=postgresql://...       # ✅ Set
JWT_SECRET=your-secret              # ✅ Set
NODE_ENV=production                 # ✅ Set
PORT=3001                          # ✅ Set
```

### Backend (Fly.io) - To Configure:
```bash
SENDGRID_API_KEY=                  # ⚠️ Needed for emails
FROM_EMAIL=                        # ⚠️ Needed for emails
FRONTEND_URL=                      # ⚠️ Needed for email links
SENTRY_DSN=                        # 📊 Recommended
```

### Frontend (Vercel) - Current:
```bash
VITE_API_URL=https://handighana-backend.fly.dev/api  # ✅ Set
VITE_SOCKET_URL=https://handighana-backend.fly.dev   # ✅ Set
```

### Frontend (Vercel) - To Configure:
```bash
VITE_SENTRY_DSN=                   # 📊 Recommended
```

---

## 📝 **Common Tasks**

### Add More Providers:

1. **Via CSV:**
```bash
# 1. Update service_providers.csv
# 2. Run seed script:
cd backend
fly ssh console -C "cd /app && node prisma/seed-direct-fixed.js"
```

2. **Via UI:**
- Register as provider through app
- Admin approves via dashboard

### Update Frontend Environment:
```bash
cd frontend
npx vercel env add VARIABLE_NAME production
npx vercel --prod
```

### Update Backend Secrets:
```bash
cd backend
fly secrets set VARIABLE_NAME="value"
# Auto-restarts backend
```

### View Backend Logs:
```bash
cd backend
fly logs
```

### Database Management:
```bash
# Connect to database:
fly postgres connect -a handighana-backend-db

# Run migrations:
fly ssh console -C "cd /app && npx prisma migrate deploy"

# View providers:
fly ssh console -C "cd /app && node prisma/check-providers.js"
```

---

## 🆘 **Troubleshooting**

### Problem: Backend not responding
```bash
fly status
fly logs
fly apps restart handighana-backend
```

### Problem: Frontend not updating
```bash
cd frontend
npm run build
npx vercel --prod --force
```

### Problem: Database connection error
```bash
fly postgres attach --app handighana-backend handighana-backend-db
fly apps restart handighana-backend
```

### Problem: Emails not sending
- Check SendGrid API key is set
- Verify sender email in SendGrid
- Check logs: `fly logs | grep email`
- Test with: `curl -X POST https://handighana-backend.fly.dev/api/test/email`

### Problem: Errors not showing in Sentry
- Verify DSN is correct
- Check VITE_ prefix for frontend
- Trigger test error: throw `new Error('Test')`

---

## 📚 **Documentation Files**

| File | Description |
|------|-------------|
| `IMPLEMENTATION_COMPLETE.md` | Complete feature implementation guide |
| `ESSENTIAL_FEATURES_IMPLEMENTATION.md` | Email & Sentry setup details |
| `DEPLOYMENT_SUCCESS_SUMMARY.md` | Initial deployment documentation |
| `REAL_DATA_SUCCESS.md` | Provider data seeding guide |
| `SEED_PROVIDERS_GUIDE.md` | How to add more providers |

---

## 💰 **Cost Overview**

**Current (Free Tier):**
- Fly.io: $0 ($5 credit/month)
- Vercel: $0 (Hobby plan)
- SendGrid: $0 (100 emails/day)
- Sentry: $0 (5K errors/month)
- **Total: $0/month**

**When You Scale:**
- Fly.io: ~$10/month (dedicated CPU)
- Vercel: $20/month (Pro plan)
- SendGrid: $15/month (40K emails)
- Sentry: $26/month (50K errors)
- **Total: ~$71/month**

---

## 🎯 **Next Steps**

**This Week:**
1. ✅ Configure SendGrid
2. ✅ Configure Sentry
3. ✅ Test booking flow
4. Share app with providers

**This Month:**
1. Add Cloudinary (image uploads)
2. Add SMS notifications (Twilio)
3. Implement Mobile Money payments
4. Onboard 20+ providers
5. Soft launch in Accra

**This Quarter:**
1. Launch mobile apps (React Native)
2. Expand to 5 cities
3. 100+ providers
4. Marketing campaign
5. Revenue: bookings + subscriptions

---

## 🔗 **Quick Links**

- **Live App:** https://frontend-fkcjzjded-lacs-projects-650efe27.vercel.app
- **Backend API:** https://handighana-backend.fly.dev
- **GitHub:** https://github.com/lacson1/handiGhanav2
- **Fly.io Dashboard:** https://fly.io/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **SendGrid Dashboard:** https://app.sendgrid.com
- **Sentry Dashboard:** https://sentry.io

---

## ✅ **Checklist**

**Deployment:**
- [x] Backend deployed to Fly.io
- [x] Frontend deployed to Vercel
- [x] Database created and migrated
- [x] 6 real providers seeded
- [x] GitHub repository created
- [x] All code committed

**Configuration Needed:**
- [ ] SendGrid API key
- [ ] Sentry DSN (backend)
- [ ] Sentry DSN (frontend)

**Testing:**
- [ ] Register test customer
- [ ] Make test booking
- [ ] Receive email confirmation
- [ ] View error in Sentry
- [ ] Test provider registration

**Launch:**
- [ ] Share with real providers
- [ ] Get feedback
- [ ] Fix issues
- [ ] Marketing materials
- [ ] Official launch

---

**🎊 Congratulations! Your HandyGhana platform is live!** 🚀

Need help with anything? Just ask! 💬

