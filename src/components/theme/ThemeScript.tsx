/**
 * Theme initialization script component
 * Prevents FOUC (Flash of Unstyled Content) by applying theme before React hydration
 */
export function ThemeScript({
  storageKey = "skillswap-ui-theme",
  defaultTheme = "system",
  attribute = "data-theme",
}: {
  storageKey?: string
  defaultTheme?: string
  attribute?: string
}) {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('${storageKey}');
        var theme = stored || '${defaultTheme}';
        var root = document.documentElement;
        
        if (theme === 'system') {
          var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.setAttribute('${attribute}', systemTheme);
          root.classList.add(systemTheme);
        } else {
          root.setAttribute('${attribute}', theme);
          root.classList.add(theme);
        }
        
        // Set CSS custom properties immediately
        var properties = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? {
          '--primary': '210 50 50',
          '--primary-dark': '210 60 45',
          '--secondary': '210 30 25',
          '--ink-head': '210 30 95',
          '--ink-body': '210 20 85',
          '--canvas': '210 30 8',
          '--surface': '210 25 12',
          '--elevated': '210 25 16',
          '--border': '210 15 25',
          '--success': '142 76 36',
          '--warning': '45 93 47',
          '--danger': '0 84 60'
        } : {
          '--primary': '210 40 98',
          '--primary-dark': '210 30 96',
          '--secondary': '210 40 95',
          '--ink-head': '210 20 14',
          '--ink-body': '210 15 20',
          '--canvas': '210 40 96',
          '--surface': '0 0 100',
          '--elevated': '210 40 99',
          '--border': '210 20 85',
          '--success': '142 76 36',
          '--warning': '45 93 47',
          '--danger': '0 84 60'
        };
        
        Object.keys(properties).forEach(function(property) {
          root.style.setProperty(property, properties[property]);
        });
        
      } catch (e) {
        console.warn('Theme initialization failed:', e);
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  )
}