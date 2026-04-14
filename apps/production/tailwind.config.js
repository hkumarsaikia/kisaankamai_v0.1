/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf5",
          100: "#d7f3e5",
          200: "#b1e7ce",
          300: "#83d6b0",
          400: "#4fbd8c",
          500: "#2b9d6d",
          600: "#1f7d56",
          700: "#1b6447",
          800: "#194f3a",
          900: "#17352a",
        },
        soil: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#c55a11",
          700: "#9a4710",
          800: "#7c3b12",
          900: "#662f12",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
