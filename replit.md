# Overview

SkillSwap is a comprehensive skill-trading platform that enables users to exchange skills using a credit-based system rather than traditional currency. The application facilitates skill learning and teaching through various formats including instant help sessions, structured courses, mentorship programs, and offline trade logging. Built as a React SPA with TypeScript, the platform emphasizes accessibility, responsive design, and a sophisticated color system with robust yellow color prevention mechanisms.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA (Single Page Application) architecture
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router DOM for client-side navigation
- **State Management**: Zustand stores for wallet and application state
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Theme System**: Next-themes for dark/light mode with custom theme provider

## Design System & Color Architecture
- **Semantic Color Tokens**: CSS custom properties for consistent theming
- **WCAG AA Compliance**: All text elements meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Light/Dark Mode Support**: Explicit color tokens for both themes with hardcoded hex values for guaranteed contrast
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA utilities, skip links, keyboard navigation support

## Recent Contrast Improvements (December 2025) - LAUNCH READY

### Comprehensive WCAG AA Audit Completed
The platform has been audited and certified for WCAG AA compliance in BOTH light and dark modes.

### Dark Mode Badge/Label Pattern (December 2025)
All badges and colored labels now use explicit Tailwind colors with proper dark mode variants instead of CSS variable opacity patterns like `bg-success/10 text-success`. The new pattern ensures WCAG AA compliance in both modes:
- Light mode: `bg-{color}-100 text-{color}-700 border-{color}-200`
- Dark mode: `dark:bg-{color}-900/30 dark:text-{color}-300 dark:border-{color}-700`

Files updated with proper dark mode contrast:
- SkillCard.tsx (difficulty labels: Beginner/Intermediate/Advanced)
- SkillBadge.tsx (featured, verified, new variants)
- MentorCard.tsx (tier badges: Silver/Gold/Platinum)
- CourseDetailPage.tsx (quick tags: Beginner Friendly, Projects Included, Certificate)
- MentorsDirectory.tsx (Verified and Tested badges)
- ChallengeDetail.tsx (theme colors: Design/Development/Language/Business)
- ChallengesHub.tsx (category theme colors)
- offline-trade-types.ts (trade status colors)
- Home.tsx (Popular badge)
- OfflineTradeModal.tsx (High Value badge)
- OfflineTradeModalSteps.tsx (High Value badge)

### CSS Architecture Fixes
- **HSL Wrapper Enforcement**: All `var(--property)` color usages now properly use `hsl(var(--property))` wrapper
- **CTA Link Class**: Created `.cta-link-primary` utility class with `!important` declarations to override global anchor styles
- **Global Anchor Rules**: Updated to exclude CTA classes from default link coloring
- **Header/Footer Token Enforcement**: All header/footer elements use semantic design tokens with proper `hsl()` syntax

### Component-Level Fixes
- Fixed CreditBalancePill using dedicated CSS variables (--credit-pill-bg, --credit-pill-text, --credit-pill-border)
- Updated CSS variables: --muted-foreground, --primary-foreground, --card-foreground for better visibility
- Improved navigation link contrast in GlobalSearchHeader
- Fixed "Trusted by" logos section - removed opacity-50 in favor of explicit text colors
- Button component uses hardcoded hex colors (#0056D2 for primary, white text) to ensure WCAG AA compliance
- Sign in button uses `.cta-link-primary` class for guaranteed white text on blue background

### Verified Pages (Visual Regression Tested)
- Homepage: Hero, CTAs, navigation, credit pill - all compliant
- Mentors page: Hero gradient, category filters, mentor cards - all compliant
- Classes page: Filters, class cards, search - all compliant
- Wallet page: Credit balance card, action buttons, usage stats - all compliant
- Challenges page: Hero section, filters, category pills - all compliant

### Color Contrast Ratios Achieved
- Normal text (16px): Minimum 4.5:1 ratio ✓
- Large text (18px+/bold): Minimum 3:1 ratio ✓
- Interactive elements: Clear visual feedback on all states ✓

## Component Architecture
- **Atomic Design**: Reusable UI components built on Radix primitives
- **Feature Components**: Complex components like booking modals, skill pickers, and session rooms
- **Layout Components**: Header, footer, and navigation with responsive behavior
- **Form Handling**: React Hook Form with Zod validation
- **Animation**: Framer Motion for micro-interactions and transitions

## Data Architecture
- **Mock Data Layer**: Comprehensive mock data for users, skills, courses, and transactions
- **Service Layer**: Credit API, skills API for data operations
- **Type Safety**: TypeScript interfaces for all data models
- **State Management**: Wallet store with credit transaction tracking

## Business Logic
- **Credit System**: Dynamic pricing with complexity multipliers and base rates
- **Skill Matching**: Algorithm-based skill compatibility scoring
- **Session Management**: Real-time session rooms with video/audio capabilities
- **Offline Trading**: Manual trade logging with verification methods
- **Mentorship**: Tiered mentor system with availability tracking

# External Dependencies

## Core Development
- **React Ecosystem**: React 18, React Router DOM, React Hook Form
- **Build & Development**: Vite, TypeScript, ESLint, PostCSS
- **UI Libraries**: Radix UI components, Lucide React icons, Embla Carousel
- **Styling**: Tailwind CSS, Class Variance Authority for component variants
- **State & Data**: TanStack React Query, date-fns for date manipulation

## Quality & Developer Experience
- **Code Quality**: ESLint with TypeScript rules, custom yellow prevention rules
- **Development Tools**: Lovable Tagger for component development
- **Utilities**: clsx and tailwind-merge for conditional styling

## Potential Future Integrations
- **Database**: Prepared for Drizzle ORM integration (currently using mock data)
- **Authentication**: User authentication system (mock implementation present)
- **Real-time Communication**: WebRTC for video sessions (UI ready)
- **Payment Processing**: Credit purchase and withdrawal systems
- **File Storage**: Image and document upload capabilities
- **Geolocation**: Map-based skill discovery and location services
- **Push Notifications**: Session reminders and platform updates