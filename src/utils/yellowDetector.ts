/**
 * Runtime Yellow Color Detective & Converter
 * Detects and converts yellow colors to design tokens in real-time
 */

export class YellowDetector {
  private static instance: YellowDetector;
  private observer: MutationObserver | null = null;
  private isActive = false;

  // Common yellow hex patterns (case insensitive)
  private yellowHexPatterns = [
    /#f59e0b/i, /#fbbf24/i, /#eab308/i, /#ffc107/i, 
    /#facc15/i, /#ffd54f/i, /#ffeb3b/i, /#fff59d/i,
    /#ffcc02/i, /#ffd700/i, /#f9a825/i
  ];

  // Common yellow RGB patterns
  private yellowRgbPatterns = [
    /rgb\s*\(\s*254\s*,\s*240\s*,\s*138\s*\)/i,
    /rgb\s*\(\s*255\s*,\s*193\s*,\s*7\s*\)/i,
    /rgb\s*\(\s*251\s*,\s*191\s*,\s*36\s*\)/i,
    /rgb\s*\(\s*255\s*,\s*235\s*,\s*59\s*\)/i,
    /rgb\s*\(\s*255\s*,\s*245\s*,\s*157\s*\)/i,
    /rgb\s*\(\s*255\s*,\s*213\s*,\s*79\s*\)/i
  ];

  // Yellow class name patterns
  private yellowClassPatterns = [
    /\byellow\b/i, /\bamber\b/i,
    /text-yellow-/i, /bg-yellow-/i, /border-yellow-/i,
    /text-amber-/i, /bg-amber-/i, /border-amber-/i
  ];

  static getInstance(): YellowDetector {
    if (!YellowDetector.instance) {
      YellowDetector.instance = new YellowDetector();
    }
    return YellowDetector.instance;
  }

  private getPrimaryColor(): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim() || '#0B5FFF';
  }

  private isYellowColor(color: string): boolean {
    // Check hex patterns
    for (const pattern of this.yellowHexPatterns) {
      if (pattern.test(color)) return true;
    }

    // Check RGB patterns
    for (const pattern of this.yellowRgbPatterns) {
      if (pattern.test(color)) return true;
    }

    // Check for yellow keywords
    if (/\byellow\b/i.test(color) || /\bamber\b/i.test(color)) {
      return true;
    }

    return false;
  }

  private hasYellowClass(element: Element): boolean {
    const className = element.className;
    if (typeof className !== 'string') return false;

    for (const pattern of this.yellowClassPatterns) {
      if (pattern.test(className)) return true;
    }
    return false;
  }

  private convertElement(element: Element): void {
    const htmlElement = element as HTMLElement;
    const primaryColor = this.getPrimaryColor();

    // Check inline styles
    if (htmlElement.style) {
      const style = htmlElement.style;
      
      // Check background color
      if (style.backgroundColor && this.isYellowColor(style.backgroundColor)) {
        style.backgroundColor = primaryColor;
        style.color = 'white';
        console.warn('🔧 Yellow detected and converted:', element);
      }

      // Check color
      if (style.color && this.isYellowColor(style.color)) {
        style.color = primaryColor;
        console.warn('🔧 Yellow text detected and converted:', element);
      }

      // Check border color
      if (style.borderColor && this.isYellowColor(style.borderColor)) {
        style.borderColor = primaryColor;
        console.warn('🔧 Yellow border detected and converted:', element);
      }
    }

    // Check class names
    if (this.hasYellowClass(element)) {
      // Add override classes
      htmlElement.style.setProperty('background-color', primaryColor, 'important');
      htmlElement.style.setProperty('color', 'white', 'important');
      htmlElement.style.setProperty('border-color', primaryColor, 'important');
      console.warn('🔧 Yellow class detected and converted:', element);
    }
  }

  private scanExistingElements(): void {
    const allElements = document.querySelectorAll('*');
    let conversions = 0;

    allElements.forEach(element => {
      try {
        this.convertElement(element);
        conversions++;
      } catch (error) {
        // Silently handle conversion errors
      }
    });

    if (conversions > 0) {
      console.log(`🔧 Yellow Detector: Scanned ${allElements.length} elements, converted ${conversions} yellow elements`);
    }
  }

  start(): void {
    if (this.isActive) return;

    this.isActive = true;

    // Scan existing elements immediately
    this.scanExistingElements();

    // Set up mutation observer for dynamic content
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        // Check added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            this.convertElement(element);
            
            // Also check children
            const children = element.querySelectorAll('*');
            children.forEach(child => this.convertElement(child));
          }
        });

        // Check modified attributes
        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          this.convertElement(mutation.target as Element);
        }
      });
    });

    // Start observing
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    console.log('🛡️ Yellow Detective: Protection system activated');
  }

  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isActive = false;
    console.log('🛡️ Yellow Detective: Protection system deactivated');
  }

  // Manual scan method for testing
  scanNow(): number {
    const allElements = document.querySelectorAll('*');
    let conversions = 0;

    allElements.forEach(element => {
      try {
        this.convertElement(element);
        conversions++;
      } catch (error) {
        // Silently handle conversion errors
      }
    });

    console.log(`🔧 Manual scan complete: ${conversions} elements converted`);
    return conversions;
  }
}

// Auto-start when DOM is ready
if (typeof window !== 'undefined') {
  const startDetector = () => {
    const detector = YellowDetector.getInstance();
    detector.start();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDetector);
  } else {
    startDetector();
  }
}

// Global access for debugging
declare global {
  interface Window {
    yellowDetector: YellowDetector;
  }
}

if (typeof window !== 'undefined') {
  window.yellowDetector = YellowDetector.getInstance();
}
