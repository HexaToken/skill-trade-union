import { useEffect, useState, useCallback } from "react"

/**
 * Custom hook for media query detection
 * @param query - The media query string
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })

  const updateMatches = useCallback((event: MediaQueryListEvent) => {
    setMatches(event.matches)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)
    
    // Set initial value
    setMatches(mediaQuery.matches)
    
    // Add listener
    mediaQuery.addEventListener("change", updateMatches)
    
    return () => mediaQuery.removeEventListener("change", updateMatches)
  }, [query, updateMatches])

  return matches
}

/**
 * Hook specifically for dark mode media query
 * @returns Boolean indicating if system prefers dark mode
 */
export function useSystemDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

/**
 * Hook for reduced motion preference
 * @returns Boolean indicating if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

/**
 * Hook for high contrast preference
 * @returns Boolean indicating if user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: high)")
}