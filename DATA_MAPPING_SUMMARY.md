# Data Mapping Summary - Quick Reference
## HandyGhana Platform

**Full Documentation:** See `DATA_MAPPING_AND_LAWFUL_BASIS.md` for complete details.

---

## Quick Data Inventory

### Personal Data Collected

| Category | Examples | Collection Point | Storage | Retention | Lawful Basis |
|----------|----------|------------------|---------|-----------|--------------|
| **Identity** | Name, Email, Phone | Registration | PostgreSQL (USA) | Until deletion + 30 days | Contract |
| **Authentication** | Password (hashed), Google ID | Registration/Login | PostgreSQL (USA) | Until deletion + 30 days | Contract |
| **Profile** | Location, Description, Skills | Provider registration | PostgreSQL (USA) | Until deletion + 7 years | Contract |
| **Verification** | ID Documents | Provider verification | Cloudinary (Global) | 30 days after verification | Legal Obligation |
| **Financial** | Bank Account, Mobile Money | Payout setup | PostgreSQL (USA) | Until deletion + 7 years | Contract |
| **Booking** | Date, Time, Service Type, Notes | Booking creation | PostgreSQL (USA) | 7 years | Contract |
| **Payment** | Amount, Method, Transaction ID | Payment processing | PostgreSQL (USA) + Paystack | 7 years | Contract |
| **Reviews** | Rating, Comment, Photos | Review submission | PostgreSQL (USA) + Cloudinary | Until deletion + 7 years | Contract |
| **Communication** | Chat messages, File uploads | Chat functionality | PostgreSQL (USA) + Cloudinary | Until deletion + 30 days | Contract |
| **Analytics** | Search queries, Event data | Platform usage | PostgreSQL (USA) | 90 days | Legitimate Interest |
| **Consent** | Privacy, Terms, Marketing | Registration | PostgreSQL (USA) | 7 years | Legal Obligation |
| **Client Storage** | JWT Token, User data, Preferences | Browser localStorage | User's device | Until logout/clear | Contract/Consent |

---

## Data Flow Summary

```
User (Ghana)
  ↓ HTTPS
Frontend (Vercel - Global)
  ↓ HTTPS API
Backend (Fly.io - USA)
  ↓ Encrypted
Database (PostgreSQL - USA)

External Transfers:
- Images → Cloudinary (Global)
- Payments → Paystack (Ghana/Nigeria)
- Errors → Sentry (Global)
- OAuth → Google (USA)
```

---

## Lawful Basis Summary

| Processing Activity | Lawful Basis | Justification |
|---------------------|--------------|---------------|
| Account creation, bookings, payments | **Contract** | Necessary for service delivery |
| Marketing communications | **Consent** | Explicit opt-in required |
| Provider verification (ID docs) | **Legal Obligation** | KYC requirements |
| Analytics, error tracking | **Legitimate Interest** | Platform improvement |
| Tax record retention | **Legal Obligation** | Ghana Revenue Authority |

---

## Special Category Data

| Data Type | Status | Safeguards |
|-----------|--------|------------|
| **ID Documents** | ✅ Collected (biometric photos) | Encrypted, 30-day retention, limited access |
| **Financial Info** | ✅ Collected (bank/mobile money) | Encrypted, PCI DSS compliance |
| **Health Data** | ❌ Not collected | N/A |
| **Other Special Categories** | ❌ Not collected | N/A |

---

## Data Retention Summary

| Data Type | Retention Period |
|-----------|------------------|
| User account data | Until deletion + 30 days |
| Booking/payment records | 7 years (tax compliance) |
| ID documents | 30 days after verification |
| Chat messages | Until deletion + 30 days |
| Analytics | 90 days |
| Consent records | 7 years (legal compliance) |
| Password reset tokens | 24 hours |

---

## Minimality Assessment

✅ **All data collection is necessary for:**
- Service delivery (bookings, payments)
- Legal compliance (KYC, tax records)
- Platform functionality (authentication, communication)
- Platform improvement (analytics - anonymized)

✅ **Optional fields clearly marked:**
- Phone number (optional)
- WhatsApp (optional)
- Marketing consent (optional)
- Tax ID (optional)

---

## Data Subject Rights

| Right | Implementation | Status |
|-------|----------------|--------|
| Access | Data export endpoint | ✅ |
| Rectification | Profile update | ✅ |
| Erasure | Account deletion | ✅ |
| Object | Marketing opt-out | ✅ |
| Portability | JSON export | ✅ |
| Withdraw Consent | Settings page | ✅ |

---

## Third-Party Processors

| Processor | Service | Location | DPA Status |
|-----------|---------|----------|------------|
| Fly.io | Backend/Database | USA | ✅ |
| Cloudinary | Image storage | Global | ✅ |
| Paystack | Payments | Ghana/Nigeria | ✅ |
| Sentry | Error tracking | Global | ✅ |
| Google | OAuth | USA | ✅ (Privacy Policy) |

---

## Compliance Status

- ✅ Purpose limitation documented
- ✅ Minimality assessed
- ✅ Lawful basis documented
- ✅ Data subject rights implemented
- ✅ Data security measures in place
- ✅ Retention policies defined
- ✅ Data transfers documented
- ⚠️ DPC registration pending (register at nca.org.gh)

---

**For detailed information, see:** `DATA_MAPPING_AND_LAWFUL_BASIS.md`

