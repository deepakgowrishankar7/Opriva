/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488', // Healthcare Teal
          700: '#0f766e',
          900: '#0b2545', // Deep Navy Blue
          950: '#06162a',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#0b1329',
        },
        health: {
          teal: '#0d9488',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          bg: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
