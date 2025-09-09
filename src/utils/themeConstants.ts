import type { Theme, ThemeConfig } from "@/types/theme"

/**
 * Theme system constants and configuration
 */

export const THEME_STORAGE_KEY = "skillswap-ui-theme"
export const THEME_ATTRIBUTE = "data-theme"
export const DEFAULT_THEME: Theme = "system"

/**
 * Available themes
 */
export const THEMES: Theme[] = ["light", "dark", "system"]

/**
 * Theme labels for UI
 */
export const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark", 
  system: "System",
}

/**
 * Complete theme configuration
 */
export const THEME_CONFIG: ThemeConfig = {
  colors: {
    light: {
      primary: "210 40 98",
      primaryDark: "210 30 96", 
      secondary: "210 40 95",
      ink: {
        head: "210 20 14",
        body: "210 15 20",
      },
      canvas: "210 40 96",
      surface: "0 0 100",
      elevated: "210 40 99",
      border: "210 20 85",
      success: "142 76 36",
      warning: "45 93 47",
      danger: "0 84 60",
    },
    dark: {
      primary: "210 50 50",
      primaryDark: "210 60 45",
      secondary: "210 30 25", 
      ink: {
        head: "210 30 95",
        body: "210 20 85",
      },
      canvas: "210 30 8",
      surface: "210 25 12",
      elevated: "210 25 16",
      border: "210 15 25",
      success: "142 76 36",
      warning: "45 93 47", 
      danger: "0 84 60",
    },
  },
  transitions: {
    duration: "200ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px", 
    lg: "1024px",
    xl: "1280px",
  },
}

/**
 * CSS custom property names
 */
export const CSS_VARIABLES = {
  primary: "--primary",
  primaryDark: "--primary-dark",
  secondary: "--secondary", 
  inkHead: "--ink-head",
  inkBody: "--ink-body",
  canvas: "--canvas",
  surface: "--surface",
  elevated: "--elevated",
  border: "--border",
  success: "--success",
  warning: "--warning",
  danger: "--danger",
  transitionDuration: "--transition-duration",
  transitionEasing: "--transition-easing",
} as const

/**
 * Media queries
 */
export const MEDIA_QUERIES = {
  darkMode: "(prefers-color-scheme: dark)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  highContrast: "(prefers-contrast: high)",
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
} as const

/**
 * Theme transition classes
 */
export const TRANSITION_CLASSES = {
  default: "transition-colors duration-200 ease-in-out",
  fast: "transition-colors duration-100 ease-in-out", 
  slow: "transition-colors duration-300 ease-in-out",
  none: "",
} as const