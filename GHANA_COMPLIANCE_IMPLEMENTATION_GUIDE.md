# Ghana Market Compliance - Implementation Guide

## 🎯 Quick Start: Meeting Ghana Data Protection Requirements

This is a practical, step-by-step guide to make your application compliant with Ghana's Data Protection Act 843 (2012).

---

## ⚡ Phase 1: IMMEDIATE ACTIONS (Week 1)

### Step 1: Register with Data Protection Commission (DPC) - MANDATORY

**This is the most critical step. You cannot legally process personal data without this.**

#### How to Register:

1. **Visit DPC Website**: https://www.dataprotection.org.gh
2. **Contact DPC**: 
   - Email: info@dataprotection.org.gh
   - Phone: Check website for current contact number
3. **Prepare Required Documents**:
   - Company registration documents
   - Business license
   - Privacy policy (you already have this)
   - Data processing description
   - Security measures documentation
4. **Submit Registration Application**
5. **Set Reminder**: Registration must be renewed every 2 years

**Cost**: Varies (check current DPC fees)
**Timeline**: 2-4 weeks for processing

---

### Step 2: Update Privacy Policy

**File**: `frontend/src/pages/Privacy.tsx`

#### Required Updates:

1. **Add DPC Registration Number** (once you receive it):
   ```tsx
   <p>We are registered with the Data Protection Commission (DPC) of Ghana. 
   Registration Number: [YOUR_DPC_NUMBER]</p>
   ```

2. **Add Data Transfer Disclosure**:
   ```tsx
   <h3>Data Transfer</h3>
   <p>Your personal data may be transferred to and processed in the United States 
   where our backend servers are located. We ensure appropriate safeguards are 
   in place for such transfers, including Standard Contractual Clauses (SCCs) 
   and Data Processing Agreements with all service providers.</p>
   ```

3. **Add User Rights Section**:
   ```tsx
   <h3>Your Rights</h3>
   <ul>
     <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
     <li><strong>Right to Rectification:</strong> You can update your data in your profile settings</li>
     <li><strong>Right to Erasure:</strong> You can delete your account at any time</li>
     <li><strong>Right to Object:</strong> You can object to certain processing activities</li>
     <li><strong>Right to Data Portability:</strong> You can export your data in JSON format</li>
   </ul>
   ```

4. **Add Contact Information**:
   ```tsx
   <p>For data protection inquiries, contact us at:</p>
   <p>Email: privacy@handyghana.com</p>
   <p>Data Protection Officer: [DPO_NAME] - [DPO_EMAIL]</p>
   ```

---

### Step 3: Add Consent Checkboxes to Registration

**File**: `frontend/src/pages/SignUp.tsx`

#### Implementation:

Add these fields to your registration form:

```tsx
// Add to formData state
const [formData, setFormData] = useState({
  // ... existing fields
  consentPrivacy: false,
  consentTerms: false,
  consentMarketing: false
})

// Add validation
if (!formData.consentPrivacy) {
  errors.consentPrivacy = 'You must accept the Privacy Policy'
}
if (!formData.consentTerms) {
  errors.consentTerms = 'You must accept the Terms of Service'
}

// Add to JSX form
<div className="space-y-3">
  <label className="flex items-start space-x-2">
    <input
      type="checkbox"
      checked={formData.consentPrivacy}
      onChange={(e) => setFormData({...formData, consentPrivacy: e.target.checked})}
      className="mt-1"
      required
    />
    <span className="text-sm">
      I have read and agree to the{' '}
      <Link to="/privacy" className="text-primary hover:underline">
        Privacy Policy
      </Link>
    </span>
  </label>
  
  <label className="flex items-start space-x-2">
    <input
      type="checkbox"
      checked={formData.consentTerms}
      onChange={(e) => setFormData({...formData, consentTerms: e.target.checked})}
      className="mt-1"
      required
    />
    <span className="text-sm">
      I agree to the{' '}
      <Link to="/terms" className="text-primary hover:underline">
        Terms of Service
      </Link>
    </span>
  </label>
  
  <label className="flex items-start space-x-2">
    <input
      type="checkbox"
      checked={formData.consentMarketing}
      onChange={(e) => setFormData({...formData, consentMarketing: e.target.checked})}
      className="mt-1"
    />
    <span className="text-sm text-gray-600">
      I consent to receive marketing communications (optional)
    </span>
  </label>
</div>
```

**Backend Update**: Store consent in database

**File**: `backend/prisma/schema.prisma`

Add to User model:
```prisma
model User {
  // ... existing fields
  consentPrivacy     Boolean   @default(false)
  consentTerms       Boolean   @default(false)
  consentMarketing   Boolean   @default(false)
  consentPrivacyAt   DateTime?
  consentTermsAt     DateTime?
  consentMarketingAt DateTime?
}
```

Run migration:
```bash
cd backend
npx prisma migrate dev --name add_user_consents
```

---

## 🔧 Phase 2: IMPLEMENT USER RIGHTS (Week 2-3)

### Step 4: Implement Data Export Endpoint

**File**: `backend/src/controllers/userController.ts` (create if doesn't exist)

```typescript
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const exportUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId // From auth middleware
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        provider: true,
        bookings: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        },
        reviews: true,
        subscriptions: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Remove sensitive fields
    const exportData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      provider: user.provider,
      bookings: user.bookings.map(b => ({
        id: b.id,
        date: b.date,
        time: b.time,
        serviceType: b.serviceType,
        status: b.status,
        amount: b.amount,
        provider: b.provider
      })),
      reviews: user.reviews,
      subscriptions: user.subscriptions,
      consentPrivacy: user.consentPrivacy,
      consentTerms: user.consentTerms,
      consentMarketing: user.consentMarketing
    }

    res.json({
      message: 'Data export successful',
      data: exportData,
      exportedAt: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Data export error:', error)
    res.status(500).json({ message: 'Export failed', error: error.message })
  }
}
```

**Add Route**: `backend/src/routes/userRoutes.ts`

```typescript
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { exportUserData } from '../controllers/userController'

const router = Router()

router.get('/export', authenticate, exportUserData)

export default router
```

**Frontend**: Add export button in Settings page

**File**: `frontend/src/pages/Settings.tsx`

```tsx
const handleExportData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    
    // Download as JSON file
    const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-data-export-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    alert('Data exported successfully!')
  } catch (error) {
    alert('Failed to export data')
  }
}

// Add button in UI
<button onClick={handleExportData} className="btn-secondary">
  Export My Data
</button>
```

---

### Step 5: Implement Account Deletion

**Backend**: `backend/src/controllers/userController.ts`

```typescript
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({ message: 'Account deleted successfully' })
  } catch (error: any) {
    console.error('Account deletion error:', error)
    res.status(500).json({ message: 'Deletion failed', error: error.message })
  }
}
```

**Add Route**:
```typescript
router.delete('/account', authenticate, deleteUserAccount)
```

**Frontend**: Add delete account in Settings

```tsx
const handleDeleteAccount = async () => {
  if (!confirm('Are you sure? This action cannot be undone. All your data will be permanently deleted.')) {
    return
  }
  
  if (!confirm('This will delete your account and all associated data. Type DELETE to confirm.')) {
    return
  }

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/users/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    logout()
    navigate('/')
    alert('Your account has been deleted')
  } catch (error) {
    alert('Failed to delete account')
  }
}
```

---

### Step 6: Add Cookie Consent Banner (if using analytics)

**File**: `frontend/src/components/CookieConsent.tsx` (new file)

```tsx
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to improve your experience. By continuing, you agree to our use of cookies.
            <a href="/privacy" className="underline ml-1">Learn more</a>
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm border border-white rounded hover:bg-gray-800"
          >
            Reject
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-primary rounded hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Add to App.tsx**:
```tsx
import CookieConsent from './components/CookieConsent'

// In your App component
<CookieConsent />
```

---

## 📋 Phase 3: LEGAL & DOCUMENTATION (Week 3-4)

### Step 7: Sign Data Processing Agreements (DPAs)

#### Required DPAs:

1. **Fly.io** (Backend hosting)
   - Contact: support@fly.io
   - Request: Data Processing Agreement
   - Usually available in their legal section

2. **Vercel** (Frontend hosting)
   - Contact: legal@vercel.com
   - Request: Data Processing Agreement
   - Check: https://vercel.com/legal/dpa

3. **Cloudinary** (Image storage)
   - Contact: support@cloudinary.com
   - Request: Data Processing Agreement
   - Check their legal section

4. **Sentry** (Error tracking)
   - Contact: privacy@sentry.io
   - Request: Data Processing Agreement
   - Usually available in account settings

5. **Paystack** (Payment processing)
   - Contact: support@paystack.com
   - Request: Data Processing Agreement
   - Verify existing agreement

**Action**: Email each provider requesting their DPA. Most have standard agreements available.

---

### Step 8: Create Records of Processing Activities (ROPA)

**Create File**: `docs/ROPA.md`

Document:
- What data you collect
- Why you collect it
- Who you share it with
- How long you keep it
- Security measures

Template:
```markdown
# Records of Processing Activities

## Data Controller
- Name: [Your Company Name]
- Address: [Your Address]
- DPC Registration: [Your Registration Number]

## Processing Activities

### 1. User Registration
- **Data**: Email, name, phone, password
- **Purpose**: Account creation and authentication
- **Legal Basis**: Contract
- **Retention**: Until account deletion
- **Third Parties**: None (stored in our database)

### 2. Service Bookings
- **Data**: Booking details, payment information
- **Purpose**: Service delivery
- **Legal Basis**: Contract
- **Retention**: 7 years (tax records)
- **Third Parties**: Paystack (payment processing)

[... continue for all processing activities]
```

---

### Step 9: Consider Appointing a Data Protection Officer (DPO)

**Not mandatory, but recommended**

#### Options:

1. **Internal DPO**: Appoint someone from your team
   - Must be knowledgeable about Act 843
   - Should have data protection training
   - Cost: Salary allocation

2. **External DPO**: Hire a consultant
   - Cost: $500 - $3,000/month
   - More expertise
   - Less commitment

3. **Hybrid**: Internal person with external consultant support
   - Cost: $200 - $1,000/month
   - Best of both worlds

**Action**: Decide on approach and appoint DPO. Make contact information publicly available.

---

## 🔒 Phase 4: SECURITY ENHANCEMENTS (Week 4-5)

### Step 10: Implement Rate Limiting

**File**: `backend/src/middleware/rateLimit.ts` (new file)

```typescript
import rateLimit from 'express-rate-limit'

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please slow down',
})
```

**Apply to routes**: `backend/src/routes/authRoutes.ts`

```typescript
import { authRateLimit } from '../middleware/rateLimit'

router.post('/login', authRateLimit, login)
router.post('/register', authRateLimit, register)
```

---

### Step 11: Add Account Lockout

**File**: `backend/src/middleware/auth.ts`

```typescript
// Track failed login attempts
const failedAttempts = new Map<string, { count: number; lockedUntil?: Date }>()

export const checkAccountLockout = (email: string): boolean => {
  const attempts = failedAttempts.get(email)
  
  if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
    return true // Account is locked
  }
  
  if (attempts?.lockedUntil && attempts.lockedUntil <= new Date()) {
    failedAttempts.delete(email) // Lock expired
    return false
  }
  
  return false
}

export const recordFailedAttempt = (email: string) => {
  const attempts = failedAttempts.get(email) || { count: 0 }
  attempts.count++
  
  if (attempts.count >= 5) {
    attempts.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // Lock for 30 minutes
  }
  
  failedAttempts.set(email, attempts)
}

export const clearFailedAttempts = (email: string) => {
  failedAttempts.delete(email)
}
```

---

### Step 12: Implement Breach Detection & Response

**File**: `backend/src/utils/breachDetection.ts` (new file)

```typescript
// Monitor for suspicious activities
export const detectBreach = async (event: {
  type: string
  userId?: string
  ip?: string
  details: any
}) => {
  // Log security events
  console.log('Security Event:', event)
  
  // Check for breach indicators
  if (event.type === 'unauthorized_access' || 
      event.type === 'data_exfiltration' ||
      event.type === 'mass_data_access') {
    
    // Notify DPC (you'll need to implement this)
    await notifyDPC(event)
    
    // Notify affected users
    if (event.userId) {
      await notifyUser(event.userId, event)
    }
  }
}

const notifyDPC = async (event: any) => {
  // Send notification to DPC
  // Email: info@dataprotection.org.gh
  // Include: Nature of breach, data affected, mitigation steps
}

const notifyUser = async (userId: string, event: any) => {
  // Send email to user about breach
  // Include: What happened, what data was affected, what they should do
}
```

---

## ✅ Phase 5: TESTING & VERIFICATION (Week 5-6)

### Step 13: Test All User Rights

1. **Test Data Export**:
   - Login as user
   - Go to Settings
   - Click "Export My Data"
   - Verify JSON file downloads correctly
   - Verify all user data is included

2. **Test Account Deletion**:
   - Create test account
   - Delete account
   - Verify all data is removed
   - Verify user cannot login after deletion

3. **Test Consent**:
   - Try to register without checking consent boxes
   - Verify form won't submit
   - Register with consent
   - Verify consent is stored in database

---

### Step 14: Create Compliance Documentation

**Create**: `docs/compliance/` folder

Files to create:
1. `data-inventory.md` - List of all data collected
2. `security-measures.md` - Security controls in place
3. `breach-response-plan.md` - What to do if breach occurs
4. `dpa-list.md` - List of all DPAs signed
5. `dpc-registration.md` - DPC registration details

---

## 📅 Implementation Timeline

### Week 1: Legal Foundation
- [ ] Register with DPC
- [ ] Update Privacy Policy
- [ ] Add consent checkboxes

### Week 2: User Rights
- [ ] Implement data export
- [ ] Implement account deletion
- [ ] Add cookie consent

### Week 3: Documentation
- [ ] Sign all DPAs
- [ ] Create ROPA
- [ ] Appoint DPO (if doing so)

### Week 4: Security
- [ ] Add rate limiting
- [ ] Add account lockout
- [ ] Implement breach detection

### Week 5: Testing
- [ ] Test all features
- [ ] Create compliance docs
- [ ] Final review

---

## 💰 Estimated Costs

- **DPC Registration**: $50 - $500 (one-time, renews every 2 years)
- **Legal Consultation**: $2,000 - $5,000 (one-time)
- **DPO (if external)**: $500 - $3,000/month
- **Security Tools**: $50 - $200/month
- **Total First Year**: $3,000 - $15,000

---

## 🎯 Quick Checklist

### Must Do (Mandatory):
- [ ] Register with DPC
- [ ] Add consent checkboxes
- [ ] Update Privacy Policy
- [ ] Implement data export
- [ ] Implement account deletion
- [ ] Sign DPAs with service providers

### Should Do (Recommended):
- [ ] Appoint DPO
- [ ] Add rate limiting
- [ ] Add account lockout
- [ ] Create ROPA
- [ ] Conduct DPIA

### Nice to Have:
- [ ] Cookie consent banner
- [ ] Security audit
- [ ] Staff training

---

## 📞 Support & Resources

- **DPC Website**: https://www.dataprotection.org.gh
- **DPC Email**: info@dataprotection.org.gh
- **Legal Help**: Consult with Ghana-based data protection lawyer
- **Technical Help**: This guide covers all code changes needed

---

## 🚀 Next Steps

1. **Start with DPC Registration** - This is the most critical step
2. **Update Privacy Policy** - Add required disclosures
3. **Add Consent Checkboxes** - Quick win, high impact
4. **Implement User Rights** - Data export and deletion
5. **Sign DPAs** - Contact all service providers
6. **Enhance Security** - Rate limiting, account lockout

**Remember**: Compliance is an ongoing process, not a one-time task. Review and update regularly!

---

**Last Updated**: December 2024  
**Status**: Ready for Implementation

