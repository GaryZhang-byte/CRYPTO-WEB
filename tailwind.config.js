/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'cyber-blue': '#63b3ed',
        'cyber-dark': '#0d1117',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(99, 179, 237, 0.2)',
      },
    },
  },
  plugins: [],
} 