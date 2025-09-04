/**
 * P10: ADVANCED PERFORMANCE OPTIMIZATION SYSTEM
 * Core Web Vitals optimization and monitoring
 */

// Core Web Vitals monitoring
export class CoreWebVitals {
  private static metrics: {
    LCP?: number;
    FID?: number;
    CLS?: number;
    INP?: number;
    TTFB?: number;
  } = {};

  /**
   * Initialize Core Web Vitals monitoring
   */
  static initialize(): void {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID) / Interaction to Next Paint (INP)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // Time to First Byte (TTFB)
    this.measureTTFB();

    console.log('📊 P10: Core Web Vitals monitoring initialized');
  }

  /**
   * Monitor Largest Contentful Paint
   */
  private static observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        this.metrics.LCP = lastEntry.startTime;
        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  /**
   * Monitor First Input Delay
   */
  private static observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-input') {
            const fidEntry = entry as any;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            
            this.metrics.FID = fid;
            this.reportMetric('FID', fid);
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    }
  }

  /**
   * Monitor Cumulative Layout Shift
   */
  private static observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        
        this.metrics.CLS = clsValue;
        this.reportMetric('CLS', clsValue);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    }
  }

  /**
   * Measure Time to First Byte
   */
  private static measureTTFB(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
        
        this.metrics.TTFB = ttfb;
        this.reportMetric('TTFB', ttfb);
      }
    }
  }

  /**
   * Report metric to analytics
   */
  private static reportMetric(name: string, value: number): void {
    // Report to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 P10: ${name} = ${value.toFixed(2)}ms`);
    }

    // In production, send to analytics service
    // Example: analytics.track(`web-vital-${name.toLowerCase()}`, { value });
  }

  /**
   * Get current metrics
   */
  static getMetrics(): typeof this.metrics {
    return { ...this.metrics };
  }

  /**
   * Check if metrics meet performance standards
   */
  static getPerformanceScore(): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    details: Record<string, { value?: number; status: 'good' | 'needs-improvement' | 'poor' }>;
  } {
    const details = {
      LCP: {
        value: this.metrics.LCP,
        status: !this.metrics.LCP ? 'good' : 
                this.metrics.LCP <= 2500 ? 'good' : 
                this.metrics.LCP <= 4000 ? 'needs-improvement' : 'poor'
      },
      FID: {
        value: this.metrics.FID,
        status: !this.metrics.FID ? 'good' : 
                this.metrics.FID <= 100 ? 'good' : 
                this.metrics.FID <= 300 ? 'needs-improvement' : 'poor'
      },
      CLS: {
        value: this.metrics.CLS,
        status: !this.metrics.CLS ? 'good' : 
                this.metrics.CLS <= 0.1 ? 'good' : 
                this.metrics.CLS <= 0.25 ? 'needs-improvement' : 'poor'
      },
      TTFB: {
        value: this.metrics.TTFB,
        status: !this.metrics.TTFB ? 'good' : 
                this.metrics.TTFB <= 800 ? 'good' : 
                this.metrics.TTFB <= 1800 ? 'needs-improvement' : 'poor'
      }
    } as const;

    // Calculate score (0-100)
    const scores = Object.values(details).map(detail => {
      if (detail.status === 'good') return 100;
      if (detail.status === 'needs-improvement') return 75;
      return 50;
    });
    
    const score = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    return { score, grade, details };
  }
}

// Resource optimization utilities
export class ResourceOptimizer {
  /**
   * Preload critical resources
   */
  static preloadCriticalResources(): void {
    const criticalResources = [
      { href: '/manifest.json', as: 'fetch', crossorigin: 'anonymous' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700', as: 'style' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }
      document.head.appendChild(link);
    });

    console.log('🚀 P10: Critical resources preloaded');
  }

  /**
   * Implement lazy loading for images
   */
  static initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // Load images 50px before they come into view
        threshold: 0.1
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      // Observer for dynamically added images
      const contentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const lazyImages = element.querySelectorAll('img[data-src]');
              lazyImages.forEach(img => imageObserver.observe(img));
            }
          });
        });
      });

      contentObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      console.log('🖼️ P10: Lazy loading initialized');
    }
  }

  /**
   * Optimize font loading
   */
  static optimizeFonts(): void {
    // Add font-display: swap to existing fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      
      @font-face {
        font-family: 'Space Grotesk';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    console.log('🔤 P10: Font optimization applied');
  }

  /**
   * Prefetch next page resources
   */
  static prefetchNextPage(nextUrl: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = nextUrl;
    document.head.appendChild(link);
  }

  /**
   * Optimize third-party scripts
   */
  static optimizeThirdPartyScripts(): void {
    // Add intersection observer for third-party widgets
    if ('IntersectionObserver' in window) {
      const widgetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const widget = entry.target as HTMLElement;
            const scriptSrc = widget.dataset.script;
            
            if (scriptSrc) {
              const script = document.createElement('script');
              script.src = scriptSrc;
              script.async = true;
              document.head.appendChild(script);
              
              widgetObserver.unobserve(widget);
            }
          }
        });
      });

      document.querySelectorAll('[data-script]').forEach(widget => {
        widgetObserver.observe(widget);
      });
    }

    console.log('🔌 P10: Third-party script optimization initialized');
  }
}

// Bundle optimization utilities
export class BundleOptimizer {
  /**
   * Analyze bundle size and suggest optimizations
   */
  static analyzeBundleSize(): void {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const jsResources = resources.filter(r => r.name.includes('.js'));
      const cssResources = resources.filter(r => r.name.includes('.css'));
      
      const totalJSSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalCSSSize = cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      
      console.log('📦 P10: Bundle Analysis:', {
        jsSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
        cssSize: `${(totalCSSSize / 1024).toFixed(2)} KB`,
        jsFiles: jsResources.length,
        cssFiles: cssResources.length
      });

      // Warn if bundle is too large
      if (totalJSSize > 250 * 1024) { // 250KB
        console.warn('⚠️ P10: JavaScript bundle is large (>250KB). Consider code splitting.');
      }
    }
  }

  /**
   * Implement code splitting recommendations
   */
  static recommendCodeSplitting(): string[] {
    const recommendations: string[] = [];
    
    // Check for large third-party dependencies
    if (document.querySelector('script[src*="chart"]')) {
      recommendations.push('Consider lazy loading chart libraries');
    }
    
    if (document.querySelector('script[src*="editor"]')) {
      recommendations.push('Lazy load rich text editors');
    }
    
    return recommendations;
  }
}

// Memory optimization
export class MemoryOptimizer {
  private static observers: Set<IntersectionObserver | MutationObserver | PerformanceObserver> = new Set();

  /**
   * Monitor memory usage
   */
  static monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      
      console.log('🧠 P10: Memory Usage:', {
        used: `${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });

      // Warn if memory usage is high
      const memoryUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
      if (memoryUsagePercent > 80) {
        console.warn('⚠️ P10: High memory usage detected (>80%)');
      }
    }
  }

  /**
   * Clean up observers and event listeners
   */
  static cleanup(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    
    console.log('🧹 P10: Memory cleanup completed');
  }

  /**
   * Register observer for cleanup
   */
  static registerObserver(observer: IntersectionObserver | MutationObserver | PerformanceObserver): void {
    this.observers.add(observer);
  }
}

// Initialize all performance optimizations
export function initializePerformance(): void {
  CoreWebVitals.initialize();
  ResourceOptimizer.preloadCriticalResources();
  ResourceOptimizer.initializeLazyLoading();
  ResourceOptimizer.optimizeFonts();
  ResourceOptimizer.optimizeThirdPartyScripts();
  BundleOptimizer.analyzeBundleSize();
  MemoryOptimizer.monitorMemoryUsage();
  
  // Monitor performance every 30 seconds
  setInterval(() => {
    MemoryOptimizer.monitorMemoryUsage();
  }, 30000);
  
  console.log('🚀 P10: Performance optimization system initialized');
}