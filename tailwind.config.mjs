import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "outline": "var(--color-outline, #717974)",
        "surface-dim": "var(--color-surface-dim, #d7dae2)",
        "inverse-surface": "var(--color-inverse-surface, #2d3137)",
        "surface-container": "var(--color-surface-container, #ebeef6)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim, #ffb693)",
        "on-primary-container": "var(--color-on-primary-container, #7ea594)",
        "on-tertiary": "var(--color-on-tertiary, #ffffff)",
        "surface-container-high": "var(--color-surface-container-high, #e5e8f0)",
        "tertiary": "var(--color-tertiary, #321900)",
        "tertiary-fixed": "var(--color-tertiary-fixed, #ffdcbe)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed, #351000)",
        "on-error-container": "var(--color-on-error-container, #93000a)",
        "surface-bright": "var(--color-surface-bright, #f8f9ff)",
        "surface": "var(--color-surface, #f8f9ff)",
        "inverse-primary": "var(--color-inverse-primary, #a6cfbd)",
        "secondary-fixed": "var(--color-secondary-fixed, #ffdbcc)",
        "on-secondary-container": "var(--color-on-secondary-container, #783610)",
        "on-surface": "var(--color-on-surface, #181c22)",
        "inverse-on-surface": "var(--color-inverse-on-surface, #eef1f9)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant, #693c00)",
        "surface-container-highest": "var(--color-surface-container-highest, #dfe2ea)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim, #ffb870)",
        "tertiary-container": "var(--color-tertiary-container, #4f2c00)",
        "background": "var(--color-background, #f8f9ff)",
        "primary-container": "var(--color-primary-container, #143b2e)",
        "on-primary": "var(--color-on-primary, #ffffff)",
        "primary": "var(--color-primary, #00251a)",
        "error": "var(--color-error, #ba1a1a)",
        "error-container": "var(--color-error-container, #ffdad6)",
        "on-background": "var(--color-on-background, #181c22)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed, #2c1600)",
        "secondary": "var(--color-secondary, #934a24)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant, #284e40)",
        "surface-variant": "var(--color-surface-variant, #dfe2ea)",
        "on-surface-variant": "var(--color-on-surface-variant, #414844)",
        "on-primary-fixed": "var(--color-on-primary-fixed, #002117)",
        "surface-container-lowest": "var(--color-surface-container-lowest, #ffffff)",
        "on-secondary": "var(--color-on-secondary, #ffffff)",
        "on-error": "var(--color-on-error, #ffffff)",
        "secondary-container": "var(--color-secondary-container, #ffa274)",
        "surface-container-low": "var(--color-surface-container-low, #f1f3fc)",
        "on-tertiary-container": "var(--color-on-tertiary-container, #da8b31)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant, #75340e)",
        "outline-variant": "var(--color-outline-variant, #c1c8c3)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim, #a6cfbd)",
        "surface-tint": "var(--color-surface-tint, #406657)",
        "primary-fixed": "var(--color-primary-fixed, #c2ecd9)",
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
    forms,
    containerQueries,
  ],
};

export default config;
