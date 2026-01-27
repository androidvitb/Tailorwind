/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",            // Scan root index
    "./src/**/*.{html,js,ejs}"     // Scan everything inside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}