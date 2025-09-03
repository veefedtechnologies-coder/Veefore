// P7-5: Core Web Vitals Optimization Library
// Comprehensive performance optimization utilities for ≥90 Lighthouse scores

import { useEffect, useCallback, useRef, useState } from 'react'

// P7-5.1: Image Optimization and Lazy Loading
export const useImageOptimization = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  
  const optimizeImage = useCallback((src: string, options?: {
    format?: 'webp' | 'avif' | 'jpeg'
    sizes?: string
  }) => {
    const { format = 'webp', sizes } = options || {}
    
    // Check WebP support
    const supportsWebP = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0
    
    const optimizedSrc = supportsWebP && format === 'webp' 
      ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : src
    
    return { src: optimizedSrc, sizes }
  }, [])
  
  return { optimizeImage, imageRef }
}

// P7-5.2: Critical Resource Preloading
export const preloadCriticalResources = () => {
  useEffect(() => {
    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = fontUrl
      link.onload = () => {
        link.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })
    
    // Preload critical API endpoints
    const criticalAPIs = ['/api/user/profile', '/api/dashboard/stats']
    criticalAPIs.forEach(endpoint => {
      fetch(endpoint, { 
        method: 'HEAD',
        credentials: 'include'
      }).catch(() => {}) // Silent fail for preload
    })
  }, [])
}

// P7-5.3: Layout Shift Prevention
export const useLayoutStabilization = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const stabilizeLayout = useCallback((elements: {
    images?: boolean
    asyncContent?: boolean
    animations?: boolean
  } = {}) => {
    const { images = true, asyncContent = true, animations = true } = elements
    
    if (images && containerRef.current) {
      // Add aspect ratio containers for images
      const imgs = containerRef.current.querySelectorAll('img:not([style*="aspect-ratio"])')
      imgs.forEach(img => {
        const aspectRatio = img.getAttribute('width') && img.getAttribute('height')
          ? `${img.getAttribute('width')} / ${img.getAttribute('height')}`
          : '16 / 9'
        ;(img as HTMLImageElement).style.aspectRatio = aspectRatio
      })
    }
    
    if (asyncContent) {
      // Reserve space for async content
      const asyncElements = containerRef.current?.querySelectorAll('[data-async]')
      asyncElements?.forEach(el => {
        if (!el.getAttribute('style')?.includes('min-height')) {
          ;(el as HTMLElement).style.minHeight = '200px'
        }
      })
    }
    
    if (animations) {
      // Use transform instead of layout-affecting properties
      const animatedElements = containerRef.current?.querySelectorAll('[data-animate]')
      animatedElements?.forEach(el => {
        ;(el as HTMLElement).style.willChange = 'transform, opacity'
      })
    }
  }, [])
  
  useEffect(() => {
    stabilizeLayout()
  }, [stabilizeLayout])
  
  return { containerRef, stabilizeLayout }
}

// P7-5.4: Intersection Observer for Lazy Loading
export const useLazyLoading = (options?: IntersectionObserverInit) => {
  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observerRef.current?.unobserve(element)
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options
      }
    )
    
    observerRef.current.observe(element)
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [options])
  
  return { elementRef, isVisible }
}

// P7-5.5: Resource Hints and Preloading
export const ResourceOptimizer = () => {
  useEffect(() => {
    // DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'api.openai.com',
      'api.anthropic.com'
    ]
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = `//${domain}`
      document.head.appendChild(link)
    })
    
    // Preconnect to critical origins
    const criticalOrigins = ['https://fonts.googleapis.com']
    criticalOrigins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }, [])
  
  return null
}

// P7-5.6: Performance Monitoring and Metrics
export const usePerformanceMonitoring = () => {
  const metricsRef = useRef<{
    lcp?: number
    fid?: number
    cls?: number
    fcp?: number
    ttfb?: number
  }>({})
  
  useEffect(() => {
    // Web Vitals measurement
    const measureWebVitals = () => {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformancePaintTiming
        metricsRef.current.lcp = lastEntry.startTime
        console.log('Web Vital - LCP:', `${lastEntry.startTime.toFixed(2)}ms`)
      }).observe({ entryTypes: ['largest-contentful-paint'] })
      
      // FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as any // PerformanceEventTiming
          if (fidEntry.processingStart) {
            metricsRef.current.fid = fidEntry.processingStart - fidEntry.startTime
            console.log('Web Vital - FID:', `${(fidEntry.processingStart - fidEntry.startTime).toFixed(2)}ms`)
          }
        })
      }).observe({ entryTypes: ['first-input'] })
      
      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            metricsRef.current.cls = clsValue
            console.log('Web Vital - CLS:', `${clsValue.toFixed(2)}ms`)
          }
        })
      }).observe({ entryTypes: ['layout-shift'] })
      
      // FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          metricsRef.current.fcp = entry.startTime
          console.log('Web Vital - FCP:', `${entry.startTime.toFixed(2)}ms`)
        })
      }).observe({ entryTypes: ['paint'] })
      
      // TTFB (Time to First Byte)
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        metricsRef.current.ttfb = navigation.responseStart - navigation.requestStart
        console.log('Web Vital - TTFB:', `${metricsRef.current.ttfb.toFixed(2)}ms`)
      }
    }
    
    // Defer measurement to avoid blocking
    setTimeout(measureWebVitals, 100)
  }, [])
  
  return metricsRef.current
}

// P7-5.7: Critical CSS Inlining
export const inlineCriticalCSS = () => {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    .hero-section { min-height: 100vh; }
    .nav-header { height: 80px; }
    .loading-skeleton { 
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .a11y-focus-indicator:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `
  
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = criticalStyles
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
}

// P7-5.8: Bundle Size Optimization Hook
export const useBundleOptimization = () => {
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)
  
  useEffect(() => {
    // Detect connection quality
    const connection = (navigator as any).connection
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.saveData
      setIsLowBandwidth(isSlowConnection)
    }
  }, [])
  
  const loadFeature = useCallback(async (featureName: string) => {
    // Dynamic import with loading state
    try {
      const module = await import(`../features/${featureName}`)
      return module.default
    } catch (error) {
      console.warn(`Failed to load feature: ${featureName}`, error)
      return null
    }
  }, [])
  
  return { isLowBandwidth, loadFeature }
}

export default {
  useImageOptimization,
  preloadCriticalResources,
  useLayoutStabilization,
  useLazyLoading,
  ResourceOptimizer,
  usePerformanceMonitoring,
  inlineCriticalCSS,
  useBundleOptimization
}