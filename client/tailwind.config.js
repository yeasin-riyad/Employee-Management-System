/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ["Pacifico", "cursive"],
        // 'heading': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-200': '#0D9488',
        'primary-100': '#75D967',
        'secondary-200': '#2B2C2E',
        'secondary-100': '#0b1a78',
        // 'tertiary': '#e74c3c',
      },
      spacing: {
        // '8': '2rem',
        // '16': '4rem',
        // '24': '6rem',
      },
    },
  },
  plugins: [],
}