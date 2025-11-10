/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Note: Tailwind v4 uses CSS-based configuration via @theme in index.css
  // This file is kept for content paths and darkMode setting
  darkMode: 'class',
}

