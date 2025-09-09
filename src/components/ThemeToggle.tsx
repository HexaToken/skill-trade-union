import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery"

/**
 * Advanced theme toggle component with system theme support
 * Provides accessibility features and smooth transitions
 */
export const ThemeToggle = () => {
  const { theme, setTheme, themes, resolvedTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()

  const themeConfig = {
    light: {
      label: "Light",
      icon: Sun,
      description: "Light theme",
    },
    dark: {
      label: "Dark", 
      icon: Moon,
      description: "Dark theme",
    },
    system: {
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  }

  // Simple toggle for binary light/dark switching
  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    } else {
      // If system, toggle to opposite of current resolved theme
      setTheme(resolvedTheme === "light" ? "dark" : "light")
    }
  }

  // If only light/dark themes available, show simple toggle
  if (!themes.includes("system")) {
    const isDark = resolvedTheme === "dark"
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        onClick={handleToggle}
        className="hover-scale transition-all duration-200"
      >
        <Sun 
          className={`h-5 w-5 transition-all ${
            prefersReducedMotion ? "" : "duration-300"
          } ${isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`} 
        />
        <Moon 
          className={`absolute h-5 w-5 transition-all ${
            prefersReducedMotion ? "" : "duration-300"
          } ${isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} 
        />
        <span className="sr-only">
          Current theme: {isDark ? "dark" : "light"}. Click to toggle.
        </span>
      </Button>
    )
  }

  // Full dropdown for all theme options
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Theme selector"
          className="hover-scale transition-all duration-200"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <Monitor className="absolute h-5 w-5 scale-0 transition-all data-[theme=system]:scale-100" />
          <span className="sr-only">Open theme selector</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const config = themeConfig[themeOption as keyof typeof themeConfig]
          const Icon = config.icon
          const isActive = theme === themeOption
          
          return (
            <DropdownMenuItem
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className="flex items-center gap-2 cursor-pointer"
              aria-current={isActive}
            >
              <Icon className="h-4 w-4" />
              <span>{config.label}</span>
              {isActive && (
                <span className="ml-auto text-xs opacity-60">Active</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
