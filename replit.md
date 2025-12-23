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

## Recent Contrast Improvements (December 2025)
- Fixed CreditBalancePill using dedicated CSS variables (--credit-pill-bg, --credit-pill-text, --credit-pill-border) with inline styles to override any conflicting Tailwind classes
- Updated CSS variables: --muted-foreground, --primary-foreground, --card-foreground for better visibility
- Improved navigation link contrast in GlobalSearchHeader
- Fixed "Trusted by" logos section - removed opacity-50 in favor of explicit text colors
- Added text-white to primary buttons for guaranteed contrast
- Footer text updated to use explicit slate colors instead of opacity-based classes
- Replaced invalid `[data-theme='dark']:` selectors with proper `dark:` prefix across all components
- Button component uses hardcoded hex colors (#0056D2 for primary, white text) to ensure WCAG AA compliance

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