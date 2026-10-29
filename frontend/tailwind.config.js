/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 14px -4px rgba(15,23,42,0.10)',
        soft: '0 8px 30px -12px rgba(15,23,42,0.25)',
        nav: '0 -6px 24px -10px rgba(15,23,42,0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
      colors: {
        navy: { 950: '#0b1220', 900: '#0f172a', 800: '#152238', 700: '#1e3a5f' },
        gold: { 50: '#fdf8ec', 100: '#faedc4', 400: '#e0b94d', 500: '#c9a227', 600: '#a9841c' },
      },
    },
  },
  plugins: [],
}
