import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery"

/**
 * Simple binary theme toggle (light/dark only)
 * Optimized for performance and accessibility
 */
export function ColorModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all ${
          prefersReducedMotion
            ? ""
            : "duration-500 ease-in-out"
        } ${
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          prefersReducedMotion
            ? ""
            : "duration-500 ease-in-out"
        } ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        }`}
      />
      <span className="sr-only">
        Current theme: {isDark ? "dark" : "light"}
      </span>
    </Button>
  )
}