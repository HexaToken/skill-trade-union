/**
 * Immediate Console Yellow Detector
 * Copy and paste this directly into browser console to detect yellow elements
 */

(() => {
  const HUE_MIN = 35, HUE_MAX = 65; // yellow range
  const offenders = new Set();
  const props = [
    'color','backgroundColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'
  ];
  const isYellowish = (rgb) => {
    const m = rgb?.match(/\d+/g); if(!m) return false;
    const [r,g,b] = m.map(Number);
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
    const d = mx - mn; if(d === 0) return false;
    let h = 0;
    switch(mx){
      case r: h = ((g-b)/d)%6; break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h = Math.round(h*60); if(h < 0) h += 360;
    const s = mx===0 ? 0 : d/mx;
    const v = mx/255;
    return s > 0.2 && v > 0.4 && h >= HUE_MIN && h <= HUE_MAX;
  };
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    let hit = props.some(p => isYellowish(cs[p]));
    // Also check inline SVG fills/strokes
    if(!hit && (el.tagName === 'svg' || el.closest('svg'))) {
      const fill = cs.fill, stroke = cs.stroke;
      hit = isYellowish(fill) || isYellowish(stroke);
    }
    if(hit) {
      el.style.outline = '2px solid red';
      offenders.add(el);
      console.log('Yellow-ish:', el, getComputedStyle(el).color, getComputedStyle(el).backgroundColor);
    }
  });
  console.info(`Found ~${offenders.size} yellow-ish elements. Red outlines applied.`);
  return { total: offenders.size, elements: Array.from(offenders) };
})();
