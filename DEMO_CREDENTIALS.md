# 🔐 Demo Credentials for HandiGhana

## 🌐 Live App URLs

- **Frontend**: https://frontend-pq0wglvtq-lacs-projects-650efe27.vercel.app
- **Backend API**: https://handighana-backend.fly.dev/api

---

## 👤 Demo User Accounts

### Customer Account
```
Email: customer@test.com
Password: password123
Role: CUSTOMER
```
**What you can do:**
- Browse and search providers
- Make bookings
- Leave reviews
- View booking history
- Manage profile

---

### Provider Account
```
Email: provider@test.com
Password: password123
Role: PROVIDER
```
**What you can do:**
- Manage provider profile
- View and respond to bookings
- Update availability
- View earnings and statistics
- Upload work photos

---

### Admin Account
```
Email: admin@test.com
Password: admin123
Role: ADMIN
```
**What you can do:**
- View platform statistics
- Manage all users
- Verify providers
- View all bookings
- Access admin dashboard

---

## 🛠️ Demo Providers in Database

The following providers are available for testing (14 total):

1. **Bis FagQ** - Electrician (Cape Coast)
2. **Kwame Boakye** - Plumber (Accra)
3. **Ama Asante** - Carpenter (Kumasi)
4. **Yaw Mensah** - Electrician (Takoradi)
5. **Kofi Adjei** - Cleaner (Accra)
6. **Abena Owusu** - Painter (Cape Coast)
7. **Kwesi Appiah** - Gardener (Kumasi)
8. **Samuel Boateng** - Mechanic (Tema)
9. ...and more!

All providers have:
- ✅ Verified status
- ⭐ High ratings (4.5-4.9)
- 📊 Realistic review counts
- 📍 Various Ghana locations
- 🔧 Multiple service areas

---

## 🧪 Quick Test Guide

### 1. Test Customer Flow:
1. Visit the live app
2. Sign in as **customer@test.com**
3. Browse providers
4. Click on a provider to see details
5. Make a booking
6. View your booking in "My Bookings"

### 2. Test Provider Flow:
1. Sign in as **provider@test.com**
2. View your provider dashboard
3. Check incoming bookings
4. Update your availability
5. Upload work photos
6. View your stats

### 3. Test Admin Flow:
1. Sign in as **admin@test.com**
2. Access admin dashboard
3. View platform statistics
4. Manage users and providers
5. View all bookings

---

## 🎯 Testing Scenarios

### Search & Filter
- Search by category (Plumber, Electrician, etc.)
- Filter by location (Accra, Kumasi, Cape Coast, etc.)
- Filter by availability
- Sort by rating

### Booking Flow
1. Select a provider
2. Click "Book Now"
3. Choose date and time
4. Add service notes
5. Confirm booking
6. View booking status

### Provider Management (as Provider)
1. Update profile information
2. Change availability status
3. Upload portfolio photos
4. View earnings
5. Respond to bookings

---

## 📊 Database Statistics

Current data in production:
- **Users**: 10+ (3 demo + others)
- **Providers**: 14 verified providers
- **Categories**: 10+ service types
- **Locations**: Accra, Kumasi, Cape Coast, Tema, Takoradi, etc.

---

## 🚀 API Testing

### Login Test:
```bash
curl -X POST https://handighana-backend.fly.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"password123"}'
```

### Get Providers:
```bash
curl https://handighana-backend.fly.dev/api/providers
```

### Health Check:
```bash
curl https://handighana-backend.fly.dev/health
```

---

## 💡 Pro Tips

1. **Quick Login**: Click 5 times on "Sign In" title to reveal demo login buttons
2. **Test Different Roles**: Sign out and sign in with different accounts
3. **Mobile Testing**: Visit on mobile for PWA installation
4. **Offline Mode**: Try using the app offline after first visit
5. **Dark Mode**: Toggle dark mode in settings

---

## ⚠️ Important Notes

- All demo accounts use **test data** - feel free to experiment!
- Bookings and changes are real but safe to test with
- Reset data by re-running the seed script if needed
- Email notifications are configured but may need SMTP setup

---

## 🔄 Reset Demo Data (if needed)

```bash
# SSH into backend
fly ssh console -a handighana-backend

# Run seed scripts
npx tsx prisma/seed-users.ts
npx tsx prisma/seed-demo-providers.ts
```

---

## 🎉 Ready to Test!

Visit: **https://frontend-pq0wglvtq-lacs-projects-650efe27.vercel.app**

Start with the **customer account** for the best first-time experience!

---

**Last Updated**: November 10, 2025
**Status**: ✅ All Systems Operational

