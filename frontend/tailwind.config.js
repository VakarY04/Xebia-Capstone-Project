/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          light: "#60a5fa",
        },
        accent: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fbbf24",
        },
        dark: {
          DEFAULT: "#0f172a",
          surface: "#020617",
          card: "#111827",
        },
        surface: {
          page: "#f5f7fb",
          card: "#ffffff",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        display: ["'Outfit'", "'Manrope'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        shell: "0 20px 60px rgba(15, 23, 42, 0.08)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
