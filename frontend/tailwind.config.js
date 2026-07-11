/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Lime-green: energy, growth, "go" - the workout accent
        primary: {
          DEFAULT: "#84cc16",
          dark: "#65a30d",
          light: "#a3e635",
        },
        // Warm amber: appetite, fuel, nutrition accent
        accent: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fbbf24",
        },
        // Deep charcoal/slate base instead of pure navy - warmer, more "gym" than "tech"
        dark: {
          DEFAULT: "#121212",
          surface: "#1a1a1a",
          card: "#1f1f1f",
        },
      },
      fontFamily: {
        display: ["'Segoe UI'", "system-ui", "sans-serif"],
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
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
        floatSlow: "floatSlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
