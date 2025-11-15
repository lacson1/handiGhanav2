# Regulatory Compliance Guide - HandyGhana

## 📋 Overview

This document outlines the key regulations and compliance requirements for the HandyGhana service marketplace platform, considering its deployment architecture and data handling practices.

---

## 🌍 Deployment Architecture

### Current Hosting Setup

- **Backend**: Fly.io (Region: `iad` - Washington D.C., USA)
- **Frontend**: Vercel (Global CDN)
- **Database**: PostgreSQL (Location depends on provider - Fly.io, Supabase, or Neon)
- **Payment Processing**: Paystack (Ghana-based)
- **Image Storage**: Cloudinary (Global)
- **Error Tracking**: Sentry (Global)

### Data Flow

```
User (Ghana) 
  → Frontend (Vercel - Global CDN)
  → Backend API (Fly.io - USA)
  → Database (Location varies)
  → Payment Gateway (Paystack - Ghana)
  → Image Storage (Cloudinary - Global)
```

---

## 🔒 Key Regulations to Consider

### 1. **Ghana Data Protection Act, 2012 (Act 843)**

**Applies**: ✅ **YES** - Primary jurisdiction (Ghana-based service)

**Key Requirements**:

#### Data Collection & Consent
- ✅ **Obtain explicit consent** before collecting personal data
- ✅ **Purpose limitation**: Only collect data necessary for service delivery
- ✅ **Transparency**: Clear privacy policy explaining data collection
- ✅ **User rights**: Right to access, rectify, and object to processing
- ✅ **Data quality**: Ensure data is accurate, complete, and up-to-date
- ✅ **Openness**: Be transparent about data processing activities

#### Current Status:
- ✅ Privacy Policy page exists (`/privacy`)
- ⚠️ **Needs**: Explicit consent checkboxes during registration
- ⚠️ **Needs**: Data deletion endpoint (right to erasure)
- ⚠️ **Needs**: Data export endpoint (user data portability)
- ⚠️ **Needs**: Right to object to processing mechanism

#### Sensitive Data Handling
- **ID Documents**: Provider verification requires ID uploads
  - ⚠️ **Action Required**: Encrypt at rest, secure access controls
  - ⚠️ **Action Required**: Retention policy (delete after verification)
- **Financial Data**: Bank accounts, mobile money numbers
  - ⚠️ **Action Required**: Additional encryption layer
  - ⚠️ **Action Required**: PCI DSS compliance considerations

#### Data Protection Principles (Act 843)
Organizations must adhere to these principles:
- ✅ **Accountability**: Responsible for compliance
- ✅ **Lawfulness of processing**: Must have legal basis
- ✅ **Specification of purpose**: Clear purpose for data collection
- ✅ **Data quality**: Accurate and up-to-date data
- ✅ **Openness**: Transparent about data processing
- ✅ **Data security safeguards**: Appropriate security measures
- ✅ **Data subject participation**: Users can access and control their data

#### Data Controller Registration
- ⚠️ **CRITICAL**: **MANDATORY** - Must register with Data Protection Commission (DPC)
- ⚠️ **Action Required**: Register as data controller before processing personal data
- ⚠️ **Action Required**: Registration must be renewed every **2 years**
- ⚠️ **Action Required**: Keep registration certificate current
- ⚠️ **Action Required**: Update registration if processing activities change

#### Data Protection Officer (DPO)
- ⚠️ **RECOMMENDED** (not mandatory, but strongly encouraged)
- ⚠️ **Action Required**: Consider appointing a DPO to oversee compliance
- ⚠️ **Action Required**: DPO should be knowledgeable about Act 843
- ⚠️ **Action Required**: DPO contact information should be available

#### Data Protection Impact Assessment (DPIA)
- ⚠️ **Action Required**: Conduct DPIA for high-risk processing activities
- ⚠️ **Action Required**: Evaluate and mitigate risks associated with data processing
- ⚠️ **Action Required**: Document DPIA findings and mitigation measures

#### Data Breach Notification
- ⚠️ **Action Required**: Implement breach detection and notification system
- ⚠️ **Action Required**: Notify DPC promptly when breach occurs
- ⚠️ **Action Required**: Notify affected data subjects without undue delay
- ⚠️ **Action Required**: Document all breaches and remediation actions
- ⚠️ **Note**: Specific timeframes not explicitly stated in Act 843, but "promptly" is required

#### Data Transfer
- ⚠️ **CRITICAL**: Backend hosted in USA - requires data transfer safeguards
- ⚠️ **Action Required**: Ensure adequate level of protection in destination country
- ⚠️ **Action Required**: Standard Contractual Clauses (SCCs) or adequacy decision
- ⚠️ **Action Required**: Document data transfer mechanisms and legal basis
- ⚠️ **Action Required**: Personal data may only be transferred if recipient country ensures adequate protection

#### Penalties & Fines
- ⚠️ **Risk**: Non-compliance can result in penalties
- ⚠️ **Action Required**: Ensure strict compliance to avoid penalties
- ⚠️ **Action Required**: Regular compliance monitoring
- ⚠️ **Note**: Specific penalty amounts not detailed in Act 843, but enforcement is active

---

### 2. **GDPR (General Data Protection Regulation)**

**Applies**: ⚠️ **POTENTIALLY** - If serving EU users

**Key Requirements**:

#### Lawful Basis for Processing
- ✅ **Contract**: Processing necessary for service delivery (bookings, payments)
- ✅ **Consent**: Marketing communications, analytics
- ⚠️ **Needs**: Document lawful basis for each data processing activity

#### User Rights (GDPR Article 15-22)
- ✅ **Right to Access**: User can view their data
- ⚠️ **Needs**: Implement `/api/users/:id/data-export` endpoint
- ⚠️ **Needs**: Implement `/api/users/:id/delete` endpoint (right to erasure)
- ⚠️ **Needs**: Right to rectification (already possible via profile update)
- ⚠️ **Needs**: Right to object to processing
- ⚠️ **Needs**: Right to data portability (JSON export)

#### Data Protection Officer (DPO)
- ⚠️ **Action Required**: Determine if DPO is required (likely not for small scale)
- ⚠️ **Action Required**: Designate data protection contact person

#### Privacy by Design
- ✅ HTTPS enforced (`force_https = true` in Fly.io config)
- ✅ Passwords hashed (bcrypt)
- ⚠️ **Needs**: Data minimization (only collect necessary data)
- ⚠️ **Needs**: Pseudonymization where possible

#### Data Processing Records
- ⚠️ **Action Required**: Maintain records of processing activities
- ⚠️ **Action Required**: Document third-party processors (Vercel, Fly.io, Cloudinary, Paystack, Sentry)

---

### 3. **PCI DSS (Payment Card Industry Data Security Standard)**

**Applies**: ⚠️ **PARTIALLY** - Payment processing via Paystack

**Key Requirements**:

#### Current Status
- ✅ **Payment processing delegated to Paystack** (PCI Level 1 certified)
- ✅ No card data stored directly (Paystack handles tokenization)
- ⚠️ **Action Required**: Ensure no card data in logs or error messages
- ⚠️ **Action Required**: Secure handling of payment references

#### Compliance Checklist
- ✅ Use PCI-compliant payment processor (Paystack)
- ⚠️ **Needs**: Secure transmission (HTTPS - ✅ already enforced)
- ⚠️ **Needs**: Access controls for payment data
- ⚠️ **Needs**: Regular security testing
- ⚠️ **Needs**: Security policy documentation

---

### 4. **US Regulations (Due to Backend Hosting)**

**Applies**: ⚠️ **POTENTIALLY** - Backend in USA (Fly.io, region: iad)

#### CCPA (California Consumer Privacy Act)
- ⚠️ **Applies if**: Serving California residents
- ⚠️ **Action Required**: "Do Not Sell My Personal Information" option
- ⚠️ **Action Required**: Disclosure of data collection practices

#### COPPA (Children's Online Privacy Protection Act)
- ✅ **Likely N/A**: Service marketplace for adults (service providers)
- ⚠️ **Action Required**: Age verification (confirm 18+)

#### State Privacy Laws
- Various states have privacy laws (Virginia, Colorado, Connecticut, etc.)
- ⚠️ **Action Required**: Monitor if serving US users

---

### 5. **Cross-Border Data Transfer Regulations**

**Applies**: ✅ **YES** - Data flows: Ghana → USA → Global

#### Key Considerations
- **Ghana → USA**: Backend processing in USA
- **USA → Global**: Cloudinary, Sentry, Vercel CDN
- **Ghana → Ghana**: Paystack (local payment processing)

#### Required Safeguards
- ⚠️ **Action Required**: Standard Contractual Clauses (SCCs) with Fly.io
- ⚠️ **Action Required**: Data Processing Agreements (DPAs) with:
  - Fly.io (backend hosting)
  - Vercel (frontend hosting)
  - Cloudinary (image storage)
  - Sentry (error tracking)
  - Paystack (payment processing)
- ⚠️ **Action Required**: Document data transfer legal basis
- ⚠️ **Action Required**: Ensure USA provides adequate level of protection

---

## 📊 Data Inventory

> **📋 Comprehensive Data Mapping:** For a complete data mapping with all personal data flows, lawful basis documentation, and minimality assessment, see **[DATA_MAPPING_AND_LAWFUL_BASIS.md](./DATA_MAPPING_AND_LAWFUL_BASIS.md)**.
> 
> **Quick Reference:** See **[DATA_MAPPING_SUMMARY.md](./DATA_MAPPING_SUMMARY.md)** for a condensed overview.

### Personal Data Collected

| Data Type | Collection Point | Storage Location | Retention | Legal Basis |
|-----------|-----------------|------------------|-----------|-------------|
| Email | Registration | PostgreSQL (USA) | Until account deletion + 30 days | Contract |
| Name | Registration | PostgreSQL (USA) | Until account deletion + 30 days | Contract |
| Phone | Registration (optional) | PostgreSQL (USA) | Until account deletion + 30 days | Consent |
| Password (hashed) | Registration | PostgreSQL (USA) | Until account deletion + 30 days | Contract |
| Location | Provider profile | PostgreSQL (USA) | Until account deletion + 7 years | Contract |
| ID Documents | Provider verification | Cloudinary (Global) | 30 days after verification | Legal obligation |
| Bank Account | Provider payout | PostgreSQL (USA) | Until account deletion + 7 years | Contract |
| Mobile Money | Provider payout | PostgreSQL (USA) | Until account deletion + 7 years | Contract |
| Payment Data | Booking payment | Paystack (Ghana) | 7 years (tax records) | Contract |
| Booking History | Service bookings | PostgreSQL (USA) | 7 years (tax records) | Legal obligation |
| Reviews | User reviews | PostgreSQL (USA) | Until account deletion + 7 years | Contract |
| Analytics | User behavior | Sentry (Global) | 90 days | Legitimate interest |

### Sensitive Data

- **ID Documents**: Encrypted at rest, secure access required
- **Financial Information**: Bank accounts, mobile money numbers
- **Payment References**: Transaction IDs, payment status

---

## ✅ Compliance Checklist

### Immediate Actions Required

#### 1. **Privacy & Consent**
- [ ] Add explicit consent checkboxes during registration
- [ ] Cookie consent banner (if using analytics cookies)
- [ ] Update Privacy Policy with data transfer disclosures
- [ ] Add Terms of Service acceptance checkbox

#### 2. **Data Controller Registration**
- [ ] **Register with Data Protection Commission (DPC)** - MANDATORY
- [ ] Complete DPC registration application
- [ ] Submit required documentation
- [ ] Set calendar reminder for renewal (every 2 years)
- [ ] Keep registration certificate current

#### 3. **Data Subject Rights**
- [ ] Implement data export endpoint (`GET /api/users/:id/export`)
- [ ] Implement data deletion endpoint (`DELETE /api/users/:id`)
- [ ] Add "Delete Account" feature in user settings
- [ ] Implement data rectification (already exists via profile update)
- [ ] Add right to object to processing mechanism

#### 4. **Data Security**
- [ ] Encrypt ID documents at rest (Cloudinary encryption)
- [ ] Implement database encryption at rest
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Implement account lockout after failed login attempts
- [ ] Regular security audits and penetration testing

#### 5. **Data Mapping & Lawful Basis** (Section 21 - Act 843)
- [x] **✅ COMPLETE**: Comprehensive data mapping documented
  - See `DATA_MAPPING_AND_LAWFUL_BASIS.md` for full documentation
  - All personal data flows mapped
  - Lawful basis documented for each processing activity
  - Minimality assessment completed
  - Special category data assessed
  - Data retention policies defined
  - External transfers documented

#### 6. **Data Transfer Compliance**
- [ ] Sign Data Processing Agreements (DPAs) with:
  - [ ] Fly.io
  - [ ] Vercel
  - [ ] Cloudinary
  - [ ] Sentry
  - [ ] Paystack (verify existing agreement)
- [x] **✅ COMPLETE**: Data transfer legal basis documented (see `DATA_MAPPING_AND_LAWFUL_BASIS.md` Section 3.2)
- [ ] Add data transfer disclosure to Privacy Policy
- [ ] Verify adequate protection in USA (destination country)

#### 7. **Breach Response**
- [ ] Implement breach detection system
- [ ] Create breach response procedure
- [ ] Document notification requirements (notify DPC promptly)
- [ ] Test breach response plan
- [ ] Document breach remediation actions

#### 7. **Documentation & Assessment**
- [ ] Records of Processing Activities (ROPA)
- [ ] Data Protection Impact Assessment (DPIA) for high-risk processing
- [ ] Security policy documentation
- [ ] Incident response plan
- [ ] Staff training on data protection principles

#### 8. **Data Protection Officer (DPO)**
- [ ] Consider appointing DPO (recommended, not mandatory)
- [ ] If appointed, make DPO contact information available
- [ ] Ensure DPO is knowledgeable about Act 843

#### 9. **Payment Security**
- [ ] Verify no card data in application logs
- [ ] Secure payment reference handling
- [ ] Implement payment data access controls
- [ ] Regular security testing

---

## 🔐 Security Best Practices

### Current Security Measures

✅ **Implemented**:
- HTTPS enforced (`force_https = true`)
- Password hashing (bcrypt)
- JWT authentication
- CORS configuration
- Environment variables for secrets

⚠️ **Needs Improvement**:
- Token storage (currently localStorage - vulnerable to XSS)
- Database encryption at rest
- ID document encryption
- Rate limiting
- Account lockout mechanisms
- Security headers (CSP, HSTS, X-Frame-Options)

### Recommended Security Enhancements

1. **Token Security**
   - Move from localStorage to httpOnly cookies
   - Implement refresh tokens
   - Shorter access token expiry (1 hour)

2. **Database Security**
   - Enable encryption at rest
   - Regular backups with encryption
   - Access logging and monitoring

3. **API Security**
   - Rate limiting per IP/user
   - Request size limits
   - Input validation and sanitization
   - SQL injection prevention (Prisma helps)

4. **Monitoring & Logging**
   - Security event logging
   - Anomaly detection
   - Regular security audits

---

## 📝 Privacy Policy Updates Needed

### Current Privacy Policy Status
- ✅ Basic privacy policy exists
- ⚠️ Needs updates for:
  - Data transfer disclosures (USA hosting)
  - Third-party processors list
  - User rights (access, deletion, export, objection)
  - Data retention policies
  - Breach notification procedures
  - Cookie policy (if using analytics)
  - DPC registration information

### Recommended Additions

1. **Data Transfer Section**
   ```
   "Your data may be transferred to and processed in the United States 
   where our backend servers are located. We ensure appropriate safeguards 
   are in place for such transfers and that the USA provides an adequate 
   level of data protection."
   ```

2. **Third-Party Processors**
   - List all service providers (Fly.io, Vercel, Cloudinary, etc.)
   - Explain their role and data access

3. **User Rights Section**
   - How to access data
   - How to delete account
   - How to export data
   - How to object to processing
   - How to withdraw consent

4. **DPC Registration**
   - Include DPC registration number (once obtained)
   - Contact information for data protection inquiries

---

## 🏛️ Regulatory Bodies & Contacts

### Ghana
- **Data Protection Commission (DPC)**
  - Website: https://www.dataprotection.org.gh
  - Email: info@dataprotection.org.gh
  - **Registration**: Data controllers must register with DPC
  - **Renewal**: Registration must be renewed every 2 years
  - **DPO**: Encouraged but not mandatory

### European Union
- **Supervisory Authority**: Depends on which EU country users are from
- **GDPR Representative**: May be required if processing EU data

### United States
- **FTC**: Federal Trade Commission (consumer protection)
- **State Attorneys General**: For state-specific privacy laws

---

## 💰 Cost Considerations

### Compliance Costs

1. **Legal Consultation**: $2,000 - $10,000 (one-time)
   - Privacy policy review
   - Data processing agreements
   - Compliance assessment

2. **DPA Signing**: Usually free (standard agreements)
   - Fly.io, Vercel, Cloudinary typically provide DPAs

3. **Security Tools**: $50 - $500/month
   - Security monitoring
   - Vulnerability scanning
   - Penetration testing (annual)

4. **Data Protection Officer (DPO)**: $0 - $3,000/month
   - **Recommended but not mandatory** under Act 843
   - Can be internal or external
   - Should be knowledgeable about Act 843

5. **DPC Registration**: Varies (check current fees)
   - Data controllers must register with DPC
   - Must be renewed every 2 years
   - Registration fees apply

6. **Data Protection Impact Assessment (DPIA)**: $1,000 - $5,000 (one-time or periodic)
   - Required for high-risk processing activities
   - May need periodic updates

---

## 🚨 Risk Assessment

### High-Risk Areas

1. **Cross-Border Data Transfer**
   - Risk: Data in USA without proper safeguards
   - Mitigation: Sign DPAs, use SCCs, document legal basis, verify adequate protection

2. **ID Document Storage**
   - Risk: Sensitive identity documents
   - Mitigation: Encrypt at rest, delete after verification, access controls

3. **Payment Data**
   - Risk: Financial information exposure
   - Mitigation: Use PCI-compliant processor (Paystack), no card storage

4. **Data Breach**
   - Risk: Unauthorized access to user data
   - Mitigation: Encryption, monitoring, breach response plan

5. **Unregistered Data Controller**
   - Risk: Operating without DPC registration (mandatory)
   - Mitigation: Register immediately with DPC

### Medium-Risk Areas

1. **Token Security**: localStorage vulnerable to XSS
2. **Account Security**: No account lockout, weak password policy
3. **Data Retention**: No clear retention policies
4. **User Consent**: No explicit consent mechanisms

---

## 📅 Compliance Timeline

### Phase 1: Immediate (Week 1-2)
- [ ] **Register with Data Protection Commission (DPC)** - MANDATORY
- [ ] Update Privacy Policy with data transfer disclosures
- [ ] Add consent checkboxes to registration
- [ ] Sign DPAs with service providers
- [ ] Document data inventory
- [ ] Consider appointing DPO

### Phase 2: Short-term (Month 1)
- [ ] Implement data export endpoint
- [ ] Implement data deletion endpoint
- [ ] Add "Delete Account" feature
- [ ] Implement security improvements (rate limiting, account lockout)
- [ ] Create Records of Processing Activities (ROPA)
- [ ] Conduct Data Protection Impact Assessment (DPIA) if needed

### Phase 3: Medium-term (Month 2-3)
- [ ] Encrypt ID documents at rest
- [ ] Implement breach detection and response
- [ ] Security audit and penetration testing
- [ ] Staff training on data protection principles
- [ ] Set up DPC registration renewal reminder (2-year cycle)

### Phase 4: Ongoing
- [ ] Regular security updates
- [ ] Annual compliance review
- [ ] Monitor regulatory changes
- [ ] Renew DPC registration every 2 years
- [ ] Update documentation as needed

---

## 📚 Resources

### Legal Resources
- [Ghana Data Protection Commission (DPC)](https://www.dataprotection.org.gh)
- [Data Protection Act, 2012 (Act 843)](https://www.dataprotection.org.gh)
- [GDPR Official Text](https://gdpr-info.eu/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)

### Technical Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Fly.io Security](https://fly.io/docs/reference/security/)
- [Vercel Security](https://vercel.com/docs/security)

---

## ✅ Summary

### Critical Actions (Priority Order)

#### **IMMEDIATE (MANDATORY)**
1. **Register with Data Protection Commission (DPC)** - Required before processing personal data
2. **Renew DPC registration every 2 years** - Set up reminder system

#### **HIGH PRIORITY**
3. **Sign Data Processing Agreements** with all service providers
4. **Update Privacy Policy** with data transfer and user rights information
5. **Implement user rights** (data export, deletion, objection)
6. **Add explicit consent** mechanisms
7. **Enhance security** (encryption, rate limiting, account lockout)
8. **Implement breach notification** procedures (notify DPC promptly)

#### **RECOMMENDED**
9. **Appoint Data Protection Officer (DPO)** - Strongly recommended
10. **Conduct Data Protection Impact Assessment (DPIA)** for high-risk processing

### Compliance Status
- **Ghana Act 843**: ⚠️ **CRITICAL** - Partial compliance (needs immediate improvements)
  - ❌ **Missing**: DPC registration (MANDATORY)
  - ⚠️ **Needs**: DPO appointment (recommended)
  - ⚠️ **Needs**: User rights implementation
  - ⚠️ **Needs**: Breach notification procedures
  - ⚠️ **Needs**: DPIA for high-risk processing
- **GDPR**: ⚠️ Partial compliance (if serving EU users)
- **PCI DSS**: ✅ Compliant (via Paystack)
- **US Regulations**: ⚠️ Monitor if serving US users

### Key Differences from Nigeria NDPR
- ✅ **DPO**: Recommended (not mandatory) vs. Nigeria (mandatory)
- ✅ **Audit**: Not explicitly required annually vs. Nigeria (mandatory annual audit)
- ✅ **Registration**: Required and renewed every 2 years (same concept, different frequency)
- ✅ **Generally less strict** than Nigeria's NDPR, but still requires compliance

### Next Steps
1. Review this document with legal counsel
2. **Register with DPC immediately** (before processing personal data)
3. Prioritize high-risk areas
4. Create implementation timeline
5. Assign compliance responsibilities
6. Regular compliance reviews
7. Set up 2-year renewal reminder for DPC registration

---

**Last Updated**: December 2024  
**Next Review**: March 2025  
**Owner**: Development Team / Legal Counsel

