# 🧪 Testing Guide - New Features

## Features to Test

### 1. ✅ Ratings & Reviews on Listings

**What to Test:**
- Provider cards should now show review snippets
- Review snippets appear below the description
- Shows star rating, comment preview, and verified badge (if applicable)

**How to Test:**
1. Navigate to the homepage or search results
2. Look for provider cards with reviews
3. You should see a review snippet box showing:
   - Star rating (1-5 stars)
   - Comment preview (truncated to 80 characters)
   - User name (if available)
   - Verified badge (if review is verified)

**Expected Behavior:**
- Review snippets load automatically for providers with reviews
- If a provider has no reviews, no snippet is shown (graceful handling)
- Review snippet styling matches the card design

**Files Modified:**
- `frontend/src/components/ReviewSnippet.tsx` (new component)
- `frontend/src/components/ProviderCard.tsx` (enhanced)
- `frontend/src/components/ProviderCardEnhanced.tsx` (enhanced)

---

### 2. 📅 Booking Calendar Integration

**What to Test:**
- Visual calendar component in booking modal
- Date selection with calendar picker
- Time slot selection with availability indicators
- Disabled dates (past dates)

**How to Test:**
1. Click "Book Now" on any provider card
2. In the booking modal, you should see:
   - A visual calendar component (instead of simple date input)
   - Time slots displayed below the calendar when a date is selected
   - Selected date highlighted in gold/yellow
   - Past dates disabled (grayed out)

**Expected Behavior:**
- Calendar shows current month by default
- Can navigate between months
- Clicking a date selects it and shows time slots
- Time slots are clickable buttons
- Selected time slot is highlighted
- Form submission works with calendar-selected date/time

**Files Modified:**
- `frontend/src/components/AvailabilityCalendar.tsx` (new component)
- `frontend/src/components/BookingModal.tsx` (enhanced)
- `backend/prisma/schema.prisma` (added AvailabilitySlot model)

**Note:** The availability checking is currently using mock data. In production, this will connect to the availability API to check:
- Provider's availability slots
- Existing bookings (to show booked slots)
- Provider's working hours

---

## 🚀 Quick Test Steps

### Step 1: Start the Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 2: Test Review Snippets

1. Open `http://localhost:5173` (or your frontend URL)
2. Navigate to homepage or search for providers
3. Look for provider cards - they should show review snippets if the provider has reviews
4. Check both grid and list view modes

### Step 3: Test Booking Calendar

1. Click "Book Now" on any provider
2. In the booking modal:
   - You should see a calendar component
   - Click on a future date
   - Time slots should appear below
   - Select a time slot
   - Complete the booking form
   - Submit and verify booking is created

### Step 4: Test Responsive Design

1. Resize browser window
2. Test on mobile viewport (Chrome DevTools)
3. Verify calendar and review snippets are responsive

---

## 🐛 Known Issues / Notes

1. **Availability API**: Currently using mock data. Real availability checking will require:
   - Backend API endpoint: `GET /api/providers/:id/availability?date=YYYY-MM-DD`
   - Database migration for `AvailabilitySlot` model
   - Provider availability management in dashboard

2. **Review Loading**: Reviews are loaded asynchronously. If a provider has many reviews, there might be a slight delay.

3. **Calendar Styling**: The calendar uses custom CSS. If styles look off, check the `<style>` tag in `AvailabilityCalendar.tsx`.

---

## ✅ Success Criteria

- [ ] Review snippets appear on provider cards with reviews
- [ ] Calendar component displays correctly in booking modal
- [ ] Date selection works (can select future dates)
- [ ] Time slots appear when date is selected
- [ ] Time slot selection works
- [ ] Booking submission works with calendar date/time
- [ ] No console errors
- [ ] Responsive on mobile devices
- [ ] Dark mode works correctly

---

## 🔧 Troubleshooting

### Calendar not showing
- Check browser console for errors
- Verify `react-calendar` package is installed: `npm list react-calendar`
- Check if CSS is loading: `react-calendar/dist/Calendar.css`

### Review snippets not appearing
- Check browser console for API errors
- Verify provider has reviews in database
- Check network tab for `/api/reviews?providerId=...` request

### TypeScript errors
- Run `npm run build` to see all errors
- Fix any type mismatches
- Ensure all imports are correct

---

## 📝 Next Steps After Testing

Once testing is complete:
1. Run database migration for `AvailabilitySlot` model
2. Create availability API endpoints
3. Add provider availability management UI
4. Connect calendar to real availability data
5. Continue with remaining features (Payment webhooks, Chat, Analytics)

