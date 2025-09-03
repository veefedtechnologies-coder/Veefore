# VeeFore Data Map - PII, Tokens, and Security Audit

**Generated:** September 3, 2025  
**Version:** 1.0 - Security Audit Discovery  
**Classification:** CONFIDENTIAL - Security Analysis

## 🛡️ **EXECUTIVE SUMMARY**

This document maps all Personally Identifiable Information (PII), authentication tokens, API secrets, and sensitive data across the VeeFore platform to ensure GDPR compliance and security hardening.

## 📊 **DATA CLASSIFICATION MATRIX**

| Data Type | Storage Location | Encryption Status | Retention Policy | GDPR Article |
|-----------|------------------|-------------------|------------------|--------------|
| **High Risk PII** | PostgreSQL/MongoDB | ❌ Not Encrypted | Indefinite | Art. 17 |
| **Authentication Tokens** | MongoDB | ❌ Plain Text | Variable | Art. 32 |
| **API Secrets** | Environment Variables | ✅ Secured | N/A | Art. 32 |
| **Social Media Tokens** | MongoDB | ❌ Plain Text | Until Revoked | Art. 17 |
| **Payment Data** | External (Stripe) | ✅ Encrypted | Per Provider | Art. 17 |

---

## 🔐 **AUTHENTICATION & AUTHORIZATION DATA**

### **Firebase Authentication**
- **Location:** Client-side + Firebase servers
- **Data Types:** Email, display name, profile pictures, UIDs
- **Encryption:** Firebase managed (encrypted in transit/rest)
- **Retention:** Controlled by Firebase retention policies
- **GDPR Compliance:** ✅ Firebase is GDPR compliant

### **Session Management**
- **Location:** PostgreSQL via connect-pg-simple
- **Data Types:** Session IDs, user IDs, expiration times
- **Encryption:** ❌ Plain text in database
- **Retention:** Session expiry (configurable)
- **Risk Level:** 🟡 Medium - Session hijacking potential

### **JWT Tokens (if used)**
- **Location:** Client localStorage/cookies
- **Data Types:** User claims, workspace permissions
- **Encryption:** ❌ Base64 encoded (not encrypted)
- **Retention:** Token expiry
- **Risk Level:** 🔴 High - XSS/CSRF vulnerability

---

## 👤 **USER PERSONAL DATA (PII)**

### **PostgreSQL Users Table**
```sql
users (
  firebase_uid,           -- Firebase identifier
  email,                  -- 🔴 High Risk PII
  username,               -- 🟡 Medium Risk PII  
  display_name,           -- 🟡 Medium Risk PII
  avatar,                 -- 🟡 Medium Risk PII (URLs)
  referral_code,          -- Internal identifier
  referred_by,            -- Relationship data
  preferences,            -- 🟡 Behavioral data (JSON)
  goals,                  -- 🟡 Behavioral data (JSON)
  niche,                  -- Business information
  target_audience,        -- Business information
  content_style,          -- Preference data
  business_type,          -- Business information
  onboarding_data         -- 🟡 User journey data (JSON)
)
```

**GDPR Rights Impact:**
- **Right to Access (Art. 15):** ❌ No export endpoint
- **Right to Rectification (Art. 16):** ❌ No update endpoint  
- **Right to Erasure (Art. 17):** ❌ No deletion workflow
- **Right to Portability (Art. 20):** ❌ No data export

---

## 🏢 **WORKSPACE & TEAM DATA**

### **PostgreSQL Workspace Tables**
```sql
workspaces (
  user_id,                -- Owner reference
  name,                   -- Workspace name
  description,            -- Workspace description
  ai_personality,         -- AI configuration
  invite_code            -- 🟡 Access control data
)

workspace_members (
  workspace_id,           -- Workspace reference
  user_id,               -- Member reference  
  role,                  -- Permission level
  permissions,           -- 🟡 Detailed permissions (JSON)
  invited_by             -- Audit trail
)
```

**Multi-tenant Security Risks:**
- ❌ No workspace isolation validation
- ❌ Missing cross-tenant access tests
- ❌ Shared data bleed potential

---

## 🔑 **SOCIAL MEDIA TOKENS & SECRETS**

### **Instagram Business API**
- **Location:** MongoDB social_accounts collection
- **Token Types:** Access tokens, refresh tokens, page tokens
- **Encryption Status:** ❌ Plain text storage
- **Scope:** instagram_basic, instagram_content_publish, pages_read_engagement
- **Expiration:** 60 days (auto-refresh implemented)
- **Risk Level:** 🔴 Critical - Full account access

### **YouTube Data API**
- **Location:** MongoDB social_accounts collection  
- **Token Types:** OAuth 2.0 access/refresh tokens
- **Encryption Status:** ❌ Plain text storage
- **Scope:** youtube, youtube.upload, youtube.readonly
- **Expiration:** 1 hour access, indefinite refresh
- **Risk Level:** 🔴 Critical - Channel management access

### **Twitter API v2**
- **Location:** MongoDB social_accounts collection
- **Token Types:** Bearer tokens, OAuth tokens
- **Encryption Status:** ❌ Plain text storage
- **Scope:** tweet.read, tweet.write, users.read
- **Risk Level:** 🔴 Critical - Tweet and profile access

### **LinkedIn Marketing API**
- **Location:** MongoDB social_accounts collection
- **Token Types:** OAuth 2.0 access tokens
- **Encryption Status:** ❌ Plain text storage
- **Scope:** r_liteprofile, w_member_social
- **Risk Level:** 🔴 Critical - Professional profile access

---

## 🤖 **AI SERVICE CREDENTIALS**

### **OpenAI API**
- **Location:** Environment variables
- **Variable:** OPENAI_API_KEY
- **Encryption:** ✅ Secured via env
- **Usage:** Content generation, chat responses, analysis
- **Risk Level:** 🟡 Medium - API cost exposure

### **Anthropic Claude**
- **Location:** Environment variables
- **Variable:** ANTHROPIC_API_KEY  
- **Encryption:** ✅ Secured via env
- **Usage:** AI insights, content analysis
- **Risk Level:** 🟡 Medium - API cost exposure

### **Google Generative AI**
- **Location:** Environment variables
- **Variable:** GOOGLE_AI_API_KEY
- **Encryption:** ✅ Secured via env
- **Usage:** AI insights, vision analysis
- **Risk Level:** 🟡 Medium - API cost exposure

### **ElevenLabs**
- **Location:** Environment variables
- **Variable:** ELEVENLABS_API_KEY
- **Encryption:** ✅ Secured via env
- **Usage:** Voice synthesis
- **Risk Level:** 🟡 Medium - API cost exposure

### **Replicate**
- **Location:** Environment variables
- **Variable:** REPLICATE_API_TOKEN
- **Encryption:** ✅ Secured via env
- **Usage:** Image generation
- **Risk Level:** 🟡 Medium - API cost exposure

---

## 💳 **PAYMENT & FINANCIAL DATA**

### **Stripe Integration**
- **Location:** External Stripe servers + user table references
- **Data Stored Locally:** stripe_customer_id, stripe_subscription_id
- **PCI Compliance:** ✅ Stripe PCI DSS Level 1
- **Webhooks:** Payment status, subscription changes
- **Risk Level:** 🟢 Low - Tokenized references only

### **Razorpay Integration**  
- **Location:** External Razorpay servers
- **Data Stored Locally:** Transaction references
- **Compliance:** Razorpay PCI compliant
- **Risk Level:** 🟢 Low - Tokenized references only

### **Credit System**
- **Location:** PostgreSQL users/workspaces tables
- **Data Types:** Credit balances, transaction history
- **Encryption:** ❌ Plain integer values
- **Risk Level:** 🟡 Medium - Financial tracking

---

## 📧 **COMMUNICATION DATA**

### **Email Services**
- **SendGrid:** Production email delivery
- **Nodemailer:** Development/backup email
- **Data Types:** Email addresses, content, delivery status
- **Retention:** Per service provider policies
- **Risk Level:** 🟡 Medium - Communication metadata

### **System Notifications**
- **Location:** MongoDB notifications collection
- **Data Types:** User preferences, notification history
- **Risk Level:** 🟡 Medium - Behavioral tracking

---

## 📱 **SOCIAL MEDIA CONTENT**

### **Instagram Content**
- **Location:** MongoDB instagram_content collection
- **Data Types:** Media URLs, captions, engagement metrics
- **Source:** Instagram Business API sync
- **Retention:** Until account disconnection
- **Risk Level:** 🟡 Medium - Business content exposure

### **YouTube Analytics**
- **Location:** MongoDB youtube_analytics collection
- **Data Types:** View counts, subscriber metrics, video metadata
- **Source:** YouTube Data API sync
- **Risk Level:** 🟡 Medium - Business metrics exposure

### **Conversation Data**
- **Location:** MongoDB conversations collection
- **Data Types:** Instagram DMs, comment responses, automation logs
- **Retention:** Indefinite (no cleanup policy)
- **Risk Level:** 🔴 High - Private communications

---

## 🤖 **AUTOMATION & AI DATA**

### **Automation Rules**
- **Location:** MongoDB automation_rules collection
- **Data Types:** Keywords, response templates, targeting criteria
- **Risk Level:** 🟡 Medium - Business logic exposure

### **AI Response History**
- **Location:** MongoDB ai_responses collection  
- **Data Types:** Generated content, user interactions, prompt history
- **Retention:** Indefinite
- **Risk Level:** 🟡 Medium - AI behavior patterns

---

## 📊 **ANALYTICS & TRACKING**

### **User Behavior Analytics**
- **Location:** Various MongoDB collections
- **Data Types:** Page views, feature usage, click tracking
- **Retention:** Indefinite
- **Risk Level:** 🟡 Medium - Behavioral profiling

### **Performance Metrics**
- **Location:** Application logs, MongoDB metrics
- **Data Types:** API response times, error rates, usage patterns
- **Risk Level:** 🟢 Low - Technical metrics

---

## 🚨 **CRITICAL SECURITY FINDINGS**

### **Immediate Risk - Red Flags**
1. **🔴 Social Media Tokens Unencrypted:** All OAuth tokens stored in plain text
2. **🔴 No Token Rotation:** Automated refresh without security validation
3. **🔴 Missing GDPR Endpoints:** No privacy rights implementation
4. **🔴 Indefinite Data Retention:** No cleanup or expiration policies
5. **🔴 Cross-tenant Risk:** Workspace isolation not enforced

### **High Priority Fixes**
1. **Encrypt All Social Tokens:** Use libsodium/NaCl with KMS keys
2. **Implement GDPR Endpoints:** Data export, rectification, erasure
3. **Add Data Retention Policies:** Automated cleanup schedules
4. **Workspace Isolation Tests:** Prevent cross-tenant data access
5. **Token Security Audit:** Scope minimization and rotation policies

---

## 📋 **GDPR COMPLIANCE GAPS**

### **Missing Privacy Rights (Articles 15-22)**
- [ ] **Article 15:** Right to access - No data export endpoint
- [ ] **Article 16:** Right to rectification - No data update API
- [ ] **Article 17:** Right to erasure - No deletion workflow
- [ ] **Article 18:** Right to restriction - No processing controls
- [ ] **Article 20:** Right to portability - No structured export
- [ ] **Article 21:** Right to object - No opt-out mechanisms

### **Missing Technical Measures (Article 32)**
- [ ] **Encryption at Rest:** Social tokens, PII fields
- [ ] **Pseudonymization:** User identifiers in analytics
- [ ] **Access Controls:** Granular permission system
- [ ] **Audit Logging:** Privacy-related actions

### **Missing Organizational Measures**
- [ ] **Data Processing Records (Article 30)**
- [ ] **Privacy Impact Assessments (Article 35)**
- [ ] **Processor Agreements (Article 28)**
- [ ] **Breach Notification Procedures (Article 33-34)**

---

## 🔄 **DATA FLOW SECURITY RISKS**

### **Authentication Flow**
```
User → Firebase → Backend → Session Storage (❌ Plain Text)
```

### **Social Token Flow**
```
OAuth → Social Provider → Token Storage (❌ Unencrypted) → API Calls
```

### **User Data Flow**
```  
Registration → Database (❌ No Encryption) → API Access (❌ No Isolation)
```

---

## 📞 **RECOMMENDED ACTIONS**

### **Phase 1: Critical Security (Week 1)**
1. Encrypt all social media tokens using libsodium
2. Fix TypeScript compilation errors
3. Implement workspace isolation validation
4. Add Redis security configuration

### **Phase 2: GDPR Compliance (Week 2-3)**
1. Build privacy endpoints (export, rectify, delete)
2. Add data retention policies
3. Implement consent management
4. Create audit logging system

### **Phase 3: Enhanced Security (Week 4)**
1. Add comprehensive input validation
2. Implement rate limiting
3. Security headers and CORS configuration
4. Penetration testing and vulnerability scanning

---

*Last Updated: September 3, 2025 - Critical findings identified requiring immediate action*