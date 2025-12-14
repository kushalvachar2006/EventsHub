/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
      },
      colors: {
        brand: {
          navy: "#0A1A2F",
          cyan: "#00E5FF",
          violet: "#7C7CFF",
          white: "#FFFFFF",
        },
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c3d66",
        },
        secondary: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e', // Base secondary
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
},
      },
      boxShadow: {
        elevated: "0 10px 25px -10px rgba(0,0,0,0.25)",
        "lg-dark": "0 20px 25px -5px rgba(0,0,0,0.5)",
        glow: "0 0 20px -5px rgba(0, 229, 255, 0.35)",
        "glow-purple": "0 0 20px -5px rgba(124, 124, 255, 0.35)",
        glass: "0 20px 40px -10px rgba(0,0,0,0.6)",
        card: "0 12px 30px -12px rgba(0,0,0,0.45)",
        nav: "0 8px 24px -10px rgba(0,0,0,0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to_right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to_bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "brand-gradient":
          "linear-gradient(to bottom right, rgba(0,229,255,0.12), rgba(124,124,255,0.15), rgba(0,229,255,0.08))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-soft": "bounceSoft 2s infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  safelist: [
    // gradients and brand accents used across pages/components
    "from-brand-cyan",
    "via-brand-violet",
    "to-brand-cyan",
    "text-brand-cyan",
    "bg-brand-cyan/10",
    "border-brand-cyan/30",
    "bg-brand-violet/10",
    "border-brand-violet/20",
  ],
  plugins: [],
};
