# SkillSwap Theme System Documentation

## Overview

The SkillSwap theme system is a comprehensive, production-ready theming solution built with React, TypeScript, and Tailwind CSS. It provides seamless light/dark mode switching with system preference detection, accessibility features, and performance optimizations.

## Architecture

### Core Components

- **ThemeProvider**: Context-based theme management with localStorage persistence
- **ThemeToggle**: Advanced theme switching component with dropdown and accessibility
- **ColorModeToggle**: Simple binary light/dark toggle
- **ThemeScript**: FOUC prevention for server-side rendering

### Key Features

✅ **Light/Dark/System Theme Support**  
✅ **FOUC Prevention**  
✅ **Accessibility Compliant (WCAG 2.1)**  
✅ **Performance Optimized**  
✅ **TypeScript Support**  
✅ **SSR Compatible**  
✅ **Responsive Design**  
✅ **Smooth Transitions**  
✅ **Error Handling**  
✅ **Cross-tab Synchronization**

## Implementation Guide

### 1. Basic Setup

```tsx
import { ThemeProvider } from "@/components/theme/ThemeProvider"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="skillswap-theme">
      <YourApp />
    </ThemeProvider>
  )
}
```

### 2. Using Theme Hooks

```tsx
import { useTheme, useResolvedTheme } from "@/components/theme-provider"

function Component() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const actualTheme = useResolvedTheme() // Never returns "system"
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme("dark")}>
        Switch to Dark
      </button>
    </div>
  )
}
```

### 3. Theme Components

```tsx
import { ThemeToggle } from "@/components/ThemeToggle"
import { ColorModeToggle } from "@/components/theme/ColorModeToggle"

// Advanced toggle with system support
<ThemeToggle />

// Simple binary toggle
<ColorModeToggle />
```

## Color System

### Design Tokens

```css
:root {
  /* Primary Colors */
  --primary: 210 40 98;
  --primary-dark: 210 30 96;
  --secondary: 210 40 95;
  
  /* Text Colors */
  --ink-head: 210 20 14;
  --ink-body: 210 15 20;
  
  /* Surface Colors */
  --canvas: 210 40 96;
  --surface: 0 0 100;
  --elevated: 210 40 99;
  --border: 210 20 85;
  
  /* State Colors */
  --success: 142 76 36;
  --warning: 45 93 47;
  --danger: 0 84 60;
}

[data-theme="dark"] {
  --primary: 210 50 50;
  --ink-head: 210 30 95;
  /* ... other dark theme colors */
}
```

### Usage in Components

```tsx
// ✅ Correct - Use semantic tokens
<div className="bg-surface text-ink-body border-border">
  Content
</div>

// ❌ Incorrect - Direct colors
<div className="bg-white text-black border-gray-300">
  Content
</div>
```

## Advanced Features

### 1. Custom Theme Configuration

```tsx
<ThemeProvider
  defaultTheme="system"
  storageKey="my-app-theme"
  enableSystem={true}
  disableTransitionOnChange={false}
  forcedTheme={undefined}
  attribute="data-theme"
>
  <App />
</ThemeProvider>
```

### 2. Media Query Hooks

```tsx
import { 
  useSystemDarkMode, 
  usePrefersReducedMotion,
  usePrefersHighContrast 
} from "@/hooks/useMediaQuery"

function Component() {
  const systemDark = useSystemDarkMode()
  const reducedMotion = usePrefersReducedMotion()
  const highContrast = usePrefersHighContrast()
  
  return (
    <div className={reducedMotion ? "transition-none" : "transition-all"}>
      Content adapts to user preferences
    </div>
  )
}
```

### 3. Theme Utilities

```tsx
import { 
  resolveTheme, 
  toggleTheme, 
  getNextTheme,
  isValidTheme 
} from "@/utils/themeHelpers"

// Resolve system theme to actual theme
const actualTheme = resolveTheme("system", "dark") // Returns "dark"

// Toggle between themes
const nextTheme = toggleTheme("light") // Returns "dark"

// Validate theme value
const isValid = isValidTheme("purple") // Returns false
```

## Performance Optimizations

### 1. FOUC Prevention

```tsx
import { ThemeScript } from "@/components/theme/ThemeScript"

// In your HTML head or root component
<ThemeScript storageKey="my-theme" defaultTheme="system" />
```

### 2. Transition Management

```tsx
// Disable transitions during theme change
<ThemeProvider disableTransitionOnChange={true}>
  <App />
</ThemeProvider>
```

### 3. Reduced Motion Support

The system automatically respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition: none !important;
  }
}
```

## Accessibility Features

### WCAG 2.1 Compliance

- **Color Contrast**: All themes meet WCAG AA standards (4.5:1 ratio)
- **Keyboard Navigation**: Full keyboard support for theme controls
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Clear focus indicators and logical tab order
- **Motion Sensitivity**: Respects prefers-reduced-motion

### Screen Reader Announcements

```tsx
// Theme changes are announced
<span className="sr-only">
  Current theme: {resolvedTheme}. Press to toggle.
</span>
```

## Testing

### Automated Testing

```tsx
import { ThemeTestSuite } from "@/components/theme/ThemeTestSuite"

// Development component for testing
<ThemeTestSuite />
```

### Manual Testing Checklist

- [ ] Theme persists across browser sessions
- [ ] System preference detection works
- [ ] Theme changes are smooth and performant
- [ ] All components adapt to theme changes
- [ ] Keyboard navigation works properly
- [ ] Screen reader announces theme changes
- [ ] No FOUC on page load
- [ ] Cross-tab synchronization works

## Troubleshooting

### Common Issues

**Q: Theme doesn't persist after refresh**  
A: Check localStorage permissions and storage key consistency

**Q: Flash of unstyled content (FOUC)**  
A: Ensure ThemeScript is included in your HTML head

**Q: System theme not detected**  
A: Verify `enableSystem={true}` and browser support

**Q: Styles not updating**  
A: Check CSS variable names match Tailwind config

### Debug Tools

```typescript
// Access theme utilities in browser console
window.themeUtils = {
  toggle: toggleTheme,
  set: setTheme,
  get: getCurrentTheme,
  init: initializeTheme
}
```

## Migration Guide

### From v1 to v2

1. Update import paths:
```tsx
// Old
import { ThemeProvider } from "@/components/theme-provider"

// New  
import { ThemeProvider } from "@/components/theme/ThemeProvider"
```

2. Update hook usage:
```tsx
// Old
const { theme, setTheme } = useTheme()

// New
const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
```

3. Add theme script for FOUC prevention:
```tsx
<ThemeScript />
```

## Contributing

### Adding New Theme Colors

1. Define CSS variables in `src/index.css`
2. Add to Tailwind config in `tailwind.config.ts`
3. Update TypeScript types in `src/types/theme.ts`
4. Test with `ThemeTestSuite` component

### Best Practices

- Always use HSL color values
- Follow semantic naming conventions
- Test with both themes and system preference
- Ensure accessibility compliance
- Document new features thoroughly

## License

This theme system is part of the SkillSwap project and follows the same license terms.