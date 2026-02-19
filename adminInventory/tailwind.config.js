/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#A31F35',
        background: '#FCFDFE',
        secondaryButton: '#0000000D',
      }
    },
  },
  plugins: [],
}
