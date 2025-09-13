/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'kalnia': ['Kalnia', 'serif'],
        'sans': ['Kalnia', 'serif'], // Makes Kalnia the default font
      },
    },
  },
  plugins: [],
}