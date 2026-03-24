/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1a1a1a",
        surface: "#242424",
        text: "#e0e0e0",
        muted: "#a8a8a8"
      },
      boxShadow: {
        glow: "0 18px 42px rgba(0, 0, 0, 0.28)"
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      }
    }
  },
  plugins: []
};
