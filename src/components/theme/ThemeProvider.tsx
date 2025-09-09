import { ThemeProvider as BaseThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "./ThemeScript"
import type { ThemeProviderProps } from "@/components/theme-provider"

/**
 * Enhanced theme provider with FOUC prevention
 * Includes the theme script for SSR compatibility
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <ThemeScript 
        storageKey={props.storageKey}
        defaultTheme={props.defaultTheme}
        attribute={props.attribute}
      />
      <BaseThemeProvider {...props}>
        {children}
      </BaseThemeProvider>
    </>
  )
}