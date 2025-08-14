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
				primary: 'var(--primary)',
				'primary-600': 'var(--primary-600)',
				secondary: 'var(--secondary)',
				ink: {
					head: 'var(--ink-head)',
					body: 'var(--ink-body)',
				},
				canvas: 'var(--canvas)',
				surface: 'var(--surface)',
				elevated: 'var(--elevated)',
				border: 'var(--border)',
				success: 'var(--success)',
				warning: 'var(--warning)',
				danger: 'var(--danger)',

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
				'brand-primary': 'var(--primary)',
				'brand-secondary': 'var(--secondary)',
				'brand-amber': 'var(--warning)',
				'brand-green': 'var(--success)',

				// Legacy compatibility
				inkHead: 'var(--ink-head)',
				inkBody: 'var(--ink-body)',
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
		// Keep all core plugins except we'll override colors
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
