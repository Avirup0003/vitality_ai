/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1f5eff', dark: '#1545c8', light: '#7aa2ff' },
        brand: { gradientStart: '#6d28d9', gradientEnd: '#2563eb' }, // violet→blue
     },
    fontFamily: { heading: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'] },
    },
  },
  plugins: [],
};
