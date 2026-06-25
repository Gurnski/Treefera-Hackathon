/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Deep climate-tech palette
        ink: {
          950: "#05080d",
          900: "#070b12",
          800: "#0b121d",
          700: "#111b2b",
          600: "#18253a",
        },
        signal: {
          // Vegetation / regen green
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        radar: {
          // Brand cyan/teal
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
        },
        amber: {
          400: "#fbbf24",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,0.15), 0 20px 60px -20px rgba(14,165,233,0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(5,8,13,0) 0%, rgba(5,8,13,0.85) 80%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "spin-slow": "spin-slow 40s linear infinite",
        "pulse-ring": "pulse-ring 2.8s ease-out infinite",
        sweep: "sweep 6s linear infinite",
      },
    },
  },
  plugins: [],
};
