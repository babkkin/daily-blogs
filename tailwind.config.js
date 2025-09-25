/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ Enable dark mode using class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}', // keep this if you actually use a /src folder
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
};