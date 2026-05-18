/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#e8f0ff',
          100: '#c7d6ff',
          200: '#97b0ff',
          300: '#6f8cff',
          400: '#4a66ff',
          500: '#3042f2',
          600: '#242fc0',
          700: '#1b218d',
          800: '#14175e',
          900: '#0b0f2e'
        },
        roseglow: {
          200: '#ffc9f2',
          300: '#ff9fe3',
          400: '#ff6cd1',
          500: '#f032b0'
        },
        aqua: {
          200: '#b7f4ff',
          300: '#7ee7ff',
          400: '#44d9ff',
          500: '#11bdf2'
        }
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'serif'],
        body: ['"Avenir Next"', '"Segoe UI"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 32px rgba(208, 120, 200, 0.35)',
        soft: '0 18px 40px rgba(15, 23, 42, 0.45)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        caret: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 1 }
        },
        scroll: {
          '0%, 100%': { transform: 'translateY(0px)', opacity: 0.5 },
          '50%': { transform: 'translateY(10px)', opacity: 1 }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        blob: 'blob 14s ease-in-out infinite',
        shimmer: 'shimmer 6s ease-in-out infinite',
        caret: 'caret 1s steps(2) infinite',
        scroll: 'scroll 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
