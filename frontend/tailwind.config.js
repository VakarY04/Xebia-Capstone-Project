/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22c55e", // green - energy / health
          dark: "#16a34a",
        },
        dark: "#0f172a",
      },
    },
  },
  plugins: [],
};
