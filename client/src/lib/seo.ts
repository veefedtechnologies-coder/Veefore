/**
 * P6-1: Comprehensive SEO Optimization System
 * 
 * Production-grade SEO implementation with dynamic meta tags,
 * structured data, Open Graph, Twitter Cards, and sitemap generation
 */

/**
 * P6-1.1: SEO configuration and interfaces
 */
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: OpenGraphConfig;
  twitterCard?: TwitterCardConfig;
  structuredData?: StructuredDataConfig;
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
}

export interface TwitterCardConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'WebSite' | 'Article' | 'Product' | 'SoftwareApplication';
  data: Record<string, any>;
}

/**
 * P6-1.2: Default SEO configuration
 */
export const DEFAULT_SEO: SEOConfig = {
  title: 'VeeFore - Professional Social Media Management Platform',
  description: 'Transform your social media presence with VeeFore\'s AI-powered content creation, automated scheduling, and comprehensive analytics for Instagram, Twitter, LinkedIn, and more.',
  keywords: [
    'social media management',
    'AI content creation',
    'Instagram automation',
    'social media analytics',
    'content scheduling',
    'social media marketing',
    'digital marketing tools',
    'brand management',
    'social media strategy',
    'influencer tools'
  ],
  openGraph: {
    type: 'website',
    siteName: 'VeeFore',
    locale: 'en_US'
  },
  twitterCard: {
    card: 'summary_large_image',
    site: '@VeeFore',
    creator: '@VeeFore'
  },
  structuredData: {
    type: 'SoftwareApplication',
    data: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'VeeFore',
      description: 'Professional Social Media Management Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '1250'
      }
    }
  }
};

/**
 * P6-1.3: Page-specific SEO configurations
 */
export const PAGE_SEO: Record<string, Partial<SEOConfig>> = {
  '/': {
    title: 'VeeFore - AI-Powered Social Media Management Platform',
    description: 'Transform your social media presence with VeeFore\'s AI-powered content creation, automated scheduling, and comprehensive analytics. Start your free trial today.',
    canonical: '/',
    openGraph: {
      title: 'VeeFore - AI-Powered Social Media Management',
      description: 'Transform your social media presence with AI-powered tools',
      image: '/og-images/homepage.jpg',
      type: 'website'
    }
  },
  '/dashboard': {
    title: 'Dashboard - VeeFore Social Media Management',
    description: 'Monitor your social media performance with real-time analytics, engagement metrics, and growth insights across all your connected accounts.',
    canonical: '/dashboard',
    noindex: true, // Private dashboard
    openGraph: {
      title: 'Social Media Dashboard - VeeFore',
      description: 'Real-time social media analytics and insights'
    }
  },
  '/automation': {
    title: 'Social Media Automation - VeeFore',
    description: 'Automate your social media engagement with intelligent rules for likes, comments, follows, and DMs. Boost your presence 24/7 with VeeFore automation.',
    canonical: '/automation',
    keywords: ['social media automation', 'Instagram automation', 'auto engagement', 'social media bot'],
    openGraph: {
      title: 'Social Media Automation Tools - VeeFore',
      description: 'Automate engagement and grow your social media presence 24/7',
      image: '/og-images/automation.jpg'
    }
  },
  '/analytics': {
    title: 'Social Media Analytics - VeeFore',
    description: 'Deep dive into your social media performance with comprehensive analytics, competitor insights, and actionable growth recommendations.',
    canonical: '/analytics',
    keywords: ['social media analytics', 'Instagram insights', 'social media metrics', 'performance tracking'],
    openGraph: {
      title: 'Advanced Social Media Analytics - VeeFore',
      description: 'Comprehensive social media analytics and insights',
      image: '/og-images/analytics.jpg'
    }
  },
  '/integrations': {
    title: 'Social Media Integrations - VeeFore',
    description: 'Connect your Instagram, Twitter, LinkedIn, and other social media accounts to VeeFore for unified management and automation.',
    canonical: '/integrations',
    keywords: ['social media integration', 'Instagram API', 'Twitter integration', 'LinkedIn connection'],
    openGraph: {
      title: 'Social Media Platform Integrations - VeeFore',
      description: 'Connect all your social media accounts in one place',
      image: '/og-images/integrations.jpg'
    }
  },
  '/ai-assistant': {
    title: 'AI Content Assistant - VeeFore',
    description: 'Generate engaging social media content with VeeFore\'s AI assistant. Create posts, captions, hashtags, and stories optimized for maximum engagement.',
    canonical: '/ai-assistant',
    keywords: ['AI content creation', 'social media AI', 'content generation', 'AI copywriting'],
    openGraph: {
      title: 'AI-Powered Content Creation - VeeFore',
      description: 'Generate engaging social media content with AI',
      image: '/og-images/ai-assistant.jpg'
    }
  },
  '/login': {
    title: 'Login - VeeFore Social Media Management',
    description: 'Log in to your VeeFore account to access your social media dashboard, analytics, and automation tools.',
    canonical: '/login',
    noindex: true, // Login pages shouldn't be indexed
    openGraph: {
      title: 'Login to VeeFore',
      description: 'Access your social media management dashboard'
    }
  },
  '/signup': {
    title: 'Sign Up - Start Your Free VeeFore Trial',
    description: 'Join thousands of creators and businesses using VeeFore to grow their social media presence. Start your free trial - no credit card required.',
    canonical: '/signup',
    openGraph: {
      title: 'Start Your Free Trial - VeeFore',
      description: 'Join thousands using VeeFore to grow their social media',
      image: '/og-images/signup.jpg'
    }
  },
  '/pricing': {
    title: 'Pricing Plans - VeeFore Social Media Management',
    description: 'Choose the perfect VeeFore plan for your social media needs. From personal creators to large businesses, we have affordable plans for everyone.',
    canonical: '/pricing',
    keywords: ['social media management pricing', 'VeeFore plans', 'Instagram management cost'],
    openGraph: {
      title: 'VeeFore Pricing Plans',
      description: 'Affordable social media management for everyone',
      image: '/og-images/pricing.jpg'
    }
  }
};

/**
 * P6-1.4: Dynamic SEO manager class
 */
export class SEOManager {
  private static instance: SEOManager;
  private currentConfig: SEOConfig = DEFAULT_SEO;

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  /**
   * P6-1.4a: Update SEO for current page
   */
  updatePageSEO(path: string, customConfig?: Partial<SEOConfig>): void {
    // Get page-specific config
    const pageConfig = PAGE_SEO[path] || {};
    
    // Merge configurations: default < page-specific < custom
    this.currentConfig = {
      ...DEFAULT_SEO,
      ...pageConfig,
      ...customConfig,
      openGraph: {
        ...DEFAULT_SEO.openGraph,
        ...pageConfig.openGraph,
        ...customConfig?.openGraph
      },
      twitterCard: {
        ...DEFAULT_SEO.twitterCard,
        ...pageConfig.twitterCard,
        ...customConfig?.twitterCard
      }
    };

    // Apply SEO changes to document
    this.applyToDocument();
  }

  /**
   * P6-1.4b: Apply SEO configuration to document
   */
  private applyToDocument(): void {
    // Update document title
    document.title = this.currentConfig.title;

    // Update meta tags
    this.updateMetaTag('description', this.currentConfig.description);
    
    if (this.currentConfig.keywords) {
      const keywordsStr = Array.isArray(this.currentConfig.keywords) 
        ? this.currentConfig.keywords.join(', ')
        : this.currentConfig.keywords;
      this.updateMetaTag('keywords', keywordsStr);
    }

    // Update robots meta tag
    const robotsContent = [
      this.currentConfig.noindex ? 'noindex' : 'index',
      this.currentConfig.nofollow ? 'nofollow' : 'follow'
    ].join(', ');
    this.updateMetaTag('robots', robotsContent);

    // Update canonical link
    if (this.currentConfig.canonical) {
      this.updateCanonicalLink(this.currentConfig.canonical);
    }

    // Update Open Graph tags
    if (this.currentConfig.openGraph) {
      this.updateOpenGraphTags(this.currentConfig.openGraph);
    }

    // Update Twitter Card tags
    if (this.currentConfig.twitterCard) {
      this.updateTwitterCardTags(this.currentConfig.twitterCard);
    }

    // Update structured data
    if (this.currentConfig.structuredData) {
      this.updateStructuredData(this.currentConfig.structuredData);
    }
  }

  /**
   * P6-1.4c: Update meta tag helper
   */
  private updateMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  /**
   * P6-1.4d: Update property meta tag helper
   */
  private updatePropertyMetaTag(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  /**
   * P6-1.4e: Update canonical link
   */
  private updateCanonicalLink(href: string): void {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    
    // Make URL absolute
    const baseUrl = window.location.origin;
    canonical.href = href.startsWith('http') ? href : `${baseUrl}${href}`;
  }

  /**
   * P6-1.4f: Update Open Graph tags
   */
  private updateOpenGraphTags(og: OpenGraphConfig): void {
    const baseUrl = window.location.origin;
    
    if (og.title) this.updatePropertyMetaTag('og:title', og.title);
    if (og.description) this.updatePropertyMetaTag('og:description', og.description);
    if (og.type) this.updatePropertyMetaTag('og:type', og.type);
    if (og.siteName) this.updatePropertyMetaTag('og:site_name', og.siteName);
    if (og.locale) this.updatePropertyMetaTag('og:locale', og.locale);
    
    if (og.url) {
      const fullUrl = og.url.startsWith('http') ? og.url : `${baseUrl}${og.url}`;
      this.updatePropertyMetaTag('og:url', fullUrl);
    } else {
      this.updatePropertyMetaTag('og:url', window.location.href);
    }
    
    if (og.image) {
      const fullImageUrl = og.image.startsWith('http') ? og.image : `${baseUrl}${og.image}`;
      this.updatePropertyMetaTag('og:image', fullImageUrl);
      
      if (og.imageWidth) this.updatePropertyMetaTag('og:image:width', og.imageWidth.toString());
      if (og.imageHeight) this.updatePropertyMetaTag('og:image:height', og.imageHeight.toString());
      if (og.imageAlt) this.updatePropertyMetaTag('og:image:alt', og.imageAlt);
    }
  }

  /**
   * P6-1.4g: Update Twitter Card tags
   */
  private updateTwitterCardTags(twitter: TwitterCardConfig): void {
    const baseUrl = window.location.origin;
    
    if (twitter.card) this.updateMetaTag('twitter:card', twitter.card);
    if (twitter.site) this.updateMetaTag('twitter:site', twitter.site);
    if (twitter.creator) this.updateMetaTag('twitter:creator', twitter.creator);
    if (twitter.title) this.updateMetaTag('twitter:title', twitter.title);
    if (twitter.description) this.updateMetaTag('twitter:description', twitter.description);
    if (twitter.imageAlt) this.updateMetaTag('twitter:image:alt', twitter.imageAlt);
    
    if (twitter.image) {
      const fullImageUrl = twitter.image.startsWith('http') ? twitter.image : `${baseUrl}${twitter.image}`;
      this.updateMetaTag('twitter:image', fullImageUrl);
    }
  }

  /**
   * P6-1.4h: Update structured data
   */
  private updateStructuredData(structuredData: StructuredDataConfig): void {
    // Remove existing structured data
    const existingLD = document.querySelector('script[type="application/ld+json"]');
    if (existingLD) {
      existingLD.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData.data);
    document.head.appendChild(script);
  }

  /**
   * P6-1.5: Get current SEO configuration
   */
  getCurrentConfig(): SEOConfig {
    return { ...this.currentConfig };
  }

  /**
   * P6-1.6: Generate sitemap data
   */
  generateSitemapData(): Array<{
    url: string;
    lastModified: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }> {
    const baseUrl = window.location.origin;
    const now = new Date().toISOString();

    return [
      {
        url: `${baseUrl}/`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/automation`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9
      },
      {
        url: `${baseUrl}/analytics`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9
      },
      {
        url: `${baseUrl}/integrations`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/ai-assistant`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/signup`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7
      },
      {
        url: `${baseUrl}/pricing`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7
      }
    ];
  }
}

/**
 * P6-1.7: React hook for SEO management
 */
import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useSEO(customConfig?: Partial<SEOConfig>) {
  const [location] = useLocation();
  const seoManager = SEOManager.getInstance();

  useEffect(() => {
    seoManager.updatePageSEO(location, customConfig);
  }, [location, customConfig]);

  return {
    updateSEO: (config: Partial<SEOConfig>) => seoManager.updatePageSEO(location, config),
    getCurrentConfig: () => seoManager.getCurrentConfig(),
    generateSitemap: () => seoManager.generateSitemapData()
  };
}

/**
 * P6-1.8: SEO Component for manual SEO updates
 */
import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  openGraph?: Partial<OpenGraphConfig>;
  twitterCard?: Partial<TwitterCardConfig>;
  structuredData?: StructuredDataConfig;
}

export const SEO: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null; // This component doesn't render anything
};

/**
 * P6-1.9: Initialize SEO system
 */
export function initializeSEO(): void {
  const seoManager = SEOManager.getInstance();
  
  // Set up default SEO for initial page load
  seoManager.updatePageSEO(window.location.pathname);
  
  console.log('🔍 P6-1: SEO optimization system initialized');
}
// Export seoConfig for component compatibility
export const seoConfig = {
  landing: {
    title: "VeeFore - AI-Powered Social Media Management Platform",
    description: "Transform your social media presence with VeeFore's AI-powered content creation, automated scheduling, comprehensive analytics, and intelligent automation tools.",
    keywords: ["social media management", "AI automation", "content creation", "social media scheduling", "Instagram automation", "social media analytics", "AI social media tools"],
    ogTitle: "VeeFore - AI-Powered Social Media Management",
    ogDescription: "Join thousands of creators and businesses using VeeFore to automate their social media success with AI-powered tools.",
    canonicalUrl: "https://veefore.com/"
  },
  analytics: {
    title: "Analytics Dashboard - VeeFore Social Media Insights",
    description: "Comprehensive social media analytics and insights dashboard. Track performance, engagement, and growth across all your social media platforms.",
    keywords: ["social media analytics", "performance tracking", "engagement metrics", "social media insights", "analytics dashboard"],
    ogTitle: "Analytics Dashboard - VeeFore",
    ogDescription: "Get deep insights into your social media performance with VeeFore's comprehensive analytics dashboard.",
    canonicalUrl: "https://veefore.com/analytics"
  }
};

// Structured Data Generator for JSON-LD
export const generateStructuredData = {
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VeeFore",
    "description": "AI-powered social media management platform for businesses and creators.",
    "url": "https://veefore.com"
  }),
  softwareApplication: () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VeeFore",
    "applicationCategory": "BusinessApplication",
    "description": "Professional social media management platform with AI-powered automation, analytics, and content creation tools.",
    "operatingSystem": "Web Browser"
  }),
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VeeFore",
    "description": "Leading provider of AI-powered social media management solutions.",
    "url": "https://veefore.com",
    "logo": "https://veefore.com/logo.png"
  })
};
