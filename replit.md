# VeeFore - AI-Powered Social Media Management Platform

VeeFore is a comprehensive AI-powered social media management platform designed to automate content creation, scheduling, and engagement across various social media platforms. Its purpose is to streamline social media workflows for individuals and businesses, enabling efficient content management and enhanced online presence through intelligent automation and analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

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