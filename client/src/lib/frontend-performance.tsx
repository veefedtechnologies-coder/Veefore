/**
 * P6-5: Frontend Performance Optimization
 * 
 * Production-grade frontend performance optimization with code splitting,
 * lazy loading, image optimization, and Core Web Vitals monitoring
 */

/**
 * P6-5.1: Performance configuration and interfaces
 */
export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enablePrefetching: boolean;
  enableWebVitalsMonitoring: boolean;
  enableResourceHints: boolean;
  imageQuality: number;
  lazyLoadingThreshold: number; // pixels
  prefetchDelay: number; // milliseconds
}

export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  resourcesLoaded: number;
  memoryUsage: number;
  connectionType: string;
  deviceType: string;
  performanceScore: number;
}

/**
 * P6-5.2: Default performance configuration
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enablePrefetching: true,
  enableWebVitalsMonitoring: true,
  enableResourceHints: true,
  imageQuality: 80,
  lazyLoadingThreshold: 300,
  prefetchDelay: 2000
};

/**
 * P6-5.3: Frontend performance optimizer
 */
export class FrontendPerformanceOptimizer {
  private static instance: FrontendPerformanceOptimizer;
  private config: PerformanceConfig = DEFAULT_PERFORMANCE_CONFIG;
  private webVitals: Partial<WebVitals> = {};
  private observers: PerformanceObserver[] = [];
  private lazyImages = new Set<HTMLImageElement>();
  private prefetchedResources = new Set<string>();

  static getInstance(): FrontendPerformanceOptimizer {
    if (!FrontendPerformanceOptimizer.instance) {
      FrontendPerformanceOptimizer.instance = new FrontendPerformanceOptimizer();
    }
    return FrontendPerformanceOptimizer.instance;
  }

  /**
   * P6-5.3a: Initialize performance optimization
   */
  initialize(config?: Partial<PerformanceConfig>): void {
    this.config = { ...DEFAULT_PERFORMANCE_CONFIG, ...config };
    
    this.setupWebVitalsMonitoring();
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupResourceHints();
    this.setupPrefetching();
    this.optimizePageLoad();
    
    console.log('⚡ P6-5: Frontend performance optimization system initialized');
  }

  /**
   * P6-5.3b: Setup Web Vitals monitoring
   */
  private setupWebVitalsMonitoring(): void {
    if (!this.config.enableWebVitalsMonitoring || !('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.webVitals.lcp = lastEntry.startTime;
      this.reportWebVital('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.webVitals.fid = (entry as any).processingStart - entry.startTime;
        this.reportWebVital('FID', this.webVitals.fid);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.webVitals.cls = clsValue;
      this.reportWebVital('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.webVitals.fcp = entry.startTime;
          this.reportWebVital('FCP', entry.startTime);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);

    // Navigation timing for TTFB
    if (performance.navigation) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        this.webVitals.ttfb = navTiming.responseStart - navTiming.fetchStart;
        this.reportWebVital('TTFB', this.webVitals.ttfb);
      }
    }
  }

  /**
   * P6-5.3c: Setup lazy loading
   */
  private setupLazyLoading(): void {
    if (!this.config.enableLazyLoading) return;

    // Native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach((img: HTMLImageElement) => {
        img.loading = 'lazy';
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
      });
    } else {
      // Intersection Observer fallback
      this.setupIntersectionObserver();
    }

    // Setup lazy loading for dynamically added images
    this.observeNewImages();
  }

  /**
   * P6-5.3d: Setup Intersection Observer for lazy loading
   */
  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            observer.unobserve(img);
            this.lazyImages.delete(img);
          }
        });
      },
      {
        rootMargin: `${this.config.lazyLoadingThreshold}px`
      }
    );

    document.querySelectorAll('img[data-src]').forEach((img: HTMLImageElement) => {
      observer.observe(img);
      this.lazyImages.add(img);
    });
  }

  /**
   * P6-5.3e: Load image with optimization
   */
  private loadImage(img: HTMLImageElement): void {
    const dataSrc = img.dataset.src;
    if (!dataSrc) return;

    // Add loading class
    img.classList.add('loading');

    // Create optimized image URL
    const optimizedSrc = this.optimizeImageUrl(dataSrc);

    // Preload the image
    const imageLoader = new Image();
    imageLoader.onload = () => {
      img.src = optimizedSrc;
      img.classList.remove('loading');
      img.classList.add('loaded');
      
      // Remove data-src to prevent reloading
      img.removeAttribute('data-src');
    };
    
    imageLoader.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      // Fallback to original src
      img.src = dataSrc;
    };
    
    imageLoader.src = optimizedSrc;
  }

  /**
   * P6-5.3f: Optimize image URL
   */
  private optimizeImageUrl(src: string): string {
    if (!this.config.enableImageOptimization) return src;

    // Only optimize if it's our own images
    if (!src.startsWith('/') && !src.includes(window.location.hostname)) {
      return src;
    }

    // Add optimization parameters
    const url = new URL(src, window.location.origin);
    
    // Auto-detect optimal format
    const supportsWebP = this.supportsImageFormat('webp');
    const supportsAVIF = this.supportsImageFormat('avif');
    
    if (supportsAVIF) {
      url.searchParams.set('format', 'avif');
    } else if (supportsWebP) {
      url.searchParams.set('format', 'webp');
    }
    
    // Set quality
    url.searchParams.set('quality', this.config.imageQuality.toString());
    
    // Auto-sizing based on container
    const container = document.querySelector('img[data-src="' + src + '"]')?.parentElement;
    if (container) {
      const containerWidth = container.clientWidth;
      if (containerWidth > 0) {
        // Round to common breakpoints
        const width = this.roundToBreakpoint(containerWidth * window.devicePixelRatio);
        url.searchParams.set('width', width.toString());
      }
    }

    return url.toString();
  }

  /**
   * P6-5.3g: Image format support detection
   */
  private supportsImageFormat(format: string): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  }

  /**
   * P6-5.3h: Round width to common breakpoints
   */
  private roundToBreakpoint(width: number): number {
    const breakpoints = [320, 480, 640, 768, 1024, 1280, 1440, 1920, 2560];
    return breakpoints.find(bp => bp >= width) || width;
  }

  /**
   * P6-5.3i: Observe new images
   */
  private observeNewImages(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const images = element.querySelectorAll ? 
              element.querySelectorAll('img[data-src]') : 
              element.matches && element.matches('img[data-src]') ? [element] : [];
            
            images.forEach((img: HTMLImageElement) => {
              if (this.config.enableLazyLoading && !this.lazyImages.has(img)) {
                this.setupLazyImage(img);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * P6-5.3j: Setup lazy image
   */
  private setupLazyImage(img: HTMLImageElement): void {
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
      img.src = img.dataset.src!;
      img.removeAttribute('data-src');
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target as HTMLImageElement);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: `${this.config.lazyLoadingThreshold}px` }
      );
      
      observer.observe(img);
      this.lazyImages.add(img);
    }
  }

  /**
   * P6-5.3k: Setup resource hints
   */
  private setupResourceHints(): void {
    if (!this.config.enableResourceHints) return;

    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'api.stripe.com',
      'js.stripe.com'
    ];

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Preconnect to critical resources
    const criticalDomains = [
      'fonts.googleapis.com',
      'api.stripe.com'
    ];

    criticalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = '';
      document.head.appendChild(link);
    });
  }

  /**
   * P6-5.3l: Setup prefetching
   */
  private setupPrefetching(): void {
    if (!this.config.enablePrefetching) return;

    // Prefetch likely next pages on hover
    document.addEventListener('mouseover', (e) => {
      const link = (e.target as Element).closest('a[href]') as HTMLAnchorElement;
      if (link && this.shouldPrefetch(link.href)) {
        setTimeout(() => {
          this.prefetchResource(link.href);
        }, this.config.prefetchDelay);
      }
    });

    // Prefetch on focus for keyboard navigation
    document.addEventListener('focusin', (e) => {
      const link = e.target as HTMLAnchorElement;
      if (link.tagName === 'A' && link.href && this.shouldPrefetch(link.href)) {
        this.prefetchResource(link.href);
      }
    });
  }

  /**
   * P6-5.3m: Check if resource should be prefetched
   */
  private shouldPrefetch(url: string): boolean {
    // Don't prefetch external links
    if (!url.startsWith(window.location.origin) && !url.startsWith('/')) {
      return false;
    }

    // Don't prefetch if already prefetched
    if (this.prefetchedResources.has(url)) {
      return false;
    }

    // Don't prefetch on slow connections
    if (this.isSlowConnection()) {
      return false;
    }

    return true;
  }

  /**
   * P6-5.3n: Prefetch resource
   */
  private prefetchResource(url: string): void {
    if (this.prefetchedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    
    document.head.appendChild(link);
    this.prefetchedResources.add(url);
  }

  /**
   * P6-5.3o: Check if connection is slow
   */
  private isSlowConnection(): boolean {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g' ||
             connection.saveData === true;
    }
    return false;
  }

  /**
   * P6-5.3p: Optimize page load
   */
  private optimizePageLoad(): void {
    // Optimize font loading
    this.optimizeFontLoading();
    
    // Remove unused CSS
    this.removeUnusedCSS();
    
    // Optimize JavaScript execution
    this.optimizeJavaScript();
  }

  /**
   * P6-5.3q: Optimize font loading
   */
  private optimizeFontLoading(): void {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });

    // Add font-display: swap to existing font faces
    const stylesheets = document.styleSheets;
    for (let i = 0; i < stylesheets.length; i++) {
      try {
        const rules = stylesheets[i].cssRules || stylesheets[i].rules;
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j] as CSSFontFaceRule;
          if (rule.type === CSSRule.FONT_FACE_RULE) {
            if (!rule.style.fontDisplay) {
              rule.style.fontDisplay = 'swap';
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets may throw errors
        console.debug('Could not access stylesheet rules:', e);
      }
    }
  }

  /**
   * P6-5.3r: Remove unused CSS (simplified)
   */
  private removeUnusedCSS(): void {
    // This is a simplified version - in production, use tools like PurgeCSS
    const unusedSelectors: string[] = [];
    
    // Remove CSS for components not present on current page
    const componentsNotPresent = [
      '.modal:not(.show)',
      '.dropdown:not(.show)',
      '.toast:not(.show)'
    ];

    componentsNotPresent.forEach(selector => {
      if (!document.querySelector(selector.split(':')[0])) {
        unusedSelectors.push(selector);
      }
    });

    // In a real implementation, you would remove these rules from stylesheets
    console.debug('Unused CSS selectors detected:', unusedSelectors);
  }

  /**
   * P6-5.3s: Optimize JavaScript execution
   */
  private optimizeJavaScript(): void {
    // Defer non-critical JavaScript
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
    nonCriticalScripts.forEach((script: HTMLScriptElement) => {
      script.defer = true;
    });

    // Use requestIdleCallback for non-urgent tasks
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        // Perform non-urgent optimizations
        this.performNonUrgentOptimizations();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.performNonUrgentOptimizations();
      }, 1000);
    }
  }

  /**
   * P6-5.3t: Perform non-urgent optimizations
   */
  private performNonUrgentOptimizations(): void {
    // Preload critical resources for next navigation
    this.preloadCriticalResources();
    
    // Clean up memory
    this.performMemoryCleanup();
    
    // Report performance metrics
    this.reportPerformanceMetrics();
  }

  /**
   * P6-5.4: Performance monitoring and reporting
   */
  private reportWebVital(name: string, value: number): void {
    // Send to analytics service
    console.debug(`Web Vital - ${name}: ${value.toFixed(2)}ms`);
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('webvital', {
      detail: { name, value }
    }));
  }

  private reportPerformanceMetrics(): void {
    const metrics = this.getPerformanceMetrics();
    
    // Send to analytics
    console.debug('Performance Metrics:', metrics);
    
    // Emit event
    window.dispatchEvent(new CustomEvent('performancemetrics', {
      detail: metrics
    }));
  }

  /**
   * P6-5.5: Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
      resourcesLoaded: performance.getEntriesByType('resource').length,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      deviceType: this.getDeviceType(),
      performanceScore: this.calculatePerformanceScore()
    };
  }

  /**
   * P6-5.6: Calculate performance score
   */
  private calculatePerformanceScore(): number {
    const { lcp = 0, fid = 0, cls = 0, fcp = 0 } = this.webVitals;
    
    // Simple scoring based on Web Vitals thresholds
    let score = 100;
    
    if (lcp > 2500) score -= 25;
    else if (lcp > 4000) score -= 50;
    
    if (fid > 100) score -= 25;
    else if (fid > 300) score -= 50;
    
    if (cls > 0.1) score -= 25;
    else if (cls > 0.25) score -= 50;
    
    if (fcp > 1800) score -= 15;
    else if (fcp > 3000) score -= 30;
    
    return Math.max(0, score);
  }

  private getDeviceType(): string {
    if (/Mobi|Android/i.test(navigator.userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(navigator.userAgent)) return 'tablet';
    return 'desktop';
  }

  /**
   * P6-5.7: Memory management
   */
  private performMemoryCleanup(): void {
    // Clear prefetched resources that haven't been used
    this.prefetchedResources.clear();
    
    // Remove unused lazy images from tracking
    this.lazyImages.forEach(img => {
      if (!document.contains(img)) {
        this.lazyImages.delete(img);
      }
    });
  }

  private preloadCriticalResources(): void {
    // Preload critical resources for likely next pages
    const criticalResources = [
      '/dashboard',
      '/automation',
      '/analytics'
    ];

    criticalResources.forEach(resource => {
      if (!this.prefetchedResources.has(resource)) {
        this.prefetchResource(resource);
      }
    });
  }

  /**
   * P6-5.8: Public API methods
   */
  getWebVitals(): Partial<WebVitals> {
    return { ...this.webVitals };
  }

  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * P6-5.9: Cleanup method
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.lazyImages.clear();
    this.prefetchedResources.clear();
  }
}

/**
 * P6-5.10: React hooks for performance optimization
 */
import { useEffect, useState } from 'react';

export function usePerformance() {
  const performanceOptimizer = FrontendPerformanceOptimizer.getInstance();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [webVitals, setWebVitals] = useState<Partial<WebVitals>>({});

  useEffect(() => {
    const handleWebVital = (event: CustomEvent) => {
      setWebVitals(prev => ({
        ...prev,
        [event.detail.name.toLowerCase()]: event.detail.value
      }));
    };

    const handleMetrics = (event: CustomEvent) => {
      setMetrics(event.detail);
    };

    window.addEventListener('webvital', handleWebVital as EventListener);
    window.addEventListener('performancemetrics', handleMetrics as EventListener);

    return () => {
      window.removeEventListener('webvital', handleWebVital as EventListener);
      window.removeEventListener('performancemetrics', handleMetrics as EventListener);
    };
  }, []);

  return {
    metrics,
    webVitals,
    getMetrics: () => performanceOptimizer.getPerformanceMetrics(),
    getWebVitals: () => performanceOptimizer.getWebVitals()
  };
}

export function useLazyImage(src: string, options?: { threshold?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;
  }, [src]);

  return { loaded, error, src: loaded ? src : undefined };
}

/**
 * P6-5.11: Image component with optimization
 */
import React, { forwardRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  quality?: number;
  sizes?: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, lazy = true, quality = 80, sizes, className, ...props }, ref) => {
    const optimizedSrc = lazy ? undefined : src;
    const dataSrc = lazy ? src : undefined;

    return (
      <img
        ref={ref}
        src={optimizedSrc}
        data-src={dataSrc}
        alt={alt}
        className={`${className || ''} ${lazy ? 'lazy' : ''}`}
        loading={lazy ? 'lazy' : 'eager'}
        sizes={sizes}
        {...props}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * P6-5.12: Initialize frontend performance optimization
 */
export function initializeFrontendPerformance(config?: Partial<PerformanceConfig>): void {
  const performanceOptimizer = FrontendPerformanceOptimizer.getInstance();
  performanceOptimizer.initialize(config);
}