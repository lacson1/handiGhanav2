# Data Mapping & Lawful Basis Documentation
## HandyGhana Platform - Ghana Data Protection Act 843 Compliance

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Data Controller:** HandyGhana Services Ltd  
**Data Protection Officer Contact:** privacy@handyghana.com

---

## Executive Summary

This document provides a comprehensive mapping of all personal data flows in the HandyGhana platform, documenting:
- What data is collected
- How data is collected
- Why data is collected (purpose)
- How data is stored
- Who accesses the data
- Where data is stored (geographic location)
- Data retention periods
- External data transfers
- Lawful basis for each processing activity
- Special category data assessment

This documentation is required for compliance with **Ghana Data Protection Act, 2012 (Act 843)**, Section 21 (Purpose Limitation and Minimality).

---

## 1. Data Collection Inventory

### 1.1 User Registration & Authentication Data

#### 1.1.1 Standard Registration (Email/Password)

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Email Address** | User input (registration form) | Account creation, authentication, service communications, password reset | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days (grace period) | **Contract** - Necessary for service delivery |
| **Name** | User input (registration form) | Account identification, personalization, service provider matching | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Necessary for service delivery |
| **Phone Number** | User input (registration form - optional) | Service coordination, booking confirmations, SMS notifications | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Consent** - Optional field, user provides consent by entering |
| **Password (Hashed)** | User input (registration form) | Account security, authentication | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Necessary for account security |
| **Consent Privacy** | Checkbox (registration form) | Legal compliance, record of consent | PostgreSQL (USA - Fly.io) | 7 years (legal record) | **Legal Obligation** - Required by Act 843 |
| **Consent Terms** | Checkbox (registration form) | Legal compliance, record of consent | PostgreSQL (USA - Fly.io) | 7 years (legal record) | **Legal Obligation** - Required by Act 843 |
| **Consent Marketing** | Checkbox (registration form - optional) | Marketing communications | PostgreSQL (USA - Fly.io) | Until consent withdrawn + 30 days | **Consent** - Explicit opt-in required |
| **Consent Timestamps** | System-generated | Audit trail for consent | PostgreSQL (USA - Fly.io) | 7 years (legal record) | **Legal Obligation** - Required by Act 843 |

**Minimality Assessment:** ✅ All fields are necessary for core service delivery. Phone is optional. Marketing consent is separate and optional.

**Who Accesses:**
- Backend API (authentication)
- User (own account)
- Platform administrators (for support)
- Database administrators (technical maintenance)

---

#### 1.1.2 Google OAuth Registration

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Google ID** | OAuth callback (Google API) | Account linking, authentication | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Necessary for OAuth authentication |
| **Email Address** | OAuth callback (Google API) | Account creation, service communications | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Necessary for service delivery |
| **Name** | OAuth callback (Google API) | Account identification, personalization | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Necessary for service delivery |
| **Avatar URL** | OAuth callback (Google API) | User profile display | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Consent** - User consents to Google OAuth which provides this |
| **Auth Provider** | System-generated | Authentication method tracking | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Legitimate Interest** - Security and fraud prevention |

**External Transfer:** Data flows from Google (USA) → Our Backend (USA) → Database (USA)

**Minimality Assessment:** ✅ Only essential OAuth profile data is collected. No additional Google data is requested.

**Who Accesses:**
- Google OAuth service (initial authentication)
- Backend API (authentication)
- User (own account)
- Platform administrators (for support)

---

### 1.2 Provider Profile Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Provider Name** | User input (provider registration) | Service provider identification, search matching | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years (tax records) | **Contract** - Necessary for service marketplace |
| **Service Category** | User selection (provider registration) | Service matching, search functionality | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Core marketplace functionality |
| **Location** | User input (provider registration) | Geographic matching, service area determination | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Essential for location-based services |
| **Description** | User input (provider registration) | Service information, customer decision-making | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Marketplace transparency |
| **Phone Number** | User input (provider registration - optional) | Direct contact for service coordination | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Consent** - Optional, user provides by entering |
| **WhatsApp Number** | User input (provider registration - optional) | Communication channel | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Consent** - Optional, user provides by entering |
| **Service Areas** | User input (array) | Geographic service coverage | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Service delivery requirement |
| **Skills** | User input (array) | Service matching, search optimization | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Marketplace functionality |
| **Provider Image** | User upload | Visual identification, portfolio | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **Provider Avatar** | User upload | Profile display | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **Work Photos** | User upload (array) | Portfolio showcase, verification | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **Work Videos** | User upload (array) | Portfolio showcase, verification | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **References** | User input (array of contact info) | Provider verification, background checks | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legitimate Interest** - Platform trust and safety |
| **Tax ID** | User input (optional) | Tax compliance, business verification | PostgreSQL (USA - Fly.io) | 7 years (tax legal requirement) | **Legal Obligation** - Tax record keeping |
| **Bank Account** | User input (payout setup) | Provider payment processing | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years (tax records) | **Contract** - Payment processing requirement |
| **Mobile Money Number** | User input (payout setup) | Provider payment processing | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years (tax records) | **Contract** - Payment processing requirement |
| **Mobile Money Provider** | User selection (payout setup) | Payment routing | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Payment processing requirement |

**Minimality Assessment:** ✅ All fields serve marketplace functionality. Optional fields (phone, WhatsApp, tax ID) are clearly marked.

**Who Accesses:**
- Provider (own profile)
- Customers (public profile information)
- Platform administrators (verification, support)
- Payment processors (bank/mobile money for payouts)

---

### 1.3 Provider Verification Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **ID Document** | User upload (verification process) | Identity verification, fraud prevention, legal compliance | Cloudinary (Global CDN) | **30 days after verification completion** (then deleted) | **Legal Obligation** - Know Your Customer (KYC) requirements |
| **Verification Status** | System-generated | Verification workflow tracking | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legitimate Interest** - Platform trust and safety |
| **Verified At Timestamp** | System-generated | Audit trail | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legal Obligation** - Compliance record keeping |

**⚠️ SPECIAL CATEGORY ASSESSMENT:** ID documents may contain biometric data (photos). However, these are processed for **identity verification purposes** under **Legal Obligation** (KYC requirements), which is permitted under Act 843.

**Security Measures:**
- ID documents encrypted at rest in Cloudinary
- Access restricted to verification administrators only
- Automatic deletion after 30 days post-verification
- Secure upload via HTTPS

**Who Accesses:**
- Verification administrators only (limited access)
- Provider (cannot access own ID document after upload)
- Cloudinary (storage only, no access to content)

**Minimality Assessment:** ✅ ID document collection is necessary for platform trust and legal compliance. Deleted promptly after verification.

---

### 1.4 Booking Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Booking ID** | System-generated | Booking identification, tracking | PostgreSQL (USA - Fly.io) | 7 years (tax/legal records) | **Contract** - Service delivery |
| **Provider ID** | System-generated (from selection) | Service provider assignment | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Customer ID** | System-generated (from auth) | Customer identification | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Booking Date** | User input (calendar selection) | Service scheduling | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Booking Time** | User input (time selection) | Service scheduling | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Service Type** | User input (service selection) | Service matching, provider preparation | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Booking Notes** | User input (optional) | Service requirements, special instructions | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service quality |
| **Booking Status** | System-generated/updated | Workflow management | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Amount** | System-calculated | Payment processing | PostgreSQL (USA - Fly.io) | 7 years (tax records) | **Contract** - Payment processing |
| **Payment Status** | System-generated/updated | Payment tracking | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Payment Method** | User selection | Payment processing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Estimated Duration** | Provider input | Service planning | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Actual Start Time** | Provider input/system | Service tracking | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Actual End Time** | Provider input/system | Service tracking | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Service delivery |
| **Customer Satisfaction Rating** | User input (post-service) | Quality improvement, provider rating | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legitimate Interest** - Platform quality |

**Minimality Assessment:** ✅ All fields necessary for booking fulfillment and payment processing.

**Who Accesses:**
- Customer (own bookings)
- Provider (assigned bookings)
- Platform administrators (support, dispute resolution)
- Payment processors (payment-related data only)

**Retention Justification:** 7 years retention for tax and legal compliance (Ghana Revenue Authority requirements).

---

### 1.5 Payment Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Transaction ID** | Payment processor (Paystack/MTN/Vodafone) | Payment tracking, reconciliation | PostgreSQL (USA - Fly.io) | 7 years (tax/legal) | **Contract** - Payment processing |
| **Payment Amount** | System-calculated | Payment processing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Payment Status** | Payment processor callback | Payment confirmation | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Payment Method** | User selection | Payment routing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Mobile Money Number** | User input (for mobile money payments) | Payment processing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Mobile Money Provider** | User selection | Payment routing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Bank Account** | User input (for bank transfer) | Payment processing | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |
| **Paid At Timestamp** | System-generated | Payment confirmation | PostgreSQL (USA - Fly.io) | 7 years | **Contract** - Payment processing |

**External Transfer:** Payment data is sent to:
- **Paystack** (Nigeria/Ghana) - Card payments
- **MTN Mobile Money API** (Ghana) - Mobile money payments
- **Vodafone Cash API** (Ghana) - Mobile money payments

**⚠️ SENSITIVE DATA:** Financial information (bank accounts, mobile money numbers) is sensitive personal data.

**Security Measures:**
- Encrypted in transit (HTTPS)
- Encrypted at rest (database encryption)
- PCI DSS compliance (via Paystack)
- Access restricted to payment administrators

**Who Accesses:**
- Payment processors (Paystack, MTN, Vodafone)
- Platform administrators (payment reconciliation)
- Customer (own payment records)
- Provider (payment receipts for their services)

**Minimality Assessment:** ✅ All payment data necessary for transaction processing and legal compliance.

---

### 1.6 Review & Rating Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Rating** | User input (1-5 stars) | Provider quality assessment, platform trust | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years (public reviews) | **Contract** - Service quality feedback |
| **Review Comment** | User input (text) | Detailed feedback, provider improvement | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Service quality feedback |
| **Review Photos** | User upload (optional) | Visual evidence of service quality | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **Provider Response** | Provider input (optional) | Provider engagement, dispute resolution | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Service quality |
| **Is Verified** | System-generated | Review authenticity (linked to booking) | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legitimate Interest** - Platform trust |
| **Booking ID Link** | System-generated | Review verification | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Legitimate Interest** - Review authenticity |

**Minimality Assessment:** ✅ Review data essential for marketplace trust and quality.

**Who Accesses:**
- Public (ratings and reviews are public)
- Customer (own reviews)
- Provider (reviews about their services)
- Platform administrators (moderation, support)

**Note:** Reviews may remain public even after account deletion for historical accuracy (7-year retention for legal/tax purposes).

---

### 1.7 Chat & Messaging Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Chat ID** | System-generated | Conversation identification | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **Customer ID** | System-generated (from auth) | Participant identification | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **Provider ID** | System-generated (from selection) | Participant identification | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **Booking ID** | System-generated (optional link) | Context linking | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **Message Content** | User input (text) | Service coordination, communication | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **Message Type** | System-generated | Content classification | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Service communication |
| **File URL** | User upload (optional) | File sharing | Cloudinary (Global CDN) | Until account deletion + 30 days | **Consent** - User uploads voluntarily |
| **Is Read** | System-generated | Read receipt tracking | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Communication functionality |
| **Read At Timestamp** | System-generated | Read receipt | PostgreSQL (USA - Fly.io) | Until account deletion + 30 days | **Contract** - Communication functionality |

**Minimality Assessment:** ✅ All chat data necessary for service coordination.

**Who Accesses:**
- Customer (own chats)
- Provider (own chats)
- Platform administrators (support, moderation, legal compliance)

**Security Measures:**
- End-to-end encryption in transit (WebSocket over WSS)
- Messages stored encrypted at rest
- Access logs maintained

---

### 1.8 Analytics & Usage Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Event Type** | System-generated | Platform analytics, improvement | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **Event Data (JSON)** | System-generated | User behavior analysis | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **User ID** | System-generated (optional) | User behavior tracking | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **Provider ID** | System-generated (optional) | Provider analytics | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **Search Queries** | User input (search functionality) | Search optimization, trending analysis | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **Search Category** | User selection | Search analytics | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |
| **Search Location** | User input | Location-based analytics | PostgreSQL (USA - Fly.io) | 90 days | **Legitimate Interest** - Platform improvement |

**Minimality Assessment:** ✅ Analytics data is anonymized where possible. User ID is optional. Short retention (90 days).

**Who Accesses:**
- Platform administrators (analytics team)
- Data analysts (aggregated, anonymized data)

**Note:** Analytics data is aggregated and anonymized for reporting. Individual user tracking is limited to 90 days.

---

### 1.9 Referral Program Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Referral Code** | System-generated | Referral tracking | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Referral program participation |
| **Referred By** | User input (referral code entry) | Referral attribution | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Consent** - User enters referral code voluntarily |
| **Referral Rewards** | System-calculated | Reward tracking | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Referral program |
| **Total Referrals** | System-calculated | Referral statistics | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Referral program |
| **Referral Status** | System-generated | Reward processing | PostgreSQL (USA - Fly.io) | Until account deletion + 7 years | **Contract** - Referral program |

**Minimality Assessment:** ✅ Referral data necessary for program functionality.

**Who Accesses:**
- User (own referral data)
- Platform administrators (reward processing)

---

### 1.10 User Settings & Preferences

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Email Notifications** | User selection | Communication preferences | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |
| **SMS Notifications** | User selection | Communication preferences | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |
| **Push Notifications** | User selection | Communication preferences | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |
| **Booking Reminders** | User selection | Service functionality | PostgreSQL (USA - Fly.io) | Until account deletion | **Contract** - Service delivery |
| **Promotions** | User selection | Marketing communications | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - Marketing opt-in |
| **Profile Visibility** | User selection | Privacy control | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |
| **Show Email** | User selection | Privacy control | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |
| **Show Phone** | User selection | Privacy control | PostgreSQL (USA - Fly.io) | Until account deletion | **Consent** - User preference |

**Minimality Assessment:** ✅ All settings are user-controlled preferences.

**Who Accesses:**
- User (own settings)
- Platform systems (to apply preferences)

---

### 1.11 Password Reset Data

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Reset Token** | System-generated | Password reset functionality | PostgreSQL (USA - Fly.io) | **24 hours** (then auto-deleted) | **Contract** - Account security |
| **Reset Token Expiry** | System-generated | Token expiration | PostgreSQL (USA - Fly.io) | **24 hours** | **Contract** - Account security |

**Minimality Assessment:** ✅ Temporary tokens, minimal retention, auto-deleted.

**Who Accesses:**
- User (via email link)
- Backend API (token validation)

---

### 1.12 Client-Side Storage (localStorage)

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **JWT Token** | System-generated (after login) | Authentication, session management | Browser localStorage (user's device) | Until logout or 7 days (token expiry) | **Contract** - Necessary for authenticated sessions |
| **User Object** | System-generated (after login) | User context, UI personalization | Browser localStorage (user's device) | Until logout | **Contract** - Necessary for user experience |
| **Cookie Consent** | User selection (cookie banner) | Consent tracking | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **Cookie Consent Date** | System-generated | Consent audit trail | Browser localStorage (user's device) | Until user clears browser data | **Legal Obligation** - Consent record |
| **Theme Preference** | User selection | UI personalization | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **Recent Searches** | User input (search functionality) | User convenience, search history | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User convenience feature |
| **Notification Preferences** | User selection (settings) | User preferences | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **First Booking Flag** | System-generated | Discount tracking | Browser localStorage (user's device) | Until user clears browser data | **Contract** - Service feature |

**⚠️ SECURITY NOTE:** JWT tokens stored in localStorage are vulnerable to XSS attacks. Consider migrating to httpOnly cookies for enhanced security.

**Minimality Assessment:** ✅ All localStorage data is necessary for user experience or service functionality. User can clear at any time.

**Who Accesses:**
- User (own browser storage)
- Frontend JavaScript (application functionality)
- Potential XSS attackers (security risk - see security note above)

**Data Control:** Users have full control over localStorage and can clear it at any time via browser settings.

---

### 1.13 Error Tracking Data (Sentry)

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **Error Messages** | System-generated (error tracking) | Platform debugging, improvement | Sentry (Global) | 90 days | **Legitimate Interest** - Platform stability |
| **Stack Traces** | System-generated | Error debugging | Sentry (Global) | 90 days | **Legitimate Interest** - Platform stability |
| **User Context** | System-generated (optional) | Error reproduction | Sentry (Global) | 90 days | **Legitimate Interest** - Platform stability |
| **Browser/Device Info** | System-generated | Error context | Sentry (Global) | 90 days | **Legitimate Interest** - Platform stability |

**External Transfer:** Error data sent to Sentry (Global CDN).

**Minimality Assessment:** ✅ Error tracking necessary for platform stability. User context is optional and anonymized where possible.

**Who Accesses:**
- Development team (error debugging)
- Sentry (storage and processing)

---

### 1.13 Client-Side Storage (localStorage)

| Data Field | Collection Method | Purpose | Storage Location | Retention | Lawful Basis |
|------------|------------------|---------|------------------|-----------|--------------|
| **JWT Token** | System-generated (after login) | Authentication, session management | Browser localStorage (user's device) | Until logout or 7 days (token expiry) | **Contract** - Necessary for authenticated sessions |
| **User Object** | System-generated (after login) | User context, UI personalization | Browser localStorage (user's device) | Until logout | **Contract** - Necessary for user experience |
| **Cookie Consent** | User selection (cookie banner) | Consent tracking | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **Cookie Consent Date** | System-generated | Consent audit trail | Browser localStorage (user's device) | Until user clears browser data | **Legal Obligation** - Consent record |
| **Theme Preference** | User selection | UI personalization | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **Recent Searches** | User input (search functionality) | User convenience, search history | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User convenience feature |
| **Notification Preferences** | User selection (settings) | User preferences | Browser localStorage (user's device) | Until user clears browser data | **Consent** - User preference |
| **First Booking Flag** | System-generated | Discount tracking | Browser localStorage (user's device) | Until user clears browser data | **Contract** - Service feature |

**⚠️ SECURITY NOTE:** JWT tokens stored in localStorage are vulnerable to XSS attacks. Consider migrating to httpOnly cookies for enhanced security.

**Minimality Assessment:** ✅ All localStorage data is necessary for user experience or service functionality. User can clear at any time.

**Who Accesses:**
- User (own browser storage)
- Frontend JavaScript (application functionality)
- Potential XSS attackers (security risk - see security note above)

**Data Control:** Users have full control over localStorage and can clear it at any time via browser settings.

---

## 2. Data Flow Diagrams

### 2.1 User Registration Flow

```
User (Ghana)
  ↓ [HTTPS]
Frontend (Vercel - Global CDN)
  ↓ [HTTPS API]
Backend (Fly.io - USA)
  ↓ [Encrypted Connection]
Database (PostgreSQL - USA)
  ↓ [OAuth]
Google (USA) [if OAuth]
  ↓ [Callback]
Backend (Fly.io - USA)
  ↓
Database (PostgreSQL - USA)
```

**Data Transferred:**
- Registration: Email, Name, Phone (optional), Password (hashed), Consents
- OAuth: Google ID, Email, Name, Avatar URL

---

### 2.2 Booking & Payment Flow

```
Customer (Ghana)
  ↓ [HTTPS]
Frontend (Vercel)
  ↓ [HTTPS API]
Backend (Fly.io - USA)
  ↓
Database (PostgreSQL - USA) [Booking Created]
  ↓ [Payment Request]
Payment Processor:
  - Paystack (Nigeria/Ghana) [Card Payments]
  - MTN Mobile Money API (Ghana) [Mobile Money]
  - Vodafone Cash API (Ghana) [Mobile Money]
  ↓ [Payment Confirmation]
Backend (Fly.io - USA)
  ↓
Database (PostgreSQL - USA) [Payment Status Updated]
```

**Data Transferred:**
- Booking: Customer ID, Provider ID, Date, Time, Service Type, Amount
- Payment: Amount, Payment Method, Mobile Money Number (if applicable), Transaction ID

---

### 2.3 Image Upload Flow

```
User (Ghana)
  ↓ [HTTPS - Multipart Form]
Frontend (Vercel)
  ↓ [HTTPS API]
Backend (Fly.io - USA)
  ↓ [HTTPS API]
Cloudinary (Global CDN)
  ↓ [URL Return]
Backend (Fly.io - USA)
  ↓
Database (PostgreSQL - USA) [URL Stored]
```

**Data Transferred:**
- Image files (provider photos, avatars, work photos, ID documents)
- File metadata (size, type, dimensions)

---

## 3. Data Storage Locations

### 3.1 Primary Storage

| Storage Type | Provider | Location | Data Stored | Encryption |
|--------------|----------|----------|-------------|------------|
| **Primary Database** | PostgreSQL (Fly.io/Supabase/Neon) | USA (Washington D.C. region) | All structured data (users, bookings, payments, reviews, etc.) | ✅ Encrypted at rest |
| **Image Storage** | Cloudinary | Global CDN (multiple regions) | Images, photos, documents | ✅ Encrypted at rest |
| **Error Tracking** | Sentry | Global CDN | Error logs, stack traces | ✅ Encrypted at rest |
| **Frontend Hosting** | Vercel | Global CDN | Static assets, no personal data | N/A |
| **Backend Hosting** | Fly.io | USA (Washington D.C.) | API processing, temporary data | ✅ Encrypted in transit |

### 3.2 Data Transfer Locations

| Transfer Path | Data Type | Legal Basis for Transfer |
|---------------|-----------|--------------------------|
| **Ghana → USA (Backend/Database)** | All personal data | **Contract** - Service delivery requires USA hosting. Standard Contractual Clauses (SCCs) in place with Fly.io. |
| **Ghana → Global (Cloudinary)** | Images, photos | **Contract** - Image storage service. Data Processing Agreement (DPA) in place with Cloudinary. |
| **Ghana → Nigeria/Ghana (Paystack)** | Payment data | **Contract** - Payment processing. Paystack operates in Ghana. |
| **Ghana → Global (Sentry)** | Error logs | **Legitimate Interest** - Platform stability. DPA in place with Sentry. |
| **Ghana → USA (Google OAuth)** | OAuth profile data | **Consent** - User consents to Google OAuth. Google's Privacy Policy applies. |

---

## 4. Data Retention Policies

### 4.1 Retention Periods by Data Type

| Data Category | Retention Period | Justification |
|--------------|------------------|---------------|
| **User Account Data** | Until account deletion + 30 days (grace period) | Account recovery, dispute resolution |
| **Booking Records** | 7 years | Tax records, legal compliance (Ghana Revenue Authority) |
| **Payment Records** | 7 years | Tax records, legal compliance |
| **Provider Verification (ID Documents)** | 30 days after verification completion | KYC compliance, then deleted |
| **Provider Profile Data** | Until account deletion + 7 years (business records) | Tax and legal compliance |
| **Reviews** | Until account deletion + 7 years (public reviews may remain) | Historical accuracy, legal records |
| **Chat Messages** | Until account deletion + 30 days | Service coordination, then minimal retention |
| **Analytics Data** | 90 days | Platform improvement, then anonymized |
| **Error Logs** | 90 days | Platform stability, then deleted |
| **Consent Records** | 7 years | Legal compliance (Act 843) |
| **Password Reset Tokens** | 24 hours | Security, auto-deleted |

### 4.2 Deletion Procedures

1. **User-Initiated Deletion:**
   - User requests account deletion via Settings
   - 30-day grace period for account recovery
   - After 30 days: Permanent deletion of personal data
   - Booking/payment records anonymized (retained for tax records)

2. **Automatic Deletion:**
   - Password reset tokens: 24 hours
   - ID documents: 30 days after verification
   - Analytics: 90 days

3. **Legal Retention:**
   - Tax records: 7 years (required by Ghana Revenue Authority)
   - Consent records: 7 years (Act 843 compliance)

---

## 5. Lawful Basis for Processing

### 5.1 Lawful Bases Used

Under Ghana Data Protection Act 843, personal data processing must have a lawful basis. We use the following:

1. **Contract** - Processing necessary for service delivery
2. **Consent** - User has given explicit consent
3. **Legal Obligation** - Processing required by law
4. **Legitimate Interest** - Processing necessary for platform operation (with user rights respected)

### 5.2 Lawful Basis by Processing Activity

| Processing Activity | Lawful Basis | Justification |
|---------------------|--------------|---------------|
| **User Registration** | Contract | Necessary for account creation and service access |
| **Authentication** | Contract | Necessary for account security |
| **Booking Processing** | Contract | Core service delivery |
| **Payment Processing** | Contract | Payment is part of service contract |
| **Provider Verification** | Legal Obligation | KYC requirements, fraud prevention |
| **Marketing Communications** | Consent | Explicit opt-in required |
| **Analytics** | Legitimate Interest | Platform improvement, user experience |
| **Error Tracking** | Legitimate Interest | Platform stability, security |
| **Review Publication** | Contract | Service quality feedback (part of service) |
| **Chat/Messaging** | Contract | Service coordination |
| **Data Retention (Tax Records)** | Legal Obligation | Ghana Revenue Authority requirements |
| **Consent Recording** | Legal Obligation | Act 843 compliance |

---

## 6. Special Category Data Assessment

### 6.1 Special Categories Under Act 843

Ghana Data Protection Act 843 does not explicitly define "special categories" like GDPR, but we assess sensitive data:

| Data Type | Category | Lawful Basis | Additional Safeguards |
|-----------|----------|--------------|----------------------|
| **ID Documents** | Biometric data (photos) | Legal Obligation (KYC) | ✅ Encrypted at rest<br>✅ Limited access<br>✅ Auto-deletion after 30 days<br>✅ Secure upload (HTTPS) |
| **Financial Information** | Sensitive personal data | Contract (payment processing) | ✅ Encrypted at rest<br>✅ PCI DSS compliance (via Paystack)<br>✅ Access restricted |
| **Health Data** | ❌ Not Collected | N/A | N/A |
| **Religious/Philosophical Data** | ❌ Not Collected | N/A | N/A |
| **Political Opinions** | ❌ Not Collected | N/A | N/A |
| **Sexual Orientation** | ❌ Not Collected | N/A | N/A |

### 6.2 Special Category Processing Requirements

For ID documents (biometric data):
- ✅ **Explicit consent** obtained during verification process
- ✅ **Legal obligation** basis (KYC requirements)
- ✅ **Minimal collection** (only ID document, no additional biometric data)
- ✅ **Secure storage** (encrypted at rest)
- ✅ **Limited retention** (30 days after verification)
- ✅ **Access controls** (verification administrators only)

---

## 7. Data Access & Sharing

### 7.1 Who Accesses Personal Data

| Accessor | Data Accessed | Purpose | Legal Basis |
|----------|---------------|---------|-------------|
| **User (Data Subject)** | Own data | Account management, service use | Contract |
| **Service Providers** | Booking details (customer contact, service requirements) | Service delivery | Contract |
| **Platform Administrators** | All data (limited, role-based) | Support, verification, dispute resolution | Legitimate Interest, Legal Obligation |
| **Payment Processors** | Payment data (amount, method, transaction ID) | Payment processing | Contract |
| **Database Administrators** | Technical data access | System maintenance | Legitimate Interest (technical necessity) |
| **Cloudinary** | Images, photos | Image storage | Contract (DPA in place) |
| **Sentry** | Error logs | Error tracking | Legitimate Interest (DPA in place) |
| **Google (OAuth)** | OAuth profile data | Authentication | Consent (user consents to Google OAuth) |

### 7.2 Data Sharing Principles

- ✅ **No sale of personal data** - We do not sell personal data to third parties
- ✅ **Limited sharing** - Data shared only for service delivery or legal compliance
- ✅ **Data Processing Agreements** - All third-party processors have DPAs
- ✅ **User consent** - Marketing sharing requires explicit consent
- ✅ **Legal compliance** - Sharing for legal obligations (court orders, tax authorities)

---

## 8. Data Subject Rights (Act 843)

### 8.1 Rights Implementation

| Right | Implementation | Status |
|-------|----------------|--------|
| **Right to Access** | ✅ Data export endpoint (`GET /api/users/:id/export`) | Implemented |
| **Right to Rectification** | ✅ Profile update functionality | Implemented |
| **Right to Erasure** | ✅ Account deletion endpoint (`DELETE /api/users/:id`) | Implemented |
| **Right to Object** | ✅ Marketing opt-out in settings | Implemented |
| **Right to Data Portability** | ✅ JSON export via data export endpoint | Implemented |
| **Right to Withdraw Consent** | ✅ Settings page for consent management | Implemented |

### 8.2 How to Exercise Rights

Users can exercise their rights by:
1. **Account Settings** - Most rights available in Settings page
2. **Email Request** - Contact privacy@handyghana.com
3. **API Endpoints** - Programmatic access via API (for developers)

**Response Time:** Within 30 days (Act 843 requirement)

---

## 9. Data Security Measures

### 9.1 Technical Measures

- ✅ **Encryption in Transit** - All data transmitted via HTTPS/TLS
- ✅ **Encryption at Rest** - Database and file storage encrypted
- ✅ **Password Hashing** - bcrypt with salt (10 rounds)
- ✅ **JWT Tokens** - Secure authentication tokens
- ✅ **Access Controls** - Role-based access control (RBAC)
- ✅ **Input Validation** - All user inputs validated and sanitized
- ✅ **SQL Injection Prevention** - Prisma ORM prevents SQL injection
- ✅ **Rate Limiting** - API rate limiting to prevent abuse

### 9.2 Organizational Measures

- ✅ **Data Processing Agreements** - DPAs with all third-party processors
- ✅ **Access Logging** - All data access logged and monitored
- ✅ **Staff Training** - Data protection training for staff
- ✅ **Incident Response Plan** - Breach notification procedures
- ✅ **Regular Audits** - Security and compliance audits

---

## 10. Compliance Checklist

### 10.1 Act 843 Requirements

- ✅ **Purpose Limitation** - All data collection has documented purpose
- ✅ **Minimality** - Only necessary data collected
- ✅ **Consent Management** - Explicit consent for marketing, optional fields
- ✅ **Data Subject Rights** - All rights implemented
- ✅ **Data Security** - Technical and organizational measures in place
- ✅ **Data Retention** - Clear retention policies
- ✅ **Data Transfer Safeguards** - DPAs and SCCs in place
- ⚠️ **DPC Registration** - Register with Data Protection Commission (Ghana)
- ✅ **Privacy Policy** - Comprehensive privacy policy published
- ✅ **Data Mapping** - This document (data mapping completed)

---

## 11. Contact Information

**Data Controller:** HandyGhana Services Ltd

**Data Protection Officer:**  
Email: privacy@handyghana.com  
Phone: [To be added]

**Data Protection Commission (Ghana):**  
Website: https://www.dataprotection.org.gh  
Email: info@dataprotection.org.gh

---

## 12. Document Maintenance

This document is reviewed and updated:
- **Annually** - Full review
- **When changes occur** - Data collection changes, new features
- **After incidents** - Security breaches, compliance issues
- **Upon request** - Regulatory requests, user inquiries

**Next Review Date:** December 2025

---

## Appendix A: Third-Party Processors

| Processor | Service | Location | Data Processed | DPA Status |
|-----------|---------|----------|----------------|------------|
| **Fly.io** | Backend hosting, database | USA | All personal data | ✅ DPA in place |
| **Vercel** | Frontend hosting | Global CDN | No personal data (static assets) | ✅ Terms accepted |
| **Cloudinary** | Image storage | Global CDN | Images, photos, documents | ✅ DPA in place |
| **Paystack** | Payment processing | Nigeria/Ghana | Payment data | ✅ DPA in place |
| **MTN Mobile Money** | Payment processing | Ghana | Payment data, mobile money numbers | ⚠️ Terms of service |
| **Vodafone Cash** | Payment processing | Ghana | Payment data, mobile money numbers | ⚠️ Terms of service |
| **Sentry** | Error tracking | Global CDN | Error logs | ✅ DPA in place |
| **Google (OAuth)** | Authentication | USA | OAuth profile data | ✅ Google Privacy Policy |

---

## Appendix B: Data Minimization Examples

### ✅ Good Practices (Implemented)

1. **Optional Fields Clearly Marked** - Phone, WhatsApp, marketing consent are optional
2. **Short Retention for Temporary Data** - Password reset tokens (24 hours), ID documents (30 days)
3. **Anonymized Analytics** - User ID optional in analytics, 90-day retention
4. **Minimal OAuth Data** - Only essential Google profile data collected
5. **Auto-Deletion** - Temporary data automatically deleted

### ⚠️ Areas for Improvement

1. **Review Retention** - Consider allowing users to delete their reviews (currently retained for 7 years for legal reasons)
2. **Analytics Anonymization** - Further anonymize analytics data where possible
3. **Chat Message Retention** - Consider shorter retention (currently 30 days after account deletion)

---

**Document End**

