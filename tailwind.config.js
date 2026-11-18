/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#3f3f46',
          600: '#18181b',
          700: '#111111',
          800: '#0a0a0a',
          900: '#000000',
        },
      },
    },
  },
  plugins: [],
}
