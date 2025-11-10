# Provider Dashboard Testing Guide

This document provides a comprehensive testing guide for all provider dashboard features.

## Prerequisites

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend should run on `http://localhost:3001`

2. **Start the Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend should run on `http://localhost:5173`

3. **Test User Account**
   - Create a test account or use existing credentials
   - Ensure you can sign in as a regular user

## Test Scenarios

### 1. Provider Registration

#### Test 1.1: Complete Provider Registration Flow
**Steps:**
1. Navigate to `/become-provider` or click "Become a Provider" link
2. Fill in the registration form:
   - **Name**: "Test Provider"
   - **Category**: Select any category (e.g., "Electrician")
   - **Location**: Select a city (e.g., "Accra")
   - **Contact**: "+233 24 123 4567"
   - **Bio**: "Experienced electrician with 10 years of experience"
3. Click "Create Profile"
4. **Expected**: 
   - Provider profile is created
   - Verification form appears
   - Provider ID is generated

#### Test 1.2: Provider Verification
**Steps:**
1. After registration, verify the verification form appears
2. Complete verification steps:
   - **ID Document**: Upload a test document
   - **References**: Add at least 2 references
   - **Portfolio**: Upload at least 3 work photos
3. Submit verification
4. **Expected**: 
   - Success message appears
   - Redirected to sign-in or provider dashboard

#### Test 1.3: Registration Validation
**Steps:**
1. Try to submit form with empty fields
2. Try invalid phone number format
3. **Expected**: 
   - Validation errors appear
   - Form does not submit

---

### 2. Service Management

#### Test 2.1: Create Pay-as-You-Go Service
**Steps:**
1. Sign in as provider
2. Navigate to Provider Dashboard → Services tab
3. Click "Add Service"
4. Fill in service details:
   - **Name**: "Electrical Repair"
   - **Description**: "Expert electrical repair services"
   - **Category**: "Electrician"
   - **Pricing Model**: "Pay As You Go"
   - **Base Price**: 200
   - **Duration**: 120 (minutes)
5. Click "Save"
6. **Expected**: 
   - Service appears in Active Services list
   - Service card shows correct information
   - Stats update (Total Services count increases)

#### Test 2.2: Create Subscription Service
**Steps:**
1. Click "Add Service"
2. Fill in service details:
   - **Name**: "Monthly Maintenance Plan"
   - **Description**: "Regular monthly maintenance"
   - **Category**: "Electrician"
   - **Pricing Model**: "Subscription"
   - **Monthly Price**: 150
   - **Billing Cycle**: "Monthly"
   - **Duration**: 90
   - **Visits Per Period**: 2
   - **Subscription Features**: Add features like "Priority Support", "Monthly Inspection"
3. Click "Save"
4. **Expected**: 
   - Service appears with subscription badge
   - Shows monthly price and billing cycle
   - Shows visits per period or "Unlimited visits"

#### Test 2.3: Edit Service
**Steps:**
1. Find an existing service
2. Click "Edit" button
3. Modify:
   - Change price to 250
   - Update description
4. Click "Save"
5. **Expected**: 
   - Service updates reflect immediately
   - Changes visible in service card

#### Test 2.4: Toggle Service Status
**Steps:**
1. Find an active service
2. Click the eye icon to deactivate
3. **Expected**: 
   - Service moves to "Inactive Services" section
   - Eye icon changes to "EyeOff"
4. Click again to reactivate
5. **Expected**: 
   - Service moves back to "Active Services"

#### Test 2.5: Delete Service
**Steps:**
1. Find a service
2. Click "Delete" (trash icon)
3. Confirm deletion
4. **Expected**: 
   - Service is removed from list
   - Stats update (Total Services count decreases)

#### Test 2.6: Service Validation
**Steps:**
1. Try to create service with:
   - Empty name
   - Negative price
   - Pay-as-you-go without base price
   - Subscription without monthly price
2. **Expected**: 
   - Validation errors appear
   - Service is not created

---

### 3. Workflow Management

#### Test 3.1: Create Task Manually
**Steps:**
1. Navigate to Provider Dashboard → Workflow tab
2. Click "New Task"
3. Fill in task details:
   - **Title**: "Install new electrical panel"
   - **Description**: "Complete installation of new panel"
   - **Status**: "Not Started"
   - **Priority**: "High"
   - **Due Date**: Select future date
   - **Estimated Hours**: 4
   - **Tags**: Add tags like "installation", "electrical"
4. Click "Save"
5. **Expected**: 
   - Task appears in Board view (Not Started column)
   - Task appears in List view
   - Stats update (Total Tasks increases)

#### Test 3.2: Auto-Create Tasks from Bookings
**Steps:**
1. Ensure you have a confirmed booking
2. Navigate to Workflow tab
3. **Expected**: 
   - Tasks automatically created from confirmed bookings
   - Tasks linked to booking ID
   - Tasks use appropriate templates if available

#### Test 3.3: Update Task Status (Drag & Drop)
**Steps:**
1. In Board view, find a task in "Not Started" column
2. Drag task to "In Progress" column
3. **Expected**: 
   - Task moves to new column
   - Status updates automatically

#### Test 3.4: Edit Task
**Steps:**
1. Find a task
2. Click "Edit" button
3. Modify:
   - Change priority to "Urgent"
   - Update due date
   - Add notes
4. Click "Save"
5. **Expected**: 
   - Task updates reflect immediately
   - Changes visible in all views

#### Test 3.5: Mark Task Complete
**Steps:**
1. Find a task
2. Click "Mark Complete" (checkmark icon)
3. **Expected**: 
   - Task moves to "Completed" column
   - Completion date is set
   - Stats update (Completed count increases)

#### Test 3.6: Time Tracking
**Steps:**
1. Find a task
2. Click "Start Time Tracking" (play icon)
3. **Expected**: 
   - Timer starts
   - Icon changes to stop button
4. Wait a few seconds, then click "Stop"
5. **Expected**: 
   - Time is recorded in "Actual Hours"
   - Timer stops

#### Test 3.7: Duplicate Task
**Steps:**
1. Find a task
2. Click "Duplicate" (copy icon)
3. **Expected**: 
   - New task created with "(Copy)" in title
   - Status set to "Not Started"
   - Original task unchanged

#### Test 3.8: Delete Task
**Steps:**
1. Find a task
2. Click "Delete" (trash icon)
3. Confirm deletion
4. **Expected**: 
   - Task is removed
   - Stats update

#### Test 3.9: Bulk Operations
**Steps:**
1. Select multiple tasks using checkboxes
2. **Expected**: 
   - Bulk actions bar appears
3. Click "Mark Complete"
4. **Expected**: 
   - All selected tasks marked complete
5. Select tasks again
6. Click "Delete"
7. **Expected**: 
   - All selected tasks deleted

#### Test 3.10: Task Filtering
**Steps:**
1. Use search bar to search for task title
2. **Expected**: 
   - Only matching tasks shown
3. Filter by status (e.g., "In Progress")
4. **Expected**: 
   - Only tasks with that status shown
5. Filter by priority (e.g., "High")
6. **Expected**: 
   - Only high priority tasks shown
7. Filter by tag
8. **Expected**: 
   - Only tasks with that tag shown

#### Test 3.11: Task Sorting
**Steps:**
1. Change sort by dropdown (Due Date, Priority, Created, Title)
2. Toggle sort order (ascending/descending)
3. **Expected**: 
   - Tasks reorder according to selection

#### Test 3.12: Calendar View
**Steps:**
1. Click "Calendar" tab
2. **Expected**: 
   - Calendar view displays
   - Tasks shown on their due dates
3. Navigate to different months
4. Click on a task
5. **Expected**: 
   - Task modal opens for editing

#### Test 3.13: Analytics View
**Steps:**
1. Click "Analytics" tab
2. **Expected**: 
   - Statistics displayed:
     - Task Status Distribution
     - Priority Distribution
     - Time Tracking Analysis
     - Tag Usage
     - Recent Completions

#### Test 3.14: Task Templates
**Steps:**
1. Click "Templates" button
2. **Expected**: 
   - Template modal opens
3. Select a booking from dropdown
4. Select a template
5. Click "Use Template"
6. **Expected**: 
   - Tasks created from template
   - Tasks linked to selected booking

---

### 4. Provider Dashboard Overview

#### Test 4.1: Dashboard Stats
**Steps:**
1. Navigate to Provider Dashboard → Overview tab
2. **Expected**: 
   - Stats cards display:
     - Total Bookings
     - Completed Bookings
     - Pending Bookings
     - Monthly Bookings
3. Verify numbers are accurate

#### Test 4.2: Recent Bookings
**Steps:**
1. In Overview tab
2. **Expected**: 
   - Recent bookings list shows last 5 bookings
   - Each booking shows:
     - Customer name
     - Service type
     - Date
     - Status
     - Action buttons

---

### 5. Bookings Management

#### Test 5.1: View All Bookings
**Steps:**
1. Navigate to Bookings tab
2. **Expected**: 
   - All bookings for provider displayed
   - Filter options available

#### Test 5.2: Filter Bookings
**Steps:**
1. Use status filter (All, Pending, Confirmed, Completed, Cancelled)
2. **Expected**: 
   - Only bookings with selected status shown

#### Test 5.3: Confirm Booking
**Steps:**
1. Find a "Pending" booking
2. Click "Confirm"
3. **Expected**: 
   - Booking status changes to "Confirmed"
   - Task automatically created in Workflow (if applicable)

#### Test 5.4: Cancel Booking
**Steps:**
1. Find a "Pending" booking
2. Click "Cancel"
3. **Expected**: 
   - Booking status changes to "Cancelled"

#### Test 5.5: Mark Booking Complete
**Steps:**
1. Find a "Confirmed" booking
2. Click "Mark Complete"
3. **Expected**: 
   - Booking status changes to "Completed"

#### Test 5.6: Contact Customer
**Steps:**
1. Find a booking
2. Click "Call" button
3. **Expected**: 
   - Phone dialer opens with customer number
4. Click "WhatsApp" button
5. **Expected**: 
   - WhatsApp opens with customer number

---

### 6. Finance Management

#### Test 6.1: View Earnings Overview
**Steps:**
1. Navigate to Finance tab
2. **Expected**: 
   - Earnings summary displayed
   - Total earnings, pending, completed payments shown

#### Test 6.2: View Payments List
**Steps:**
1. In Finance tab
2. **Expected**: 
   - List of payments displayed
   - Filter options available

#### Test 6.3: Create Invoice
**Steps:**
1. Click "Create Invoice"
2. Fill in invoice details
3. Click "Save"
4. **Expected**: 
   - Invoice created and appears in list

#### Test 6.4: Edit Invoice
**Steps:**
1. Find an invoice
2. Click "Edit"
3. Modify details
4. Click "Save"
5. **Expected**: 
   - Invoice updates reflect

#### Test 6.5: Send Invoice
**Steps:**
1. Find an invoice
2. Click "Send"
3. **Expected**: 
   - Invoice sent to customer
   - Status updates

#### Test 6.6: Download Invoice
**Steps:**
1. Find an invoice
2. Click "Download"
3. **Expected**: 
   - Invoice PDF downloads

---

### 7. Customer Management

#### Test 7.1: View Customers
**Steps:**
1. Navigate to Customers tab
2. **Expected**: 
   - List of customers displayed
   - Customer details shown

#### Test 7.2: Customer Details
**Steps:**
1. Click on a customer
2. **Expected**: 
   - Customer details displayed:
     - Contact information
     - Booking history
     - Payment history

---

### 8. Business Tools

#### Test 8.1: Invoicing Tab
**Steps:**
1. Navigate to Business Tools tab
2. Click "Invoicing"
3. **Expected**: 
   - Invoice list displayed
   - Create Invoice button available

#### Test 8.2: Tax Calculator
**Steps:**
1. Click "Tax Calculator" tab
2. Enter:
   - Tax ID (TIN)
   - Monthly Earnings
3. **Expected**: 
   - VAT calculated automatically
   - Estimated tax displayed

#### Test 8.3: Time Tracking
**Steps:**
1. Click "Time Tracking" tab
2. **Expected**: 
   - Time entries displayed (if any)
   - Add Entry button available

#### Test 8.4: Insights
**Steps:**
1. Click "Insights" tab
2. **Expected**: 
   - Business insights displayed:
     - Monthly earnings
     - Total hours
     - Average booking value
     - Most popular service

---

### 9. Premium Listing

#### Test 9.1: View Premium Tiers
**Steps:**
1. Navigate to Premium tab
2. **Expected**: 
   - Available tiers displayed:
     - FREE
     - BASIC
     - PREMIUM
     - ENTERPRISE
3. Features for each tier shown

#### Test 9.2: Upgrade Tier
**Steps:**
1. Click "Upgrade" on a tier
2. **Expected**: 
   - Upgrade flow initiated
   - Payment modal opens (if applicable)

---

### 10. Profile & Settings

#### Test 10.1: Edit Profile
**Steps:**
1. Navigate to Profile tab
2. Click "Edit Profile"
3. Modify:
   - Name
   - Bio
   - Contact information
4. Click "Save"
5. **Expected**: 
   - Profile updates saved
   - Changes reflect immediately

#### Test 10.2: Settings
**Steps:**
1. Navigate to Settings tab
2. Toggle:
   - Email notifications
   - SMS notifications
   - Auto-confirm bookings
3. **Expected**: 
   - Settings saved to localStorage
   - Preferences persist

#### Test 10.3: Availability Toggle
**Steps:**
1. In Settings or Overview
2. Toggle availability switch
3. **Expected**: 
   - Availability status updates
   - Status reflects in provider listing

---

## Test Checklist

Use this checklist to track your testing progress:

### Registration & Verification
- [ ] Complete provider registration
- [ ] Submit verification documents
- [ ] Form validation works

### Services
- [ ] Create pay-as-you-go service
- [ ] Create subscription service
- [ ] Edit service
- [ ] Toggle service status
- [ ] Delete service
- [ ] Service validation

### Workflow
- [ ] Create task manually
- [ ] Auto-create from bookings
- [ ] Drag & drop task status
- [ ] Edit task
- [ ] Mark task complete
- [ ] Time tracking
- [ ] Duplicate task
- [ ] Delete task
- [ ] Bulk operations
- [ ] Filter tasks
- [ ] Sort tasks
- [ ] Calendar view
- [ ] Analytics view
- [ ] Task templates

### Dashboard Features
- [ ] Overview stats
- [ ] Recent bookings
- [ ] Bookings management
- [ ] Finance management
- [ ] Customer management
- [ ] Business tools
- [ ] Premium listing
- [ ] Profile editing
- [ ] Settings

---

## Common Issues & Solutions

### Issue: Services not loading
**Solution**: Check backend is running and API endpoint is correct

### Issue: Tasks not auto-creating from bookings
**Solution**: Ensure bookings have status "Confirmed" and providerId matches

### Issue: Time tracking not working
**Solution**: Check browser console for errors, ensure state updates correctly

### Issue: Drag & drop not working
**Solution**: Ensure tasks are draggable and drop zones are properly configured

---

## Notes

- All features use mock data currently
- Backend integration points are marked with TODO comments
- Some features may require authentication
- Test with different user roles (PROVIDER, CUSTOMER, ADMIN)

---

## Automated Testing (Future)

Consider implementing:
- Unit tests for components
- Integration tests for API endpoints
- E2E tests with Playwright/Cypress
- API tests with Jest/Supertest

