/**
 * Theme system type definitions
 * @description Centralized type definitions for the theme system
 */

export type Theme = "dark" | "light" | "system"

export type ResolvedTheme = Exclude<Theme, "system">

/**
 * Color palette interface for theme colors
 */
export interface ColorPalette {
  primary: string
  primaryDark: string
  secondary: string
  ink: {
    head: string
    body: string
  }
  canvas: string
  surface: string
  elevated: string
  border: string
  success: string
  warning: string
  danger: string
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  colors: {
    light: ColorPalette
    dark: ColorPalette
  }
  transitions: {
    duration: string
    easing: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

/**
 * Theme context interface
 */
export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme | undefined
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isSystemSupported: boolean
  themes: Theme[]
}

/**
 * Theme storage interface
 */
export interface ThemeStorage {
  getTheme: () => Theme | null
  setTheme: (theme: Theme) => void
  removeTheme: () => void
}

/**
 * Media query change event
 */
export interface MediaQueryChangeEvent {
  matches: boolean
  media: string
}