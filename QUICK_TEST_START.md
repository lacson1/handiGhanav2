# 🚀 Quick Test Start Guide

## Step 1: Start Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend should start on `http://localhost:3001`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend should start on `http://localhost:5173`

---

## Step 2: Run Database Migration (First Time Only)

```bash
cd backend
npx prisma migrate dev --name add_chat_and_availability
npx prisma generate
```

---

## Step 3: Open Browser

Navigate to: **http://localhost:5173**

---

## Step 4: Quick Feature Tests

### ✅ Test 1: Review Snippets (30 seconds)
1. Go to homepage
2. Look for provider cards
3. **Expected**: Cards with reviews show review snippets

### ✅ Test 2: Booking Calendar (1 minute)
1. Click "Book Now" on any provider
2. **Expected**: See calendar component (not just date input)
3. Click a date → time slots appear
4. Select time → complete booking

### ✅ Test 3: Chat (1 minute)
1. Go to any provider profile page
2. Click "Chat" button
3. **Expected**: Chat window opens
4. Type a message and send
5. **Expected**: Message appears in chat

### ✅ Test 4: Analytics (30 seconds)
1. Sign in as provider
2. Go to Provider Dashboard
3. Click "Analytics" tab
4. **Expected**: See charts and stats

---

## ✅ All Tests Pass?

If all features work:
- ✅ Review snippets appear
- ✅ Calendar shows in booking modal
- ✅ Chat opens and works
- ✅ Analytics dashboard displays

**You're all set! 🎉**

---

## ❌ Issues?

Check:
1. Browser console for errors
2. Backend terminal for errors
3. Both servers are running
4. Database migration completed

See `COMPREHENSIVE_TESTING_GUIDE.md` for detailed testing.

