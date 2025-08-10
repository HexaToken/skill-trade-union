// Accessibility utilities and helpers for SkillSwap
import { useEffect, useRef } from 'react';

// ARIA utilities
export const ariaUtils = {
  // Generate unique IDs for form associations
  generateId: (prefix: string = 'skillswap') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Common ARIA attributes
  expandedState: (isExpanded: boolean) => ({
    'aria-expanded': isExpanded.toString(),
    'aria-hidden': (!isExpanded).toString()
  }),
  
  loadingState: (isLoading: boolean) => ({
    'aria-busy': isLoading.toString(),
    'aria-live': 'polite' as const
  }),
  
  requiredField: (isRequired: boolean) => ({
    'aria-required': isRequired.toString(),
    required: isRequired
  }),
  
  invalidField: (isInvalid: boolean, errorMessage?: string) => ({
    'aria-invalid': isInvalid.toString(),
    'aria-describedby': isInvalid && errorMessage ? 'error-message' : undefined
  }),
  
  // Navigation helpers
  skipToContent: {
    'aria-label': 'Skip to main content',
    href: '#main-content'
  },
  
  // Button states
  pressedState: (isPressed: boolean) => ({
    'aria-pressed': isPressed.toString()
  }),
  
  // Modal/Dialog states
  dialogProps: (titleId: string, descriptionId?: string) => ({
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId
  })
};

// Focus management hooks
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Focus first element when trap becomes active
    firstElement?.focus();
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
  
  return containerRef;
}

// Auto-focus hook
export function useAutoFocus<T extends HTMLElement>(shouldFocus: boolean = true) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);
  
  return ref;
}

// Keyboard navigation hooks
export function useKeyboardNavigation(
  items: any[],
  onSelect: (index: number) => void,
  options: {
    loop?: boolean;
    homeAndEnd?: boolean;
    onEscape?: () => void;
  } = {}
) {
  const { loop = true, homeAndEnd = true, onEscape } = options;
  
  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1;
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0;
        }
        break;
        
      case 'Home':
        if (homeAndEnd) {
          e.preventDefault();
          newIndex = 0;
        }
        break;
        
      case 'End':
        if (homeAndEnd) {
          e.preventDefault();
          newIndex = items.length - 1;
        }
        break;
        
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        return;
        
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      onSelect(newIndex);
    }
  };
  
  return handleKeyDown;
}

// Screen reader utilities
export const screenReaderUtils = {
  // Live region announcements
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
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
  },
  
  // Description helpers
  describeElement: (element: HTMLElement, description: string) => {
    const descId = ariaUtils.generateId('desc');
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    
    element.setAttribute('aria-describedby', descId);
    element.appendChild(descElement);
    
    return () => {
      element.removeAttribute('aria-describedby');
      element.removeChild(descElement);
    };
  }
};

// Color contrast utilities
export const colorContrastUtils = {
  // WCAG AA compliant color combinations
  ensureContrast: (foreground: string, background: string) => {
    // This would need a proper color contrast calculation library
    // For now, return predefined accessible combinations
    return {
      foreground: foreground,
      background: background,
      isAccessible: true // Placeholder
    };
  },
  
  // High contrast mode detection
  prefersHighContrast: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  }
};

// Motion utilities
export const motionUtils = {
  // Respect user's motion preferences
  prefersReducedMotion: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },
  
  // Safe animation durations
  getAnimationDuration: (defaultDuration: number) => {
    return motionUtils.prefersReducedMotion() ? 0 : defaultDuration;
  }
};

// Form accessibility helpers
export const formAccessibility = {
  // Error message association
  createErrorMessage: (fieldId: string, message: string) => {
    const errorId = `${fieldId}-error`;
    return {
      id: errorId,
      role: 'alert',
      'aria-live': 'polite',
      children: message,
      className: 'text-destructive text-sm mt-1'
    };
  },
  
  // Field validation states
  getFieldProps: (
    fieldId: string,
    isInvalid: boolean,
    isRequired: boolean,
    errorMessage?: string
  ) => {
    const errorId = isInvalid && errorMessage ? `${fieldId}-error` : undefined;
    
    return {
      id: fieldId,
      'aria-invalid': isInvalid,
      'aria-required': isRequired,
      'aria-describedby': errorId,
      required: isRequired
    };
  },
  
  // Label association
  getLabelProps: (fieldId: string) => ({
    htmlFor: fieldId
  })
};

// Notification accessibility
export const notificationAccessibility = {
  // Toast/snackbar properties
  getToastProps: (type: 'success' | 'error' | 'warning' | 'info') => ({
    role: type === 'error' ? 'alert' : 'status',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
    'aria-atomic': true
  }),
  
  // Loading state announcements
  announceLoadingState: (isLoading: boolean, context: string) => {
    const message = isLoading ? `Loading ${context}` : `${context} loaded`;
    screenReaderUtils.announce(message);
  }
};

// Skip link component helpers
export const skipLinkUtils = {
  createSkipLink: (targetId: string, text: string) => ({
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded-md shadow-lg z-50',
    children: text,
    onFocus: () => {
      screenReaderUtils.announce(`Skip link: ${text}`, 'polite');
    }
  }),
  
  // Main content landmark
  mainContentProps: {
    id: 'main-content',
    role: 'main',
    tabIndex: -1
  }
};

// Landmark helpers
export const landmarkUtils = {
  navigation: (label?: string) => ({
    role: 'navigation',
    'aria-label': label
  }),
  
  banner: {
    role: 'banner'
  },
  
  contentInfo: {
    role: 'contentinfo'
  },
  
  main: {
    role: 'main',
    id: 'main-content'
  },
  
  search: (label?: string) => ({
    role: 'search',
    'aria-label': label || 'Site search'
  })
};

// Testing utilities for accessibility
export const a11yTestUtils = {
  // Check if element has proper focus management
  hasFocusManagement: (element: HTMLElement) => {
    return element.tabIndex >= 0 || element.getAttribute('tabindex') !== null;
  },
  
  // Check if interactive element has accessible name
  hasAccessibleName: (element: HTMLElement) => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      element.getAttribute('title')
    );
  },
  
  // Validate ARIA attributes
  validateAria: (element: HTMLElement) => {
    const issues: string[] = [];
    
    // Check for invalid ARIA attributes
    const attributes = element.getAttributeNames();
    attributes.forEach(attr => {
      if (attr.startsWith('aria-') && !validAriaAttributes.includes(attr)) {
        issues.push(`Invalid ARIA attribute: ${attr}`);
      }
    });
    
    return issues;
  }
};

// Valid ARIA attributes list (subset)
const validAriaAttributes = [
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-expanded',
  'aria-hidden',
  'aria-live',
  'aria-atomic',
  'aria-busy',
  'aria-checked',
  'aria-current',
  'aria-disabled',
  'aria-invalid',
  'aria-pressed',
  'aria-required',
  'aria-selected',
  'aria-modal',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant',
  'aria-autocomplete',
  'aria-haspopup',
  'aria-orientation',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext'
];

export default {
  ariaUtils,
  useFocusTrap,
  useAutoFocus,
  useKeyboardNavigation,
  screenReaderUtils,
  colorContrastUtils,
  motionUtils,
  formAccessibility,
  notificationAccessibility,
  skipLinkUtils,
  landmarkUtils,
  a11yTestUtils
};
