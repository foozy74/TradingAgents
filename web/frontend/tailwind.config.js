/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: '#7dd3c0',
        blue: '#5b9bd5',
        purple: '#9b8fb8',
        'bg-dark': '#030712',
      },
    },
  },
  plugins: [],
}
