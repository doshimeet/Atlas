import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wbg: {
          porcelain: "#f8fafc",
          surface: "#ffffff",
          border: "#e2e8f0",
          navy: "#002244",
          sapphire: "#0071bc",
          slate: {
            900: "#0f172a",
            800: "#1e293b",
            700: "#334155",
            600: "#475569",
            500: "#64748b",
            400: "#94a3b8",
            300: "#cbd5e1",
            200: "#e2e8f0",
            100: "#f1f5f9",
            50: "#f8fafc",
          },
        },
        cat: {
          project: "#0284c7",
          country: "#0891b2",
          ministry: "#7c3aed",
          tech: "#059669",
          policy: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)",
        lifted: "0 4px 12px -2px rgba(0, 34, 68, 0.08), 0 2px 6px -1px rgba(0, 34, 68, 0.04)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 32s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
