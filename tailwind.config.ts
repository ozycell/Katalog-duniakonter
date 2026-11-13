import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  safelist: [
    // Typography
    'text-body-md',
    'text-body-sm',
    'text-label-md',
    'text-label-sm',
    'text-label-xs',
    
    // Standard Icon Colors (8 colors) - Text
    'text-primary',
    'text-gray-600',
    'text-red-600',
    'text-amber-600',
    'text-blue-600',
    'text-purple-600',
    'text-emerald-600',
    'dark:text-gray-400',
    'dark:text-red-400',
    'dark:text-amber-400',
    'dark:text-blue-400',
    'dark:text-purple-400',
    'dark:text-emerald-400',
    
    // Standard Icon Backgrounds (8 colors)
    'bg-primary/10',
    'dark:bg-primary/20',
    'bg-gray-100',
    'dark:bg-gray-900/30',
    'bg-red-100',
    'dark:bg-red-900/30',
    'bg-amber-100',
    'dark:bg-amber-900/30',
    'bg-blue-100',
    'dark:bg-blue-900/30',
    'bg-purple-100',
    'dark:bg-purple-900/30',
    'bg-emerald-100',
    'dark:bg-emerald-900/30',
    
    // Badge Colors - Text (700)
    'text-emerald-700',
    'text-amber-700',
    'text-red-700',
    'text-blue-700',
    'text-purple-700',
    'text-gray-700',
    'dark:text-emerald-300',
    'dark:text-amber-300',
    'dark:text-red-300',
    'dark:text-blue-300',
    'dark:text-purple-300',
    'dark:text-gray-300',
    
    // Responsive Header Button Classes
    'lg:w-auto',
    'lg:px-2.5',
    'lg:gap-1.5',
    'lg:flex',
    'lg:items-center',
    'lg:h-4',
    'lg:w-4',
    'hidden',
    
    // Icon Sizes
    'h-5',
    'w-5',
  ],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],

        // Headlines
        'display-lg': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],

        // Headings
        'heading-lg': ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['0.9375rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }], // 15px

        // Body
        'body-lg': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],        // 16px
        'body-md': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],   // 15px
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],    // 14px
        'body-xs': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],   // 13px

        // UI Labels (Buttons, Inputs, etc.)
        'label-lg': ['0.9375rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['0.8125rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-xs': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '500' }],

        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' }],
        'badge': ['0.6875rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '500' }], // 11px
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          subtle: "hsl(var(--primary-subtle))",
          // Keep scale for compatibility if needed, but prefer functional tokens
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'top': '0 -4px 6px -1px rgb(0 0 0 / 0.05), 0 -2px 4px -2px rgb(0 0 0 / 0.05)',
        'bottom': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    // Enable line-clamp (Tailwind v3.3+)
    lineClamp: true,
  },
} satisfies Config;
