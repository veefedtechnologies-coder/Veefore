# VeeFore - Complete Project Documentation

**Latest Update**: July 10, 2025 - Logo Asset Migration & Production Build Complete

## 🚀 Project Overview

VeeFore is a comprehensive, enterprise-grade social media management platform powered by cutting-edge AI technology. It provides creators, businesses, and marketing professionals with intelligent automation tools, advanced analytics, and seamless multi-platform content management capabilities.

### Key Features
- **15+ AI-Powered Tools**: Content generation, thumbnail creation, trend analysis, automation, and more
- **Multi-Platform Integration**: Instagram, Facebook, Twitter, LinkedIn, YouTube support
- **Advanced Analytics**: Real-time insights, performance tracking, engagement optimization
- **Team Collaboration**: 9-tier role system with granular permissions
- **Subscription Management**: 4-tier pricing with credit-based system
- **Professional UI**: Hootsuite-inspired design with modern, responsive interface

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.0+ for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state, React hooks for client state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui with custom design system

### Backend Stack
- **Runtime**: Node.js 18+ with Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: Firebase Authentication with JWT tokens
- **File Storage**: Local filesystem with HTTP redirects
- **Email Service**: SendGrid SMTP for transactional emails
- **Payment Processing**: Razorpay (primary) and Stripe (international)
- **Real-time Features**: WebSocket connections for live updates

### AI & External Services
- **OpenAI**: GPT-4o for content generation, DALL-E 3 for image creation
- **Anthropic**: Claude for advanced AI assistance
- **Runway ML**: AI video generation and editing
- **Perplexity**: Real-time web search and analysis
- **Instagram Business API**: Direct integration for posting and analytics
- **YouTube Data API**: Channel management and analytics
- **Twitter API v2**: Tweet posting and engagement tracking
- **LinkedIn API**: Professional content publishing

## 📁 Project Structure

```
VeeFore/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   └── layout/        # Layout components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── assets/            # Static assets
│   ├── index.html
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── routes/                # API route handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── services/              # Business logic
│   └── utils/                 # Utility functions
├── shared/                     # Shared types and schemas
├── uploads/                    # File upload directory
└── package.json
```

## 🎯 Core Features Implementation

### 1. AI Content Generation System
- **AI Image Generator**: DALL-E 3 integration with professional prompt engineering
- **AI Thumbnail Maker Pro**: 7-stage thumbnail creation with CTR optimization
- **Content Writer**: Multi-platform content generation with tone customization
- **Hashtag Generator**: AI-powered hashtag suggestions with trending analysis
- **Caption Generator**: Context-aware caption creation with engagement optimization

### 2. Social Media Management
- **Post Creation**: Hootsuite-inspired interface with multi-platform support
- **Content Scheduling**: Advanced calendar with timezone conversion (IST to UTC)
- **Analytics Dashboard**: Real-time performance metrics and engagement tracking
- **Automation Rules**: DM auto-replies, keyword responses, engagement automation
- **Multi-Platform Publishing**: Simultaneous posting across all connected platforms

### 3. Team Management System
- **9-Tier Role System**: Owner, Admin, Content Manager, Social Manager, Editor, Analyst, Contributor, Viewer, Guest
- **Granular Permissions**: Feature-specific access control with inheritance
- **Workspace Management**: Multi-workspace support with team collaboration
- **Invitation System**: Email-based team invitations with role assignment

### 4. Subscription & Payment System
- **4-Tier Plans**: Free (₹0), Starter (₹699), Pro (₹1,499), Business (₹2,199)
- **Credit System**: Usage-based billing with monthly allocations
- **Payment Processing**: Razorpay integration with international Stripe support
- **Usage Tracking**: Real-time credit consumption monitoring

## 🔧 Database Schema

### Core Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  firebaseUid: String,
  isOnboarded: Boolean,
  plan: String, // 'free', 'starter', 'pro', 'business'
  credits: Number,
  planStatus: String,
  trialExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Workspaces Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  description: String,
  credits: Number,
  theme: String,
  aiPersonality: String,
  isDefault: Boolean,
  maxTeamMembers: Number,
  inviteCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Social Accounts Collection
```javascript
{
  _id: ObjectId,
  workspaceId: String,
  platform: String, // 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube'
  username: String,
  accessToken: String,
  refreshToken: String,
  followersCount: Number,
  followingCount: Number,
  mediaCount: Number,
  totalLikes: Number,
  totalComments: Number,
  avgEngagement: Number,
  totalReach: Number,
  lastSyncAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Content Collection
```javascript
{
  _id: ObjectId,
  workspaceId: String,
  userId: String,
  type: String, // 'post', 'story', 'reel', 'video'
  caption: String,
  hashtags: [String],
  mediaUrls: [String],
  platforms: [String],
  scheduledAt: Date,
  status: String, // 'draft', 'scheduled', 'published', 'failed'
  publishedData: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### Automation Rules Collection
```javascript
{
  _id: ObjectId,
  workspaceId: String,
  userId: String,
  name: String,
  type: String, // 'dm_auto_reply', 'keyword_response', 'engagement_automation'
  trigger: Object,
  action: Object,
  isActive: Boolean,
  restrictions: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Environment Variables & API Configuration

### Required Environment Variables

#### Database Configuration
```
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/veeforedb
DATABASE_URL=mongodb+srv://[username]:[password]@[cluster].mongodb.net/veeforedb
```

#### Firebase Authentication
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### AI Service APIs
```
OPENAI_API_KEY=sk-your_openai_api_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
RUNWAY_API_KEY=your_runway_api_key
PERPLEXITY_API_KEY=pplx-your_perplexity_key
```

#### Social Media APIs
```
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=https://your-domain.com/api/instagram/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

#### Payment Processing
```
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Email Services
```
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@veefore.com
SENDGRID_FROM_NAME=VeeFore
```

#### Security & Sessions
```
JWT_SECRET=your_super_secure_jwt_secret_key
SESSION_SECRET=your_session_secret_key
WEBHOOK_VERIFY_TOKEN=your_webhook_verification_token
```

#### Server Configuration
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

## 🚀 Deployment Instructions

### 1. Replit Deployment (Primary)
```bash
# Clone the repository
git clone https://github.com/your-username/veefore.git

# Install dependencies
npm install

# Configure environment variables in Replit Secrets
# Add all environment variables from the list above

# Start the application
npm run dev
```

### 2. Manual Server Deployment
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/your-username/veefore.git
cd veefore
npm install

# Create .env file with all required variables
cp .env.example .env
# Edit .env with your actual values

# Build and start
npm run build
npm start
```

### 3. Docker Deployment
```bash
# Build Docker image
docker build -t veefore .

# Run with environment file
docker run -p 3000:3000 --env-file .env veefore
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user profile
- `GET /api/user/subscription` - Get subscription details
- `POST /api/user/upgrade` - Upgrade subscription

### Workspace Management
- `GET /api/workspaces` - Get user workspaces
- `POST /api/workspaces` - Create new workspace
- `PUT /api/workspaces/:id` - Update workspace
- `DELETE /api/workspaces/:id` - Delete workspace

### Social Media Integration
- `GET /api/social-accounts` - Get connected accounts
- `POST /api/social-accounts/connect` - Connect new account
- `DELETE /api/social-accounts/:id` - Disconnect account
- `GET /api/social-accounts/:id/sync` - Sync account data

### Content Management
- `GET /api/content` - Get content library
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `POST /api/content/:id/publish` - Publish content
- `POST /api/content/:id/schedule` - Schedule content

### AI Tools
- `POST /api/ai/generate-content` - Generate AI content
- `POST /api/ai/generate-image` - Generate AI image
- `POST /api/ai/generate-thumbnail` - Generate AI thumbnail
- `POST /api/ai/analyze-trends` - Analyze trending topics
- `POST /api/ai/optimize-hashtags` - Optimize hashtags

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/content` - Content performance
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/reach` - Reach and impressions

### Automation
- `GET /api/automation/rules` - Get automation rules
- `POST /api/automation/rules` - Create automation rule
- `PUT /api/automation/rules/:id` - Update automation rule
- `DELETE /api/automation/rules/:id` - Delete automation rule

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Firebase project setup
- OpenAI API key
- Social media developer accounts (Instagram, Facebook, Twitter, LinkedIn, YouTube)
- Razorpay/Stripe payment gateway accounts
- SendGrid email service account

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔍 Key Technical Decisions

### Why This Tech Stack?
1. **React + TypeScript**: Type safety and component reusability
2. **Vite**: Fast development with optimized production builds
3. **MongoDB**: Flexible schema for social media data
4. **Express.js**: Lightweight and performant API server
5. **Firebase Auth**: Secure, scalable user authentication
6. **TanStack Query**: Efficient server state management
7. **Tailwind CSS**: Utility-first styling for rapid development
8. **shadcn/ui**: Consistent, accessible component library

### Architecture Patterns
- **Separation of Concerns**: Clear frontend/backend boundaries
- **Component-Based UI**: Reusable, testable components
- **Service Layer**: Business logic separated from routes
- **Middleware Pattern**: Authentication, validation, error handling
- **Event-Driven**: Webhook handling for real-time updates

## 📈 Performance Optimizations

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization with lazy loading
- Memoization for expensive calculations
- Efficient re-renders with React.memo()
- Bundle optimization with Vite

### Backend Optimizations
- Database connection pooling
- Query optimization with indexes
- API response caching
- Rate limiting for API endpoints
- Efficient file handling

### Database Optimizations
- Compound indexes for common queries
- Aggregation pipelines for analytics
- Connection pooling
- Query result caching
- Optimized schema design

## 🔒 Security Measures

### Authentication & Authorization
- JWT tokens with proper expiration
- Role-based access control (RBAC)
- Firebase Authentication integration
- Session management with secure cookies
- API key rotation and management

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting on sensitive endpoints

### API Security
- CORS configuration
- Request size limits
- Authentication middleware
- Webhook signature verification
- Environment variable protection

## 🐛 Troubleshooting Guide

### Common Issues
1. **Database Connection**: Check MongoDB URI and network access
2. **Authentication Errors**: Verify Firebase configuration
3. **API Rate Limits**: Monitor API usage and implement caching
4. **Payment Failures**: Check Razorpay/Stripe webhook configuration
5. **Social Media API**: Verify OAuth tokens and permissions

### Debug Commands
```bash
# Check database connection
node -e "console.log('Testing DB connection...')"

# Verify environment variables
node -e "console.log(process.env.MONGODB_URI ? 'DB URI set' : 'DB URI missing')"

# Test API endpoints
curl -X GET http://localhost:3000/api/health

# Check logs
tail -f logs/app.log
```

## 📚 Additional Resources

### Documentation Links
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Instagram Business API](https://developers.facebook.com/docs/instagram-api)
- [React Query Documentation](https://tanstack.com/query/latest)

### Deployment Guides
- [Replit Deployment](https://docs.replit.com/hosting/deployments)
- [Vercel Deployment](https://vercel.com/docs/deployments)
- [Railway Deployment](https://docs.railway.app/deployment)
- [Docker Deployment](https://docs.docker.com/get-started/)

## 📝 Recent Changes & Updates

### July 10, 2025 - Logo Asset Migration & Production Build Complete
- ✅ **Logo System Overhaul**: Migrated from image-based to icon-based branding
- ✅ **Asset Dependency Elimination**: Removed all veeforeLogo import references
- ✅ **Consistent Visual Identity**: Implemented Rocket icon in blue containers across all components
- ✅ **Production Build Support**: Created comprehensive build-production.js script
- ✅ **Component Updates**: Fixed OnboardingPremium.tsx, HootsuiteLanding.tsx, SignUpIntegrated.tsx, SignUpWithOnboarding.tsx
- ✅ **Runtime Error Resolution**: Eliminated "veeforeLogo is not defined" errors
- **Impact**: Application now has consistent branding without asset dependencies, ready for production deployment

## 📞 Support

For technical support or questions:
- Email: support@veefore.com
- Documentation: https://docs.veefore.com
- GitHub Issues: https://github.com/your-username/veefore/issues

## 📝 License

This project is proprietary software owned by VEEFED TECHNOLOGIES PRIVATE LIMITED. All rights reserved.

---

**Last Updated**: July 10, 2025
**Version**: 1.0.0
**Author**: VeeFore Development Team