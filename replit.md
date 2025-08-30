# VeeFore - AI-Powered Social Media Management Platform

VeeFore is a comprehensive AI-powered social media management platform designed to automate content creation, scheduling, and engagement across various social media platforms. Its purpose is to streamline social media workflows for individuals and businesses, enabling efficient content management and enhanced online presence through intelligent automation and analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**August 30, 2025**
- ✅ Fixed Instagram OAuth redirect issue - changed route from /integrations to /integration
- ✅ Instagram profile pictures now display correctly (fetched from API, not placeholder images)
- ✅ Created comprehensive LOCAL_DEVELOPMENT_SETUP.md for Cursor IDE compatibility
- ✅ Verified OAuth system works with real profile picture fetching
- ✅ Documented preservation of landing page interactive demos and animations
- ✅ CRITICAL FIX: Optimized Firebase authentication for instant loading (removed 5-second delay)
- ✅ Fixed protected route access - unauthenticated users now see loading spinner instead of blank pages
- ✅ Implemented smart authentication state initialization for modern app-like performance
- ✅ Removed problematic catch-all route that interfered with normal auth flow

## System Architecture

VeeFore features a modern web interface built with React and TypeScript, leveraging Tailwind CSS with shadcn/ui components for a consistent design system. State management is handled with React hooks and context, and Vite is used for optimized builds. The backend is built on Node.js with Express.js, utilizing MongoDB for data storage and Firebase Auth for authentication. SendGrid is integrated for email services, and local file storage with a CDN handles media files. The system supports multi-tenant architecture with workspace-based organization, role-based access control, and a credit system for usage-based billing. AI integration is central, automating content generation, response generation, and social media analytics. The platform includes advanced scheduling, real-time analytics sync, and a rule-based automation engine for various social media interactions.

## External Dependencies

-   **MongoDB Atlas**: Cloud database hosting.
-   **SendGrid**: Email delivery service.
-   **Instagram Business API**: Social media posting and messaging.
-   **Firebase**: Authentication and user session management.
-   **Runway ML**: AI video generation capabilities.
-   **OpenAI**: AI services for content generation, script generation, scene enhancement, voiceover optimization, and various AI insights (e.g., GPT-4o).
-   **Anthropic Claude**: AI services for insights (as a fallback to OpenAI).
-   **ElevenLabs**: AI voiceover generation.
-   **Replicate**: SDXL integration for scene image generation.
-   **ClipDrop**: AI image generation for visual content.
-   **Drizzle Kit**: Database migration and schema management.
-   **shadcn/ui**: Pre-built UI component library.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **TypeScript**: Type-safe development environment.
-   **Razorpay**: Primary payment gateway.
-   **Stripe**: International payment gateway.
-   **YouTube Data API**: For YouTube integrations.
-   **Twitter API v2**: For Twitter integrations.
-   **LinkedIn API**: For LinkedIn integrations.
-   **Perplexity APIs**: For additional AI services.

## Development Setup

**Local Development**: Complete setup guide available in `LOCAL_DEVELOPMENT_SETUP.md`
- Supports both Replit and Cursor IDE environments
- Preserves all interactive landing page demos and animations
- Maintains complete authentication flow (Firebase + Google OAuth)
- Ensures waitlist system with OTP verification works correctly
- No modifications required to existing components or UI
- Asset management system preserves 500+ generated images for landing demos

**Key Configuration Files**:
- `vite.config.ts`: Auto-detects environment (Replit vs local)
- `.env.example`: Complete environment variable template
- `attached_assets/`: Critical image assets for landing page demos
- `server/index.ts`: Production-ready server with proper middleware
- `client/src/App.tsx`: Authentication guards and routing logic with optimized protected route handling
- `client/src/hooks/useFirebaseAuth.ts`: Optimized Firebase auth hook for instant authentication loading
- `client/src/lib/firebase.ts`: Firebase configuration with local persistence for fast authentication

**Architecture Notes**:
- Frontend and backend integrated in single Express server
- MongoDB with Mongoose ODM for data persistence
- React Query for client-side state management
- shadcn/ui + Tailwind CSS for consistent design system
- Optimized Firebase authentication with instant loading and smart state initialization
- Protected route handling with proper loading states and fallbacks for unauthenticated access