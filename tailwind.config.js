/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "outline": "#717974",
        "surface-dim": "#d7dae2",
        "inverse-surface": "#2d3137",
        "surface-container": "#ebeef6",
        "secondary-fixed-dim": "#ffb693",
        "on-primary-container": "#7ea594",
        "on-tertiary": "#ffffff",
        "surface-container-high": "#e5e8f0",
        "tertiary": "#321900",
        "tertiary-fixed": "#ffdcbe",
        "on-secondary-fixed": "#351000",
        "on-error-container": "#93000a",
        "surface-bright": "#f8f9ff",
        "surface": "#f8f9ff",
        "inverse-primary": "#a6cfbd",
        "secondary-fixed": "#ffdbcc",
        "on-secondary-container": "#783610",
        "on-surface": "#181c22",
        "inverse-on-surface": "#eef1f9",
        "on-tertiary-fixed-variant": "#693c00",
        "surface-container-highest": "#dfe2ea",
        "tertiary-fixed-dim": "#ffb870",
        "tertiary-container": "#4f2c00",
        "background": "#f8f9ff",
        "primary-container": "#143b2e",
        "on-primary": "#ffffff",
        "primary": "#00251a",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-background": "#181c22",
        "on-tertiary-fixed": "#2c1600",
        "secondary": "#934a24",
        "on-primary-fixed-variant": "#284e40",
        "surface-variant": "#dfe2ea",
        "on-surface-variant": "#414844",
        "on-primary-fixed": "#002117",
        "surface-container-lowest": "#ffffff",
        "on-secondary": "#ffffff",
        "on-error": "#ffffff",
        "secondary-container": "#ffa274",
        "surface-container-low": "#f1f3fc",
        "on-tertiary-container": "#da8b31",
        "on-secondary-fixed-variant": "#75340e",
        "outline-variant": "#c1c8c3",
        "primary-fixed-dim": "#a6cfbd",
        "surface-tint": "#406657",
        "primary-fixed": "#c2ecd9",
        slate: {
          950: '#1a1d21',
          900: '#23272b'
        },
        black: '#1a1d21'
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "body": ["var(--font-manrope)", "Manrope", "sans-serif"],
        "label": ["var(--font-inter)", "Inter", "sans-serif"],
        "mukta": ["var(--font-mukta)", "Mukta", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
