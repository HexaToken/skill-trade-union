// Responsive design utilities for SkillSwap
import { useState, useEffect } from 'react';

// Breakpoint definitions matching Tailwind defaults
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to get current screen size
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return currentBreakpoint;
}

// Hook to check if current screen is mobile
export function useIsMobile() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'xs' || breakpoint === 'sm';
}

// Hook to check if current screen is tablet or larger
export function useIsTabletOrLarger() {
  const breakpoint = useBreakpoint();
  return breakpoint !== 'xs' && breakpoint !== 'sm';
}

// Hook to check if current screen is desktop or larger
export function useIsDesktop() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
}

// Utility function to get responsive grid columns
export function getResponsiveColumns(
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3,
  ultrawide: number = 4
) {
  return {
    'grid-cols-1': mobile === 1,
    'grid-cols-2': mobile === 2,
    'grid-cols-3': mobile === 3,
    'md:grid-cols-1': tablet === 1,
    'md:grid-cols-2': tablet === 2,
    'md:grid-cols-3': tablet === 3,
    'md:grid-cols-4': tablet === 4,
    'lg:grid-cols-1': desktop === 1,
    'lg:grid-cols-2': desktop === 2,
    'lg:grid-cols-3': desktop === 3,
    'lg:grid-cols-4': desktop === 4,
    'lg:grid-cols-5': desktop === 5,
    'xl:grid-cols-1': ultrawide === 1,
    'xl:grid-cols-2': ultrawide === 2,
    'xl:grid-cols-3': ultrawide === 3,
    'xl:grid-cols-4': ultrawide === 4,
    'xl:grid-cols-5': ultrawide === 5,
    'xl:grid-cols-6': ultrawide === 6
  };
}

// Container max widths for different sections
export const containerMaxWidths = {
  'max-w-sm': '24rem',     // 384px - Small content
  'max-w-md': '28rem',     // 448px - Medium content
  'max-w-lg': '32rem',     // 512px - Large content
  'max-w-xl': '36rem',     // 576px - Extra large content
  'max-w-2xl': '42rem',    // 672px - Text content
  'max-w-3xl': '48rem',    // 768px - Article content
  'max-w-4xl': '56rem',    // 896px - Page content
  'max-w-5xl': '64rem',    // 1024px - Wide content
  'max-w-6xl': '72rem',    // 1152px - Extra wide content
  'max-w-7xl': '80rem',    // 1280px - Maximum content
  'max-w-full': '100%'     // Full width
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Padding utilities
  'p-4 md:p-6 lg:p-8': 'Responsive padding',
  'px-4 md:px-6 lg:px-8': 'Responsive horizontal padding',
  'py-4 md:py-6 lg:py-8': 'Responsive vertical padding',
  
  // Margin utilities  
  'm-4 md:m-6 lg:m-8': 'Responsive margin',
  'mx-4 md:mx-6 lg:mx-8': 'Responsive horizontal margin',
  'my-4 md:my-6 lg:my-8': 'Responsive vertical margin',
  
  // Gap utilities
  'gap-4 md:gap-6 lg:gap-8': 'Responsive gap',
  'gap-x-4 md:gap-x-6 lg:gap-x-8': 'Responsive horizontal gap',
  'gap-y-4 md:gap-y-6 lg:gap-y-8': 'Responsive vertical gap'
} as const;

// Responsive text sizes
export const responsiveText = {
  // Display text
  'text-4xl md:text-5xl lg:text-6xl': 'Display heading',
  'text-3xl md:text-4xl lg:text-5xl': 'Large heading',
  'text-2xl md:text-3xl lg:text-4xl': 'Medium heading',
  'text-xl md:text-2xl lg:text-3xl': 'Small heading',
  
  // Body text
  'text-sm md:text-base': 'Small body text',
  'text-base md:text-lg': 'Regular body text',
  'text-lg md:text-xl': 'Large body text'
} as const;

// Layout presets for common patterns
export const layoutPresets = {
  // Hero sections
  heroContainer: 'page-container py-12 md:py-16 lg:py-24',
  heroContent: 'max-w-4xl mx-auto text-center space-y-6 md:space-y-8',
  heroTitle: 'text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight',
  heroSubtitle: 'text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto',
  
  // Card grids
  cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  cardGridWide: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6',
  
  // Content sections
  sectionContainer: 'page-container py-8 md:py-12 lg:py-16',
  sectionHeader: 'max-w-3xl mx-auto text-center space-y-4 mb-8 md:mb-12',
  sectionTitle: 'text-2xl md:text-3xl lg:text-4xl font-heading font-bold',
  sectionSubtitle: 'text-muted-foreground text-lg',
  
  // Two-column layouts
  twoColumnLayout: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
  twoColumnContent: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
  
  // Sidebar layouts
  sidebarLayout: 'flex flex-col lg:flex-row gap-8',
  sidebarMain: 'flex-1 min-w-0',
  sidebarAside: 'w-full lg:w-80 lg:flex-shrink-0'
} as const;

// Animation presets
export const animationPresets = {
  // Hover effects
  hoverLift: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverGlow: 'transition-all duration-200 hover:shadow-glow',
  
  // Loading states
  fadeIn: 'animate-in fade-in duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
  
  // Interactive elements
  buttonPress: 'transition-all duration-150 active:scale-95',
  cardHover: 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
} as const;

// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
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
    }
  };
  
  element.addEventListener('keydown', handleTabKeyPress);
  
  return () => {
    element.removeEventListener('keydown', handleTabKeyPress);
  };
}

// Scroll utilities
export function scrollToElement(elementId: string, offset: number = 80) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Intersection observer hook for animations
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);
  
  return isIntersecting;
}
