# Frontend Testing Guide

This guide provides step-by-step instructions for testing all frontend features of the provider dashboard.

## Prerequisites

1. **Backend Server Running**
   ```bash
   cd backend
   npm run dev
   ```
   Should be running on `http://localhost:3001`

2. **Frontend Server Running**
   ```bash
   cd frontend
   npm run dev
   ```
   Should be running on `http://localhost:5173`

3. **Run API Integration Tests**
   ```bash
   cd frontend
   node test-frontend-api.js
   ```

## Quick Test Checklist

- [ ] Backend server running (port 3001)
- [ ] Frontend server running (port 5173)
- [ ] API integration tests pass
- [ ] Can access frontend in browser
- [ ] Provider registration form loads
- [ ] Can create provider profile
- [ ] Can access provider dashboard
- [ ] Services management works
- [ ] Workflow management works

---

## Step-by-Step Frontend Testing

### Phase 1: Provider Registration

#### Test 1.1: Access Registration Page
1. Open browser: `http://localhost:5173`
2. Navigate to `/become-provider` or click "Become a Provider"
3. **Expected**: Registration form loads with fields:
   - Full Name
   - Category (dropdown)
   - Location (dropdown)
   - Contact (phone/WhatsApp)
   - Bio/Description

#### Test 1.2: Fill Registration Form
1. Enter test data:
   ```
   Name: Test Provider Frontend
   Category: Electrician
   Location: Accra
   Contact: +233 24 123 4567
   Bio: Experienced electrician with 10+ years of experience
   ```
2. Click "Create Profile"
3. **Expected**: 
   - Loading state shows
   - Form submits successfully
   - Verification form appears

#### Test 1.3: Complete Verification
1. Upload ID document (any test file)
2. Add 2 references:
   - Reference 1: John Doe, +233 24 111 1111
   - Reference 2: Jane Smith, +233 24 222 2222
3. Upload 3 work photos (any test images)
4. Click through all verification steps
5. Submit verification
6. **Expected**: 
   - Success message appears
   - Redirected to sign-in or dashboard

#### Test 1.4: Form Validation
1. Try submitting empty form
2. **Expected**: Validation errors appear
3. Try invalid phone number
4. **Expected**: Phone validation error
5. Try submitting with missing required fields
6. **Expected**: Specific field errors shown

---

### Phase 2: Provider Dashboard Access

#### Test 2.1: Sign In as Provider
1. Navigate to `/signin`
2. Use provider credentials (or create account)
3. Sign in
4. **Expected**: Redirected to provider dashboard

#### Test 2.2: Dashboard Overview
1. Check Overview tab loads
2. **Expected**: 
   - Stats cards show:
     - Total Bookings
     - Completed Bookings
     - Pending Bookings
     - Monthly Bookings
   - Recent bookings list displays
   - All data loads correctly

#### Test 2.3: Navigation
1. Click through all tabs:
   - Overview
   - Bookings
   - Analytics
   - Finance
   - Workflow
   - Services
   - Customers
   - Business Tools
   - Premium
   - Profile
   - Settings
2. **Expected**: Each tab loads without errors

---

### Phase 3: Service Management

#### Test 3.1: View Services Tab
1. Navigate to Services tab
2. **Expected**: 
   - Services list displays
   - Stats show:
     - Total Services
     - Active Services
     - Average Price
   - "Add Service" button visible

#### Test 3.2: Create Pay-as-You-Go Service
1. Click "Add Service"
2. Fill in form:
   ```
   Name: Electrical Repair Service
   Description: Expert electrical repair for all issues
   Category: Electrician
   Pricing Model: Pay As You Go
   Base Price: 200
   Duration: 120 minutes
   ```
3. Click "Save"
4. **Expected**: 
   - Service appears in Active Services
   - Service card shows correct info
   - Stats update

#### Test 3.3: Create Subscription Service
1. Click "Add Service"
2. Fill in form:
   ```
   Name: Monthly Maintenance Plan
   Description: Regular monthly maintenance
   Category: Electrician
   Pricing Model: Subscription
   Monthly Price: 150
   Billing Cycle: Monthly
   Duration: 90 minutes
   Visits Per Period: 2
   Subscription Features: Priority Support, Monthly Inspection
   ```
3. Click "Save"
4. **Expected**: 
   - Service appears with subscription badge
   - Shows monthly price and billing cycle
   - Shows visits per period

#### Test 3.4: Edit Service
1. Find a service
2. Click "Edit" button
3. Modify:
   - Change price to 250
   - Update description
4. Click "Save"
5. **Expected**: 
   - Service updates immediately
   - Changes visible in service card

#### Test 3.5: Toggle Service Status
1. Find an active service
2. Click eye icon (deactivate)
3. **Expected**: 
   - Service moves to "Inactive Services"
   - Icon changes to EyeOff
4. Click again (reactivate)
5. **Expected**: 
   - Service moves back to "Active Services"

#### Test 3.6: Delete Service
1. Find a service
2. Click delete (trash icon)
3. Confirm deletion
4. **Expected**: 
   - Service removed from list
   - Stats update

#### Test 3.7: Service Validation
1. Try creating service with:
   - Empty name
   - Negative price
   - Missing required fields
2. **Expected**: 
   - Validation errors appear
   - Service not created

---

### Phase 4: Workflow Management

#### Test 4.1: View Workflow Tab
1. Navigate to Workflow tab
2. **Expected**: 
   - Board view displays by default
   - Stats cards show:
     - Total Tasks
     - Completed
     - In Progress
     - Overdue
   - "New Task" button visible

#### Test 4.2: Create Task Manually
1. Click "New Task"
2. Fill in form:
   ```
   Title: Install new electrical panel
   Description: Complete installation of new panel
   Status: Not Started
   Priority: High
   Due Date: Tomorrow
   Estimated Hours: 4
   Tags: installation, electrical
   ```
3. Click "Save"
4. **Expected**: 
   - Task appears in "Not Started" column
   - Task visible in all views

#### Test 4.3: Drag & Drop Task
1. In Board view
2. Drag task from "Not Started" to "In Progress"
3. **Expected**: 
   - Task moves to new column
   - Status updates automatically

#### Test 4.4: Edit Task
1. Find a task
2. Click "Edit" button
3. Modify:
   - Change priority to "Urgent"
   - Update due date
   - Add notes
4. Click "Save"
5. **Expected**: 
   - Task updates immediately
   - Changes visible in all views

#### Test 4.5: Mark Task Complete
1. Find a task
2. Click "Mark Complete" (checkmark)
3. **Expected**: 
   - Task moves to "Completed" column
   - Completion date set
   - Stats update

#### Test 4.6: Time Tracking
1. Find a task
2. Click "Start Time Tracking" (play icon)
3. **Expected**: 
   - Timer starts
   - Icon changes to stop button
4. Wait a few seconds
5. Click "Stop"
6. **Expected**: 
   - Time recorded in "Actual Hours"
   - Timer stops

#### Test 4.7: Task Filtering
1. Use search bar to search for task title
2. **Expected**: Only matching tasks shown
3. Filter by status (e.g., "In Progress")
4. **Expected**: Only tasks with that status
5. Filter by priority (e.g., "High")
6. **Expected**: Only high priority tasks
7. Filter by tag
8. **Expected**: Only tasks with that tag

#### Test 4.8: Task Views
1. Switch to List view
2. **Expected**: Tasks displayed in list format
3. Switch to Calendar view
4. **Expected**: Tasks displayed on calendar
5. Switch to Analytics view
6. **Expected**: Statistics and charts displayed

#### Test 4.9: Bulk Operations
1. Select multiple tasks using checkboxes
2. **Expected**: Bulk actions bar appears
3. Click "Mark Complete"
4. **Expected**: All selected tasks marked complete
5. Select tasks again
6. Click "Delete"
7. **Expected**: All selected tasks deleted

---

### Phase 5: Bookings Management

#### Test 5.1: View Bookings
1. Navigate to Bookings tab
2. **Expected**: 
   - All bookings for provider displayed
   - Filter options available

#### Test 5.2: Filter Bookings
1. Use status filter (All, Pending, Confirmed, Completed, Cancelled)
2. **Expected**: Only bookings with selected status shown

#### Test 5.3: Confirm Booking
1. Find a "Pending" booking
2. Click "Confirm"
3. **Expected**: 
   - Booking status changes to "Confirmed"
   - Task automatically created in Workflow (if applicable)

#### Test 5.4: Cancel Booking
1. Find a "Pending" booking
2. Click "Cancel"
3. **Expected**: Booking status changes to "Cancelled"

#### Test 5.5: Mark Booking Complete
1. Find a "Confirmed" booking
2. Click "Mark Complete"
3. **Expected**: Booking status changes to "Completed"

#### Test 5.6: Contact Customer
1. Find a booking
2. Click "Call" button
3. **Expected**: Phone dialer opens
4. Click "WhatsApp" button
5. **Expected**: WhatsApp opens

---

### Phase 6: Other Dashboard Features

#### Test 6.1: Finance Management
1. Navigate to Finance tab
2. **Expected**: 
   - Earnings overview displayed
   - Payments list visible
   - Invoice management available

#### Test 6.2: Customer Management
1. Navigate to Customers tab
2. **Expected**: 
   - Customer list displayed
   - Customer details accessible

#### Test 6.3: Business Tools
1. Navigate to Business Tools tab
2. Test each sub-tab:
   - Invoicing
   - Tax Calculator
   - Time Tracking
   - Insights
3. **Expected**: Each tab loads and functions correctly

#### Test 6.4: Settings
1. Navigate to Settings tab
2. Toggle:
   - Email notifications
   - SMS notifications
   - Auto-confirm bookings
3. **Expected**: Settings save and persist

#### Test 6.5: Profile Editing
1. Navigate to Profile tab
2. Click "Edit Profile"
3. Modify profile information
4. Click "Save"
5. **Expected**: Profile updates saved

---

## Browser Console Testing

### Check for Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate through the app
4. **Expected**: No red errors in console

### Check Network Requests
1. Go to Network tab in DevTools
2. Perform actions (create provider, service, etc.)
3. **Expected**: 
   - API requests succeed (status 200/201)
   - No failed requests
   - Responses contain expected data

### Check React Components
1. Install React DevTools extension
2. Inspect components
3. **Expected**: Components render correctly

---

## Responsive Design Testing

### Test on Different Screen Sizes
1. Use browser DevTools responsive mode
2. Test on:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
3. **Expected**: 
   - Layout adapts correctly
   - All features accessible
   - No horizontal scrolling

---

## Dark Mode Testing

### Test Theme Toggle
1. Click theme toggle (if available)
2. **Expected**: 
   - Theme switches between light/dark
   - All components styled correctly
   - Text readable in both modes

---

## Performance Testing

### Check Load Times
1. Open Network tab
2. Reload page
3. **Expected**: 
   - Initial load < 3 seconds
   - API requests complete quickly
   - No unnecessary re-renders

---

## Common Issues & Solutions

### Issue: Services not loading
**Solution**: 
- Check backend is running
- Check browser console for errors
- Verify API endpoint in Network tab

### Issue: Tasks not appearing
**Solution**: 
- Check if bookings are confirmed
- Verify providerId matches
- Check browser console for errors

### Issue: Forms not submitting
**Solution**: 
- Check validation errors
- Verify all required fields filled
- Check browser console for API errors

### Issue: Drag & drop not working
**Solution**: 
- Check browser supports drag & drop
- Verify tasks are draggable
- Check console for JavaScript errors

---

## Test Data Reference

### Provider Registration
```
Name: Test Provider
Category: Electrician
Location: Accra
Contact: +233 24 123 4567
Bio: Test provider description
```

### Service Creation
```
Name: Test Service
Category: Electrician
Pricing: Pay-as-you-go, 200 GHS
Duration: 120 minutes
```

### Task Creation
```
Title: Test Task
Priority: High
Status: Not Started
Due Date: Tomorrow
```

---

## Next Steps After Testing

1. **Document Issues**: Note any bugs or issues found
2. **Test Edge Cases**: Test with invalid data, empty states, etc.
3. **Test User Flows**: Complete full user journeys
4. **Test Integrations**: Verify all API integrations work
5. **Performance**: Check load times and responsiveness

---

## Automated Testing (Future)

Consider implementing:
- Unit tests with Jest/Vitest
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress
- Visual regression tests

For now, manual testing with this guide ensures all features work correctly.

