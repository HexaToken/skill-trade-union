/**
 * Theme system exports
 * Centralized exports for the theme system components and utilities
 */

// Core theme components
export { ThemeProvider } from "./ThemeProvider"
export { ThemeToggle } from "@/components/ThemeToggle"
export { ColorModeToggle } from "./ColorModeToggle"
export { ThemeScript } from "./ThemeScript"
export { ThemeTestSuite } from "./ThemeTestSuite"

// Theme provider and hooks
export { 
  useTheme, 
  useResolvedTheme, 
  useSystemTheme 
} from "@/components/theme-provider"
export type { 
  ThemeProviderProps 
} from "@/components/theme-provider"

// Utility hooks
export { 
  useSystemDarkMode, 
  usePrefersReducedMotion,
  usePrefersHighContrast,
  useMediaQuery 
} from "@/hooks/useMediaQuery"
export { useThemeStorage } from "@/hooks/useThemeStorage"

// Helper functions
export {
  resolveTheme,
  toggleTheme,
  getNextTheme,
  isValidTheme,
  getThemeProperties,
  applyThemeProperties,
  detectSystemTheme,
  createSystemThemeListener
} from "@/utils/themeHelpers"

// Constants and types
export {
  THEME_STORAGE_KEY,
  THEME_ATTRIBUTE,
  DEFAULT_THEME,
  THEMES,
  THEME_LABELS,
  THEME_CONFIG,
  CSS_VARIABLES,
  MEDIA_QUERIES,
  TRANSITION_CLASSES
} from "@/utils/themeConstants"

export type {
  Theme,
  ResolvedTheme,
  ColorPalette,
  ThemeConfig,
  ThemeContextValue,
  ThemeStorage,
  MediaQueryChangeEvent
} from "@/types/theme"