/**
 * Theme utility functions for managing light/dark mode
 */

export type Theme = 'light' | 'dark';

/**
 * Initialize theme from localStorage or system preference
 */
export function initializeTheme(): void {
  const saved = localStorage.getItem('theme') as Theme;
  const root = document.documentElement;
  
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else {
    // Use system preference if no saved theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    root.setAttribute('data-theme', systemTheme);
    localStorage.setItem('theme', systemTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') as Theme;
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  
  return next;
}

/**
 * Set a specific theme
 */
export function setTheme(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

/**
 * Get the current theme
 */
export function getCurrentTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'light';
}

/**
 * Listen to system theme changes
 */
export function watchSystemTheme(callback: (theme: Theme) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    const systemTheme: Theme = e.matches ? 'dark' : 'light';
    callback(systemTheme);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).themeUtils = {
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    init: initializeTheme
  };
}
