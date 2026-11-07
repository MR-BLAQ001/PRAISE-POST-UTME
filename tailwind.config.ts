import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a6ff",
          500: "#3384ff",
          600: "#1e63f5",
          700: "#184ee1",
          800: "#1b41b6",
          900: "#1c3a8f",
          950: "#152457"
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4"
        },
        gold: "#f5c451",
        silver: "#cbd5e1",
        bronze: "#d08a52"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,132,255,.18), 0 18px 60px -20px rgba(30,99,245,.45)",
        card: "0 24px 60px -30px rgba(2,8,32,.65)",
        soft: "0 12px 30px -18px rgba(2,8,32,.4)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(5,8,26,0) 0%, rgba(5,8,26,.7) 65%, rgba(5,8,26,1) 100%)",
        "brand-gradient": "linear-gradient(135deg, #1e63f5 0%, #06b6d4 100%)",
        "hero-glow":
          "radial-gradient(ellipse at 50% 0%, rgba(51,132,255,.22), transparent 60%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(.9)", opacity: ".7" },
          "70%": { transform: "scale(1.15)", opacity: "0" },
          "100%": { opacity: "0" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.22,1,.36,1) both",
        "fade-in": "fade-in .4s ease both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        marquee: "marquee 38s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
