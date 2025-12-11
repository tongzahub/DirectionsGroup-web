/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf9f7',
          100: '#f0ede6',
          200: '#e1dbc9',
          300: '#d2c9ac',
          400: '#c3b78f',
          500: '#8b7355',
          600: '#7a6449',
          700: '#69553d',
          800: '#584631',
          900: '#2d251a',
        },
        neutral: {
          white: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          gold: '#d4af37',
          'gold-light': '#f4e4a6',
          copper: '#b87333',
          'copper-light': '#d4a574',
        },
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-sm': 'clamp(2rem, 4vw, 2.5rem)',
        'display-md': 'clamp(2.5rem, 5vw, 3.5rem)',
        'display-lg': 'clamp(3rem, 6vw, 4.5rem)',
        'display-xl': 'clamp(3.5rem, 7vw, 6rem)',
        'display-2xl': 'clamp(4rem, 8vw, 8rem)',
      },
      boxShadow: {
        'luxury-sm': '0 2px 8px rgba(139, 115, 85, 0.08)',
        'luxury-md': '0 4px 16px rgba(139, 115, 85, 0.12)',
        'luxury-lg': '0 8px 32px rgba(139, 115, 85, 0.16)',
        'luxury-xl': '0 16px 64px rgba(139, 115, 85, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out forwards',
        'slide-up': 'slideUp 500ms ease-out forwards',
        'slide-down': 'slideDown 500ms ease-out forwards',
        'fade-in-up': 'fadeInUp 700ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}