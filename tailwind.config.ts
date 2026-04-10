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
        background: "var(--background)",
        foreground: "var(--foreground)",
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
