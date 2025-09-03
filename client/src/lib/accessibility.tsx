import { useEffect, useRef } from 'react';

/**
 * P7-3: Comprehensive Accessibility System
 * Provides WCAG-compliant accessibility features for improved user experience
 */

// Screen reader announcements
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Skip links for keyboard navigation
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        data-testid="skip-to-main"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-24 bg-blue-600 text-white p-2 z-50"
        data-testid="skip-to-nav"
      >
        Skip to navigation
      </a>
    </div>
  );
}

// Focus management hook
export function useFocusManagement() {
  const focusedElementRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    focusedElementRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (focusedElementRef.current) {
      focusedElementRef.current.focus();
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  };

  return { saveFocus, restoreFocus, trapFocus };
}

// Keyboard navigation helpers
export function enhanceKeyboardNavigation() {
  // Add escape key handling globally
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals/dropdowns
      const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
      openModals.forEach(modal => {
        const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      });
    }
  });

  // Improve focus visibility
  const style = document.createElement('style');
  style.textContent = `
    .focus-visible:focus {
      outline: 2px solid #2563eb !important;
      outline-offset: 2px !important;
    }
    
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

// ARIA labels and descriptions generator
export const ariaHelpers = {
  generateId: (prefix: string = 'aria') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  describeElement: (elementId: string, description: string) => {
    const descriptionId = `${elementId}-desc`;
    let descEl = document.getElementById(descriptionId);
    
    if (!descEl) {
      descEl = document.createElement('span');
      descEl.id = descriptionId;
      descEl.className = 'sr-only';
      document.body.appendChild(descEl);
    }
    
    descEl.textContent = description;
    
    const element = document.getElementById(elementId);
    if (element) {
      element.setAttribute('aria-describedby', descriptionId);
    }
    
    return descriptionId;
  },

  announceChange: (element: HTMLElement, newValue: string) => {
    const announcement = `${element.getAttribute('aria-label') || 'Value'} changed to ${newValue}`;
    announceToScreenReader(announcement);
  }
};

// Route change announcements for SPAs
export function useRouteAnnouncements() {
  useEffect(() => {
    const announceRouteChange = () => {
      const title = document.title;
      announceToScreenReader(`Navigated to ${title}`, 'assertive');
    };

    // Listen for title changes (indicates route change)
    const observer = new MutationObserver(() => {
      announceRouteChange();
    });

    observer.observe(document.querySelector('title')!, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);
}

// Screen reader announcement function
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Error announcements
export function announceError(message: string) {
  announceToScreenReader(`Error: ${message}`, 'assertive');
}

export function announceSuccess(message: string) {
  announceToScreenReader(`Success: ${message}`, 'polite');
}

// Form accessibility helpers
export const formAccessibility = {
  addRequiredIndicator: (fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.setAttribute('required', 'true');
      field.setAttribute('aria-required', 'true');
      
      // Add visual indicator
      const label = document.querySelector(`label[for="${fieldId}"]`);
      if (label && !label.querySelector('.required-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'required-indicator text-red-500 ml-1';
        indicator.textContent = '*';
        indicator.setAttribute('aria-hidden', 'true');
        label.appendChild(indicator);
      }
    }
  },

  setFieldError: (fieldId: string, errorMessage: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      const errorId = `${fieldId}-error`;
      let errorEl = document.getElementById(errorId);
      
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = errorId;
        errorEl.className = 'text-red-500 text-sm mt-1';
        errorEl.setAttribute('role', 'alert');
        field.parentNode?.appendChild(errorEl);
      }
      
      errorEl.textContent = errorMessage;
      field.setAttribute('aria-describedby', errorId);
      field.setAttribute('aria-invalid', 'true');
      
      announceError(`${field.getAttribute('aria-label') || 'Field'}: ${errorMessage}`);
    }
  },

  clearFieldError: (fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      const errorId = `${fieldId}-error`;
      const errorEl = document.getElementById(errorId);
      
      if (errorEl) {
        errorEl.remove();
      }
      
      field.removeAttribute('aria-describedby');
      field.removeAttribute('aria-invalid');
    }
  }
};

// Color contrast and theme helpers
export const colorContrastHelpers = {
  checkContrast: (foreground: string, background: string): boolean => {
    // Simplified contrast check - in production, use a proper color contrast library
    const getForegroundLuminance = (color: string) => {
      // Basic luminance calculation
      return color.includes('white') || color.includes('light') ? 1 : 0.1;
    };
    
    const getBackgroundLuminance = (color: string) => {
      return color.includes('black') || color.includes('dark') ? 0.1 : 1;
    };
    
    const ratio = (getForegroundLuminance(foreground) + 0.05) / (getBackgroundLuminance(background) + 0.05);
    return ratio >= 4.5; // WCAG AA standard
  },

  ensureHighContrast: () => {
    // Apply high contrast styles if needed
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-contrast: high) {
        * {
          border-color: currentColor !important;
        }
        
        .bg-gray-100 { background-color: #ffffff !important; }
        .bg-gray-200 { background-color: #ffffff !important; }
        .text-gray-600 { color: #000000 !important; }
        .text-gray-500 { color: #000000 !important; }
        
        .dark .bg-gray-800 { background-color: #000000 !important; }
        .dark .bg-gray-700 { background-color: #000000 !important; }
        .dark .text-gray-300 { color: #ffffff !important; }
        .dark .text-gray-400 { color: #ffffff !important; }
      }
    `;
    document.head.appendChild(style);
  }
};

// Motion preferences
export function respectMotionPreferences() {
  const style = document.createElement('style');
  style.textContent = `
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Enhanced ARIA management
export const enhancedAriaHelpers = {
  // Live region management
  createLiveRegion: (id: string, level: 'polite' | 'assertive' = 'polite') => {
    const existing = document.getElementById(id);
    if (existing) return existing;
    
    const region = document.createElement('div');
    region.id = id;
    region.setAttribute('aria-live', level);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  },
  
  // Button state management
  enhanceButton: (button: HTMLElement, options: {
    expanded?: boolean;
    controls?: string;
    pressed?: boolean;
    disabled?: boolean;
  } = {}) => {
    if (options.expanded !== undefined) {
      button.setAttribute('aria-expanded', options.expanded.toString());
    }
    if (options.controls) {
      button.setAttribute('aria-controls', options.controls);
    }
    if (options.pressed !== undefined) {
      button.setAttribute('aria-pressed', options.pressed.toString());
    }
    if (options.disabled) {
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
    }
  },
  
  // Form field enhancement
  enhanceFormField: (field: HTMLElement, options: {
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
  } = {}) => {
    const fieldId = field.id || `field-${Math.random().toString(36).substr(2, 9)}`;
    field.id = fieldId;
    
    if (options.label) {
      field.setAttribute('aria-label', options.label);
    }
    
    if (options.description) {
      const descId = ariaHelpers.describeElement(fieldId, options.description);
      field.setAttribute('aria-describedby', descId);
    }
    
    if (options.required) {
      field.setAttribute('aria-required', 'true');
      field.setAttribute('required', '');
    }
    
    if (options.error) {
      formAccessibility.setFieldError(fieldId, options.error);
    }
  }
};

// Component accessibility enhancers
export const componentA11y = {
  // Card/Article accessibility
  enhanceCard: (card: HTMLElement, options: {
    title?: string;
    description?: string;
    interactive?: boolean;
  } = {}) => {
    card.setAttribute('role', options.interactive ? 'button' : 'article');
    
    if (options.interactive) {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    }
    
    if (options.title) {
      card.setAttribute('aria-label', options.title);
    }
    
    if (options.description) {
      const descId = ariaHelpers.describeElement(card.id || 'card', options.description);
      card.setAttribute('aria-describedby', descId);
    }
  },
  
  // Navigation accessibility
  enhanceNavigation: (nav: HTMLElement) => {
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    
    // Enhance nav links
    const links = nav.querySelectorAll('a, button');
    links.forEach((link, index) => {
      if (link.getAttribute('aria-current') === 'page') {
        announceToScreenReader(`Current page: ${link.textContent}`);
      }
      
      // Add position information for screen readers
      link.setAttribute('aria-setsize', links.length.toString());
      link.setAttribute('aria-posinset', (index + 1).toString());
    });
  },
  
  // Modal/Dialog accessibility
  enhanceDialog: (dialog: HTMLElement, options: {
    title?: string;
    modal?: boolean;
  } = {}) => {
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', options.modal ? 'true' : 'false');
    
    if (options.title) {
      const titleId = `${dialog.id}-title`;
      dialog.setAttribute('aria-labelledby', titleId);
      
      const titleEl = dialog.querySelector('h1, h2, h3, .dialog-title');
      if (titleEl) {
        titleEl.id = titleId;
      }
    }
    
    // Focus management for dialogs
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }
};

// Initialize all accessibility features
export function initializeAccessibility() {
  enhanceKeyboardNavigation();
  colorContrastHelpers.ensureHighContrast();
  respectMotionPreferences();
  
  // Add basic ARIA attributes to the root
  document.body.setAttribute('role', 'application');
  
  // Create global live regions
  enhancedAriaHelpers.createLiveRegion('global-announcements', 'polite');
  enhancedAriaHelpers.createLiveRegion('global-alerts', 'assertive');
  
  // Enhanced focus indicators
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    .a11y-focus-indicator:focus,
    .a11y-focus-indicator:focus-visible {
      outline: 3px solid #2563eb !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2) !important;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .a11y-focus-indicator:focus {
        outline: 3px solid currentColor !important;
        outline-offset: 2px !important;
      }
    }
    
    /* Ensure text is readable */
    .a11y-text-contrast {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    }
    
    .dark .a11y-text-contrast {
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    }
  `;
  document.head.appendChild(focusStyle);
  
  console.log('P7-3: Enhanced accessibility system initialized');
}