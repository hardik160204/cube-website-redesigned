const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    // Touch screens fire false hovers on tap; hover styles only apply where a real cursor exists.
    future: { hoverOnlyWhenSupported: true },
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Archivo', 'Inter', 'sans-serif'],
        // Telemetry voice for timestamps, call IDs and labels
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        // Soft, diffused depth for white cards on slate-50
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.08)',
        elevated: '0 2px 4px rgb(15 23 42 / 0.04), 0 24px 48px -16px rgb(15 23 42 / 0.18)',
        glow: '0 0 0 1px hsl(var(--primary) / 0.35), 0 8px 24px -8px hsl(var(--primary) / 0.55)'
      },
      transitionTimingFunction: {
        // Emil Kowalski's strong ease-out for UI (same value as `ease` in src/lib/motion.js)
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        brand: {
          navy: '#0A1F44',
          maroon: '#84081B'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        // Idle bob for the hero's floating cards
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        // One grid cell (56px) per loop, so the pan repeats seamlessly
        'grid-pan': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(56px)' }
        },
        // Voice bars breathing (hero waveform, live call)
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.55)' }
        },
        // A ringing phone: rings leave the CTA and fade
        ripple: {
          from: { transform: 'scale(1)', opacity: '0.5' },
          to: { transform: 'scale(1.9)', opacity: '0' }
        },
        // Packets flowing along a dashed connector
        dash: {
          to: { strokeDashoffset: '-20' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // CSS (not JS) so predetermined loops stay smooth while the page is busy; easeInOutSine from easings.co
        float: 'float 7s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        'grid-pan': 'grid-pan 8s linear infinite',
        wave: 'wave 1.8s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        // Emil's ease-out: the ring leaves fast and settles as it fades
        ripple: 'ripple 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite',
        dash: 'dash 1s linear infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};