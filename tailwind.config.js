/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "forge-dark": "#0a0a0a",
        "forge-light": "#f5f5f5",
        "safety-orange": "#ff5e00",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Oswald", "sans-serif"],
      },
    },
  },
  plugins: [],
};
