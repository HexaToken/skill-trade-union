import type { Config } from "tailwindcss";

export default {
	darkMode: ['class', '[data-theme="dark"]'],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx,js,jsx,html}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				primary: 'hsl(var(--primary))',
				'primary-dark': 'hsl(var(--primary-dark))',
				secondary: 'hsl(var(--secondary))',
				ink: {
					head: 'hsl(var(--ink-head))',
					body: 'hsl(var(--ink-body))',
				},
				canvas: 'hsl(var(--canvas))',
				surface: 'hsl(var(--surface))',
				elevated: 'hsl(var(--elevated))',
				border: 'hsl(var(--border))',
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				danger: 'hsl(var(--danger))',

				// Shadcn/ui compatibility
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',

				// Brand colors for gradient compatibility
				'brand-primary': 'hsl(var(--primary))',
				'brand-secondary': 'hsl(var(--secondary))',
				'brand-warning': 'hsl(var(--warning))',
				'brand-success': 'hsl(var(--success))',

				// Legacy compatibility
				inkHead: 'hsl(var(--ink-head))',
				inkBody: 'hsl(var(--ink-body))',
			},
			backgroundImage: {
				'brand-gradient': 'var(--brand-gradient)',
			},
			borderRadius: {
				card: '16px',
				pill: '999px',
				xl2: '1rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				card: '0 8px 24px rgba(0,0,0,0.25)',
				'card-light': '0 8px 24px rgba(2,6,23,0.06)',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				heading: ['Outfit', 'Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'100': '25rem',
				'104': '26rem',
				'120': '30rem'
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }]
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	// Explicitly disable yellow and amber color palettes to prevent accidental usage
	corePlugins: {
		// Remove yellow and amber from default color palette
	},
	safelist: [
		// Explicitly prevent any yellow/amber utilities
		{
			pattern: /^(text|bg|border)-(yellow|amber)-.*/,
			variants: [],
		}
	],
	blocklist: [
		// Block all yellow and amber utilities
		'text-yellow-50', 'text-yellow-100', 'text-yellow-200', 'text-yellow-300', 'text-yellow-400', 'text-yellow-500', 'text-yellow-600', 'text-yellow-700', 'text-yellow-800', 'text-yellow-900',
		'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900',
		'border-yellow-50', 'border-yellow-100', 'border-yellow-200', 'border-yellow-300', 'border-yellow-400', 'border-yellow-500', 'border-yellow-600', 'border-yellow-700', 'border-yellow-800', 'border-yellow-900',
		'text-amber-50', 'text-amber-100', 'text-amber-200', 'text-amber-300', 'text-amber-400', 'text-amber-500', 'text-amber-600', 'text-amber-700', 'text-amber-800', 'text-amber-900',
		'bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900',
		'border-amber-50', 'border-amber-100', 'border-amber-200', 'border-amber-300', 'border-amber-400', 'border-amber-500', 'border-amber-600', 'border-amber-700', 'border-amber-800', 'border-amber-900',
	],
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
