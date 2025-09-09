import type { Theme, ResolvedTheme } from "@/types/theme"

/**
 * Resolves system theme to actual theme
 * @param theme - The theme to resolve
 * @param systemTheme - The detected system theme
 * @returns The resolved theme (never "system")
 */
export function resolveTheme(theme: Theme, systemTheme?: ResolvedTheme): ResolvedTheme {
  if (theme === "system") {
    return systemTheme || "light"
  }
  return theme as ResolvedTheme
}

/**
 * Gets the next theme in rotation
 * @param currentTheme - Current theme
 * @param themes - Available themes
 * @returns Next theme
 */
export function getNextTheme(currentTheme: Theme, themes: Theme[] = ["light", "dark", "system"]): Theme {
  const currentIndex = themes.indexOf(currentTheme)
  const nextIndex = (currentIndex + 1) % themes.length
  return themes[nextIndex]
}

/**
 * Toggles between light and dark themes
 * @param currentTheme - Current theme
 * @returns Toggled theme
 */
export function toggleTheme(currentTheme: Theme): ResolvedTheme {
  switch (currentTheme) {
    case "light":
      return "dark"
    case "dark":
      return "light"
    case "system":
      // For system theme, we need to know the system preference
      // This is handled by the theme provider
      return "dark"
    default:
      return "light"
  }
}

/**
 * Validates if a string is a valid theme
 * @param value - Value to validate
 * @returns Boolean indicating validity
 */
export function isValidTheme(value: unknown): value is Theme {
  return typeof value === "string" && ["light", "dark", "system"].includes(value)
}

/**
 * Gets theme-specific CSS custom properties
 * @param theme - The theme to get properties for
 * @returns Object with CSS custom properties
 */
export function getThemeProperties(theme: ResolvedTheme) {
  const baseProperties = {
    "--transition-duration": "200ms",
    "--transition-easing": "cubic-bezier(0.4, 0, 0.2, 1)",
  }

  const lightProperties = {
    "--primary": "210 40 98",
    "--primary-dark": "210 30 96",
    "--secondary": "210 40 95",
    "--ink-head": "210 20 14",
    "--ink-body": "210 15 20",
    "--canvas": "210 40 96",
    "--surface": "0 0 100",
    "--elevated": "210 40 99",
    "--border": "210 20 85",
    "--success": "142 76 36",
    "--warning": "45 93 47",
    "--danger": "0 84 60",
  }

  const darkProperties = {
    "--primary": "210 50 50",
    "--primary-dark": "210 60 45",
    "--secondary": "210 30 25",
    "--ink-head": "210 30 95",
    "--ink-body": "210 20 85",
    "--canvas": "210 30 8",
    "--surface": "210 25 12",
    "--elevated": "210 25 16",
    "--border": "210 15 25",
    "--success": "142 76 36",
    "--warning": "45 93 47",
    "--danger": "0 84 60",
  }

  return {
    ...baseProperties,
    ...(theme === "light" ? lightProperties : darkProperties),
  }
}

/**
 * Applies theme properties to document root
 * @param theme - Theme to apply
 */
export function applyThemeProperties(theme: ResolvedTheme) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const properties = getThemeProperties(theme)

  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

/**
 * Detects system theme preference
 * @returns The detected system theme
 */
export function detectSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/**
 * Creates a media query listener for system theme changes
 * @param callback - Callback to execute on theme change
 * @returns Cleanup function
 */
export function createSystemThemeListener(callback: (theme: ResolvedTheme) => void) {
  if (typeof window === "undefined") return () => {}

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  
  const handleChange = (event: MediaQueryListEvent) => {
    callback(event.matches ? "dark" : "light")
  }

  mediaQuery.addEventListener("change", handleChange)
  
  return () => mediaQuery.removeEventListener("change", handleChange)
}