import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

/**
 * P7-1: Dynamic SEO Management Component
 * Provides comprehensive meta tag management for optimal search engine optimization
 */
export function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription, 
  ogImage,
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  structuredData
}: SEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        if (selector.includes('property')) {
          tag.setAttribute('property', selector.split('="')[1].split('"')[0]);
        } else {
          tag.setAttribute('name', selector.split('="')[1].split('"')[0]);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Update basic meta tags
    if (description) {
      updateMetaTag('meta[name="description"]', description);
    }
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    // Update Open Graph tags
    if (ogTitle) {
      updateMetaTag('meta[property="og:title"]', ogTitle);
    }
    if (ogDescription) {
      updateMetaTag('meta[property="og:description"]', ogDescription);
    }
    if (ogImage) {
      updateMetaTag('meta[property="og:image"]', ogImage);
    }
    if (ogUrl) {
      updateMetaTag('meta[property="og:url"]', ogUrl);
    }

    // Update Twitter tags
    if (twitterTitle) {
      updateMetaTag('meta[property="twitter:title"]', twitterTitle);
    }
    if (twitterDescription) {
      updateMetaTag('meta[property="twitter:description"]', twitterDescription);
    }
    if (twitterImage) {
      updateMetaTag('meta[property="twitter:image"]', twitterImage);
    }

    // Update canonical URL
    if (canonicalUrl) {
      let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    }

    // Add structured data (JSON-LD)
    if (structuredData) {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterTitle, twitterDescription, twitterImage, canonicalUrl, structuredData]);

  return null; // This component doesn't render anything
}

/**
 * P7-1: SEO Configuration for different page types
 */
export const seoConfig = {
  default: {
    title: "VeeFore - Professional Social Media Management",
    description: "AI-powered social media management platform. Automate content creation, scheduling, and engagement across Instagram, Twitter, and LinkedIn with advanced analytics and automation.",
    keywords: "social media management, AI automation, Instagram automation, content creation, social media analytics, engagement automation, social media scheduling",
    ogImage: "https://veefore.com/og-image.jpg",
    ogUrl: "https://veefore.com/"
  },
  
  dashboard: {
    title: "Dashboard - VeeFore Social Media Management",
    description: "Comprehensive social media dashboard with real-time analytics, performance insights, and content management for Instagram, Twitter, and LinkedIn.",
    keywords: "social media dashboard, analytics dashboard, social media metrics, performance tracking, content management",
    ogTitle: "Social Media Dashboard - VeeFore",
    ogDescription: "Track your social media performance with real-time analytics, engagement metrics, and comprehensive insights across all platforms.",
    canonicalUrl: "https://veefore.com/dashboard"
  },
  
  analytics: {
    title: "Analytics - VeeFore Social Media Insights",
    description: "Advanced social media analytics with detailed performance metrics, audience insights, engagement tracking, and ROI measurement across all platforms.",
    keywords: "social media analytics, engagement metrics, audience insights, social media ROI, performance tracking, analytics dashboard",
    ogTitle: "Social Media Analytics - VeeFore",
    ogDescription: "Get deep insights into your social media performance with advanced analytics, audience demographics, and engagement trends.",
    canonicalUrl: "https://veefore.com/analytics"
  },
  
  automation: {
    title: "Automation - VeeFore Social Media Automation",
    description: "Advanced social media automation tools. Automate content posting, engagement, commenting, following, and story interactions with AI-powered rules.",
    keywords: "social media automation, Instagram automation, auto-posting, engagement automation, content scheduling, social media bots",
    ogTitle: "Social Media Automation - VeeFore",
    ogDescription: "Automate your social media presence with intelligent automation tools for posting, engagement, and growth across all platforms.",
    canonicalUrl: "https://veefore.com/automation"
  },
  
  integration: {
    title: "Integrations - Connect Your Social Media Accounts",
    description: "Connect and manage multiple social media accounts including Instagram, Twitter, LinkedIn, TikTok, and Facebook from one unified platform.",
    keywords: "social media integration, connect Instagram, social media accounts, multi-platform management, social media connection",
    ogTitle: "Social Media Integrations - VeeFore",
    ogDescription: "Connect all your social media accounts to VeeFore and manage them from one powerful dashboard with unified analytics and automation.",
    canonicalUrl: "https://veefore.com/integration"
  },
  
  videoGenerator: {
    title: "AI Video Generator - Create Professional Videos",
    description: "Generate professional AI videos with automated voiceovers, captions, and effects. Create engaging content for social media in minutes.",
    keywords: "AI video generator, video creation, automated videos, social media videos, AI voiceover, video content creation",
    ogTitle: "AI Video Generator - VeeFore",
    ogDescription: "Create stunning AI-generated videos for social media with automated voiceovers, captions, and professional effects in minutes.",
    canonicalUrl: "https://veefore.com/video-generator"
  },

  landing: {
    title: "VeeFore - AI-Powered Social Media Management Platform",
    description: "Transform your social media presence with VeeFore's AI-powered content creation, automated scheduling, comprehensive analytics, and intelligent automation tools.",
    keywords: "social media management, AI automation, content creation, social media scheduling, Instagram automation, social media analytics, AI social media tools",
    ogTitle: "VeeFore - AI-Powered Social Media Management",
    ogDescription: "Join thousands of creators and businesses using VeeFore to automate their social media success with AI-powered tools.",
    canonicalUrl: "https://veefore.com/"
  },

  veeGPT: {
    title: "VeeGPT - AI Assistant for Social Media Content",
    description: "Intelligent AI assistant for creating engaging social media content, captions, hashtags, and content strategies. Powered by advanced AI technology.",
    keywords: "AI assistant, social media content, AI writing, content creation, social media captions, hashtag generator, AI copywriting",
    ogTitle: "VeeGPT - AI Content Assistant",
    ogDescription: "Create compelling social media content with VeeGPT, your intelligent AI assistant for captions, hashtags, and content strategy.",
    canonicalUrl: "https://veefore.com/veegpt"
  },

  profile: {
    title: "Profile Settings - VeeFore Account Management",
    description: "Manage your VeeFore account settings, profile information, billing details, and preferences for your social media management platform.",
    keywords: "account settings, profile management, user preferences, billing settings, account configuration",
    ogTitle: "Profile Settings - VeeFore",
    ogDescription: "Customize your VeeFore experience with comprehensive account and profile management options.",
    canonicalUrl: "https://veefore.com/profile"
  },

  settings: {
    title: "Settings - VeeFore Configuration & Preferences",
    description: "Configure your VeeFore workspace settings, notifications, integrations, and platform preferences for optimal social media management.",
    keywords: "settings, configuration, preferences, notifications, workspace settings, platform configuration",
    ogTitle: "Settings - VeeFore",
    ogDescription: "Optimize your VeeFore experience with comprehensive settings and configuration options.",
    canonicalUrl: "https://veefore.com/settings"
  }
};

// Export seoConfig for component compatibility
export const seoConfig = {
  landing: {
    title: "VeeFore - AI-Powered Social Media Management Platform",
    description: "Transform your social media presence with VeeFore's AI-powered content creation, automated scheduling, comprehensive analytics, and intelligent automation tools.",
    keywords: "social media management, AI automation, content creation, social media scheduling, Instagram automation, social media analytics, AI social media tools",
    ogTitle: "VeeFore - AI-Powered Social Media Management",
    ogDescription: "Join thousands of creators and businesses using VeeFore to automate their social media success with AI-powered tools.",
    canonicalUrl: "https://veefore.com/"
  },

  veeGPT: {
    title: "VeeGPT - AI Assistant for Social Media Content",
    description: "Intelligent AI assistant for creating engaging social media content, captions, hashtags, and content strategies. Powered by advanced AI technology.",
    keywords: "AI assistant, social media content, AI writing, content creation, social media captions, hashtag generator, AI copywriting",
    ogTitle: "VeeGPT - AI Content Assistant",
    ogDescription: "Create compelling social media content with VeeGPT, your intelligent AI assistant for captions, hashtags, and content strategy.",
    canonicalUrl: "https://veefore.com/veegpt"
  },

  profile: {
    title: "Profile Settings - VeeFore Account Management",
    description: "Manage your VeeFore account settings, profile information, billing details, and preferences for your social media management platform.",
    keywords: "account settings, profile management, user preferences, billing settings, account configuration",
    ogTitle: "Profile Settings - VeeFore",
    ogDescription: "Customize your VeeFore experience with comprehensive account and profile management options.",
    canonicalUrl: "https://veefore.com/profile"
  },

  settings: {
    title: "Settings - VeeFore Configuration & Preferences",
    description: "Configure your VeeFore workspace settings, notifications, integrations, and platform preferences for optimal social media management.",
    keywords: "settings, configuration, preferences, notifications, workspace settings, platform configuration",
    ogTitle: "Settings - VeeFore",
    ogDescription: "Optimize your VeeFore experience with comprehensive settings and configuration options.",
    canonicalUrl: "https://veefore.com/settings"
  },

  analytics: {
    title: "Analytics Dashboard - VeeFore Social Media Insights",
    description: "Comprehensive social media analytics and insights dashboard. Track performance, engagement, and growth across all your social media platforms.",
    keywords: "social media analytics, performance tracking, engagement metrics, social media insights, analytics dashboard",
    ogTitle: "Analytics Dashboard - VeeFore",
    ogDescription: "Get deep insights into your social media performance with VeeFore's comprehensive analytics dashboard.",
    canonicalUrl: "https://veefore.com/analytics"
  }
};

/**
 * P7-2: Structured Data Generator for JSON-LD
 */
export const generateStructuredData = {
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VeeFore",
    "description": "AI-powered social media management platform for businesses and creators.",
    "url": "https://veefore.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://veefore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }),

  softwareApplication: () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VeeFore",
    "applicationCategory": "BusinessApplication",
    "description": "Professional social media management platform with AI-powered automation, analytics, and content creation tools.",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "category": "subscription"
    },
    "featureList": [
      "Social Media Automation",
      "Content Creation",
      "Analytics Dashboard",
      "Multi-Platform Management",
      "AI Video Generation",
      "Engagement Automation"
    ]
  }),

  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VeeFore",
    "description": "Leading provider of AI-powered social media management solutions.",
    "url": "https://veefore.com",
    "logo": "https://veefore.com/logo.png",
    "sameAs": [
      "https://twitter.com/veefore",
      "https://linkedin.com/company/veefore",
      "https://instagram.com/veefore"
    ]
  })
};