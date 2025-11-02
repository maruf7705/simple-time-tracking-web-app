/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto Mono"', ...fontFamily.mono],
      },
      colors: {
        'primary': '#9E7FFF',
        'primary-light': '#b79eff',
        'secondary': '#38bdf8',
        'accent': '#f472b6',
        
        // Light Theme
        'background-light': '#f5f5f5',
        'surface-light': '#ffffff',
        'text-light': '#0a0a0a',
        'text-secondary-light': '#525252',
        'border-light': '#e5e5e5',

        // New Dark Theme
        'background-dark': '#0a0a0a',
        'surface-dark': '#1a1a1a',
        'text-dark': '#f5f5f5',
        'text-secondary-dark': '#a3a3a3',
        'border-dark': '#2a2a2a',

        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
