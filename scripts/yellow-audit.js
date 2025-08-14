/**
 * Comprehensive Yellow Color Audit Script
 * Run this in browser console to detect any remaining yellow colors
 */

(function() {
  console.log('🔍 Starting comprehensive yellow audit...');
  
  const yellowPatterns = {
    hex: [
      /#f59e0b/i, /#fbbf24/i, /#eab308/i, /#ffc107/i, 
      /#facc15/i, /#ffd54f/i, /#ffeb3b/i, /#fff59d/i,
      /#ffcc02/i, /#ffd700/i, /#f9a825/i
    ],
    rgb: [
      /rgb\s*\(\s*254\s*,\s*240\s*,\s*138\s*\)/i,
      /rgb\s*\(\s*255\s*,\s*193\s*,\s*7\s*\)/i,
      /rgb\s*\(\s*251\s*,\s*191\s*,\s*36\s*\)/i,
      /rgb\s*\(\s*255\s*,\s*235\s*,\s*59\s*\)/i,
      /rgb\s*\(\s*255\s*,\s*245\s*,\s*157\s*\)/i,
      /rgb\s*\(\s*255\s*,\s*213\s*,\s*79\s*\)/i
    ],
    classes: [
      /\btext-yellow-\d+\b/i,
      /\bbg-yellow-\d+\b/i,
      /\bborder-yellow-\d+\b/i,
      /\btext-amber-\d+\b/i,
      /\bbg-amber-\d+\b/i,
      /\bborder-amber-\d+\b/i
    ],
    keywords: [
      /\byellow\b/i,
      /\bamber\b/i
    ]
  };

  const results = {
    inlineStyles: [],
    classes: [],
    computedStyles: [],
    total: 0
  };

  // 1. Check inline styles
  console.log('📍 Checking inline styles...');
  const elementsWithStyles = document.querySelectorAll('[style]');
  elementsWithStyles.forEach(el => {
    const style = el.getAttribute('style');
    let found = false;
    
    // Check hex patterns
    yellowPatterns.hex.forEach(pattern => {
      if (pattern.test(style)) found = true;
    });
    
    // Check RGB patterns
    yellowPatterns.rgb.forEach(pattern => {
      if (pattern.test(style)) found = true;
    });
    
    // Check keywords
    yellowPatterns.keywords.forEach(pattern => {
      if (pattern.test(style)) found = true;
    });
    
    if (found) {
      results.inlineStyles.push({
        element: el,
        style: style,
        tag: el.tagName,
        className: el.className
      });
    }
  });

  // 2. Check class names
  console.log('📍 Checking class names...');
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    const className = el.className;
    if (typeof className === 'string') {
      let found = false;
      
      yellowPatterns.classes.forEach(pattern => {
        if (pattern.test(className)) found = true;
      });
      
      yellowPatterns.keywords.forEach(pattern => {
        if (pattern.test(className)) found = true;
      });
      
      if (found) {
        results.classes.push({
          element: el,
          className: className,
          tag: el.tagName
        });
      }
    }
  });

  // 3. Check computed styles (this is more comprehensive but slower)
  console.log('📍 Checking computed styles...');
  const sampleElements = Array.from(allElements).slice(0, 100); // Sample first 100 elements
  sampleElements.forEach(el => {
    const computed = getComputedStyle(el);
    const bgColor = computed.backgroundColor;
    const color = computed.color;
    const borderColor = computed.borderColor;
    
    [bgColor, color, borderColor].forEach(colorValue => {
      if (colorValue && colorValue !== 'rgba(0, 0, 0, 0)' && colorValue !== 'transparent') {
        // Convert RGB to hex for checking
        const rgbMatch = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          
          // Check if this looks yellow-ish (high red and green, low blue)
          if (r > 200 && g > 180 && b < 100) {
            results.computedStyles.push({
              element: el,
              property: colorValue === bgColor ? 'background' : colorValue === color ? 'color' : 'border',
              value: colorValue,
              tag: el.tagName,
              className: el.className
            });
          }
        }
      }
    });
  });

  // Calculate totals
  results.total = results.inlineStyles.length + results.classes.length + results.computedStyles.length;

  // Report results
  console.log('\n📊 YELLOW AUDIT RESULTS:');
  console.log('========================');
  console.log(`Total potential yellow elements found: ${results.total}`);
  console.log(`- Inline styles: ${results.inlineStyles.length}`);
  console.log(`- Class names: ${results.classes.length}`);
  console.log(`- Computed styles: ${results.computedStyles.length}`);

  if (results.total > 0) {
    console.log('\n⚠️ DETAILED FINDINGS:');
    
    if (results.inlineStyles.length > 0) {
      console.log('\n🎨 Inline Styles with Yellow:');
      results.inlineStyles.forEach((item, i) => {
        console.log(`${i+1}. <${item.tag}> style="${item.style}"`);
        console.log(item.element);
      });
    }
    
    if (results.classes.length > 0) {
      console.log('\n🏷️ Classes with Yellow:');
      results.classes.forEach((item, i) => {
        console.log(`${i+1}. <${item.tag}> class="${item.className}"`);
        console.log(item.element);
      });
    }
    
    if (results.computedStyles.length > 0) {
      console.log('\n🖥️ Computed Styles (Yellow-ish):');
      results.computedStyles.forEach((item, i) => {
        console.log(`${i+1}. <${item.tag}> ${item.property}: ${item.value}`);
        console.log(item.element);
      });
    }
  } else {
    console.log('✅ No yellow colors detected! Protection system is working.');
  }

  // Return results for further inspection
  return results;
})();
