# 🔐 Admin Provider Verification Guide

## Where to Verify Providers

Admin verifies providers in the **Admin Dashboard** → **Providers Tab**.

### Step-by-Step Instructions

1. **Login as Admin:**
   - Go to http://localhost:5173
   - Click "Sign In" in the navbar
   - Use demo login: `admin@test.com` / `admin123`
   - Or click the "Admin" button in the demo login section

2. **Navigate to Admin Dashboard:**
   - After login, click "Admin" button in the navbar
   - Or go directly to: http://localhost:5173/admin

3. **Open Providers Tab:**
   - In the left sidebar, click **"Providers"** (Shield icon)
   - This shows all providers in the system

4. **Find Unverified Providers:**
   - Look for providers with a **"Pending"** badge (yellow)
   - Verified providers show a **"Verified"** badge (green)

5. **Verify a Provider:**
   - For each unverified provider, you'll see two buttons:
     - **"Verify"** button (green, with checkmark icon)
     - **"Reject"** button (red, with X icon)
   - Click **"Verify"** to approve the provider
   - The provider's status will change to "Verified"

## Visual Location

```
Admin Dashboard
├── Sidebar (Left)
│   ├── Overview
│   ├── Providers ← CLICK HERE
│   ├── Users
│   └── Bookings
│
└── Main Content Area
    └── Providers List
        └── Each Provider Card
            ├── Provider Name
            ├── Status Badge (Pending/Verified)
            └── Action Buttons
                ├── [Verify] ← CLICK TO VERIFY
                ├── [Reject]
                └── [View]
```

## Code Location

**File:** `frontend/src/pages/AdminDashboard.tsx`

**Function:** `handleVerifyProvider` (line 87-99)

**UI Location:** Providers tab, around line 289-296

```typescript
{!provider.verified && (
  <>
    <Button
      size="sm"
      onClick={() => handleVerifyProvider(provider.id)}
    >
      <CheckCircle className="h-4 w-4 mr-1" />
      Verify
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleRejectProvider(provider.id)}
    >
      <X className="h-4 w-4 mr-1" />
      Reject
    </Button>
  </>
)}
```

## What Happens When You Verify

1. **API Call:** Calls `providersApi.update(providerId, { verified: true })`
2. **State Update:** Updates the provider's `verified` status to `true`
3. **UI Update:** 
   - Badge changes from "Pending" (yellow) to "Verified" (green)
   - Verify/Reject buttons disappear
4. **Notification:** Shows success alert: "Provider verified successfully!"

## Features

### Search Providers
- Use the search box at the top to find specific providers
- Search by name, category, or location

### Filter by Status
- Currently shows all providers
- You can see which are verified (green badge) and which are pending (yellow badge)

### Provider Information Shown
- Provider name
- Category (Electrician, Plumber, etc.)
- Location
- Rating and review count
- Verification status

## Testing

To test the verification feature:

1. **Login as Admin:**
   ```bash
   Email: admin@test.com
   Password: admin123
   ```

2. **Check Mock Providers:**
   - Most mock providers are already verified
   - To test, you can temporarily modify `mockProviders.ts` to set some `verified: false`

3. **Verify a Provider:**
   - Click "Verify" on any unverified provider
   - See the status change immediately

## Backend API

The verification calls the backend endpoint:
- **PUT** `/api/providers/:id`
- **Body:** `{ verified: true }`

**Backend File:** `backend/src/controllers/providerController.ts`
**Function:** `updateProvider`

## Notes

- Only admins can verify providers (protected route)
- Verification is immediate (no approval workflow)
- Verified providers get a green badge
- Unverified providers show a yellow "Pending" badge
- Once verified, the Verify/Reject buttons disappear

