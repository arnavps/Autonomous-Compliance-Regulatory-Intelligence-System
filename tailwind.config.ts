import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        navy: {
          DEFAULT: "#001f3f",
          dark: "#00152b",
        },
        teal: {
          DEFAULT: "#008080",
          light: "#00a3a3",
        },
        brand: {
          ivory: "#FAFAFA",
          slate: "#0F172A",
          indigo: "#4F46E5",
          gold: "#854D0E",
        }
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
        aventa: ["var(--font-aventa)", "Inter", "sans-serif"],
        garamond: ["var(--font-garamond)", "Apple Garamond", "serif"],
        utility: ["var(--font-helvetica)", "Helvetica", "Arial", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
};
export default config;
