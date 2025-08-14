# SkillSwap Color System Usage Guide

## 🎨 Semantic Color Mapping

Use this guide to ensure consistent color usage across the application.

### Primary Actions & Highlights
- **Use:** `var(--color-primary)` or `bg-primary`, `text-primary`
- **When:** CTA buttons, active states, primary links, key highlights
- **Examples:** "Sign in" button, active nav items, primary actions

### Secondary Accents & Focus
- **Use:** `var(--color-secondary)` or `bg-secondary`, `text-secondary`  
- **When:** Focus rings, secondary actions, accent highlights
- **Examples:** Focus outlines, secondary buttons, accent badges

### Status Colors
- **Success:** `var(--color-success)` - Green for completed actions, success states
- **Warning:** `var(--color-warning)` - Orange for caution, important notices  
- **Danger:** `var(--color-danger)` - Red for errors, destructive actions

### Background Hierarchy
- **Page Background:** `var(--color-canvas)` or `bg-canvas`
- **Card Surfaces:** `var(--color-surface)` or `bg-surface`
- **Elevated Elements:** `var(--color-elevated)` or `bg-elevated` (modals, dropdowns)

### Text Hierarchy
- **Headings:** `var(--color-ink-head)` or `text-inkHead`
- **Body Text:** `var(--color-ink-body)` or `text-inkBody`
- **Links:** `var(--color-primary)` with `hover:var(--color-secondary)`

### Borders & Dividers
- **All Borders:** `var(--color-border)` or `border-border`

## 🚫 What NOT to Use

### ❌ Forbidden Colors
- **No yellow hex:** `#f59e0b`, `#fbbf24`, `#eab308`, `#ffc107`, `#facc15`
- **No yellow utilities:** `text-yellow-*`, `bg-yellow-*`, `border-yellow-*`
- **No amber utilities:** `text-amber-*`, `bg-amber-*`, `border-amber-*`

### ❌ Anti-Patterns
```css
/* DON'T: Hard-coded hex colors */
.my-button { background: #f59e0b; }

/* DON'T: Tailwind yellow utilities */
<div className="bg-yellow-400 text-yellow-800">

/* DON'T: Inline styles with hex */
<div style="background-color: #fbbf24">
```

### ✅ Correct Patterns
```css
/* DO: Use semantic tokens */
.my-button { background: var(--color-primary); }

/* DO: Use semantic Tailwind classes */
<div className="bg-primary text-white">

/* DO: Use CSS custom properties */
<div style="background-color: var(--color-surface)">
```

## 🛡️ Protection System

### Stylelint Rules
- Blocks all hex colors to force token usage
- Specifically prevents yellow/amber hex values
- Allows design token custom properties

### ESLint Rules  
- Prevents yellow/amber Tailwind utility classes
- Warns about direct hex color usage in strings
- Guides developers toward design tokens

### Emergency Overrides
- CSS overrides catch any remaining yellow colors
- Maps common yellow hex values to semantic tokens
- Handles inline styles and utility classes

## 🎯 Quick Reference

| Use Case | Correct Token | Tailwind Class |
|----------|---------------|----------------|
| Primary button | `var(--color-primary)` | `bg-primary` |
| Button text | `#ffffff` | `text-white` |
| Card background | `var(--color-surface)` | `bg-surface` |
| Heading text | `var(--color-ink-head)` | `text-inkHead` |
| Body text | `var(--color-ink-body)` | `text-inkBody` |
| Border | `var(--color-border)` | `border-border` |
| Success state | `var(--color-success)` | `text-success` |
| Warning state | `var(--color-warning)` | `text-warning` |
| Error state | `var(--color-danger)` | `text-danger` |

## 🌙 Theme Support

All tokens automatically switch between light and dark themes using `data-theme="dark"` attribute:

```javascript
// Toggle theme
document.documentElement.dataset.theme = 'dark' | 'light';
```

Light and dark variants are automatically handled by the CSS custom properties system.
