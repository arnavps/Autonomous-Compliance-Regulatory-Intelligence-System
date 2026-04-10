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
        amber: {
          primary: "#C17B2F",
          secondary: "#D4860A",
          glow: "rgba(193, 123, 47, 0.12)",
        },
        conflict: {
          red: "#C0392B",
          glow: "rgba(192, 57, 43, 0.05)",
        },
        sand: {
          bg: "#F7F5F0",
          topbar: "rgba(247, 245, 240, 0.92)",
          sidebar: "rgba(247, 245, 240, 0.85)",
        }
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
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
