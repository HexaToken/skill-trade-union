import { useCallback, useEffect, useState } from "react"
import type { Theme } from "@/types/theme"

/**
 * Custom hook for theme storage management
 * @param storageKey - The key used for localStorage
 * @param defaultTheme - Default theme to use if none is stored
 * @returns Theme storage methods and current value
 */
export function useThemeStorage(storageKey: string, defaultTheme: Theme = "system") {
  const [storedTheme, setStoredTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme
    
    try {
      const item = localStorage.getItem(storageKey)
      return (item as Theme) || defaultTheme
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error)
      return defaultTheme
    }
  })

  const setTheme = useCallback((theme: Theme) => {
    try {
      localStorage.setItem(storageKey, theme)
      setStoredTheme(theme)
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error)
      setStoredTheme(theme) // Still update state even if storage fails
    }
  }, [storageKey])

  const removeTheme = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      setStoredTheme(defaultTheme)
    } catch (error) {
      console.warn("Failed to remove theme from localStorage:", error)
      setStoredTheme(defaultTheme)
    }
  }, [storageKey, defaultTheme])

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setStoredTheme(e.newValue as Theme)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [storageKey])

  return {
    theme: storedTheme,
    setTheme,
    removeTheme,
  }
}