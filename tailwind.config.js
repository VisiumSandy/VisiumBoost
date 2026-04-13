/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f1ff",
          100: "#e9e5ff",
          200: "#d5ceff",
          300: "#b8a9ff",
          400: "#a29bfe",
          500: "#6C5CE7",
          600: "#5a45d6",
          700: "#4c35b8",
          800: "#3f2d96",
          900: "#35277b",
        },
        dark: {
          900: "#0F0F1A",
          800: "#1a1a2e",
          700: "#252540",
        },
        success: "#00B894",
        warning: "#FDCB6E",
        danger: "#E17055",
        info: "#0984E3",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04)",
        elevated: "0 8px 30px rgba(108,92,231,0.12)",
      },
    },
  },
  plugins: [],
};
