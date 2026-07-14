/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Overrides (not extends) Tailwind's default border-radius scale: every
    // rounded-* utility across the whole project is 25% smaller than the
    // Tailwind default. "full" is left untouched since it produces true
    // circles/pills, not square-cornered rectangles.
    borderRadius: {
      none: "0px",
      sm: "1.5px",
      DEFAULT: "3px",
      md: "4.5px",
      lg: "6px",
      xl: "9px",
      "2xl": "12px",
      "3xl": "18px",
      full: "9999px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#69C978",
          dark: "#56B866",
          light: "#A8E6B1",
        },
        accent: {
          DEFAULT: "#8BDB97",
          dark: "#69C978",
          light: "#CDEFD2",
        },
        dark: {
          DEFAULT: "#1C1C1E",
          surface: "#141416",
          card: "#2C2C2E",
        },
        surface: {
          page: "#1C1C1E",
          card: "#2C2C2E",
          border: "#48484A",
        },
      },
      fontFamily: {
        display: ["'Cabinet Grotesk'", "'Times New Roman'", "Times", "serif"],
        sans: ["'Cabinet Grotesk'", "'Times New Roman'", "Times", "serif"],
      },
      boxShadow: {
        shell: "0 20px 60px rgba(0, 0, 0, 0.35)",
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
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.98)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)", filter: "blur(0)" },
        },
        gradientPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(14px, -18px)" },
        },
        floatSlower: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-18px, 16px)" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.6" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
        blink: "blink 1s step-end infinite",
        revealUp: "revealUp 0.9s cubic-bezier(0.16,1,0.3,1) both",
        gradientPan: "gradientPan 6s ease-in-out infinite",
        floatSlow: "floatSlow 9s ease-in-out infinite",
        floatSlower: "floatSlower 11s ease-in-out infinite",
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
