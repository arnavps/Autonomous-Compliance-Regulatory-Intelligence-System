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
        background: "#F7F5F0",
        foreground: "#1A1714",
        border: "rgba(193, 123, 47, 0.12)",
        input: "rgba(193, 123, 47, 0.12)",
        ring: "#C17B2F",
        primary: {
          DEFAULT: "#884e00",
          container: "#a7651a",
          fixed: "#ffdcbf",
          "fixed-dim": "#ffb872",
          on: "#ffffff",
        },
        secondary: {
          DEFAULT: "#305f9b",
          container: "#92bdff",
          fixed: "#d4e3ff",
          "fixed-dim": "#a6c8ff",
          on: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#18693a",
          container: "#368351",
          fixed: "#a5f4b8",
          "fixed-dim": "#89d89e",
          on: "#ffffff",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          on: "#ffffff",
        },
        "on-surface": "#1b1c19",
        "on-surface-variant": "#524438",
        "outline": "#857466",
        "outline-variant": "#d7c3b3",
        "surface": {
          DEFAULT: "#f7f5f0",
          variant: "#e4e2dd",
          dim: "#dbdad5",
          bright: "#fbf9f4",
          container: {
            lowest: "#ffffff",
            low: "#f5f3ee",
            DEFAULT: "#f0eee9",
            high: "#eae8e3",
            highest: "#e4e2dd",
          }
        },
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f1ec",
        "inverse-primary": "#ffb872",
        "amber": {
          primary: "#C17B2F",
          secondary: "#D4860A",
          glow: "rgba(193, 123, 47, 0.12)",
        },
        "conflict": {
          red: "#C0392B",
          glow: "rgba(192, 57, 43, 0.05)",
        },
        "sand": {
          bg: "#F7F5F0",
          topbar: "rgba(247, 245, 240, 0.92)",
          sidebar: "rgba(247, 245, 240, 0.85)",
        }
      },
      fontFamily: {
        headline: ["var(--font-newsreader)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        label: ["var(--font-space-grotesk)", "monospace"],
        serif: ["var(--font-newsreader)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
        glass: "12px",
        "glass-elevated": "20px",
      },
      boxShadow: {
        "glass-sm": "0 4px 24px rgba(26, 23, 20, 0.06)",
        "glass-md": "0 8px 40px rgba(26, 23, 20, 0.12)",
      }
    },
  },
  plugins: [],
};
export default config;
