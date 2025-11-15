# 🧪 Comprehensive Testing Guide

## Prerequisites

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend should run on `http://localhost:3001`

2. **Start Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend should run on `http://localhost:5173`

3. **Run Database Migration** (if not done):
   ```bash
   cd backend
   npx prisma migrate dev --name add_chat_and_availability
   npx prisma generate
   ```

---

## ✅ Feature 1: Ratings & Reviews on Listings

### Test Steps:
1. Navigate to homepage: `http://localhost:5173`
2. Look for provider cards in the search results or homepage
3. **Expected**: Provider cards with reviews should show a review snippet box below the description

### What to Verify:
- [ ] Review snippet appears on cards with reviews
- [ ] Shows 1-5 star rating
- [ ] Shows comment preview (truncated to ~80 characters)
- [ ] Shows user name (if available)
- [ ] Verified badge appears for verified reviews (green checkmark)
- [ ] Cards without reviews don't show snippets (graceful handling)
- [ ] Works in both grid and list view modes
- [ ] Responsive on mobile devices
- [ ] Dark mode works correctly

### Test Providers:
- Try providers with reviews
- Try providers without reviews
- Check different rating levels (1-5 stars)

---

## ✅ Feature 2: Booking Calendar Integration

### Test Steps:
1. Click "Book Now" on any provider card
2. Booking modal should open
3. **Expected**: See a visual calendar component (not just date input)

### What to Verify:
- [ ] Calendar component displays correctly
- [ ] Can navigate between months (prev/next arrows)
- [ ] Past dates are disabled (grayed out, not clickable)
- [ ] Future dates are clickable
- [ ] Selected date is highlighted (gold/yellow color)
- [ ] When date is selected, time slots appear below calendar
- [ ] Time slots are displayed as clickable buttons
- [ ] Selected time slot is highlighted
- [ ] Can change date selection (time slots update)
- [ ] Can complete booking with calendar-selected date/time
- [ ] Booking submission works correctly
- [ ] Calendar styling looks good in dark mode
- [ ] Responsive on mobile (calendar adapts to screen size)

### Test Scenarios:
- Select today's date
- Select a date next week
- Select different time slots
- Try to select past dates (should be disabled)
- Complete a booking with calendar date/time

---

## ✅ Feature 3: Payment Webhooks

### Test Steps:
1. Create a booking that requires payment
2. Complete payment flow
3. Check backend logs for webhook events

### What to Verify:
- [ ] Paystack webhook endpoint exists: `POST /api/payments/webhook/paystack`
- [ ] Mobile Money webhook endpoint exists: `POST /api/payments/webhook/mobile-money`
- [ ] Webhook handlers log events correctly
- [ ] Signature verification works (for Paystack)

### Test with Webhook Testing Tools:
- Use Paystack webhook testing tool
- Send test webhook events
- Verify backend receives and processes them

**Note**: Full webhook testing requires:
- Paystack account with webhook URL configured
- Mobile Money API credentials
- Webhook URL: `https://your-backend-url/api/payments/webhook/paystack`

---

## ✅ Feature 4: Real-Time Chat System

### Test Steps:
1. Navigate to a provider profile page
2. Click "Chat" button
3. Chat window should open

### What to Verify:
- [ ] Chat button appears on provider profile
- [ ] Clicking chat button opens chat window
- [ ] Chat window displays correctly (modal overlay)
- [ ] Can type and send messages
- [ ] Messages appear in chat window
- [ ] Messages show sender/receiver correctly
- [ ] Timestamps display correctly
- [ ] Read receipts work (✓✓ for read messages)
- [ ] Real-time updates work (open in two browsers)
- [ ] Chat window closes correctly
- [ ] Responsive on mobile
- [ ] Dark mode works

### Test Scenarios:
1. **Single User Test**:
   - Open chat
   - Send a message
   - Verify message appears

2. **Real-Time Test** (requires two browsers/devices):
   - Open chat in Browser 1 (as customer)
   - Open chat in Browser 2 (as provider - different account)
   - Send message from Browser 1
   - Verify message appears in Browser 2 in real-time
   - Send reply from Browser 2
   - Verify reply appears in Browser 1

3. **Authentication Test**:
   - Try to open chat without logging in
   - Should prompt to sign in

---

## ✅ Feature 5: Analytics Dashboard

### Test Steps:
1. Sign in as a provider
2. Navigate to Provider Dashboard: `/provider-dashboard`
3. Click "Analytics" tab in sidebar

### What to Verify:
- [ ] Analytics tab exists in sidebar
- [ ] Analytics dashboard loads correctly
- [ ] Stats cards display:
  - [ ] Total Bookings
  - [ ] Revenue
  - [ ] Active Users
  - [ ] Average Rating
- [ ] Charts display:
  - [ ] Bookings Over Time (Line chart)
  - [ ] Revenue Trends (Area chart)
  - [ ] Service Category Distribution (Bar chart)
- [ ] Period selector works (7d, 30d, 3m, 1y)
- [ ] Charts are responsive
- [ ] Dark mode works
- [ ] No console errors

### Test Scenarios:
- Switch between different time periods
- Verify charts update (currently using mock data)
- Test on different screen sizes
- Test in dark mode

---

## ✅ Feature 6: Provider Dashboards Enhancement

### Test Steps:
1. Sign in as a provider
2. Navigate to Provider Dashboard
3. Test all tabs

### What to Verify:
- [ ] Overview tab shows stats
- [ ] Bookings tab shows all bookings
- [ ] Analytics tab shows charts (from Feature 5)
- [ ] Finance tab shows financial data
- [ ] Reviews tab shows review management
- [ ] All tabs are functional
- [ ] Navigation works smoothly

---

## 🔍 Cross-Feature Testing

### Integration Tests:
1. **Booking → Chat Flow**:
   - Create a booking
   - Open chat with provider
   - Verify booking context in chat

2. **Review → Display Flow**:
   - Create a review for a provider
   - Check if review appears in provider card snippet
   - Verify review shows in provider profile

3. **Calendar → Booking Flow**:
   - Use calendar to select date/time
   - Complete booking
   - Verify booking uses calendar-selected date/time

---

## 🐛 Common Issues & Solutions

### Issue: Review snippets not appearing
**Solution**: 
- Check browser console for API errors
- Verify provider has reviews in database
- Check network tab for `/api/reviews?providerId=...` request

### Issue: Calendar not showing
**Solution**:
- Check if `react-calendar` is installed: `npm list react-calendar`
- Verify CSS is loading: Check browser console for CSS errors
- Clear browser cache

### Issue: Chat not working
**Solution**:
- Verify WebSocket connection (check browser console)
- Check if user is authenticated
- Verify backend chat routes are registered
- Check backend logs for errors

### Issue: Analytics charts not displaying
**Solution**:
- Verify `recharts` is installed: `npm list recharts`
- Check browser console for errors
- Verify stats API is working

### Issue: Payment webhooks not receiving
**Solution**:
- Verify webhook URL is correct
- Check backend logs
- Verify webhook signature (for Paystack)
- Test with webhook testing tools

---

## 📊 Test Checklist

### Frontend Features
- [ ] Review snippets on provider cards
- [ ] Calendar in booking modal
- [ ] Chat button on provider profile
- [ ] Chat window functionality
- [ ] Analytics dashboard
- [ ] All components responsive
- [ ] Dark mode works everywhere
- [ ] No console errors

### Backend Features
- [ ] Chat API endpoints working
- [ ] Payment webhook endpoints exist
- [ ] WebSocket connections working
- [ ] Database models created (after migration)

### Integration
- [ ] Booking flow with calendar
- [ ] Chat real-time messaging
- [ ] Analytics data loading
- [ ] Review display integration

---

## 🚀 Quick Test Script

Run this to test all features quickly:

1. **Start servers** (in separate terminals):
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Open browser**: `http://localhost:5173`

3. **Test sequence**:
   - ✅ Check homepage for review snippets
   - ✅ Click "Book Now" → test calendar
   - ✅ Go to provider profile → test chat button
   - ✅ Sign in as provider → test analytics dashboard
   - ✅ Test all features in dark mode

---

## 📝 Test Results Template

Fill this in as you test:

```
Date: ___________
Tester: ___________

Feature 1 - Review Snippets: [ ] Pass [ ] Fail
Notes: _________________________________

Feature 2 - Booking Calendar: [ ] Pass [ ] Fail
Notes: _________________________________

Feature 3 - Payment Webhooks: [ ] Pass [ ] Fail
Notes: _________________________________

Feature 4 - Real-Time Chat: [ ] Pass [ ] Fail
Notes: _________________________________

Feature 5 - Analytics Dashboard: [ ] Pass [ ] Fail
Notes: _________________________________

Feature 6 - Provider Dashboards: [ ] Pass [ ] Fail
Notes: _________________________________

Overall Status: [ ] All Pass [ ] Some Fail
Issues Found: _________________________________
```

---

## 🎯 Success Criteria

All features are working correctly if:
- ✅ No console errors
- ✅ All UI components render correctly
- ✅ All interactions work (clicks, forms, etc.)
- ✅ Real-time features work (chat, WebSocket)
- ✅ Responsive on mobile
- ✅ Dark mode works
- ✅ No TypeScript/build errors

---

## 🔧 Debugging Tips

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls are successful
3. **Check Backend Logs**: Look for server errors
4. **Verify Database**: Check if data exists in database
5. **Clear Cache**: Clear browser cache if issues persist
6. **Check Dependencies**: Verify all npm packages are installed

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message in browser console
2. Check backend logs
3. Verify all dependencies are installed
4. Ensure database migration is run
5. Check that servers are running

---

**Happy Testing! 🎉**

