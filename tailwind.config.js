/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,ts,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#e85d04',
          dark: '#1c1917',
        },
      },
      fontFamily: {
        ui: ["'Segoe UI Variable'", "'Segoe UI'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
