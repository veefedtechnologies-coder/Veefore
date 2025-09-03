# VeeFore Platform Architecture

**Generated:** September 3, 2025  
**Version:** 1.0 - Initial Security Audit Discovery

## 🏗️ **SYSTEM OVERVIEW**

VeeFore is a comprehensive AI-powered social media management platform with multi-tenant workspace architecture, featuring real-time automation, content generation, and cross-platform social media integrations.

## 📋 **TECHNOLOGY STACK**

### **Frontend Architecture**
- **Framework:** React 18.3.1 with TypeScript 5.6.3
- **Build Tool:** Vite 5.4.19 with HMR (Hot Module Replacement)
- **Styling:** Tailwind CSS 3.4.17 + Radix UI component library
- **State Management:** TanStack Query v5 (React Query) for server state + React Context for UI state
- **Routing:** Wouter 3.7.1 (lightweight client-side router)
- **Forms:** React Hook Form with Zod validation
- **Real-time:** Socket.io Client 4.8.1
- **Authentication:** Firebase Auth 11.8.1 client SDK

### **Backend Architecture**
- **Runtime:** Node.js with Express 4.21.2
- **Language:** TypeScript 5.6.3 (ESM modules)
- **Database:** Hybrid PostgreSQL (Drizzle ORM) + MongoDB (Mongoose ODM)
- **Authentication:** Firebase Admin SDK + Passport.js
- **Real-time:** Socket.io Server 4.8.1
- **Security:** Helmet 8.1.0 + bcryptjs + JWT
- **Queues:** BullMQ 5.58.4 with Redis (ioredis 5.7.0)
- **Session Management:** Express-session with connect-pg-simple

### **AI & External Services**
- **AI Providers:** OpenAI 5.15.0, Anthropic 0.37.0, Google GenAI, Replicate
- **Voice:** ElevenLabs 1.59.0
- **Payments:** Stripe 18.3.0, Razorpay 2.9.6
- **Email:** SendGrid 8.1.5, Nodemailer 7.0.5
- **Media Processing:** Sharp 0.34.3, Canvas 2.11.2, FFmpeg, Puppeteer 24.12.1
- **Social APIs:** Instagram Business, YouTube Data API v3, Twitter API v2, LinkedIn API

### **Infrastructure & Deployment**
- **Container:** Docker with multi-stage builds
- **Cloud Platforms:** Replit (development), Vercel (frontend), Railway (backend)
- **CDN:** Integrated asset management with `@assets` alias
- **Monitoring:** Built-in health checks and analytics

---

## 🏛️ **SYSTEM ARCHITECTURE DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React App (Vite)                                              │
│  ├── Authentication (Firebase)                                  │
│  ├── UI Components (Radix + Tailwind)                          │
│  ├── State Management (TanStack Query + Context)               │
│  ├── Real-time (Socket.io Client)                              │
│  └── Routing (Wouter)                                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                              │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                             │
│  ├── Security Middleware (Helmet, CORS, Rate Limiting)         │
│  ├── Authentication (Firebase Admin + Passport)                │
│  ├── Request Validation (Zod schemas)                          │
│  ├── Multi-tenant Workspace Isolation                          │
│  └── Error Handling & Logging                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   CORE SERVICES │  │  AI SERVICES    │  │ SOCIAL SERVICES │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│• User Management│  │• Content Gen    │  │• Instagram API  │
│• Workspace Mgmt │  │• AI Insights    │  │• YouTube API    │
│• Credit System  │  │• Trend Analysis │  │• Twitter API    │
│• Subscription   │  │• Auto Responses │  │• LinkedIn API   │
│• Team Management│  │• Video Gen      │  │• Webhook Handlers│
│• Analytics      │  │• Thumbnail Gen  │  │• OAuth Flows    │
│• Automation     │  │• Voice Synthesis│  │• Token Refresh  │
│• Scheduling     │  │• Legal AI       │  │• Rate Limiting  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   QUEUE SYSTEM  │  │   DATA LAYER    │  │ EXTERNAL APIS   │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│• BullMQ Workers │  │• PostgreSQL     │  │• OpenAI/Claude  │
│• Redis Cache    │  │  (Drizzle ORM)  │  │• Instagram Graph│
│• Job Scheduling │  │• MongoDB        │  │• YouTube Data   │
│• Background Tasks│  │  (Mongoose)     │  │• Stripe/Razorpay│
│• Metrics Queue  │  │• File Storage   │  │• SendGrid       │
│• Webhook Queue  │  │• Session Store  │  │• ElevenLabs     │
│• Token Refresh  │  │• Media Assets   │  │• Replicate      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🔄 **DATA FLOW PATTERNS**

### **1. User Authentication Flow**
```
Client → Firebase Auth → Backend Verification → Session Creation → Workspace Access
```

### **2. Social Media Integration Flow**
```
OAuth Request → Provider Authorization → Token Storage (Encrypted) → API Access → Data Sync
```

### **3. Automation Workflow**
```
Webhook Reception → Signature Verification → Queue Processing → AI Response → Social Action
```

### **4. Content Creation Flow**
```
User Input → AI Processing → Content Generation → Review/Edit → Scheduling → Publication
```

### **5. Real-time Updates**
```
Data Change → WebSocket Broadcast → Client State Update → UI Refresh
```

---

## 🗂️ **DIRECTORY STRUCTURE**

```
VeeFore/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-based page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   └── types/              # TypeScript type definitions
│   └── public/                 # Static assets
├── server/                     # Backend Express application
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Express middleware
│   ├── models/                 # Database models
│   ├── services/               # Business logic services
│   ├── queues/                 # Background job definitions
│   ├── workers/                # Queue processors
│   └── utils/                  # Server utilities
├── shared/                     # Shared TypeScript types/schemas
│   └── schema.ts               # Drizzle database schema
└── attached_assets/            # Media assets and uploads
```

---

## 🔐 **MULTI-TENANT ARCHITECTURE**

### **Workspace Isolation Model**
- **Primary Tenant:** User Account (Firebase UID)
- **Secondary Tenant:** Workspace (PostgreSQL workspace_id)
- **Access Control:** Role-based permissions (owner/editor/viewer)
- **Data Isolation:** All queries scoped by workspace_id
- **Resource Sharing:** Credits and subscriptions at workspace level

### **Database Design**
- **PostgreSQL:** Structured data, user management, workspaces, analytics
- **MongoDB:** Social media content, conversations, automation rules
- **Hybrid Strategy:** Leverage strengths of both database types

---

## 🌐 **EXTERNAL INTEGRATIONS**

### **Social Media Platforms**
| Platform  | API Version | Auth Method | Webhook Support |
|-----------|-------------|-------------|-----------------|
| Instagram | Graph API   | OAuth 2.0   | ✅ Yes          |
| YouTube   | Data API v3 | OAuth 2.0   | ✅ Yes          |
| Twitter   | API v2      | OAuth 2.0   | ✅ Yes          |
| LinkedIn  | Marketing   | OAuth 2.0   | ✅ Yes          |

### **AI & ML Services**
| Service    | Purpose           | Integration Type |
|------------|-------------------|------------------|
| OpenAI     | Content, Chat     | REST API         |
| Anthropic  | Content, Analysis | REST API         |
| Google AI  | Insights, Vision  | REST API         |
| ElevenLabs | Voice Synthesis   | REST API         |
| Replicate  | Image Generation  | REST API         |

### **Infrastructure Services**
| Service  | Purpose        | Integration |
|----------|----------------|-------------|
| Firebase | Authentication | Admin SDK   |
| Stripe   | Payments       | Webhooks    |
| SendGrid | Email          | REST API    |
| Redis    | Caching/Queues | Direct      |

---

## ⚡ **PERFORMANCE CHARACTERISTICS**

### **Frontend Optimizations**
- Code splitting with dynamic imports
- TanStack Query caching and deduplication
- Lazy loading of heavy components
- Optimized asset loading with Vite

### **Backend Optimizations**
- Connection pooling for databases
- Redis caching for frequent operations
- Queue-based processing for heavy tasks
- Rate limiting and request throttling

### **Real-time Features**
- Socket.io for instant updates
- Selective room-based broadcasting
- Connection state management
- Graceful degradation for offline scenarios

---

## 🔒 **SECURITY ARCHITECTURE**

### **Authentication & Authorization**
- Firebase Authentication with JWT tokens
- Multi-factor authentication support
- Role-based access control (RBAC)
- Workspace-level permission enforcement

### **Data Protection**
- Encrypted token storage
- HTTPS-only communication
- Input validation with Zod schemas
- SQL injection prevention via ORM

### **API Security**
- Rate limiting per endpoint
- CORS configuration
- Request size limitations
- Security headers with Helmet

---

## 📊 **SCALABILITY DESIGN**

### **Horizontal Scaling**
- Stateless backend design
- Load balancer ready
- Database connection pooling
- Cache-first data access patterns

### **Queue-based Processing**
- Background job processing
- Distributed task execution
- Retry mechanisms with exponential backoff
- Dead letter queue handling

### **Monitoring & Observability**
- Health check endpoints
- Performance metrics collection
- Error tracking and alerting
- User analytics and insights

---

*Last Updated: September 3, 2025 - Initial Discovery Phase*