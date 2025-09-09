import { createContext, useContext, useEffect, useState, useCallback } from "react"

/**
 * Available theme modes
 * @description Supports explicit light/dark themes or system preference detection
 */
export type Theme = "dark" | "light" | "system"

/**
 * Theme provider props interface
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  forcedTheme?: Theme
  attribute?: string
}

/**
 * Theme context state interface
 */
export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: Exclude<Theme, "system">
  systemTheme: Exclude<Theme, "system"> | undefined
  themes: Theme[]
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
  systemTheme: undefined,
  themes: ["light", "dark", "system"],
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "skillswap-ui-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
  forcedTheme,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    
    try {
      const stored = localStorage.getItem(storageKey) as Theme
      return stored || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const [systemTheme, setSystemTheme] = useState<Exclude<Theme, "system"> | undefined>()
  const [resolvedTheme, setResolvedTheme] = useState<Exclude<Theme, "system">>("light")

  // System theme detection
  useEffect(() => {
    if (!enableSystem) return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const updateSystemTheme = () => {
      const systemTheme = media.matches ? "dark" : "light"
      setSystemTheme(systemTheme)
      
      if (theme === "system") {
        setResolvedTheme(systemTheme)
      }
    }

    updateSystemTheme()
    media.addEventListener("change", updateSystemTheme)
    
    return () => media.removeEventListener("change", updateSystemTheme)
  }, [theme, enableSystem])

  // Theme application
  useEffect(() => {
    if (typeof window === "undefined") return

    const root = window.document.documentElement
    const currentTheme = forcedTheme || (theme === "system" ? systemTheme : theme) || "light"
    
    setResolvedTheme(currentTheme as Exclude<Theme, "system">)

    // Disable transitions during theme change if requested
    if (disableTransitionOnChange) {
      const css = document.createElement("style")
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      )
      document.head.appendChild(css)

      return () => {
        // Force repaint
        (() => window.getComputedStyle(root).opacity)()
        document.head.removeChild(css)
      }
    }

    // Remove any existing theme classes for compatibility
    root.classList.remove("light", "dark")
    
    // Apply theme attribute
    root.setAttribute(attribute, currentTheme)
    
    // Apply theme class for additional compatibility
    root.classList.add(currentTheme)
  }, [theme, systemTheme, forcedTheme, attribute, disableTransitionOnChange])

  const handleSetTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch {
      // Handle localStorage errors gracefully
      console.warn("Failed to save theme preference")
    }
    setTheme(newTheme)
  }, [storageKey])

  const value: ThemeProviderState = {
    theme: forcedTheme || theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    systemTheme,
    themes: enableSystem ? ["light", "dark", "system"] : ["light", "dark"],
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * Hook to access theme context
 * @returns Theme context with current theme state and methods
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

/**
 * Hook to get the current resolved theme (never "system")
 * @returns The actual theme being applied ("light" or "dark")
 */
export const useResolvedTheme = () => {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

/**
 * Hook to check if system theme is supported
 * @returns Boolean indicating system theme support
 */
export const useSystemTheme = () => {
  const { systemTheme, themes } = useTheme()
  return {
    systemTheme,
    isSystemSupported: themes.includes("system"),
  }
}
