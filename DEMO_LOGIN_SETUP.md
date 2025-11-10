# 🎯 Demo Login Setup Guide

## ✅ What's Already Done

1. **Frontend Demo Login** - Fully implemented and working
   - Hidden activation (click 5x on "Sign In" title)
   - Customer, Provider, and Admin buttons
   - Works in both LoginModal and SignIn page

2. **Backend Authentication** - Ready to accept demo logins
   - `/api/auth/login` endpoint working
   - Password hashing with bcrypt
   - JWT token generation

## 🔧 What Needs to Be Done

You need to **create the demo users** in your database. Choose one of these methods:

---

### Method 1: Run the Seed Script (Recommended)

When your database is running and accessible:

```bash
cd backend
npx tsx prisma/seed-users.ts
```

This will create:
- ✅ Customer account
- ✅ Provider account with profile
- ✅ Admin account

---

### Method 2: Use the Shell Script

If your backend API is running:

```bash
cd backend
./create-demo-users.sh
```

Or specify a custom API URL:

```bash
API_URL=https://your-api.com ./create-demo-users.sh
```

---

### Method 3: Manual Registration

Visit your signup page and manually create:

**Customer:**
- Email: `customer@test.com`
- Password: `password123`
- Name: John Doe
- Role: Customer

**Provider:**
- Email: `provider@test.com`
- Password: `password123`
- Name: Bis FagQ
- Role: Provider

**Admin:**
- Email: `admin@test.com`
- Password: `admin123`
- Name: Admin User
- Role: Admin

---

## 🎮 How to Use Demo Login

Once users are created:

1. **Go to any login page** (`/signin` or click "Sign In")
2. **Click 5 times rapidly** on the "Sign In" title area (top of the form)
3. **Demo buttons appear** at the bottom
4. **Click** Customer, Provider, or Admin to instantly login
5. **Click 5 times again** to hide the demo options

---

## 🐛 Current Issue

**Database Connection Error:**
```
User was denied access on the database `(not available)`
```

**Possible Solutions:**

1. **Check if database is running:**
   ```bash
   # For PostgreSQL
   pg_isready
   ```

2. **Verify DATABASE_URL in .env:**
   ```bash
   cd backend
   cat .env | grep DATABASE_URL
   ```

3. **Start your database:**
   - If using Docker: `docker compose up -d`
   - If using local PostgreSQL: `brew services start postgresql` (Mac)

4. **Run migrations:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

5. **Then create demo users:**
   ```bash
   npx tsx prisma/seed-users.ts
   ```

---

## 📝 Demo Credentials

Once created, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Customer** | customer@test.com | password123 |
| **Provider** | provider@test.com | password123 |
| **Admin** | admin@test.com | admin123 |

---

## ✨ Features

- **Invisible by default** - No one knows it exists
- **5-click activation** - Prevents accidental discovery
- **All roles included** - Customer, Provider, and Admin
- **Auto-redirect** - Takes you to the right dashboard
- **Toggle on/off** - Click 5x to show, 5x again to hide
- **Works everywhere** - LoginModal and SignIn page

---

## 🚀 Next Steps

1. Fix database connection
2. Run: `npx tsx prisma/seed-users.ts`
3. Test demo login on your app
4. Click 5x on "Sign In" title to activate

**Need help?** Check the database connection first!

