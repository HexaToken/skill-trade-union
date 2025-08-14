/**
 * Advanced HSV-based Yellow Color Detector
 * Uses HSV color space to accurately detect yellowish colors
 */

export class AdvancedYellowDetector {
  private static instance: AdvancedYellowDetector;
  private readonly HUE_MIN = 35;
  private readonly HUE_MAX = 65;
  private offenders = new Set<Element>();
  
  private readonly colorProperties = [
    'color',
    'backgroundColor', 
    'borderTopColor',
    'borderRightColor', 
    'borderBottomColor',
    'borderLeftColor',
    'fill',
    'stroke'
  ];

  static getInstance(): AdvancedYellowDetector {
    if (!AdvancedYellowDetector.instance) {
      AdvancedYellowDetector.instance = new AdvancedYellowDetector();
    }
    return AdvancedYellowDetector.instance;
  }

  private isYellowish(rgbString: string): boolean {
    if (!rgbString) return false;
    
    const match = rgbString.match(/\d+/g);
    if (!match) return false;
    
    const [r, g, b] = match.map(Number);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (delta === 0) return false;
    
    let hue = 0;
    switch (max) {
      case r: 
        hue = ((g - b) / delta) % 6; 
        break;
      case g: 
        hue = (b - r) / delta + 2; 
        break;
      case b: 
        hue = (r - g) / delta + 4; 
        break;
    }
    
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
    
    const saturation = max === 0 ? 0 : delta / max;
    const value = max / 255;
    
    // Yellow detection: significant saturation, decent brightness, yellow hue range
    return saturation > 0.2 && value > 0.4 && hue >= this.HUE_MIN && hue <= this.HUE_MAX;
  }

  private getPrimaryColor(): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--primary')
      .trim() || '#0B5FFF';
  }

  scanAndMark(): { total: number; elements: Element[] } {
    this.offenders.clear();
    const allElements = document.querySelectorAll('*');
    
    console.log('🔍 Starting advanced HSV yellow detection...');
    
    allElements.forEach(element => {
      const computedStyle = getComputedStyle(element);
      let hasYellow = false;
      
      // Check all color properties
      for (const prop of this.colorProperties) {
        const colorValue = computedStyle[prop as any];
        if (this.isYellowish(colorValue)) {
          hasYellow = true;
          break;
        }
      }
      
      // Special check for SVG elements
      if (!hasYellow && (element.tagName === 'svg' || element.closest('svg'))) {
        const fill = computedStyle.fill;
        const stroke = computedStyle.stroke;
        hasYellow = this.isYellowish(fill) || this.isYellowish(stroke);
      }
      
      if (hasYellow) {
        // Mark the element with red outline
        (element as HTMLElement).style.outline = '2px solid red';
        this.offenders.add(element);
        
        console.warn('🟡 Yellow element detected:', {
          element,
          tag: element.tagName,
          className: element.className,
          color: computedStyle.color,
          backgroundColor: computedStyle.backgroundColor,
          borderColor: computedStyle.borderTopColor
        });
      }
    });
    
    console.info(`🔍 Advanced scan complete: Found ${this.offenders.size} yellowish elements. Red outlines applied.`);
    
    return {
      total: this.offenders.size,
      elements: Array.from(this.offenders)
    };
  }

  fixDetectedElements(): number {
    const primaryColor = this.getPrimaryColor();
    let fixed = 0;
    
    this.offenders.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Apply fixes
      htmlElement.style.setProperty('background-color', primaryColor, 'important');
      htmlElement.style.setProperty('color', 'white', 'important');
      htmlElement.style.setProperty('border-color', primaryColor, 'important');
      
      // Remove red outline
      htmlElement.style.outline = '';
      
      fixed++;
      console.log('🔧 Fixed yellow element:', element);
    });
    
    this.offenders.clear();
    console.log(`✅ Fixed ${fixed} yellow elements`);
    
    return fixed;
  }

  clearOutlines(): void {
    this.offenders.forEach(element => {
      (element as HTMLElement).style.outline = '';
    });
    this.offenders.clear();
    console.log('🧹 Cleared all red outlines');
  }

  generateReport(): {
    total: number;
    byTag: Record<string, number>;
    elements: Array<{
      tag: string;
      className: string;
      colors: Record<string, string>;
    }>;
  } {
    const byTag: Record<string, number> = {};
    const elements: Array<{
      tag: string;
      className: string;
      colors: Record<string, string>;
    }> = [];
    
    this.offenders.forEach(element => {
      const tag = element.tagName.toLowerCase();
      byTag[tag] = (byTag[tag] || 0) + 1;
      
      const computedStyle = getComputedStyle(element);
      const colors: Record<string, string> = {};
      
      this.colorProperties.forEach(prop => {
        const value = computedStyle[prop as any];
        if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
          colors[prop] = value;
        }
      });
      
      elements.push({
        tag,
        className: element.className || '',
        colors
      });
    });
    
    return {
      total: this.offenders.size,
      byTag,
      elements
    };
  }
}

// Browser console function
if (typeof window !== 'undefined') {
  (window as any).runAdvancedYellowScan = () => {
    const detector = AdvancedYellowDetector.getInstance();
    return detector.scanAndMark();
  };
  
  (window as any).fixYellowElements = () => {
    const detector = AdvancedYellowDetector.getInstance();
    return detector.fixDetectedElements();
  };
  
  (window as any).clearYellowOutlines = () => {
    const detector = AdvancedYellowDetector.getInstance();
    detector.clearOutlines();
  };
  
  (window as any).getYellowReport = () => {
    const detector = AdvancedYellowDetector.getInstance();
    return detector.generateReport();
  };
}

// Export the original script as a function for browser console
export const runAdvancedYellowDetection = () => {
  const HUE_MIN = 35, HUE_MAX = 65; // yellow range
  const offenders = new Set();
  const props = [
    'color','backgroundColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'
  ];
  
  const isYellowish = (rgb: string) => {
    const m = rgb?.match(/\d+/g); 
    if(!m) return false;
    const [r,g,b] = m.map(Number);
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
    const d = mx - mn; 
    if(d === 0) return false;
    let h = 0;
    switch(mx){
      case r: h = ((g-b)/d)%6; break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h = Math.round(h*60); 
    if(h < 0) h += 360;
    const s = mx===0 ? 0 : d/mx;
    const v = mx/255;
    return s > 0.2 && v > 0.4 && h >= HUE_MIN && h <= HUE_MAX;
  };
  
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    let hit = props.some(p => isYellowish(cs[p as any]));
    
    // Also check inline SVG fills/strokes
    if(!hit && (el.tagName === 'svg' || el.closest('svg'))) {
      const fill = cs.fill, stroke = cs.stroke;
      hit = isYellowish(fill) || isYellowish(stroke);
    }
    
    if(hit) {
      (el as HTMLElement).style.outline = '2px solid red';
      offenders.add(el);
      console.log('Yellow-ish:', el, getComputedStyle(el).color, getComputedStyle(el).backgroundColor);
    }
  });
  
  console.info(`Found ~${offenders.size} yellow-ish elements. Red outlines applied.`);
  return { total: offenders.size, elements: Array.from(offenders) };
};
