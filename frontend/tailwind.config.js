/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        surface: '#111827'
      },
      boxShadow: {
        glow: '0 20px 70px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};
