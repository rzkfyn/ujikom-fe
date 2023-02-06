/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.vue',
    './src/pages/**/*.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
