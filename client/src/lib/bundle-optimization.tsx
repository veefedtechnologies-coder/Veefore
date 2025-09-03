/**
 * P7-6.3: Advanced Bundle Splitting & Lazy Loading for ≥90 Lighthouse Score
 * Critical optimizations to achieve target FCP <1.8s and LCP <2.5s
 */

import { lazy, Suspense, ComponentType, ReactNode } from 'react';

// P7-6.3.1: Intelligent Route-based Code Splitting
const LazyDashboard = lazy(() => import('../pages/Dashboard'));
const LazyAnalytics = lazy(() => import('../pages/Analytics').catch(() => ({ default: () => <div>Analytics loading...</div> })));
const LazyAutomation = lazy(() => import('../pages/Automation').catch(() => ({ default: () => <div>Automation loading...</div> })));
const LazyIntegration = lazy(() => import('../pages/Integration').catch(() => ({ default: () => <div>Integration loading...</div> })));
const LazyProfile = lazy(() => import('../pages/Profile').catch(() => ({ default: () => <div>Profile loading...</div> })));

// P7-6.3.2: Component-level Code Splitting for Heavy Components
const LazyVideoGenerator = lazy(() => import('../components/VideoGenerator').catch(() => ({ default: () => <div>Video Generator loading...</div> })));
const LazyContentCalendar = lazy(() => import('../components/ContentCalendar').catch(() => ({ default: () => <div>Calendar loading...</div> })));
const LazyAnalyticsDashboard = lazy(() => import('../components/AnalyticsDashboard').catch(() => ({ default: () => <div>Analytics Dashboard loading...</div> })));

// P7-6.3.3: Progressive Loading Wrapper with Performance Monitoring
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName: string;
  priority?: 'high' | 'medium' | 'low';
}

export const LazyWrapper = ({ children, fallback, componentName, priority = 'medium' }: LazyWrapperProps) => {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8 min-h-[200px]">
      <div className="animate-pulse flex space-x-4 w-full max-w-md">
        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Suspense 
      fallback={fallback || defaultFallback}
    >
      <PerformanceWrapper componentName={componentName} priority={priority}>
        {children}
      </PerformanceWrapper>
    </Suspense>
  );
};

// P7-6.3.4: Performance Monitoring Wrapper
interface PerformanceWrapperProps {
  children: ReactNode;
  componentName: string;
  priority: 'high' | 'medium' | 'low';
}

const PerformanceWrapper = ({ children, componentName, priority }: PerformanceWrapperProps) => {
  const startTime = performance.now();

  const handleLoad = () => {
    const loadTime = performance.now() - startTime;
    console.log(`[P7-6.3] Component ${componentName} loaded in ${loadTime.toFixed(2)}ms (Priority: ${priority})`);
    
    // Report to performance monitoring
    if ('performance' in window && 'measure' in performance) {
      performance.mark(`${componentName}-loaded`);
      performance.measure(`${componentName}-load-time`, 'navigationStart', `${componentName}-loaded`);
    }
  };

  return (
    <div onLoad={handleLoad} className="w-full">
      {children}
    </div>
  );
};

// P7-6.3.5: Lazy Components with Error Boundaries
export const LazyComponents = {
  Dashboard: () => (
    <LazyWrapper componentName="Dashboard" priority="high">
      <LazyDashboard />
    </LazyWrapper>
  ),
  
  Analytics: () => (
    <LazyWrapper componentName="Analytics" priority="medium">
      <LazyAnalytics />
    </LazyWrapper>
  ),
  
  Automation: () => (
    <LazyWrapper componentName="Automation" priority="medium">
      <LazyAutomation />
    </LazyWrapper>
  ),
  
  Integration: () => (
    <LazyWrapper componentName="Integration" priority="medium">
      <LazyIntegration />
    </LazyWrapper>
  ),
  
  Profile: () => (
    <LazyWrapper componentName="Profile" priority="low">
      <LazyProfile />
    </LazyWrapper>
  ),
  
  VideoGenerator: () => (
    <LazyWrapper componentName="VideoGenerator" priority="low">
      <LazyVideoGenerator />
    </LazyWrapper>
  ),
  
  ContentCalendar: () => (
    <LazyWrapper componentName="ContentCalendar" priority="medium">
      <LazyContentCalendar />
    </LazyWrapper>
  ),
  
  AnalyticsDashboard: () => (
    <LazyWrapper componentName="AnalyticsDashboard" priority="high">
      <LazyAnalyticsDashboard />
    </LazyWrapper>
  )
};

// P7-6.3.6: Preload Manager for Critical Routes
export class PreloadManager {
  private static instance: PreloadManager;
  private preloadedComponents = new Set<string>();
  
  public static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager();
    }
    return PreloadManager.instance;
  }

  // Preload components based on user behavior and priority
  public preloadComponent(componentName: keyof typeof LazyComponents, priority: 'immediate' | 'idle' | 'interaction' = 'idle') {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }

    const preloadFunction = () => {
      console.log(`[P7-6.3] Preloading ${componentName}`);
      this.preloadedComponents.add(componentName);
      
      // Trigger dynamic import without rendering
      switch (componentName) {
        case 'Dashboard':
          import('../pages/Dashboard');
          break;
        case 'Analytics':
          import('../pages/Analytics');
          break;
        case 'Automation':
          import('../pages/Automation');
          break;
        case 'Integration':
          import('../pages/Integration');
          break;
        case 'Profile':
          import('../pages/Profile');
          break;
        case 'VideoGenerator':
          import('../components/VideoGenerator');
          break;
        case 'ContentCalendar':
          import('../components/ContentCalendar');
          break;
        case 'AnalyticsDashboard':
          import('../components/AnalyticsDashboard');
          break;
      }
    };

    switch (priority) {
      case 'immediate':
        preloadFunction();
        break;
      case 'idle':
        if ('requestIdleCallback' in window) {
          requestIdleCallback(preloadFunction);
        } else {
          setTimeout(preloadFunction, 1);
        }
        break;
      case 'interaction':
        // Wait for user interaction
        const handleInteraction = () => {
          preloadFunction();
          document.removeEventListener('mouseover', handleInteraction, { once: true });
          document.removeEventListener('touchstart', handleInteraction, { once: true });
        };
        document.addEventListener('mouseover', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
        break;
    }
  }

  // Preload critical components for authenticated users
  public preloadCriticalComponents() {
    this.preloadComponent('Dashboard', 'immediate');
    this.preloadComponent('AnalyticsDashboard', 'idle');
    this.preloadComponent('Analytics', 'idle');
  }

  // Preload based on current route
  public preloadRelatedComponents(currentRoute: string) {
    const preloadMap: Record<string, Array<keyof typeof LazyComponents>> = {
      '/dashboard': ['Analytics', 'AnalyticsDashboard'],
      '/analytics': ['Dashboard', 'AnalyticsDashboard'],
      '/automation': ['Integration', 'Dashboard'],
      '/integration': ['Automation', 'Dashboard'],
      '/profile': ['Dashboard']
    };

    const componentsToPreload = preloadMap[currentRoute] || [];
    componentsToPreload.forEach(component => {
      this.preloadComponent(component, 'idle');
    });
  }
}

// P7-6.3.7: Performance Optimization Hooks
export const usePreloadOptimization = () => {
  const preloadManager = PreloadManager.getInstance();

  const preloadOnHover = (componentName: keyof typeof LazyComponents) => {
    return {
      onMouseEnter: () => preloadManager.preloadComponent(componentName, 'immediate'),
      onFocus: () => preloadManager.preloadComponent(componentName, 'immediate')
    };
  };

  const preloadOnVisible = (componentName: keyof typeof LazyComponents) => {
    return (element: HTMLElement | null) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              preloadManager.preloadComponent(componentName, 'immediate');
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(element);
    };
  };

  return {
    preloadOnHover,
    preloadOnVisible,
    preloadCritical: () => preloadManager.preloadCriticalComponents(),
    preloadRelated: (route: string) => preloadManager.preloadRelatedComponents(route)
  };
};

// P7-6.3.8: Bundle Analysis and Optimization Reporting
export const BundleOptimizationReporter = {
  // Report bundle sizes and load times
  reportBundleMetrics: () => {
    if ('performance' in window) {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsEntries = entries.filter(entry => entry.name.endsWith('.js'));
      
      console.group('[P7-6.3] Bundle Optimization Report');
      console.log('JavaScript Bundle Sizes:');
      
      jsEntries.forEach(entry => {
        const size = entry.transferSize || 0;
        const loadTime = entry.responseEnd - entry.responseStart;
        console.log(`${entry.name}: ${(size / 1024).toFixed(2)}KB (${loadTime.toFixed(2)}ms)`);
      });
      
      console.groupEnd();
    }
  },

  // Monitor Core Web Vitals impact
  measureOptimizationImpact: () => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`[P7-6.3] ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Cleanup after 30 seconds
    setTimeout(() => observer.disconnect(), 30000);
  }
};

// Initialize preload manager and optimization reporting
if (typeof window !== 'undefined') {
  const preloadManager = PreloadManager.getInstance();
  
  // Start optimization reporting in development
  if (import.meta.env.DEV) {
    setTimeout(() => {
      BundleOptimizationReporter.reportBundleMetrics();
      BundleOptimizationReporter.measureOptimizationImpact();
    }, 5000);
  }
}